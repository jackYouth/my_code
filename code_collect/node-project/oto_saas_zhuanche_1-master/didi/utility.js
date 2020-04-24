/**
 * Created by Garry on 2017/6/5.
 */

const request = require('request');
const async = require('async');
const moment = require('moment');
const hash = require('@boluome/hash');
const redis = require('@boluome/redis');
const redisTokenKey = 'didi_token';

const config = require('../config');

const domain = 'otosaas';
const key = 'otosaas20170605';
const server = 'http://123.125.253.6:20001';

const redisClient = redis.getInstance(config.REDIS_TCP_ADDR, config.REDIS_TCP_PORT, 15);

const signature = data => {
    let arr = [];
    Object.keys(data).sort((x, y) => x > y).forEach(k => {
        let v = data[k];
        if (v) {
            if (v instanceof Array) {
                v = JSON.stringify(v);
            }

            arr.push(`${k}=${v}`);
        }
    });

    return hash.md5(`${hash.md5(arr.join('&'))}${key}`);
};

/**
 * 请求didi服务器
 * @param opt.api
 * @param opt.method
 * @param opt.headers
 * @param opt.data
 * @param callback
 */
const requestAPI = (opt, callback) => {
    let reqOpt = {
        url: `${server}${opt.api}`,
        method: opt.method,
        headers: opt.headers || {},
        json: true
    };

    if (opt.method == 'GET') {
        reqOpt = Object.assign(reqOpt, {
            qs: opt.data
        });
    } else {
        reqOpt = Object.assign(reqOpt, {
            body: opt.data
        });
    }

    request(reqOpt, (err, response, body) => {
        callback(err, body);
    });
};

const getToken = callback => {
    const generateToken = (refresh_token, callback) => {
        if (!callback) {
            callback = refresh_token;
            refresh_token = null;
        }

        let timeStr = moment().format('YYYY-MM-DDTHH:mm:ssZ');
        timeStr = timeStr.replace(timeStr.substr(22), '00');

        let body = {
            grant_type: 'client_credentials',
            scope: 'public rides.read rides.request profile',
            _: timeStr,
            nostr: Math.random().toString(36).substr(2).substring(0, 6),
        };

        if (refresh_token) {
            body = Object.assign(body, {
                refresh_token: refresh_token
            });
        }

        requestAPI({
            api: '/v1/oauth/token',
            method: 'POST',
            data: body,
            headers: {
                Authorization: `bearer ${domain}|${signature(body)}`
            }
        }, (err, result) => {
            callback(err, result);
        });
    };

    async.waterfall([callback => {
        redisClient.hgetall(redisTokenKey, (err, result) => {
            callback(err, result);
        });
    }, (redisData, callback) => {
        if (redisData && redisData.access_token) {
            if ((Date.now() - redisData.createdAt) / 1000 < redisData.expires_in_second) {
                callback(null, redisData, {
                    writeRedis: false
                });
            } else {
                generateToken(redisData.refresh_token, (err, result) => {
                    callback(err, result, {
                        writeRedis: true
                    });
                });
            }
        } else {
            generateToken((err, result) => {
                callback(err, result, {
                    writeRedis: true
                });
            });
        }
    }, (tokenData, opt, callback) => {
        if (opt.writeRedis) {
            redisClient.hmset(redisTokenKey, Object.assign(tokenData, {
                createdAt: Date.now()
            }), err => {
                callback(err, tokenData.access_token);
            });
        } else {
            callback(null, tokenData.access_token);
        }
    }], (err, result) => {
        callback(err, result);
    });
};


/**
 * 请求didi服务器 带token
 * @param opt.api
 * @param opt.method
 * @param opt.headers
 * @param opt.data
 * @param callback
 */
const requestWithToken = (opt, callback) => {
    async.waterfall([callback => {
        getToken((err, result) => {
            callback(err, result);
        });
    }, (token, callback) => {
        opt.headers = Object.assign({}, opt.headers, {
            Authorization: `bearer ${domain}|${token}`
        });

        requestAPI(opt, (err, result) => {
            callback(err, result);
        })
    }], (err, result) => {
        callback(err, result);
    });
};

module.exports = {
    requestWithToken: requestWithToken,
    utf8Encode: text => {
        return text.replace(/[\s\S]/g, m => {
            return '\\u' + ('000' + m.charCodeAt().toString(16)).slice(-4);
        });
    }
};

