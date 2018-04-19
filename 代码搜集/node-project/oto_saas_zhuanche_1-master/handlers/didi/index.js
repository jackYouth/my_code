/**
 * Created by Garry on 2017/6/6.
 */

const async = require('async');

const didi = require('../../didi');
const order = require('../../order');
const config = require('../../config');

module.exports = {
    createOrder: (data, callback) => {
        let returnVal = null;
        let estimatesPrices = null;

        async.waterfall([callback => {
            order.saveOrder(Object.assign({}, data, {
                name: ''
            }), (err, result) => {
                if (err) {
                    return callback(err);
                }

                if (result.code != 0) {
                    return callback(result.message);
                }

                returnVal = result.data;
                callback();
            });
        }, callback => {
            didi.estimatesPrices({
                imei: data.imei,
                start_lat: data.origin.latitude,
                start_lng: data.origin.longitude,
                from_name: data.origin.name,
                end_lat: data.destination.latitude,
                end_lng: data.destination.longitude,
                to_name: data.destination.name,
                product_type: data.productType,
                ride_type: data.rideType,
                map_type: config.DDMAPTYPE
            }, (err, result) => {
                callback(err, result);
            });
        }, (estimatesPricesData, callback) => {
            estimatesPrices = estimatesPricesData[0];
            didi.order({
                oid: returnVal.id,
                product: {
                    product_type: data.productType,
                    ride_type: data.rideType
                },
                passenger: {
                    phone: data.userPhone
                },
                user: {
                    user_id: data.customerUserId,
                    phone: data.userPhone
                },
                origin: {
                    lat: data.origin.latitude,
                    lng: data.origin.longitude,
                    name: data.origin.name
                },
                destination: {
                    lat: data.destination.latitude,
                    lng: data.destination.longitude,
                    name: data.destination.name
                },
                device: {
                    imei: data.imei
                },
                estimate_id: estimatesPrices.estimate_id,
                map_type: config.DDMAPTYPE
            }, (err, result) => {
                callback(err, result);
            });
        }, (didiOrderData, callback) => {
            order.updateStatus(returnVal.id, [{
                code: order.status_emun.dealing.code,
                msg: '等待司机接单'
            }], {
                partnerId: didiOrderData.didi_oid,
                estimatedPrice: estimatesPrices.estimate_price / 100,
                didiStatus: didiOrderData.status
            }, err => {
                callback(err);
            });
        }], err => {
            callback(err, returnVal);
        });
    }
};