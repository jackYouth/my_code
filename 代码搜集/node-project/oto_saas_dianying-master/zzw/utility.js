/**
 * Created by garry on 16/9/1.
 */
'use strict';

var crypto = require('crypto');
var request = require('request');

//var config = process.env.NODE_ENV === 'dev' ? {
//    url: 'http://filmapi.spider.com.cn/v2/ceshi/',
//    key: 'ceshi',
//    secret: '0051657786'
//} : {
//    url: 'http://filmapi.spider.com.cn/v2/boluomi/',
//    key: 'boluomi',
//    secret: 'BV07RK5W9U3Z'
//};

var config = {
	url: 'http://filmapi.spider.com.cn/v2/boluomi/',
	key: 'boluomi',
	secret: 'BV07RK5W9U3Z',
};

/**
 * md5加密
 * @param str
 */
var md5 = str=> {
	return crypto.createHash('md5').update(str, 'utf8', 'utf8').digest('hex');
};

var handleData = data=> {
	data.key = config.key;

	var md5Str = '';

	for (var i in data) {
		md5Str += data[i];
	}

	data.sign = md5(md5Str + config.secret);
	data.filetype = 'json';
};

module.exports = {
	apiGet: (path, data, callback)=> {
		handleData(data);

		var url = config.url + path;

		if (data) {
			var queryString = [];

			for (var i in data) {
				queryString.push(i + '=' + encodeURIComponent(data[i]));
			}
			if (queryString.length > 0) {
				url += (url.indexOf('?') >= 0 ? '&' : '?') + queryString.join('&');
			}
		}

		request({
			url: url,
			json: true,
			encoding: 'utf8',
		}, (error, response, body)=> {
			if (!error && response.statusCode == 200 && body) {
				callback(null, body);
			} else {
				callback(body || 'something wrong at http get');
			}
		});
	},
};


