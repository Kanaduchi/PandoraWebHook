let express = require('express'),
    createError = require('http-errors');
let router = express.Router();
let https = require('https');
let Q = require("q");

let querystring = require('querystring');

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
                defer.resolve(obj.session_id);
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

function getCarId(session) {

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
                defer.resolve({session: session, carId: car[0].id});
            }
        });
    });
    reqs.setHeader('Accept', 'application/json');
    reqs.setHeader('User-Agent', 'Mozilla/5.0');
    reqs.setHeader('Referer', 'https://pro.p-on.ru/login');
    reqs.setHeader('Connection', 'keep-alive');
    reqs.setHeader('Accept-Encoding', 'gzip, deflate, br');
    reqs.setHeader('Cookie', 'sid=' + session);

    reqs.end();

    return defer.promise;
}

function getParams(object, item) {

    let defer = Q.defer();

    let start = new Date();
    start.setHours(0, 0, 0, 0);

    let end = new Date();
    end.setHours(23, 59, 0, 0);

    let options = {
        host: 'pro.p-on.ru',
        port: 443,
        path: '/api/updates?ts=-1&amp&from=' + start.getTime() + '&to=' + end.getTime(),
        method: 'GET'
    };

    let reqs = https.request(options, function (res) {
        res.setEncoding('utf8');
        let parsed = '';
        res.on('data', function (d) {
            parsed += d.toString();
        });
        res.on('end', function () {
            if (item == "summary") {
                defer.resolve(parsed);
            } else {
                let obj = JSON.parse(parsed);
                if (obj.hasOwnProperty("error_text")) {
                    defer.reject({
                        error: obj.error_text
                    });
                } else {
                    let car = object.carId;
                    if (obj['stats'][car].hasOwnProperty(item)) {
                        let value = obj['stats'][car][item];
                        defer.resolve(value);
                    } else {
                        defer.resolve("Unknown property: " + item);
                    }
                }
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

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

router.get('/', function (req, res, next) {
    let param = req.query.id;
    if (req.query.id == null) {
        param = "summary";
    }
    if (req.query.user == null) {
        next(createError("User is not specified"));
    }
    getSessionId(Buffer.from(req.query.user, 'base64').toString('ascii').split(':'))
        .then(getCarId)
        .then(function (value) {
            return getParams(value, param)
        })
        .then(function (value) {
                let responseObj = {
                    "fulfillmentText": capitalizeFirstLetter(param) + ' info received: ' + value
                    , "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    capitalizeFirstLetter(param) + ' info received: ' + value
                                ]
                            }
                        }
                    ]
                    , "source": "pandora alarm"
                };
                return res.json(responseObj);
            }
        ).catch(function onError(error) {
        next(createError(error.error));
    });
});

module.exports = router;
