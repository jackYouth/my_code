/**
 * Created by Garry on 2017/6/5.
 */

const utility = require('./utility');

module.exports = {
    /**
     * 根据城市和地名获取坐标位置
     * @param city
     * @param address
     * @param callback
     */
    getCoordinate: (city, address, callback) => {
        utility.requestWithToken({
            api: '/v1/poi',
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                city: city,
                sug: address
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 运力类型
     * @param data.lat
     * @param data.lng
     * @param data.product_type
     * @param data.ride_type
     * @param data.map_type
     */
    products: (data, callback) => {
        utility.requestWithToken({
            api: '/v1/products',
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 计价规则
     * @param data.lat
     * @param data.lng
     * @param data.product_type
     * @param data.ride_type
     * @param data.map_type
     */
    productPrice: (data, callback) => {
        utility.requestWithToken({
            api: '/v1/product/standard',
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 周边司机
     * @param data.lat
     * @param data.lng
     * @param data.product_type
     * @param data.ride_type
     */
    drivers: (data, callback) => {
        utility.requestWithToken({
            api: '/v1/drivers',
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 预估时间
     * @param data.lat
     * @param data.lng
     * @param data.map_type
     * @param data.product_type
     * @param data.ride_type
     */
    estimatesTime: (data, callback) => {
        utility.requestWithToken({
            api: '/v1/estimates/time',
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 预估价格
     * @param data.imei
     * @param data.start_lat
     * @param data.start_lng
     * @param data.from_name
     * @param data.end_lat
     * @param data.end_lng
     * @param data.to_name
     * @param data.product_type
     * @param data.ride_type
     * @param data.map_type
     * @param data.departure_time
     */
    estimatesPrices: (data, callback) => {
        utility.requestWithToken({
            api: '/v1/estimates/prices',
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 请求行程
     * @param data.oid
     * @param data.remark
     * @param data.product
     * @param data.passenger
     * @param data.user
     * @param data.origin
     * @param data.destination
     * @param data.device
     * @param data.create_time
     * @param data.departure_time
     * @param data.estimate_id
     * @param data.map_type
     * @param data.o_type
     * @param data.traffic_no
     * @param data.traffic_date
     * @param data.date_type
     * @param data.taxi_info
     * @param data.price
     */
    order: (data, callback) => {
        utility.requestWithToken({
            api: '/v1/orders',
            method: 'POST',
            data: data
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 取消行程
     * @param data.didi_oid
     * @param data.passenger_phone
     * @param data.lat
     * @param data.lng
     * @param data.map_type
     * @param data.device
     * @param data.cancel_msg
     * @param data.cancel_token
     * @param data
     */
    cancel: (data, callback) => {
        utility.requestWithToken({
            api: `/v1/orders/${data.didi_oid}/cancel`,
            method: 'PUT',
            data: data
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 司机位置
     * @param didi_oid
     */
    dirverLocation: (didi_oid, callback) => {
        utility.requestWithToken({
            api: `/v1/orders/${didi_oid}/location`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 行程详情
     * @param didi_oid
     */
    orderDetail: (didi_oid, callback) => {
        utility.requestWithToken({
            api: `/v1/orders/${didi_oid}/detail`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 账单
     * @param didi_oid
     */
    bill: (didi_oid, callback) => {
        utility.requestWithToken({
            api: `/v1/orders/${didi_oid}/bill`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 评价司机
     * @param data.didi_oid
     * @param data.rating
     * @param data.comment
     */
    rating: (data, callback) => {
        utility.requestWithToken({
            api: `/v1/orders/${data.didi_oid}/rating`,
            method: 'POST',
            data: {
                rating: data.rating,
                comment: data.comment
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 司机号码解密
     * @param data.didi_oid
     * @param data.driver_phone
     */
    decryDriverPhone: (data, callback) => {
        utility.requestWithToken({
            api: `/v1/orders/decryption`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 申请发票
     * @param data.title
     * @param data.name
     * @param data.phone
     * @param data.email
     * @param data.orders
     * @param data.province
     * @param data.city
     * @param data.district
     * @param data.address
     */
    invoice: (data, callback) => {
        utility.requestWithToken({
            api: `/v1/orders/invoice`,
            method: 'POST',
            data: data
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 发票查询
     * @param invoice_id
     * @param callback
     */
    queryInvoice: (invoice_id, callback) => {
        utility.requestWithToken({
            api: `/v1/orders/${invoice_id}/invoice`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 支付
     * @param didi_oid
     * @param total_fee
     */
    payment: (didi_oid, total_fee, callback) => {
        utility.requestWithToken({
            api: `/v1/orders/${didi_oid}/payment`,
            method: 'POST',
            data: {
                total_fee: total_fee
            }
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 发单预校验接口
     * @param data.product
     * @param data.origin
     * @param data.destination
     * @param data.map_type
     * @param data.o_type
     * @param data.traffic_no
     * @param data.traffic_date
     * @param data.date_type
     * @param data.departure_time
     */
    inspection: (data, callback) => {
        utility.requestWithToken({
            api: `/v1/inspection`,
            method: 'POST',
            data: data
        }, (err, result) => {
            callback(err, result);
        });
    },

    /**
     * 机场信息接口
     * @param data.code
     * @param data.terminal
     */
    airport:(data, callback)=>{
        utility.requestWithToken({
            api: `/v1/airport`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, (err, result) => {
            callback(err, result);
        });
    }
};