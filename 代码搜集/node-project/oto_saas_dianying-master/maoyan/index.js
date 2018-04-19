/**
 * Created by Garry on 2017/7/18.
 */

const logger = require('@boluome/log').getLogger('dianying');
const utility = require('./utility');

module.exports = {
    /**
     * 查询影院列表
     */
    cinemas: callback => {
        utility.requestAPI('/sync/gateway', 'gateway.sync.cinemas', (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 查询影厅列表
     *
     * @param cinemaId
     */
    halls: (cinemaId, callback) => {
        utility.requestAPI('/sync/gateway', 'gateway.sync.halls', {cinemaId}, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 查询场次列表
     * @param cinemaId
     * @param startDate
     */
    show: (cinemaId, startDate, callback) => {
        utility.requestAPI('/sync/gateway', 'gateway.sync.show', {cinemaId, startDate}, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 查询影厅座位列表
     *
     * @param showId
     */
    seat: (showId, callback) => {
        utility.requestAPI('/trade/gateway', 'gateway.trade.seat', {
            showId
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 查询电影信息
     *
     * @param movieId
     */
    movieInfo: (movieId, callback) => {
        utility.requestAPI('/cmdata/gateway', 'cmdata.movieInfo', {
            movieId
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 查询热映电影列表
     *
     * @param cityId
     */
    hotMovies: (cityId, callback) => {
        utility.requestAPI('/mmdb/gateway', 'mmdb.hotMovies', {
            cityId
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 查询待映电影列表
     *
     * @param cityId
     */
    comingMovies: (cityId, callback) => {
        utility.requestAPI('/mmdb/gateway', 'mmdb.comingMovies', {
            cityId: cityId * 1
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 查询城市列表
     */
    city: callback => {
        utility.requestAPI('/base/gateway', 'base.city', (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 锁座
     *
     * @param data.cinemaId
     * @param data.showId
     * @param data.seatsJSON
     * @param data.orderCode
     * @param data.mobile
     * @param data.settlePrice
     * @param data.sellPrice
     */
    lock: (data, callback) => {
        utility.requestAPI('/trade/gateway', 'gateway.trade.lock', data, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 释放座位
     *
     * @param orderId
     * @param orderCode
     */
    unlock: ({orderId, orderCode}, callback) => {
        utility.requestAPI('/trade/gateway', 'gateway.trade.unlock', {orderId, orderCode}, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 确认订单
     * @param orderId
     * @param orderCode
     * @param callback
     */
    fixOrder: (orderId, orderCode, callback) => {
        utility.requestAPI('/trade/gateway', 'gateway.trade.fixOrder', {orderId, orderCode}, (err, result) => {
            logger.info(JSON.stringify({
                '猫眼确认订单:': {
                    orderId,
                    orderCode,
                    err,
                    result
                }
            }));

            callback(err, result);
        });
    }
};