/**
 * Created by garry on 16/11/25.
 */

const request = require('request');
const globalConfig = require('@boluome/consul')('global');

const fetchData = (data, callback) => {
    request({
        url: `${globalConfig.getConfig().MONGODB_PROXY}/dianying_film_kou`,
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
                movieId: filmId * 1
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    queryByFilmIdAndCinemaId: (filmId, cinemaId, callback) => {
        fetchData({
            method: 'findOne',
            query: {
                movieId: filmId * 1,
                cinemaId: cinemaId * 1
            }
        }, (err, result) => {
            callback(err, result && result[0]);
        });
    },

    queryByFilmIdAndCinemaIds: (filmId, cinemaIds, callback) => {
        fetchData({
            method: 'find',
            query: {
                movieId: filmId * 1,
                cinemaId: {
                    $in: cinemaIds.map(id => id * 1)
                }
            }
        }, (err, result) => {
            callback(err, result || []);
        });
    },

    queryByCinemaIds: (cinemaIds, callback) => {
        fetchData({
            method: 'find',
            query: {
                cinemaId: {
                    $in: cinemaIds
                }
            },
            project: {
                _id: 0,
                cinemaId: 1,
                movieId: 1,
                pathVerticalS: 1,
                pathHorizonH: 1,
                expired: 1,
                has3D: 1,
                publishTime: 1,
                minVipPrice: 1,
                score: 1,
                actor: 1,
                has2D: 1,
                director: 1,
                intro: 1,
                movieName: 1,
                point: 1,
                hot_priority: 1,
                fansCnt: 1,
                movieType: 1,
                movieLength: 1,
                hot_planCount: 1,
                hasImax: 1,
                hot: 1,
                publishTimeDate: 1,
                minPrice: 1
            }
        }, (err, result) => {
            callback(err, result || []);
        });
    },
};