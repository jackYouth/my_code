/**
 * Created by garry on 16/8/31.
 */
'use strict';
var moment = require('moment');
var crypto = require('crypto');
var querystring = require('querystring');
var request = require('request');

//var config = process.env.NODE_ENV === 'dev' ? {
//    requestUrl: 'http://test.komovie.cn/api_movie/service',
//    md5Key: 'XQxYf3J5gJHm3zWh'
//} : {
//    requestUrl: 'http://api.komovie.cn/movie/service',
//    md5Key: 'GglrL3WIjp6CUZnj'
//};


var config = {
    requestUrl: 'http://api.komovie.cn/movie/service',
    md5Key: 'GglrL3WIjp6CUZnj'
}

var requestUrl = config.requestUrl;
var md5Key = config.md5Key;

var md5 = str=> {
    return crypto.createHash('md5').update(str, 'utf8', 'utf8').digest('hex');
};

var hash = (data)=> {
    var keys = [],
        hashStr = '';
    for (var o in data) {
        keys.push(o);
    }
    keys.sort();
    for (var i = 0; i < keys.length; i++) {
        hashStr += data[keys[i]];
    }
    hashStr += md5Key;
    return md5(encodeURIComponent(hashStr)).toLowerCase();
};

var apiPost = (url, data, callback)=> {
    var sendData = querystring.stringify(data);
    var contentLength = sendData.length;

    request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded',
            'channel_id': 189
        },
        uri: url,
        body: sendData,
        method: 'POST'
    }, function (err, res, body) {
        if (err) {
            callback(err);
            return;
        }
        if (body) {
            callback(null, body);
        }
    });
};

module.exports = {
    kouQuery: (data, callback)=> {
        data.time_stamp = new moment().format('x');

        data.enc = hash(data);

        apiPost(requestUrl, data, function (error, result) {
            if (error) {
                callback(error);
            } else {
                callback(null, typeof result == 'string' ? JSON.parse(result) : result);
            }
        });
    }
};