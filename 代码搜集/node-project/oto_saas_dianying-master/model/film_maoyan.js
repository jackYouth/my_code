/**
 * Created by Garry on 2017/7/19.
 */

const request = require('request');
const globalConfig = require('@boluome/consul')('global');

const fetchData = (data, callback) => {
    const config = globalConfig.getConfig();

    request({
        url: `${config.MONGODB_PROXY}/dianying_film_mao`,
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
    getByCinemaId: (cinemaId, callback) => {
        fetchData({
            method: 'find',
            query: {
                cinemaId: cinemaId * 1
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    getByFilmId: (filmId, callback) => {
        fetchData({
            method: 'find',
            query: {
                id: filmId * 1
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    queryByFilmIdAndCinemaId: (filmId, cinemaId, callback) => {
        fetchData({
            method: 'findOne',
            query: {
                id: filmId * 1,
                cinemaId: cinemaId * 1
            }
        }, (err, result) => {
            callback(err, result && result[0]);
        });
    },

    queryByFilmIdAndCinemaIds: (filmId, cinemaIds, callback) => {
        fetchData({
            method: 'findOne',
            query: {
                id: filmId * 1,
                cinemaId: {
                    $in: cinemaIds.map(i => i * 1)
                }
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    queryByCinemaIds: (cinemaIds, callback) => {
        fetchData({
            method: 'find',
            query: {
                cinemaId: {
                    $in: cinemaIds.map(i => i * 1)
                }
            }
        }, (err, result) => {
            callback(err, result || []);
        });
    },
};