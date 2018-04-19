/**
 * Created by garry on 16/8/31.
 */
'use strict';

const zzw = require('../zzw/index');
const mapper = require('./zzw_mapper');
const async = require('async');
const moment = require('moment');
const order = require('../order');
const configLoader = require('@boluome/consul')('dianying');
const filmDb = require('../model/film_zzw');
const cinemaDb = require('../model/cinema_zzw');
const common = require('./common');

module.exports = {
    queryRegionListByCityId: (data, callback) => {
        zzw.regionList(data.cityId, (err, result) => {
            callback(err, mapper.regionsMapping(result));
        });
    },

    queryCinemasByCityAndFilm: (data, callback) => {
        var cinemas = [];
        var dates = [];

        for (var i = 0; i < 30; i++) {
            dates.push(moment().add(i, 'days').format('YYYY-MM-DD'));
        }

        async.waterfall([callback => {
            zzw.cinemaList(data.cityId, (err, result) => {
                cinemas = result;
                callback(err);
            });
        }, callback => {
            var cinemaIds = cinemas.map(c => c.cinemaId);

            filmDb.queryByFilmIdAndCinemaIds(data.filmId, cinemaIds, (err, result) => {
                callback(err, result);
            });
        }], (err, films) => {
            if (err) {
                callback(err);
            } else {
                cinemas.forEach(c => {
                    var film = films.filter(f => f.cinemaId == c.cinemaId)[0];

                    c.hasPlans = film ? film.plans.filter(p => {
                            return dates.indexOf(p.showDate) > -1
                                && moment(`${p.showDate} ${p.showTime.substring(0, 2)}:${p.showTime.slice(-2)}`, 'YYYY-MM-DD HH:mm') > moment();
                        }).length > 0 : false;
                });

                callback(null, mapper.cinemaMapping({
                    lat: data.latitude,
                    lng: data.longitude,
                }, cinemas).sort((x, y) => x.dis - y.dis));
            }
        });
    },

    queryCineamsByCityOrRegion: (data, callback) => {
        cinemaDb.getByCityAndDistrict({
            cityId: data.cityId,
            regionId: data.regionId
        }, (err, cinemas) => {
            if (err) {
                return callback(err);
            }

            if (data.regionId) {
                cinemas = cinemas.filter(c => c.regionId == data.regionId);
            }

            callback(null, mapper.cinemaMapping({
                lat: data.latitude,
                lng: data.longitude,
            }, cinemas).sort((x, y) => x.dis - y.dis));
        });
    },

    queryFilmInfo: (filmId, callback) => {
        zzw.filmList(filmId, (err, films) => {
            if (err) {
                callback(err);
            } else {
                callback(null, mapper.movieMapping(films)[0] || {});
            }
        });
    },

    queryRecentCinemaIds: (data, callback) => {
        order.queryRecentOrder({
            channel: 'zzw',
            customerUserId: data.customerUserId,
            cityId: data.cityId,
            count: configLoader.getConfig().RECENT_CINEMAS_COUNT,
        }, (err, result) => callback(err, result));
    },

    queryRecentCinemas: (data, callback) => {
        async.waterfall([callback => {
            order.queryRecentOrder({
                channel: 'zzw',
                customerUserId: data.customerUserId,
                cityId: data.cityId,
                count: configLoader.getConfig().RECENT_CINEMAS_COUNT,
            }, (err, result) => callback(err, result));
        }, (orders, callback) => {
            var cinemaIds = orders.map(r => r.cinema.id);

            cinemaDb.queryByIds(cinemaIds, (err, result) => callback(err, result));
        }], (err, result) => {
            if (err) {
                return callback(err);
            }

            callback(null, mapper.cinemaMapping({
                lat: data.latitude,
                lng: data.longitude,
            }, result).sort((x, y) => x.dis - y.dis));
        });
    },

    queryShowingFilmByCity: (data, callback) => {
        zzw.filmList((err, films) => {
            if (err) {
                callback(err);
            } else {
                callback(null, mapper.movieArrayMapping(films.filter(f => {
                    //过滤掉上映时间是一年前的电影
                    return f.actor && moment(f.openingDate).add(1, 'years').isAfter(new Date());
                }).sort((x, y) => {
                    //按照上映时间倒序排序
                    return (x.openingDate < y.openingDate) ? 1 : -1;
                })));
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
                            address: result.cinemaAdd,
                            latitude: result.latitude,
                            longitude: result.longitude,
                            endbuyMinute: 30,
                        });
                    }
                });
            },
            films: callback => {
                filmDb.getByCinemaId(cinemaId, (err, result) => {
                    if (err) {
                        callback(err);
                    } else {
                        var films = result.filter(f => {
                            return f.plans.filter(p => {
                                    return p.showDate >= moment().format('YYYY-MM-DD');
                                }).length > 0;
                        });

                        callback(null, films.map(m => {
                            return {
                                id: m.filmId,
                                pic: m.picture,
                                name: m.filmName,
                                type: m.catalog,
                                score: 8,
                                length: m.duration * 1
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
        filmDb.queryByFilmIdAndCinemaId(data.filmId, data.cinemaId, (err, films) => {
            if (err) {
                return callback(err);
            }

            var plans = films.plans;
            var dates = [... new Set(plans.map(p => p.showDate))].filter(d => moment(d) > moment()).sort((x, y) => x > y);
            var retVal = [];

            dates.forEach(d => {
                var plan = mapper.moviePlanMapping(plans.filter(p => p.showDate == d));

                let result = plan.filter(p => !p.isExpire);
                if (result.length < 4) {
                    result = plan.slice(-4);
                }

                retVal.push({
                    dateStr: mapper.dateMapping(d),
                    date: d,
                    plan: result,
                });
            });

            callback(null, retVal);
        });
    },

    queryShowSeatsInfo: (data, callback) => {
        async.parallel({
            all: callback => {
                zzw.seatList({
                    cinemaId: data.cinemaId,
                    hallId: data.hallId,
                }, (err, result) => {
                    callback(err, result);
                });
            },
            saled: callback => {
                zzw.showSeatList(data.showId, (err, result) => {
                    callback(err, result);
                });
            },
        }, (err, result) => {
            if (err) {
                callback(err);
            } else {
                callback(null, mapper.seatsMapping(result.all, result.saled));
            }
        });
    },

    queryShowSeatsInfo_v2: (data, callback) => {
        async.parallel({
            all: callback => {
                zzw.seatList({
                    cinemaId: data.cinemaId,
                    hallId: data.hallId,
                }, (err, result) => {
                    callback(err, result);
                });
            },
            saled: callback => {
                zzw.showSeatList(data.showId, (err, result) => {
                    callback(err, result);
                });
            },
        }, (err, result) => {
            if (err) {
                callback(err);
            } else {
                callback(null, mapper.seatsMapping_v2(result.all, result.saled));
            }
        });
    },

    createOrder: (data, callback) => {
        let retVal = null;
        let show = null;
        let cinema = null;
        const priceRaising = configLoader.getConfig().ZZW_PRICE_RAISING;

        data.showId = data.showId || data.planId;

        async.waterfall([callback => {
            cinemaDb.getById(data.cinemaId, (err, result) => {
                cinema = result;
                callback(err);
            });
        }, callback => {
            filmDb.queryByFilmIdAndCinemaId(data.filmId, data.cinemaId, (err, result) => {
                callback(err, result && result.plans);
            })
        }, (shows, callback) => {
            show = shows.filter(s => s.showId == data.showId)[0];

            var seatName = [];

            data.seatNo.forEach(s => {
                var kv = s.split(':');

                seatName.push(`${kv[0]}排${kv[1]}座`);
            });

            order.saveOrder({
                userId: data.userId,
                orderPrice: Number(((show.userPrice * 1 + priceRaising) * data.count).toFixed(2)),
                realPrice: Number((show.userPrice * data.count).toFixed(2)),
                phone: data.phone,
                name: show.filmName,
                movieName: show.filmName,
                hallName: show.hallName,
                showDate: show.showDate,
                language: show.language,
                screenType: show.dimensional,
                seatName: seatName.join(' '),
                couponId: data.couponId,
                activityId: data.activityId,
                channel: 'zzw',
                count: data.count,
                cinema: {
                    id: show.cinemaId,
                    name: show.cinemaName,
                    addr: cinema.cinemaAdd,
                    lat: cinema.latitude,
                    lng: cinema.longitude,
                    cityId: cinema.cityId,
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
            var feePrice = '';

            for (var i = 0; i < data.count; i++) {
                feePrice += show.feePrice + '|';
            }

            feePrice = feePrice.substring(0, feePrice.length - 1);
            zzw.lockSeatList({
                showId: show.showId,
                cinemaId: show.cinemaId,
                hallId: show.hallId,
                filmId: show.filmId,
                seatId: data.seatNo.join('|'),
                merPrice: show.merPrice,
                feePrice: feePrice ? feePrice : show.feePrice,
                parorderId: data.orderId,
                mobile: data.phone,
            }, (err, result) => {
                if (err) {
                    // order.cancel(retVal.id, ()=> {
                    //     return callback(err);
                    // });
                    // 创建订单失败，将订单状态置为异常
                    order.updateStatus(retVal.id, [order.status_emun.error], {canCancel: 0}, () => {
                        callback(err);
                    });
                } else {
                    callback(err, result);
                }
            });
        }, (zzwOrder, callback) => {
            order.updateStatus(retVal.id, order.status_emun.be_paid, {
                partnerId: zzwOrder.orderId,
            }, err => {
                callback(err);
            });
        }], err => {
            callback(err, retVal);
        });
    },

    confirmOrder: (data, callback) => {
        zzw.confirmOrder({
            orderId: data.orderId,
            mobile: data.mobile
        }, err => {
            callback(err);
        });
    },

    cancelOrder: (data, callback) => {
        zzw.unLockSeat(data.partnerId, (err, result) => {
            callback(err, result);
        });
    },

    cinemaPlans: (data, callback) => {
        let cinemas = [];
        let recentCinemaIds = [];
        let dates = [];
        let priceRaising = Number(configLoader.getConfig().ZZW_PRICE_RAISING || 0);

        async.waterfall([callback => {
            async.parallel({
                recentCinemaIds: callback => {
                    if (data.customerUserId) {
                        module.exports.queryRecentCinemaIds({
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
            var cinemaIds = cinemas.map(c => c.cinemaId);

            filmDb.queryByFilmIdAndCinemaIds(data.filmId, cinemaIds, (err, result) => {
                callback(err, result);
            });
        }, (films, callback) => {
            films.forEach(f => {
                f.plans = f.plans.filter(p => moment(`${p.showDate} ${p.showTime.substring(0, 2)}:${p.showTime.slice(-2)}`) > moment());
            });

            films = films.filter(f => f.plans.length);

            films.forEach(f => {
                dates = dates.concat(f.plans.map(p => p.showDate));
            });

            dates = [... new Set(dates)].filter(d => d >= moment().format('YYYY-MM-DD')).sort((x, y) => x > y);

            var group = [];

            dates.forEach(d => {
                var matchedfilms = films.filter(p => {
                    return p.plans.filter(item => item.showDate == d).length;
                });

                var matchedCinemas = [];

                matchedfilms.forEach(f => {
                    var times = f.plans.filter(p => p.showDate == d).map(item => {
                        var showTime = ('00' + item.showTime).slice(-4);


                        return moment(`${item.showDate} ${showTime.substring(0, 2)}:${showTime.slice(-2)}`, 'YYYY-MM-DD HH:mm');
                    });
                    var minPrice = Math.min(... f.plans.map(item => Number(item.userPrice) + priceRaising));

                    var timePrefix = moment().format('YYYY-MM-DD') == d ? '近期场次' : '当日场次';
                    var matchedTimes = times.map(t => t.format('HH:mm'));

                    matchedCinemas.push(Object.assign({}, mapper.cinemaMapping({
                        lat: data.latitude,
                        lng: data.longitude,
                    }, cinemas.filter(c => c.cinemaId == f.cinemaId))[0], {
                        minPrice: minPrice,
                        times: `${timePrefix} ${matchedTimes.length > 4 ? matchedTimes.slice(0, 4).join(' | ') + '...' : matchedTimes.join(' | ')}`,
                    }));
                });

                group.push({
                    date: common.dateMapping(d),
                    cinemas: matchedCinemas.sort((x, y) => x.dis - y.dis).map(c => {
                        c.isRecent = recentCinemaIds.indexOf(c.id) > -1 ? 1 : 0;
                        return c;
                    }),
                });
            });

            callback(null, group.filter(g => g.cinemas.length));
        }], (err, result) => {
            callback(err, result);
        });
    },
};






