/**
 * Created by garry on 16/8/31.
 */
'use strict';

const express = require('express');
const moment = require('moment');
const async = require('async');
const request = require('request');

const mongo = require('@boluome/mongo');
const logger = require('@boluome/log').getLogger('dianying');
const configLoader = require('@boluome/consul')('dianying');
const globalConfig = require('@boluome/consul')('global');

const order = require('../order');
const FilmError = require('../error').FilmError;
const FilmError_Enum = require('../error').FilmError_Enum;

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

//订单确认
router.post('/paySuccess', (req, res, next) => {
    req.checkBody('id', 'id 不能为空').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    let order_data = null;

    async.waterfall([callback => {
        order.getById(req.data.id, (err, result) => {
            order_data = result;

            callback(err);
        });
    }, callback => {
        if (process.env.NODE_ENV == 'dev') {
            return callback();
        }

        getHandler(order_data.channel).confirmOrder(order_data, err => {
            callback(err);
        });
    }, callback => {
        if (process.env.NODE_ENV == 'dev') {
            return callback();
        }

        const taskName = order_data.channel == 'kou' ? 'worker.kou.kou_fetch' : 'worker.maoyan.order_status_polling';
        const queue = order_data.channel == 'kou' ? 'kou_tasks' : 'maoyan_tasks';

        request({
            url: globalConfig.getConfig().mqUrl,
            json: true,
            method: 'POST',
            body: {
                exchangeName: "session",
                routingKey: "task",
                payload: {
                    taskName,
                    queue,
                    args: {
                        channel: order_data.channel,
                        orderId: order_data.id,
                        partnerOrderId: order_data.partnerId,
                        appCode: order_data.appCode
                    }
                }
            }
        }, err => callback(err));
    }], err => {
        if (err) {
            order.cancel(order_data.id, cancelErr => {
                next(err || cancelErr);
            });
        } else {
            req.result = {
                statuses: [{code: 9, msg: '出票中'}],
                doc: {
                    canCancel: 0
                }
            };

            next();
        }
    });
});

//订单详情
router.get('/queryOrderById', (req, res, next) => {
    req.checkQuery('id', 'id 不能为空').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    order.queryOrderById(req.data.id, (err, result) => {
        if (err) {
            logger.error(err);
            next(new FilmError(FilmError_Enum.order.query));
        } else {
            if (result.ticketMsg) {
                const reg = /取票码\[(.+?)\]/;

                if (reg.test(result.ticketMsg)) {
                    result.ticketCode = reg.exec(result.ticketMsg)[1];
                }
            }

            req.result = result;
            next();
        }
    });
});

//取消订单
router.post('/cancelOrder', (req, res, next) => {
    req.checkBody('id', 'id 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({
            code: configLoader.getConfig().PARAMERROR_DEFAULT_CODE,
            msg: errors[0].msg
        });
    }

    async.waterfall([
        callback => order.getById(req.data.id, callback),
        (orderData, callback) => {
            getHandler(req.data.channel).cancelOrder(Object.assign(req.data, {
                partnerId: orderData.partnerId
            }), callback);
        }
    ], err => next(err));
});

//添加测试接口
router.get('/testAPI', (req, res) => {
    res.status(200).json('ok');
});

//网关定时调用的健康检查接口
router.get('/status', (req, res) => {
    async.parallel({
        mongo: callback => {
            async.waterfall([
                callback => mongo.getInstance(callback),
                (db, callback) => db.admin().ping(callback)
            ], (err, result) => {
                if (err || !result.ok) {
                    return callback(null, `down+${configLoader.getConfig().MONGODB_CONNECT_STR}`);
                }

                callback(null, 'online');
            });
        },
        redis: callback => {
            callback(null, '-');
        }
    }, (err, result) => {
        res.json({
            name: 'dianying',
            host: configLoader.getConfig().HOST,
            port: configLoader.getConfig().PORT,
            redis: result.redis,
            mongo: result.mongo,
            mq: 'online',
            time: moment().format('YYYY-MM-DD HH:mm:ss')
        });
    });
});