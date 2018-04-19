/**
 * Created by garry on 16/8/31.
 */
'use strict';

const configLoader = require('@boluome/consul')('dianying');
const kou = require('../kou/index');
const mapper = require('./kou_mapper');
const async = require('async');
const order = require('../order');
const filmDb = require('../model/film_kou');
const cinemaDb = require('../model/cinema_kou');
const moment = require('moment');
const common = require('./common');

const queryRecentCinemaIds = (data, callback) => {
    const config = configLoader.getConfig();

    order.queryRecentOrder({
        channel: 'kou',
        customerUserId: data.customerUserId,
        cityId: data.cityId,
        count: config.RECENT_CINEMAS_COUNT,
    }, (err, result) => {
        callback(err, (result || []).map(r => r.cinema.id));
    });
};

module.exports = {
    queryRecentCinemaIds,

    queryRegionListByCityId: (data, callback) => {
        kou.queryRegionList(data, (err, cinemas) => {
            if (err) {
                callback(err);
            } else {
                let list = [];
                let hash = {};

                cinemas.forEach(item => {
                    if (item.districtId && !hash[item.districtId]) {
                        list.push({
                            name: item.districtName,
                            id: item.districtId,
                        });

                        hash[item.districtId] = true;
                    }
                });

                callback(null, list);
            }
        });
    },

    queryCinemasByCityAndFilm: (data, callback) => {
        let cinemas = [];
        let dates = [];

        for (let i = 0; i < 30; i++) {
            dates.push(moment().add(i, 'days').format('YYYY-MM-DD'));
        }

        async.waterfall([callback => {
            cinemaDb.getByCityAndDistrict({
                cityId: data.cityId
            }, (err, result) => {
                cinemas = result;
                callback(err);
            });
        }, callback => {
            let cinemaIds = cinemas.map(c => c.cinemaId);

            filmDb.queryByFilmIdAndCinemaIds(data.filmId, cinemaIds, (err, result) => {
                callback(err, result);
            });
        }], (err, films) => {
            if (err) {
                callback(err);
            } else {
                cinemas.forEach(c => {
                    let film = films.filter(f => f.cinemaId == c.cinemaId)[0];

                    c.hasPlans = film ? film.plans.filter(p => {
                            let m = moment(p.featureTime, 'YYYY-MM-DD HH:mm:ss');

                            return dates.indexOf(m.format('YYYY-MM-DD')) > -1 && m > moment();
                        }).length > 0 : false;
                });

                callback(null, cinemas.filter(c => c.hasPlans).map(c => mapper.cinemaMapping(c, {
                    lat: data.lat,
                    lng: data.lng,
                })).sort((x, y) => x.dis - y.dis));
            }
        });
    },

    queryCineamsByCityOrRegion: (data, callback) => {
        cinemaDb.getByCityAndDistrict({
            cityId: data.cityId,
            regionId: data.regionId
        }, (err, result) => {
            if (err) {
                callback(err);
            } else {
                callback(null, result.map(c => mapper.cinemaMapping(c, {
                    lat: data.latitude,
                    lng: data.longitude,
                })).sort((x, y) => x.dis - y.dis));
            }
        });
    },

    queryComingFilms: (cityId, callback) => {
        if (!callback) {
            callback = cityId;
            cityId = null;
        }

        kou.queryComingFilms((err, result) => {
            if (err) {
                return callback(err);
            }

            const movies = mapper.movieArrayMapping(result);
            const {filmsGroupByDate, filmsGroupByMonth} = common.comingMovieMapping(movies);

            callback(null, {
                filmsGroupByDate,
                filmsGroupByMonth,
            });
        });
    },

    queryFilmInfo: (filmId, callback) => {
        filmDb.getByFilmId(filmId, (err, result) => {
            if (err) {
                callback(err);
            } else {
                callback(null, mapper.movieMapping(result[0]));
            }
        });
    },

    queryRecentCinemas: (data, callback) => {
        const config = configLoader.getConfig();

        async.waterfall([callback => {
            order.queryRecentOrder({
                channel: 'kou',
                customerUserId: data.customerUserId,
                cityId: data.cityId,
                count: config.RECENT_CINEMAS_COUNT,
            }, (err, result) => callback(err, result));
        }, (orders, callback) => {
            let cinemaIds = orders.map(r => r.cinema.id);

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

    queryCinemaInfo: (data, callback) => {
        kou.queryCinemaInfo(data, (err, cinema) => {
            callback(err, mapper.cinemaInfoMapping(cinema));
        });
    },

    queryShowingFilmByCity: (data, callback) => {
        async.waterfall([callback => {
            cinemaDb.getIdsByCity(data.cityId, (err, result) => {
                callback(err, result);
            });
        }, (cinemaIds, callback) => {
            filmDb.queryByCinemaIds(cinemaIds, (err, result) => {
                callback(err, result);
            });
        }], (err, movies) => {
            if (err) {
                callback(err);
            } else {
                var result = [];
                var ids = [... new Set(movies.map(m => m.movieId))];

                ids.forEach(id => {
                    result.push(movies.filter(m => m.movieId == id)[0]);
                });

                callback(null, mapper.movieArrayMapping(result));
            }
        });
    },

    queryCinemaFilmInfo: (cinemaId, callback) => {
        async.parallel({
            cinemaInfo: callback => {
                cinemaDb.getById(cinemaId, (err, result) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, {
                            id: result.cinemaId,
                            name: result.cinemaName,
                            address: result.cinemaAddress,
                            latitude: result.latitude,
                            longitude: result.longitude,
                            endbuyMinute: 30,
                            mapType: 'gaode'
                        });
                    }
                });
            },
            films: callback => {
                filmDb.getByCinemaId(cinemaId, (err, result) => {
                    if (err) {
                        callback(err);
                    } else {
                        let films = result.filter(f => {
                            return (f.plans || []).filter(p => {
                                    return moment(p.featureTime) > moment();
                                }).length > 0;
                        });

                        callback(null, films.map(m => {
                            return {
                                id: m.movieId,
                                pic: (m.pathVerticalS || '').replace(/http:/, 'https:'),
                                name: m.movieName,
                                type: m.movieType,
                                score: m.score,
                                length: m.movieLength
                            };
                        }));
                    }
                });
            },
        }, (err, result) => {
            callback(err, result);
        });
    },

    queryFilmShowingInfo: (data, callback) => {
        filmDb.queryByFilmIdAndCinemaId(data.filmId, data.cinemaId, (err, result) => {
            if (err) {
                return callback(err);
            }

            const matchedPlans = result.plans.filter(p => moment(p.featureTime).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD'));

            async.eachLimit(matchedPlans, 5, (plan, callback) => {
                if (moment(plan.featureTime) > moment()) {
                    kou.queryShowSeatsInfo(plan.planId, (err, seats) => {
                        if (err) {
                            plan.isFull = true;
                        } else {
                            plan.isFull = (seats || []).filter(s => s.seatState == 0).length == 0;
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
                    movieLength: result.movieLength,
                    appCode: data.appCode
                }));
            });
        });
    },

    queryShowSeatsInfo: (data, callback) => {
        kou.queryShowSeatsInfo(data.showId, (err, seats) => {
            if (err) {
                callback(err);
            } else {
                callback(null, mapper.seatsMapping(seats));
            }
        });
    },

    queryShowSeatsInfo_v2: (data, callback) => {
        kou.queryShowSeatsInfo(data.showId, (err, seats) => {
            if (err) {
                callback('该电影当前场次临时调整,请选择其它场次');
            } else {
                callback(err, mapper.seatsMapping_v2(seats));
            }
        });
    },

    createOrder: (data, callback) => {
        let retVal = null;
        let cinema = null;

        const config = configLoader.getConfig();

        const premiumRate = config.KOU_PREMIUM_RATE[data.appCode] || 1;

        data.showId = data.showId || data.planId;

        async.waterfall([callback => {
            cinemaDb.getById(data.cinemaId, (err, result) => {
                cinema = result;
                callback(err);
            });
        }, callback => {
            kou.queryFilmShowingInfo({
                cinemaId: data.cinemaId,
                filmId: data.filmId,
            }, (err, result) => {
                callback(err, result);
            });
        }, (plans, callback) => {
            let plan = plans.filter(p => p.planId == data.showId)[0];
            const orderPrice = premiumRate == 1 ? Number((parseFloat(plan.price) * data.count).toFixed(2))
                : Math.round(plan.price * premiumRate) * data.count;

            order.saveOrder({
                userId: data.userId,
                orderPrice,
                realPrice: Number((parseFloat(plan.price) * data.count).toFixed(2)), //成本价
                phone: data.phone,
                name: plan.movie.movieName,
                movieName: plan.movie.movieName,
                hallName: plan.hallName,
                showDate: moment(plan.featureTime).format('YYYY-MM-DD'),
                showTime: moment(plan.featureTime).format('HH:mm'),
                endTime: moment(plan.featureTime).add(plan.movie.movieLength, 'minutes').format('HH:mm'),
                language: plan.language,
                screenType: plan.screenType,
                couponId: data.couponId,
                activityId: data.activityId,
                channel: 'kou',
                count: data.count,
                cinema: {
                    id: cinema.cinemaId,
                    name: cinema.cinemaName,
                    addr: cinema.cinemaAddress,
                    lat: cinema.latitude,
                    lng: cinema.longitude,
                    cityId: `${cinema.cityId}`,
                },
                moviePhoto: data.moviePhoto,
                customerId: data.customerId,
                customerUserId: data.customerUserId,
                userPhone: data.userPhone,
                appCode: data.appCode,
            }, (err, result) => {
                if (err) {
                    return callback(err);
                }

                if (result.code != 0) {
                    return callback(result.message);
                }

                retVal = result.data;
                callback();
            });
        }, callback => {
            kou.createOrder(data, (err, result) => {
                if (err) {
                    // 创建订单失败，将订单状态置为异常
                    order.updateStatus(retVal.id, [order.status_emun.error], {canCancel: 0}, () => {
                        callback(err, result);
                    });
                } else {
                    callback(err, result);
                }
            });
        }, (kouOrder, callback) => {
            order.updateStatus(retVal.id, order.status_emun.be_paid, {
                partnerId: kouOrder.orderId,
            }, err => {
                callback(err, kouOrder);
            });
        }, (kouOrder, callback) => {
            let seatName = [];

            kouOrder.seatInfo.split(',').forEach(item => {
                let arr = item.split('_');

                if (arr.length == 2) {
                    seatName.push(arr[0] + '排' + arr[1] + '座');
                } else {
                    seatName.push(arr[1] + '排' + arr[2] + '座');
                }
            });

            order.update(retVal.id, {
                seatName: seatName.join(' '),
            }, err => {
                callback(err);
            });
        }], err => {
            callback(err, retVal);
        });
    },

    /**
     * 确认订单
     *
     * @param data.partnerId
     * @param data.realPrice
     */
    confirmOrder: (data, callback) => {
        kou.confirmOrder({
            order_id: data.partnerId,
            balance: data.realPrice
        }, err => {
            callback(err);
        });
    },

    cancelOrder: (data, callback) => {
        kou.cancelOrder(data.partnerId, (err, result) => {
            callback(err);
        });
    },

    cinemaPlans: (data, callback) => {
        const config = configLoader.getConfig();

        let cinemas = [];
        let recentCinemaIds = [];
        let dates = [];
        let premiumRate = config.KOU_PREMIUM_RATE[data.appCode] || 1;

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
                f.plans = f.plans.filter(p => moment(p.featureTime) > moment());
            });

            films = films.filter(f => f.plans.length);

            films.forEach(f => {
                dates = dates.concat(f.plans.map(item => moment(item.featureTime).format('YYYY-MM-DD')));
            });

            dates = [... new Set(dates)].filter(d => d >= moment().format('YYYY-MM-DD')).sort((x, y) => x > y ? 1 : -1);

            let group = [];

            dates.forEach(d => {
                let matchedfilms = films.filter(p => {
                    return p.plans.filter(p => moment(p.featureTime).format('YYYY-MM-DD') == d).length;
                });

                let matchedCinemas = [];

                matchedfilms.forEach(f => {
                    let times = f.plans.filter(p => moment(p.featureTime).format('YYYY-MM-DD') == d).map(item => moment(item.featureTime));
                    let minPrice = Math.min(... f.plans.map(item => Math.round(item.price * premiumRate)));

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
};

