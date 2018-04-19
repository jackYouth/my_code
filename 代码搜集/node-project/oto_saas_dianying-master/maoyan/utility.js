/**
 * Created by Garry on 2017/7/18.
 */

const request = require('request');
const crypto = require('crypto');

//正式环境
const merCode = '1000058';
const key = 'cw8jhcd1lld0b5c3szq890wgxrq376cc';
const server = 'http://open.maoyan.com/api/';

//测试环境
// const merCode = '1000014';
// const key = 'A013F70DB97834C0A5492378BD76C53A';
// const server = 'http://movie.test.maoyan.com';

const version = '1.0';
const signType = 'MD5';

const signature = data => {
    let arr = [];

    Object.keys(data).sort((x, y) => x > y).forEach(k => {
        arr.push(`${k}=${data[k]}`);
    });

    arr.push(`key=${key}`);

    return crypto.createHash('md5').update(arr.join('&'), 'utf8', 'utf8').digest('hex').toUpperCase();
};

module.exports = {
    requestAPI: (path, api, data, callback) => {
        if (!callback) {
            callback = data;
            data = undefined;
        }

        let form = {
            merCode: merCode,
            timestamp: Math.floor(Date.now() / 1000),
            version: version,
            signType: signType,
            api: api,
        };

        if (data) {
            form = Object.assign(form, {
                bizData: JSON.stringify(data)
            });
        }

        form = Object.assign(form, {
            signMsg: signature(form)
        });

        const url = `${server}${path}`;

        request({
            url,
            method: 'POST',
            form
        }, (err, response, body) => {
            body = JSON.parse(body);

            if (err || body.code != 0) {
                return callback(err || body.msg);
            }

            callback(null, body.data.data);
        });
    }
};