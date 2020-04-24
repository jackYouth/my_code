/**
 * Created by garry on 16/11/28.
 */
const request = require('request');
const globalConfig = require('@boluome/consul')('global');

const fetchData = (data, callback) => {
    request({
        url: `${globalConfig.getConfig().MONGODB_PROXY}/dianying_film_zzw`,
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
                cinemaId: cinemaId
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    getByFilmId: (filmId, callback) => {
        fetchData({
            method: 'find',
            query: {
                filmId: filmId
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    queryByFilmIdAndCinemaId: (filmId, cinemaId, callback) => {
        fetchData({
            method: 'findOne',
            query: {
                filmId: filmId,
                cinemaId: cinemaId
            }
        }, (err, result) => {
            callback(err, result && result[0]);
        });
    },

    queryByFilmIdAndCinemaIds: (filmId, cinemaIds, callback) => {
        fetchData({
            method: 'find',
            query: {
                filmId: filmId,
                cinemaId: {
                    $in: cinemaIds
                }
            }
        }, (err, result) => {
            callback(err, result);
        });
    }
};