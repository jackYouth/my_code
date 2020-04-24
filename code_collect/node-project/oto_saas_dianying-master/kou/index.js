/**
 * Created by garry on 16/8/31.
 */
'use strict';
const logger = require('@boluome/log').getLogger('dianying');
const utility = require('./utility');
const async = require('async');

module.exports = {
    //通过城市获取影院列表
    cityCinemaList: (cityId, callback) => {
        utility.kouQuery({
            action: 'cinema_Query',
            city_id: cityId
        }, (err, result) => {
            if (err) {
                callback(err);
            } else {
                if (result.status == 0) {
                    callback(null, result.cinemas);
                } else {
                    callback(result.error);
                }
            }
        });
    },

    /**
     * 根据城市查询区域列表
     * @public
     * @param cityId
     * @param callback
     */
    queryRegionList: (params, callback) => {
        var data = {
            action: 'cinema_Query',
            city_id: params.cityId
        };

        utility.kouQuery(data, function (err, result) {
            if (err) {
                callback(err);
            } else {
                if (result.status == 0) {
                    callback(null, result.cinemas);
                } else {
                    callback(result.error);
                }
            }
        });
    },

    /**
     * 由影片查询其影院
     * @param parmas
     * @param callback
     */
    queryCineamsByCityAndFilm: (params, callback) => {
        var data = {
            action: 'cinema_Query',
            city_id: params.cityId
        };

        var list = [];

        async.waterfall([callback => {
            utility.kouQuery(data, (err, result) => {
                callback(err, result);
            });
        }, (cinema_result, callback) => {
            var cinemas = cinema_result.cinemas;

            if (params.regionId) {
                cinemas = cinemas.filter(c => c.districtId == params.regionId);
            }

            async.eachLimit(cinemas, 10, (cinema, callback) => {
                var p = {
                    action: 'plan_Query',
                    cinema_id: cinema.cinemaId,
                    movie_id: params.filmId
                };
                utility.kouQuery(p, function (err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        if (result.plans && result.plans.length > 0) {
                            list.push(cinema);
                        }
                        callback();
                    }
                });
            }, err => {
                callback(err);
            });
        }], err => {
            callback(err, list);
        });
    },

    /**
     * 查询城市\区域电影院列表
     * @public
     * @param params
     * @param callback
     */
    queryCineamsByCityOrRegion: (params, callback) => {
        var data = {
            action: 'cinema_Query',
            city_id: params.cityId
        };

        utility.kouQuery(data, (err, result) => {
            if (err) {
                callback(err);
            } else {
                var cinemas = result.cinemas;
                if (params.regionId) {
                    cinemas = cinemas.filter(c => c.districtId == params.regionId);
                }

                callback(err, cinemas);
            }
        });
    },

    /**
     * 查询即将上映电影
     * @public
     * @param callback
     */
    queryComingFilms: callback => {
        var data = {
            action: 'movie_Query',
            coming: 1
        };
        utility.kouQuery(data, (err, result) => {
            callback(err, result.movies);
        });
    },

    /**
     * 查询电影详情
     * @public
     * @param filmId
     * @param callback
     */
    queryFilmInfo: (filmId, callback) => {
        var data = {
            action: 'movie_Query',
            movie_id: filmId
        };
        utility.kouQuery(data, (err, result) => {
            if (err || result.status != 0) {
                callback(err || result.error);
            } else {
                callback(null, result.movie);
            }
        });
    },

    /**
     * 查询影院详情
     * @public
     * @param params
     * @param callback
     */
    queryCinemaInfo: (cinemaId, callback) => {
        var data = {
            action: 'cinema_Query',
            cinema_id: cinemaId
        };

        utility.kouQuery(data, (err, result) => {
            callback(err, result.cinema);
        });
    },

    /**
     * 查询城市热映电影
     * @public
     * @param params
     * @param callback
     */
    queryShowingFilmsByCity: (params, callback) => {
        var data = {
            action: 'movie_Query',
            city_id: params.cityId
        };
        utility.kouQuery(data, (err, result) => {
            callback(err, result.movies);
        });
    },

    /**
     * 查询影院中影片及其某部影片的排期信息
     * @public
     * @param params
     * @param callback
     */
    queryCinemaFilmInfo: (cinemaId, callback) => {
        var data = {
            action: 'movie_Query',
            cinema_id: cinemaId
        };

        utility.kouQuery(data, (err, result) => {
            callback(err, result.movies || []);
        });
    },

    /**
     * 查询某部电影的排期
     * @public
     * @param params
     * @param callback
     */
    queryFilmShowingInfo: (params, callback) => {
        var data = {
            action: 'plan_Query',
            cinema_id: params.cinemaId,
            movie_id: params.filmId
        };

        utility.kouQuery(data, (err, result) => {
            logger.info(JSON.stringify({
                'kou.queryFilmShowingInfo': {
                    data,
                    err,
                    result
                }
            }));

            callback(err, result.plans);
        });
    },

    /**
     * 查询某一场次的座位信息
     * @public
     * @param params
     * @param callback
     */
    queryShowSeatsInfo: (showId, callback) => {
        var data = {
            action: 'seat_Query',
            plan_id: showId
        };
        utility.kouQuery(data, function (err, result) {
            if (err || result.status != 0) {
                callback(err || result.error);
            } else {
                callback(null, result.seats);
            }
        });
    },

    /**
     * 选座下单
     * @public
     * @param params
     * @param callback
     */
    createOrder: (params, callback) => {
        var data = {
            action: 'order_Add',
            mobile: params.phone,
            seat_no: params.seatNo.join(','),
            plan_id: params.showId
        };

        utility.kouQuery(data, (err, result) => {
            logger.info(JSON.stringify({
                '抠电影下单:': {
                    params: data,
                    err: err,
                    result: result
                }
            }));

            if (err) {
                callback(err);
            } else if (result.status != 0) {
                callback({
                    code: result.errorCode,
                    message: result.error
                });
            } else {
                callback(null, result.order);
            }
        });
    },

    /**
     * 订单确认
     * @public
     * @param params
     * @param callback
     */
    confirmOrder: (params, callback) => {
        let data = {
            action: 'order_Confirm',
            order_id: params.order_id,
            balance: params.balance
        };

        if (params.kou_code) {
            data.coupon_ids = params.kou_code;
        }

        utility.kouQuery(data, (err, result) => {
            logger.info(JSON.stringify({
                'kou confirm order:': {
                    data,
                    err,
                    result
                }
            }));

            if (err || result.status != 0) {
                callback(err || result.error);
            } else {
                callback(null, result.orderId);
            }
        });
    },

    /**
     * 取消订单
     * @param params
     * @param callback
     */
    cancelOrder: (orderId, callback) => {
        var data = {
            action: 'order_Delete',
            order_id: orderId
        };
        utility.kouQuery(data, (err, result) => {
            logger.info(JSON.stringify({
                'kou cancel order:': {
                    data,
                    err,
                    result
                }
            }));

            if (err || result.status != 0) {
                callback(err || result.error);
            } else {
                callback();
            }
        });
    }
};

