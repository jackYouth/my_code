/**
 * Created by Garry on 2017/6/5.
 */

let config = {
    PORT: 31029,
    SVC_ORDER: 'http://localhost:21003',
    MONGODB_CONNECT_STR: 'mongodb://root:Boluome123@139.198.1.168:11017/boluome?authSource=admin&maxPoolSize=1',
    REDIS_TCP_PORT: 11019,
    REDIS_TCP_ADDR: '139.198.1.168',
    DDMAPTYPE: 'baidu'
};

switch (process.env.NODE_ENV) {
    case 'dev':
        config = Object.assign({}, config, {
            SVC_ORDER: 'http://localhost:21003',
            MONGODB_CONNECT_STR: 'mongodb://root:Boluome123@192.168.0.10:27017,192.168.0.7:27017/boluome?authSource=admin&replicaSet=foba',
        });
        break;
    case 'pro':
        config = Object.assign({}, config, {
            SVC_ORDER: 'http://192.168.1.16:21003',
            MONGODB_CONNECT_STR: 'mongodb://root:Boluome123@192.168.1.6:27017,192.168.1.7:27017/boluome?authSource=admin&replicaSet=foba',
        });
        break;
    default:
        break;
}

module.exports = config;