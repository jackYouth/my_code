/**
 * Created by garry on 16/8/31.
 */
'use strict';

const configLoader = require('@boluome/consul')('dianying');
const mongo = require('@boluome/mongo');
const request = require('request');
const async = require('async');

const ORDER_PARAMS = {
    table: 'order_dianying',
    orderType: 'dianying'
};

const getCollection = callback => {
    mongo.getInstance((err, db) => {
        if (err) {
            return callback(err);
        }

        const collection = db.collection(ORDER_PARAMS.table);

        callback(null, collection);
    });
};

//订单状态枚举
const status_emun = {
    remove: {code: -1, msg: '已删除'},
    error: {code: 0, msg: '异常'},
    ordered: {code: 1, msg: '已下单'},
    be_paid: {code: 2, msg: '待支付'},
    paid: {code: 3, msg: '已支付'},
    complete: {code: 4, msg: '已完成'},
    canceling: {code: 5, msg: '取消中'},
    pay_back: {code: 6, msg: '退款中'},
    pay_back_success: {code: 7, msg: '已退款'},
    cancelled: {code: 8, msg: '已取消'},
    dealing: {code: 9, msg: '处理中'},
    failed: {code: 10, msg: '订单失败'},
    waiting_refund: {code: 11, msg: '等待退款'}
};

module.exports = {
    getById: (id, callback) => {
        async.waterfall([callback => getCollection(callback),
            (collection, callback) => {
                collection.find({id}).limit(1).next(callback);
            }], callback);
    },

    //保存订单
    saveOrder: (data, callback) => {
        request({
            url: `${configLoader.getConfig().SVC_ORDER}/`,
            method: 'post',
            qs: {
                orderType: ORDER_PARAMS.orderType
            },
            body: {
                doc: data
            },
            json: true
        }, (err, body, response) => {
            callback(err, response);
        });
    },

    //根据id 获取订单详情
    queryOrderById: (id, callback) => {
        async.waterfall([callback => getCollection(callback),
            (collection, callback) => {
                collection.findOne({id}, callback);
            }], callback);
    },

    //查询最近的订单
    queryRecentOrder: (data, callback) => {
        async.waterfall([callback => getCollection(callback),
            (collection, callback) => {
                collection.find({
                    channel: data.channel,
                    status: 4,
                    customerUserId: data.customerUserId,
                    'cinema.cityId': `${data.cityId}`
                }).sort({createdAt: -1}).limit(data.count).toArray(callback);
            }], callback);
    },

    //取消订单
    cancel: (id, callback) => {
        request({
            url: `${configLoader.getConfig().SVC_ORDER}/cancel`,
            method: 'put',
            qs: {
                orderType: ORDER_PARAMS.orderType,
                id: id
            },
            json: true
        }, (err, body, response) => {
            callback(err, response.data);
        });
    },

    //更新订单状态
    updateStatus: (id, status, opts, callback) => {
        if (!callback) {
            callback = opts;
            opts = {};
        }

        if (!(status instanceof Array)) {
            status = Array.of(status);
        }

        request({
            url: `${configLoader.getConfig().SVC_ORDER}/status`,
            method: 'put',
            qs: {
                orderType: ORDER_PARAMS.orderType,
                id: id
            },
            body: {
                statuses: status,
                opts: opts
            },
            json: true
        }, (err, body, response) => {
            callback(err, response && response && response.data);
        });
    },

    //更新订单
    update: (id, data, callback) => {
        async.waterfall([callback => getCollection(callback),
            (collection, callback) => {
                collection.updateOne({id}, {
                    $set: data
                }, err => {
                    callback(err);
                });
            }], callback);
    },

    status_emun: status_emun
};