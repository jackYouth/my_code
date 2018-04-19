/**
 * Created by garry on 16/8/31.
 */

'use strict';

const express = require('express');
const async = require('async');
const configLoader = require('@boluome/consul')('dianying');
const request = require('request');
const order = require('../order');
const moment = require('moment');

const router = express.Router();

module.exports = router;

const getHandler = function (channel) {
    var handler = null;

    switch (channel) {
        case "kou":
            handler = require('../handlers/kou');
            break;
        case 'zzw':
            handler = require('../handlers/zzw');
            break;
        case 'maoyan':
            handler = require('../handlers/maoyan');
            break;
        default:
            break;
    }

    return handler;
};

const moviesSort = movies => {
    const list = movies.map(m => m);

    list.forEach(m => {
        const today = moment();
        let dateWeight;

        if (Math.abs(today.diff(moment(m.publishTime), 'days')) > 21) {
            dateWeight = 6;
        } else if (Math.abs(today.diff(moment(m.publishTime), 'days')) > 14) {
            dateWeight = 7;
        } else if (Math.abs(today.diff(moment(m.publishTime), 'days')) > 7) {
            dateWeight = 8;
        } else {
            dateWeight = 9;
        }

        m.weight = m.score + dateWeight;
        if (m.score == 8) {
            m.weight *= 0.95
        }
    });

    return list.sort((x, y) => x.weight < y.weight ? 1 : -1);
};

//获取供应商数据
router.get('/channels', (req, res, next) => {
    const svc_basis = configLoader.getConfig().SVC_BASIS;

    async.waterfall([callback => {
        request({
            url: `${svc_basis}/${req.get('customerId')}/brands`,
            json: true
        }, (err, response, body) => {
            callback(err, body);
        });
    }], (err, result) => {
        req.result = result.data.filter(r => r.category_code == 'dianying')[0].brands.sort((x, y) => x.order > y.order).map(b => {
            return {
                icon: b.icon_url,
                name: b.brand_name,
                code: b.brand_code,
                angle: b.angle || ''
            }
        });

        next(err);
    });
});

//获取城市字典数据
router.get('/cities', (req, res, next) => {
    const svc_basis = configLoader.getConfig().SVC_BASIS;

    async.parallel({
        kou: callback => {
            request({
                url: `${svc_basis}/dianying/kou/cities`,
                json: true
            }, (err, response, body) => {
                callback(err, body);
            });
        },
        zzw: callback => {
            request({
                url: `${svc_basis}/dianying/zzw/cities`,
                json: true
            }, (err, response, body) => {
                callback(err, body);
            });
        },
        maoyan: callback => {
            request({
                url: `${svc_basis}/dianying/maoyan/cities`,
                json: true
            }, (err, response, body) => {
                callback(err, body);
            });
        }
    }, (err, result) => {
        if (err) {
            next(err);
        } else {
            let kou_cities = result.kou.data;
            let zzw_cities = result.zzw.data;
            let maoyan_cities = result.maoyan.data;

            let cities = new Set((kou_cities.concat(zzw_cities).concat(maoyan_cities)).sort((x, y) => x.py > y.py ? 1 : -1).map(c => c.name));

            let cityData = [];
            cities.forEach(n => {
                let kou_city = kou_cities.filter(c => c.name == n)[0];
                let zzw_city = zzw_cities.filter(c => c.name == n)[0];
                let maoyan_city = maoyan_cities.filter(c => c.name == n)[0];

                cityData.push({
                    name: n,
                    py: (kou_city && kou_city.py) || (zzw_city && zzw_city.py)|| (maoyan_city && maoyan_city.py),
                    id: {
                        kou: kou_city && kou_city.channelCityId || '',
                        zzw: zzw_city && zzw_city.channelCityId || '',
                        maoyan: maoyan_city && maoyan_city.channelCityId || ''
                    }
                });
            });

            req.result = cityData;
            next();
        }
    });
});

//根据城市名获取城市id
router.get('/cities/:cityName/id', (req, res, next) => {
    const svc_basis = configLoader.getConfig().SVC_BASIS;

    request({
        url: `${svc_basis}/dianying/${req.data.channel}/cities`,
        json: true
    }, (err, response, body) => {
        if (err) {
            return next(err);
        }

        const city = body.data.filter(d => d.name == decodeURIComponent(req.params.cityName))[0];
        if (city) {
            req.result = city.channelCityId;
            return next();
        }

        next('没有对应的城市');
    });
});

//根据城市查询区域列表
/* @Param cityId       string */
router.get('/regions', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();
    req.checkQuery('cityId', 'cityId 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    getHandler(req.data.channel).queryRegionListByCityId(req.data, (err, result) => {
        req.result = result;
        next(err);
    });
});

/**
 * 查询某个城市下的行政区
 */
router.get('/city/:cityId/districts', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    const handler = getHandler(req.data.channel);
    handler.queryRegionListByCityId({
        cityId: req.params.cityId
    }, (err, result) => {
        req.result = result;
        next(err);
    });
});

//查询影院列表
/* @Param cityId       string */
/* @Param channel       string */
/* @Param latitude       string */
/* @Param longitude       string */
/*-----------------------------*/
/* @Param filmId       string */
/* @Param regionId       string */
router.get('/cinemas', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();
    req.checkQuery('cityId', 'cityId 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    var handler = getHandler(req.data.channel);

    async.waterfall([callback => {
        handler.queryRegionListByCityId(req.data, (err, districts) => {
            callback(err, districts);
        });
    }, (districts, callback) => {
        var method = req.data.filmId ? 'queryCinemasByCityAndFilm' : 'queryCineamsByCityOrRegion';

        handler[method](req.data, (err, cinemas) => {
            if (err) {
                callback(err);
            } else {
                if (req.data.queryText) {
                    cinemas = cinemas.filter(c => {
                        var reg = new RegExp(req.data.queryText);
                        return reg.test(c.name) || reg.test(c.address);
                    });
                }

                cinemas = cinemas.sort((x, y) => x.dis - y.dis);

                callback(null, {
                    districts: districts,
                    cinemas: cinemas
                });
            }
        });
    }], (err, result) => {
        req.result = result;
        next(err);
    });
});

//查询最近去过的影院
/* @Param channel       string */
/* @Param customerUserId   string */
/* @Param cityId       string */
/* @Param latitude       string */
/* @Param longitude       string */
router.get('/cinemas/recent', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();
    req.checkQuery('customerUserId', 'customerUserId 不能为空').notEmpty();
    req.checkQuery('cityId', 'cityId 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    const handler = getHandler(req.data.channel);

    handler.queryRecentCinemas(req.data, (err, result) => {
        req.result = result;
        next(err);
    });
});

//根据电影查询影院排期
/* @Param channel       string */
/* @Param cityId       string */
/* @Param latitude       string */
/* @Param longitude       string */
router.get('/film/:filmId/cinemas', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();
    req.checkQuery('cityId', 'cityId 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    req.data = Object.assign(req.data, {
        filmId: req.params.filmId
    });

    getHandler(req.data.channel).cinemaPlans(req.data, (err, result) => {
        req.result = result;
        next(err);
    });
});

//查询热映电影
router.get('/film/showing', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();
    req.checkQuery('cityId', 'cityId 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    getHandler(req.data.channel).queryShowingFilmByCity(req.data, (err, result) => {
        req.result = moviesSort(result);
        next(err);
    });
});

//查询即将上映电影
router.get('/film/coming', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    //蜘蛛网没有待映电影列表接口
    const handler = req.data.channel == 'maoyan' ? getHandler('maoyan') : getHandler('kou');

    handler.queryComingFilms(req.data.cityId, (err, result) => {
        req.result = result;
        next(err);
    });
});

//查询热映电影的详情信息
router.get('/film/showing/:filmId', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    getHandler(req.data.channel).queryFilmInfo(req.params.filmId, (err, result) => {
        req.result = result;
        next(err);
    });
});

//查询即将上映电影的详情信息
router.get('/film/coming/:filmId', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();

    const errors = req.validationErrors();
    const {channel} = req.data;
    const {filmId} = req.params;

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    if (channel == 'kou') {
        getHandler('kou').queryFilmInfo(filmId, (err, result) => {
            req.result = result;
            next(err);
        });
    } else if (channel == 'maoyan') {
        getHandler('maoyan').queryCommingFilmInfo(filmId, (err, result) => {
            req.result = result;
            next(err);
        });
    }
});

//查询某个影院下的电影列表
/* @Param cityId       string */
router.get('/cinema/:cinemaId/films', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    getHandler(req.data.channel).queryCinemaFilmInfo(req.params.cinemaId, (err, result) => {
        req.result = result;
        next(err);
    });
});

//查询某个影院下的某部电影的排期
/* @Param cinemaId       string */
/* @Param filmId       string */
/* @Param cityId       string */
router.get('/cinema/:cinemaId/film/:filmId/plans', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    getHandler(req.data.channel).queryFilmShowingInfo({
        cinemaId: req.params.cinemaId,
        filmId: req.params.filmId,
        appCode: req.data.appCode
    }, (err, result) => {
        req.result = result;
        next(err);
    });
});

//查询座位信息
/* @Param channel       string */
/* @Param cinemaId       string */
/* @Param hallId       string */
/* @Param planId       string */
router.get('/cinema/:cinemaId/hall/:hallId/plan/:planId/seats', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    getHandler(req.data.channel).queryShowSeatsInfo({
        showId: req.params.planId,
        cinemaId: req.params.cinemaId,
        hallId: req.data.hallId
    }, (err, result) => {
        req.result = result;
        next(err);
    });
});

//订单创建
router.post('/order', (req, res, next) => {
    req.checkBody('channel', 'channel 不能为空').notEmpty();
    req.checkBody('showId', 'showId 不能为空').notEmpty();
    req.checkBody('userId', 'userId 不能为空').notEmpty();
    req.checkBody('customerUserId', 'customerUserId 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    req.data.appCode = req.get('appCode');
    req.data.customerId = req.get('customerId');

    getHandler(req.data.channel).createOrder(req.data, (err, result) => {
        req.result = result;
        next(err);
    });
});