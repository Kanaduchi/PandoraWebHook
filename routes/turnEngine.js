let express = require('express'),
    createError = require('http-errors');

let https = require('https');
let Q = require("q");

let querystring = require('querystring');

let router = express.Router();

/*
Get Pandora token
*/
function getSessionId(user) {

    let defer = Q.defer();

    let post_data = querystring.stringify({
        'login': user[0],
        'password': user[1],
        'lang': 'ru'
    });

    let options = {
        host: 'pro.p-on.ru',
        port: 443,
        path: '/api/users/login',
        method: 'POST'
    };

    let reqs = https.request(options, function (res) {
        res.setEncoding('utf8');
        let parsed = '';
        res.on('data', function (d) {
            parsed += d.toString();
        });
        res.on('end', function () {
            let obj = JSON.parse(parsed);
            if (obj.hasOwnProperty("error_text")) {
                defer.reject({
                    error: obj.error_text
                });
            } else {
                defer.resolve(Object.assign(user, {session: obj.session_id}));
            }
        });
    });

    reqs.setHeader('Accept', 'application/json');
    reqs.setHeader('User-Agent', 'Mozilla/5.0');
    reqs.setHeader('Referer', 'https://pro.p-on.ru/login');
    reqs.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    reqs.setHeader('Content-Length', post_data.length);
    reqs.setHeader('Connection', 'keep-alive');
    reqs.setHeader('Accept-Encoding', 'gzip, deflate, br');

    reqs.write(post_data);
    reqs.end();

    return defer.promise;
}

/*
Get car
*/
function getCarId(object) {

    let defer = Q.defer();

    let options = {
        host: 'pro.p-on.ru',
        port: 443,
        path: '/api/devices',
        method: 'GET'
    };

    let reqs = https.request(options, function (res) {
        res.setEncoding('utf8');
        let parsed = '';
        res.on('data', function (d) {
            parsed += d.toString();
        });
        res.on('end', function () {
            const car = JSON.parse(parsed);
            if (car.hasOwnProperty("error_text")) {
                defer.reject({
                    error: car.error_text
                });
            } else {
                defer.resolve(Object.assign(object, {carId: car[0].id}));
            }
        });
    });
    reqs.setHeader('Accept', 'application/json');
    reqs.setHeader('User-Agent', 'Mozilla/5.0');
    reqs.setHeader('Referer', 'https://pro.p-on.ru/login');
    reqs.setHeader('Connection', 'keep-alive');
    reqs.setHeader('Accept-Encoding', 'gzip, deflate, br');
    reqs.setHeader('Cookie', 'sid=' + object.session);

    reqs.end();

    return defer.promise;
}

/*
Start engine
*/
function turnEngine(object) {

    let defer = Q.defer();

    let post_data = querystring.stringify({
        'command': object.type,
        'id': object.carId
    });

    let options = {
        host: 'pro.p-on.ru',
        port: 443,
        path: '/api/devices/command',
        method: 'POST'
    };

    let reqs = https.request(options, function (res) {
        res.setEncoding('utf8');
        let parsed = '';
        res.on('data', function (d) {
            parsed += d.toString();
        });
        res.on('end', function () {
            let obj = JSON.parse(parsed);
            if (obj.hasOwnProperty("error_text")) {
                defer.reject({
                    error: obj.error_text
                });
            } else {
                defer.resolve({data: parsed, carId: object.carId});
            }
        });
    });

    reqs.setHeader('Accept', 'application/json');
    reqs.setHeader('User-Agent', 'Mozilla/5.0');
    reqs.setHeader('Referer', 'https://pro.p-on.ru/login');
    reqs.setHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    reqs.setHeader('Content-Length', post_data.length);
    reqs.setHeader('Connection', 'keep-alive');
    reqs.setHeader('Accept-Encoding', 'gzip, deflate, br');
    reqs.setHeader('Cookie', 'sid=' + object.session);

    reqs.write(post_data);
    reqs.end();

    return defer.promise;
}


router.get('/', function (req, res, next) {
    if (req.query.user == null) {
        next(createError("User is not specified"));
    }
    let userObject = Buffer.from(req.query.user, 'base64').toString('ascii').split(':');

    let type = {type: 4, text: "Start engine"};
    if (req.baseUrl == '/stop') {
        type = {type: 8, text: "Stop engine"};
    }
    Object.assign(userObject, type);

    getSessionId(Object.assign(userObject, type)).then(getCarId).then(turnEngine).then(
        function (value) {
            const car = JSON.parse(value.data);
            if (car.hasOwnProperty('action_result') && car['action_result'].hasOwnProperty(value.carId)) {
                return res.json({
                    speech: type.text,
                    displayText: type.text,
                    source: 'pandora alarm'
                });
            } else {
                return res.json({
                    speech: 'Something wrong',
                    displayText: value.data,
                    source: 'pandora alarm'
                });
            }
        }
    ).catch(function onError(error) {
        next(createError(error.error));
    });
});

module.exports = router;
