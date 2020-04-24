/**
 * Created by Garry on 2017/7/19.
 */

const request = require('request');
const globalConfig = require('@boluome/consul')('global');

const fetchData = (data, callback) => {
    const config = globalConfig.getConfig();

    request({
        url: `${config.MONGODB_PROXY}/dianying_cinema_mao`,
        method: 'POST',
        json: true,
        body: data
    }, (err, response, body) => {
        if (err || body.code != 0) {
            return callback(err || body.message);
        }

        callback(null, body.data);
    });
};


module.exports = {
    getByCityAndDistrict: (data, callback) => {
        let condition = {
            cityId: data.cityId
        };

        if (data.regionId) {
            condition = Object.assign(condition, {
                locationId: data.regionId
            });
        }

        fetchData({
            method: 'find',
            query: condition
        }, (err, result) => {
            callback(err, result);
        });
    },

    getById: (id, callback) => {
        fetchData({
            method: 'findOne',
            query: {cinemaId: id * 1}
        }, (err, result) => {
            callback(err, result && result[0]);
        });
    },

    queryByIds: (idArr, callback) => {
        fetchData({
            method: 'find',
            query: {
                cinemaId: {
                    $in: idArr.map(id => id * 1)
                }
            }
        }, (err, result) => {
            callback(err, result);
        });
    },
};