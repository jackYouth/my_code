/**
 * Created by Garry on 2017/6/6.
 */

const express = require('express');
const handlers = require('../handlers');

const router = express.Router();

module.exports = router;

/**
 * 创建订单
 *
 * @param channel
 * @param productType
 * @param rideType
 * @param userPhone
 * @param customerUserId
 * @param origin
 * @param origin.longitude
 * @param origin.latitude
 * @param origin.name
 * @param destination
 * @param destination.longitude
 * @param destination.latitude
 * @param destination.name
 * @param imei
 */
router.post('/order', (req, res, next) => {
    req.checkBody('channel', 'channel 不能为空').notEmpty();
    req.checkBody('productType', 'productType 不能为空').notEmpty();
    req.checkBody('rideType', 'rideType 不能为空').notEmpty();
    req.checkBody('userPhone', 'userPhone 不能为空').notEmpty();
    req.checkBody('customerUserId', 'customerUserId 不能为空').notEmpty();
    req.checkBody('origin', 'origin 不能为空').notEmpty();
    req.checkBody('destination', 'destination 不能为空').notEmpty();
    req.checkBody('imei', 'imei 不能为空').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return next(errors[0].msg);
    }

    handlers[req.data.channel].createOrder(req.data, (err, result) => {
        res.data = result;
        next(err);
    });
});