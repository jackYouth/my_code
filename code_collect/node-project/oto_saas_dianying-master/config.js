/**
 * Created by garry on 16/8/31.
 */

'use strict';

let config = {
    PORT: 31004,
    MONGODB_CONNECT_STR: 'mongodb://root:Boluome123@139.198.1.168:11017/boluome?authSource=admin',
    PARAMERROR_DEFAULT_CODE: 10000,
    FILMERROR_DEFAULT_CODE: 20000,
    KOUERROR_DEFAULT_CODE: 30000,
    SVC_BASIS: 'http://localhost:21001/basis/v1',
    SVC_ORDER: 'http://localhost:21003',
    KOU_PREMIUM_RATE: {
        oklife: 1.11
    },
    ZZW_PRICE_RAISING: 3,
    RECENT_CINEMAS_COUNT: 3,
    MONGODB_PROXY: 'http://192.168.2.8:8000/mongodb_query'
};

switch (process.env.NODE_ENV) {
    case 'dev':
        config = Object.assign({}, config, {
            MONGODB_CONNECT_STR: 'mongodb://root:Boluome123@192.168.0.10:27017,192.168.0.7:27017/boluome?authSource=admin&replicaSet=foba',
            SVC_BASIS: 'http://192.168.0.5:21001/basis/v1',
            SVC_ORDER: 'http://localhost:21003',
            mqServer: 'amqp://blm:blm123@192.168.0.6',
            MONGODB_PROXY: 'http://192.168.2.8:8000/mongodb_query',
            HOST: '192.168.0.5',
        });
        break;
    case 'stg':
        config = Object.assign({}, config, {
            MONGODB_CONNECT_STR: 'mongodb://mongoc:Boluome123@192.168.2.4:27017,192.168.2.3:27017/boluome?authSource=admin&replicaSet=foba',
            SVC_BASIS: 'http://127.0.0.1:21001/basis/v1',
            SVC_ORDER: 'http://127.0.0.1:21003',
            mqServer: 'amqp://blm:blm123@192.168.2.6',
            MONGODB_PROXY: 'http://192.168.2.8:8000/mongodb_query',
            HOST: '192.168.2.2',
        });
        break;
    case 'pro':
        config = Object.assign({}, config, {
            MONGODB_CONNECT_STR: 'mongodb://root:Boluome123@mongo-m.localdomain:27017,mongo-s.localdomain:27017/boluome?authSource=admin&replicaSet=foba',
            SVC_BASIS: 'http://saasapi.localdomain:21001/basis/v1',
            SVC_ORDER: 'http://saasapi.localdomain:21003',
            mqServer: 'amqp://blm:blm123@192.168.1.27',
            MONGODB_PROXY: 'http://192.168.2.8:8000/mongodb_query',
            HOST: 'saasapi.localdomain',
        });
        break;
    default:
        break;
}

module.exports = config;