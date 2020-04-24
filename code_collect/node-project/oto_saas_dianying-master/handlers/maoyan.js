/**
 * Created by Garry on 2017/7/19.
 */

const _ = require('lodash');
const moment = require('moment');
const async = require('async');
const common = require('./common');
const mapper = require('./maoyan_mapper');
const configLoader = require('@boluome/consul')('dianying');
const order = require('../order');
const maoyan = require('../maoyan');
const filmDb = require('../model/film_maoyan');
const cinemaDb = require('../model/cinema_maoyan');

const channel = 'maoyan';

const queryRecentCinemaIds = (data, callback) => {
    const config = configLoader.getConfig();

    order.queryRecentOrder({
        channel: channel,
        customerUserId: data.customerUserId,
        cityId: data.cityId,
        count: config.RECENT_CINEMAS_COUNT,
    }, (err, result) => {
        callback(err, (result || []).map(r => r.cinema.id));
    });
};

module.exports = {
    queryRecentCinemaIds,

    /**
     * 根据城市获取行政区列表
     *
     * @param data.cityId
     */
    queryRegionListByCityId: (data, callback) => {
        cinemaDb.getByCityAndDistrict({
            cityId: data.cityId
        }, (err, result) => {
            if (err) {
                return callback(err)
            }

            callback(null, _.uniqBy(result, 'locationId').map(item => {
                return {
                    name: item.areaName,
                    id: item.locationId
                }
            }));
        });
    },

    /**
     * 根据城市id和行政区id筛选影院
     *
     * @param data.cityId
     * @param data.regionId
     * @param data.latitude
     * @param data.longitude
     */
    queryCineamsByCityOrRegion: (data, callback) => {
        cinemaDb.getByCityAndDistrict(data, (err, result) => {
            if (err) {
                return callback(err);
            }

            callback(null, result.map(c => mapper.cinemaMapping(c, {
                lat: data.latitude,
                lng: data.longitude
            })).sort((x, y) => x.dis - y.dis));
        });
    },

    /**
     * 根据城市id和电影id筛选影院
     *
     * @param data.cityId
     * @param data.filmId
     */
    queryCinemasByCityAndFilm: (data, callback) => {
        let cinemas = [];

        async.waterfall([callback => {
            cinemaDb.getByCityAndDistrict({
                cityId: data.cityId
            }, (err, result) => {
                cinemas = result;

                callback(err);
            });
        }, callback => {
            filmDb.queryByFilmIdAndCinemaIds(data.filmId, cinemas.map(c => c.cinemaId), (err, result) => {
                callback(err, result);
            });
        }], (err, films) => {
            if (err) {
                return callback(err);
            }

            cinemas.forEach(c => {
                let film = films.filter(f => f.cinemaId == c.cinemaId)[0];

                c.hasPlans = film ? (film.showList || []).filter(p => {
                        return p.showStartTime > Date.now()
                    }).length > 0 : false;
            });

            cinemas = cinemas.filter(c => c.hasPlans);

            callback(err, cinemas.map(c => mapper.cinemaMapping(c, {
                lat: data.latitude,
                lng: data.longitude
            })).sort((x, y) => x.dis - y.dis));
        });
    },

    /**
     * 影院排期
     *
     * @param data.cityId
     * @param data.filmId
     * @param data.customerUserId
     * @param data.regionId
     * @param data.lat
     * @param data.lng
     */
    cinemaPlans: (data, callback) => {
        let cinemas = [];
        let recentCinemaIds = [];
        let dates = [];

        async.waterfall([callback => {
            async.parallel({
                recentCinemaIds: callback => {
                    if (data.customerUserId) {
                        queryRecentCinemaIds({
                            customerUserId: data.customerUserId,
                            cityId: data.cityId,
                        }, (err, result) => {
                            recentCinemaIds = result;
                            callback(err);
                        });
                    } else {
                        callback(null, []);
                    }
                },
                cinemas: callback => {
                    cinemaDb.getByCityAndDistrict({
                        cityId: data.cityId,
                        regionId: data.regionId,
                    }, (err, result) => {
                        cinemas = result;
                        callback(err);
                    });
                }
            }, err => {
                callback(err);
            });
        }, callback => {
            let cinemaIds = cinemas.map(c => c.cinemaId);

            filmDb.queryByFilmIdAndCinemaIds(data.filmId, cinemaIds, (err, result) => {
                callback(err, result);
            });
        }, (films, callback) => {
            films.forEach(f => {
                f.plans = f.showList.filter(p => p.canSell && p.showStartTime > Date.now());
            });

            films = films.filter(f => f.plans.length);

            films.forEach(f => {
                dates = dates.concat(f.plans.map(item => moment(item.showStartTime).format('YYYY-MM-DD')));
            });

            dates = [... new Set(dates)].filter(d => d >= moment().format('YYYY-MM-DD')).sort((x, y) => x > y ? 1 : -1);

            let group = [];

            dates.forEach(d => {
                let matchedfilms = films.filter(p => {
                    return p.plans.filter(p => moment(p.showStartTime).format('YYYY-MM-DD') == d).length;
                });

                let matchedCinemas = [];

                matchedfilms.forEach(f => {
                    let times = f.plans.filter(p => moment(p.showStartTime).format('YYYY-MM-DD') == d).map(item => moment(item.showStartTime));
                    let minPrice = Math.min(... f.plans.map(item => Number(item.settlePriceForMerchant / 100)));

                    let timePrefix = moment().format('YYYY-MM-DD') == d ? '近期场次' : '当日场次';
                    let matchedTimes = times.map(t => t.format('HH:mm'));

                    matchedCinemas.push(Object.assign({}, mapper.cinemaMapping(cinemas.filter(c => c.cinemaId == f.cinemaId)[0], {
                        lat: data.latitude,
                        lng: data.longitude,
                    }), {
                        minPrice: minPrice,
                        times: `${timePrefix} ${matchedTimes.length > 4 ? matchedTimes.slice(0, 4).join(' | ') + '...' : matchedTimes.join(' | ')}`,
                    }));
                });

                matchedCinemas = matchedCinemas.map(c => {
                    c.isRecent = recentCinemaIds.indexOf(c.id) > -1 ? 1 : 0;
                    return c;
                });

                group.push({
                    date: common.dateMapping(d),
                    cinemas: matchedCinemas.filter(c => c.isRecent).concat(matchedCinemas.filter(c => !c.isRecent).sort((x, y) => x.dis - y.dis))
                });
            });

            callback(null, group.filter(g => g.cinemas.length));
        }], (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 查询用户最近去过的影院
     *
     * @param data.cityId
     * @param data.customerUserId
     * @param data.latitude
     * @param data.longitude
     */
    queryRecentCinemas: (data, callback) => {
        async.waterfall([callback => {
            queryRecentCinemaIds(data, (err, result) => {
                callback(err, result);
            });
        }, (cinemaIds, callback) => {
            cinemaDb.queryByIds(cinemaIds, (err, result) => callback(err, result));
        }], (err, result) => {
            if (err) {
                return callback(err);
            }

            callback(null, result.map(r => mapper.cinemaMapping(r, {
                lat: data.latitude,
                lng: data.longitude,
            })).sort((x, y) => x.dis - y.dis));
        });
    },

    /**
     * 待映电影
     *
     * @param cityId
     */
    queryComingFilms: (cityId, callback) => {
        filmDb.getByCinemaId(-1, (err, result) => {
            if (err) {
                return callback(err);
            }

            const movies = _.uniqBy(result.map(m => mapper.commingMovieMapping(m)), 'id');
            const {videos, filmsGroupByDate, filmsGroupByMonth} = common.comingMovieMapping(movies);

            callback(null, {
                videos,
                filmsGroupByDate,
                filmsGroupByMonth,
            });
        });
    },

    /**
     * 查询某个影院的电影列表
     *
     * @param cinemaId
     */
    queryCinemaFilmInfo: (cinemaId, callback) => {
        async.parallel({
            cinemaInfo: callback => {
                cinemaDb.getById(cinemaId, (err, result) => {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, {
                        id: result.cinemaId,
                        name: result.cinemaName,
                        address: result.cinemaAddr,
                        latitude: result.latitude,
                        longitude: result.longitude,
                        endbuyMinute: result.buyTimeLimit || 30,
                        mapType: 'gaode'
                    });
                });
            },
            films: callback => {
                filmDb.getByCinemaId(cinemaId, (err, result) => {
                    if (err) {
                        return callback(err);
                    }

                    let films = result.filter(f => {
                        return (f.showList || []).filter(p => {
                                return p.canSell && (p.showStartTime > Date.now());
                            }).length > 0;
                    });

                    callback(null, films.map(m => {
                        return {
                            id: m.id,
                            pic: mapper.getHttpsImageUrl(m.avatar || ''),
                            name: m.name,
                            type: m.category,
                            score: m.score,
                            length: m.duration
                        };
                    }));
                });
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 查询热映电影
     *
     * @param data.cityId
     */
    queryShowingFilmByCity: (data, callback) => {
        async.waterfall([callback => {
            cinemaDb.getByCityAndDistrict({
                cityId: data.cityId
            }, (err, result) => {
                callback(err, result);
            });
        }, (cinemas, callback) => {
            filmDb.queryByCinemaIds(cinemas.map(c => c.cinemaId), (err, result) => {
                callback(err, result);
            });
        }], (err, movies) => {
            if (err) {
                return callback(err);
            }

            callback(null, mapper.movieArrayMapping(_.uniqBy(movies, 'id')));
        });
    },

    /**
     * 查询电影信息
     *
     * @param filmId
     */
    queryFilmInfo: (filmId, callback) => {
        filmDb.getByFilmId(filmId, (err, result) => {
            if (err) {
                return callback(err);
            }

            callback(null, mapper.movieMapping(result[0]));
        });
    },

    /**
     * 查询待映的电影信息
     *
     * @param cityId
     * @param filmId
     */
    queryCommingFilmInfo: (filmId, callback) => {
        maoyan.movieInfo(filmId, (err, result) => {
            if (err) {
                return callback(err);
            }

            callback(null, mapper.movieMapping(result));
        });
    },

    /**
     * 查询某个影院下的某部电影的排期
     *
     * @param data.filmId
     * @param data.cinemaId
     */
    queryFilmShowingInfo: (data, callback) => {
        filmDb.queryByFilmIdAndCinemaId(data.filmId, data.cinemaId, (err, result) => {
            if (err) {
                return callback(err);
            }

            const matchedPlans = result.showList.filter(p => {
                return moment(p.showStartTime).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD')
                    && p.canSell;
            });

            async.eachLimit(matchedPlans, 5, (plan, callback) => {
                if (moment(plan.showStartTime) > moment()) {
                    maoyan.seat(plan.showId, (err, seatData) => {
                        if (err) {
                            plan.isFull = true;
                        } else {
                            plan.isFull = seatData.sections.map(s => s.seats || []).reduce((x, y) => x.concat(y), []).filter(s => {
                                    return s.status == 'N' || s.status == 'L' || s.status == 'R'
                                }).length == 0;
                        }

                        callback();
                    });
                } else {
                    plan.isFull = true;
                    callback();
                }
            }, err => {
                if (err) {
                    return callback(err);
                }

                callback(null, mapper.moviePlanMapping(matchedPlans, {
                    movieLength: result.duration,
                }));
            });
        });
    },

    /**
     * 查询座位信息
     *
     * @param data.showId
     */
    queryShowSeatsInfo: (data, callback) => {
        maoyan.seat(data.showId, (err, result) => {
            if (err) {
                return callback(err);
            }

            callback(null, mapper.seatsMapping(result.sections[0].seats));
        });
    },

    createOrder: (data, callback) => {
        let retVal = null;
        let cinema = null;
        let film = null;
        let seats = null;
        let seatNameList = [];
        let price = 0;

        let seatsJSON = {
            count: data.count,
            list: []
        };

        data.showId = data.showId || data.planId;

        async.parallel({
            cinema: callback => {
                cinemaDb.getById(data.cinemaId, (err, result) => {
                    callback(err, result);
                });
            },
            film: callback => {
                filmDb.queryByFilmIdAndCinemaId(data.filmId, data.cinemaId, (err, result) => {
                    callback(err, result);
                });
            },
            seats: callback => {
                maoyan.seat(data.showId, (err, result) => {
                    callback(err, result);
                });
            }
        }, (err, result) => {
            if (err) {
                return callback(err);
            }

            cinema = result.cinema;
            film = result.film;
            seats = result.seats;

            data.seatNo.forEach(s => {
                let seat = seats.sections[0].seats.filter(item => item.seatNo == s)[0];

                seatNameList.push(`${seat.rowId}排${seat.columnId}座`);

                seatsJSON.list.push({
                    sectionId: seats.sections[0].id,
                    seatNo: s,
                    columnId: seat.columnId,
                    rowId: seat.rowId
                });
            });

            async.waterfall([callback => {
                let plan = film.showList.filter(p => p.showId == data.showId)[0];
                price = Number(parseFloat(plan.settlePriceForMerchant) * data.count);

                order.saveOrder({
                    userId: data.userId,
                    orderPrice: price / 100,
                    realPrice: price / 100,
                    phone: data.phone,
                    name: film.name,
                    movieName: film.name,
                    hallName: plan.hallName,
                    seatName: seatNameList.join(' '),
                    showDate: moment(plan.showStartTime).format('YYYY-MM-DD'),
                    showTime: moment(plan.showStartTime).format('HH:mm'),
                    language: plan.language,
                    screenType: plan.showVersionType,
                    couponId: data.couponId,
                    activityId: data.activityId,
                    channel: channel,
                    count: data.count,
                    cinema: {
                        id: cinema.cinemaId,
                        name: cinema.cinemaName,
                        addr: cinema.cinemaAddr,
                        lat: cinema.latitude,
                        lng: cinema.longitude,
                        cityId: `${cinema.cityId}`,
                    },
                    moviePhoto: data.moviePhoto,
                    icon: data.moviePhoto,
                    customerId: data.customerId,
                    customerUserId: data.customerUserId,
                    userPhone: data.userPhone,
                    appCode: data.appCode,
                }, (err, result) => {
                    if (err || result.code != 0) {
                        return callback(err || result.message);
                    }

                    retVal = result.data;
                    callback();
                });
            }, callback => {
                maoyan.lock({
                    cinemaId: cinema.cinemaId,
                    showId: data.showId,
                    seatsJSON: JSON.stringify(seatsJSON),
                    orderCode: retVal.id,
                    mobile: data.userPhone,
                    settlePrice: price,
                    sellPrice: price
                }, (err, result) => {
                    if (err || result.orderStatus != 1) {
                        order.updateStatus(retVal.id, [order.status_emun.error], {canCancel: 0}, () => {
                            callback(err, result);
                        });
                    } else {
                        callback(err, result);
                    }
                });
            }, (maoOrder, callback) => {
                order.updateStatus(retVal.id, order.status_emun.be_paid, {
                    partnerId: maoOrder.orderId,
                }, err => {
                    callback(err, maoOrder);
                });
            }], err => {
                callback(err, retVal);
            });
        });
    },

    /**
     * 确认订单
     *
     * @param data.id
     * @param data.partnerId
     */
    confirmOrder: (data, callback) => {
        maoyan.fixOrder(data.partnerId, data.id, err => {
            callback(err);
        });
    },

    cancelOrder: (data, callback) => {
        maoyan.unlock({
            orderId: data.partnerId,
            orderCode: data.id
        }, callback);
    }
};