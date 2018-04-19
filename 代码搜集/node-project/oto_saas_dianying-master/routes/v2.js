/**
 * Created by Garry on 2017/6/7.
 */
const express = require('express');
const async = require('async');
const router = express.Router();
const configLoader = require('@boluome/consul')('dianying');

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

/**
 * 查询影院列表
 *
 * @param cityId
 * @param channel
 * @param latitude
 * @param longitude
 * @param filmId
 * @param regionId
 * @param queryText
 */
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

    const handler = getHandler(req.data.channel);
    const method = req.data.filmId ? 'queryCinemasByCityAndFilm' : 'queryCineamsByCityOrRegion';

    async.parallel({
        recentCinemaIds: callback => {
            req.data.customerUserId = req.data.customerUserId || req.data.userId;

            if (req.data.customerUserId) {
                handler.queryRecentCinemaIds({
                    customerUserId: req.data.customerUserId || req.data.userId,
                    cityId: req.data.cityId
                }, (err, result) => {
                    callback(err, result);
                });
            } else {
                callback(null, []);
            }
        },
        cinemas: callback => {
            handler[method](req.data, (err, result) => {
                callback(err, result);
            });
        }
    }, (err, result) => {
        if (err) {
            return next(err);
        }

        let cinemas = [];
        const reg = req.data.queryText ? new RegExp(req.data.queryText) : null;
        result.cinemas.forEach(c => {
            if (!reg || reg.test(c.name) || reg.test(c.address)) {
                c.isRecent = result.recentCinemaIds.indexOf(c.id) > -1 ? 1 : 0;
                cinemas.push(c);
            }
        });

        cinemas = cinemas.filter(c => c.isRecent).concat(cinemas.filter(c => !c.isRecent).sort((x, y) => x.dis - y.dis));

        req.result = cinemas;
        next();
    });
});

//查询即将上映电影
router.get('/film/coming', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();
    req.checkQuery('cityId', 'channel 不能为空').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    //目前只有抠电影支持即将上映电影查询
    const handler = req.data.channel == 'maoyan' ? getHandler('maoyan') : getHandler('kou');

    handler.queryComingFilms(req.data.cityId, (err, result) => {
        req.result = result;
        next(err);
    });
});


/**
 * 查询座位信息
 *
 * @param channel
 * @param cinemaId
 * @param hallId
 * @param planId
 */
router.get('/cinema/:cinemaId/hall/:hallId/plan/:planId/seats', (req, res, next) => {
    req.checkQuery('channel', 'channel 不能为空').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    getHandler(req.data.channel).queryShowSeatsInfo_v2({
        showId: req.params.planId,
        cinemaId: req.params.cinemaId,
        hallId: req.params.hallId
    }, (err, result) => {
        req.result = result;
        next(err);
    });
});


//订单创建
router.post('/order', (req, res, next) => {
    req.checkBody('channel', 'channel 不能为空').notEmpty();
    req.checkBody('planId', 'planId 不能为空').notEmpty();
    req.checkBody('customerUserId', 'customerUserId 不能为空').notEmpty();

    var errors = req.validationErrors();
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