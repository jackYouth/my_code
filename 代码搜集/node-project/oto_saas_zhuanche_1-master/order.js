/**
 * Created by garry on 16/8/31.
 */
'use strict';

const SVC_ORDER = require('./config').SVC_ORDER;

const request = require('request');

const ORDER_PARAMS = {
    table: 'order_zhuanche',
    orderType: 'zhuanche'
};

const collection = global.mongoDb.collection(ORDER_PARAMS.table);

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
    //获取新订单id
    getId: callback => {
        request({
            url: `${SVC_ORDER}/id`,
            json: true
        }, (err, body, response) => {
            callback(err, response && response.data);
        });
    },

    getById: (id, callback) => {
        collection.find({
            id: id
        }).limit(1).next((err, doc) => {
            callback(err, doc);
        });
    },

    //保存订单
    saveOrder: (data, callback) => {
        request({
            url: `${SVC_ORDER}/`,
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
        collection.findOne({
            id: id
        }, (err, result) => {
            callback(err, result);
        });
    },

    //取消订单
    cancel: (id, callback) => {
        request({
            url: `${SVC_ORDER}/cancel`,
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
            url: `${SVC_ORDER}/status`,
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
        collection.updateOne({
            id: id
        }, {
            $set: data
        }, err => {
            callback(err);
        });
    },

    status_emun: status_emun
};