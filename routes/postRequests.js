let express = require('express'),
    createError = require('http-errors');
let router = express.Router();
let constants = require('./constants');

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
Send command
*/
function sendCommand(object) {

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
                defer.resolve(Object.assign(object, {data: parsed, carId: object.carId}));
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

function checkEngineStart(object, count = 0) {
    let defer = Q.defer();

    count = count || 0;

    if (!object.show){
        console.log("No need to wait for result");
        defer.resolve(Object.assign(object, {rpm: -100}));
    }

    if (count > 10) {
        console.log("Wait too much time. Value is set to 200");
        defer.resolve(Object.assign(object, {rpm: -100}));
    }

    if (object.type != 4) {
        console.log("No need to wait for engine rpm");
        defer.resolve(Object.assign(object, {rpm: -100}));
    }

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
            let obj = JSON.parse(parsed);
            if (obj.hasOwnProperty("error_text")) {
                defer.reject({
                    error: obj.error_text
                });
            } else {
                let car = object.carId;
                if (obj['stats'][car].hasOwnProperty('engine_rpm')) {
                    let value = obj['stats'][car]['engine_rpm'];
                    defer.resolve(Object.assign(object, {rpm: value}));
                } else {
                    defer.resolve("Some error");
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

    return defer.promise.then(function (response) {
        return response.rpm == 0 ?
            sleep(2000).then(function () {
                return checkEngineStart(response, count + 1)
            })
            : finish(response);
    });
}

function finish(object) {
    let defer = Q.defer();
    defer.resolve(object);
    return defer.promise;
}

function sleep(milliseconds) {
    var defer = Q.defer();
    setTimeout(function () {
        defer.resolve();
    }, milliseconds);
    return defer.promise;
}

router.post('/', function (req, res, next) {

    //Check user
    if (req.query.user == null) {
        next(createError("User is not specified"));
    }

    let userObject = Buffer.from(req.query.user, 'base64').toString('ascii').split(':');

    //Parse request body
    //If action contains in the list
    let request = constants.actions.filter(el => el.name === req.body['queryResult']['action']);

    //Check language
    let lang = request.filter(l => l.response.hasOwnProperty(req.body['queryResult']['languageCode'])).length == 1
        ? req.body['queryResult']['languageCode'] : "default";

    if (request[0]['id'] != "undefined") {

        //Need to check info or command
        if (request[0]['type'] == "info") {

            getSessionId(userObject)
                .then(getCarId)
                .then(function (value) {
                    return getParams(value, req.body['queryResult']['action'])
                })
                .then(function (value) {
                        let responseObj = {
                            "fulfillmentText": request[0]['response'][lang] + ' ' + value + ' ' + request[0]['suffix'][lang]
                            , "fulfillmentMessages": [
                                {
                                    "text": {
                                        "text": [
                                            request[0]['response'][lang] + ' ' + value + ' ' + request[0]['suffix'][lang]
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


        } else if (request[0]['type'] == "command") {
            let show = req.body['queryResult']['parameters'].hasOwnProperty('show')
            && req.body['queryResult']['parameters']['show'] == "true" ? true : false;
            let type = {type: request[0]['id'], show: show};
            getSessionId(Object.assign(userObject, type))
                .then(getCarId)
                .then(sendCommand)
                .then(checkEngineStart)
                .then(function (value) {
                        const car = JSON.parse(value.data);
                        if (car.hasOwnProperty('action_result') && car['action_result'].hasOwnProperty(value.carId)) {
                            let response = request[0]['response'][lang];
                            if (request[0]['id'] == 4 && req.body['queryResult']['parameters'].hasOwnProperty('show') && req.body['queryResult']['parameters']['show'] == "true") {
                                response = request[0]['response'][lang] + ': ' + value.rpm + ' ' + request[0]['suffix'][lang];
                            }
                            let responseObj = {
                                "fulfillmentText": response
                                , "fulfillmentMessages": [
                                    {
                                        "text": {
                                            "text": [
                                                response
                                            ]
                                        }
                                    }
                                ]
                                , "source": "pandora alarm"
                            };
                            return res.json(responseObj);
                        } else {
                            let responseObj = {
                                "fulfillmentText": 'Something wrong: ' + value.data
                                , "fulfillmentMessages": [
                                    {
                                        "text": {
                                            "text": [
                                                'Something wrong: ' + value.data
                                            ]
                                        }
                                    }
                                ]
                                , "source": "pandora alarm"
                            };
                            return res.json(responseObj);
                        }
                    }
                ).catch(function onError(error) {
                next(createError(error));
            });
        }
    } else {
        next(createError("Request command is incorrect"));
    }
});

module.exports = router;