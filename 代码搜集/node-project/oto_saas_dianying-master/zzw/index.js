/**
 * Created by garry on 16/11/21.
 */

'use strict';
var utility = require('./utility');

module.exports = {
    //城市查询接口
    cityList: callback => {
        utility.apiGet('cityList.html', {}, (err, result) => {
            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result);
            }
        });
    },

    //地区信息查询接口
    regionList: (cityId, callback) => {
        utility.apiGet('regionList.html', {
            cityId: cityId,
        }, (err, result) => {
            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result.data);
            }
        });
    },

    //影院信息查询接口
    cinemaList: (cityId, callback) => {
        utility.apiGet('cinemaList.html', {
            cityId: cityId,
        }, (err, result) => {
            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result.data);
            }
        });
    },

    //影厅信息查询接口
    hallList: (cinemaId, callback) => {
        utility.apiGet('hallList.html', {
            cinemaId: cinemaId,
        }, (err, result) => {
            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result.data);
            }
        });
    },

    //座位信息查询接口
    /**
     * @data 对象的字段
     * @param cinemaId
     * @param hallId
     */
    seatList: (data, callback) => {
        utility.apiGet('seatList.html', data, (err, result) => {
            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result.data);
            }
        });
    },

    //影片信息查询接口
    /**
     * @param filmId可以不传,不传则返回所有影片
     */
    filmList: (filmId, callback) => {
        if (!callback) {
            callback = filmId;
            filmId = null;
        }

        var data = filmId ? {
            filmId: filmId,
        } : {};

        utility.apiGet('filmList.html', data, (err, result) => {
            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result.data);
            }
        });
    },

    //场次信息查询接口
    /**
     * @data 对象的字段
     * @param cinemaId
     * @param filmId
     * @param showDate
     */
    showList: (data, callback) => {
        utility.apiGet('showList.html', data, (err, result) => {
            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result.data);
            }
        });
    },

    //场次座位信息查询接口
    //查询场次已售的座位信息列表
    showSeatList: (showId, callback) => {
        utility.apiGet('showSeatList.html', {
            showId: showId,
        }, (err, result) => {
            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result.data);
            }
        });
    },

    //订单座位锁定接口
    /**
     * @data 对象的字段
     * @param showId
     * @param cinemaId
     * @param hallId
     * @param filmId
     * @param seatId
     * @param merPrice
     * @param feePrice
     * @param parorderId
     * @param mobile
     */
    lockSeatList: (data, callback) => {
        utility.apiGet('lockSeatList.html', data, (err, result) => {
            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result.data);
            }
        });
    },

    //订单座位解锁接口
    unLockSeat: (orderId, callback) => {
        utility.apiGet('unLockSeat.html', {
            orderId: orderId,
        }, (err, result) => {
            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result.data);
            }
        });
    },

    //订单交易确认接口
    confirmOrder: (data, callback) => {
        const param = {
            orderId: data.orderId,
            mobile: data.mobile,
        };

        utility.apiGet('confirmOrder.html', param, (err, result) => {
            console.log(JSON.stringify({
                'zzw confirm order:': {
                    param,
                    err,
                    result
                }
            }));

            if (err || result.result != '0') {
                callback(err || (result.result + ' ' + result.message));
            } else {
                callback(err, result.data);
            }
        });
    },
};
