/**
 * Created by garry on 16/11/28.
 */

const request = require('request');
const globalConfig = require('@boluome/consul')('global');

const fetchData = (data, callback) => {
    request({
        url: `${globalConfig.getConfig().MONGODB_PROXY}/dianying_cinema_zzw`,
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
            condition.regionId = data.regionId
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
            query: {cinemaId: id}
        }, (err, result) => {
            callback(err, result && result[0]);
        });
    },

    queryByIds: (idArr, callback) => {
        fetchData({
            method: 'find',
            query: {
                cinemaId: {
                    $in: idArr
                }
            }
        }, (err, result) => {
            callback(err, result);
        });
    }
};