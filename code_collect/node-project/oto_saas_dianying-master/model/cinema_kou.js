/**
 * Created by garry on 16/11/25.
 */

const request = require('request');
const globalConfig = require('@boluome/consul')('global');

const fetchData = (data, callback) => {
    request({
        url: `${globalConfig.getConfig().MONGODB_PROXY}/dianying_cinema_kou`,
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
            cityId: data.cityId * 1
        };

        if (data.regionId) {
            condition.districtId = data.regionId * 1
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
            query: {
                cinemaId: id * 1
            }
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

    getIdsByCity: (cityId, callback) => {
        fetchData({
            method: 'find',
            query: {
                cityId: cityId * 1
            },
            project: {
                _id: 0,
                cinemaId: 1
            }
        }, (err, result) => {
            callback(err, (result || []).map(r => r.cinemaId));
        });
    }
};