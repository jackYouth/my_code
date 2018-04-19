/**
 * Created by Garry on 2017/6/6.
 */


const didi = require('./didi');

// didi.getCoordinate('北京', '西二旗', (err, result) => {
//     console.log(result);
// });

// didi.products({
//     lat: '31.277663',
//     lng: '121.486726',
//     product_type: 'private-car'
// }, (err, result) => {
//     console.log(result);
// });

// didi.productPrice({
//     lat: '31.277663',
//     lng: '121.486726',
//     product_type: 'private-car'
// }, (err, result) => {
//     console.log(result);
// });

// didi.drivers({
//     lat: '31.277663',
//     lng: '121.486726',
//     product_type: 'private-car',
//     ride_type: 'compact'
// }, (err, result) => {
//     console.log(result);
// });

// didi.estimatesTime({
//     lat: '31.277663',
//     lng: '121.486726',
//     product_type: 'private-car',
//     ride_type: 'compact'
// }, (err, result) => {
//     console.log(result);
// });
//
//
// didi.estimatesPrices({
//     imei: '358565074359522',
//     start_lat: 39.976014,
//     start_lng: 116.317799,
//     from_name: '海淀黄庄-地铁站',
//     end_lat: 40.053424,
//     end_lng: 116.30556,
//     to_name: '西二旗-地铁站',
//     product_type: 'private-car',
//     ride_type: 'compact',
//     map_type: 'baidu'
// }, (err, result) => {
//     console.log(result);
// });


//
// didi.order({
//     oid: 'blm1234',
//     product: {
//         product_type: 'private-car',
//         ride_type: 'compact'
//     },
//     passenger: {
//         phone: '18600020574'
//     },
//     user: {
//         user_id: 'blm_test_long',
//         phone: '18600020574'
//     },
//     origin: {
//         lat: 39.976014,
//         lng: 116.317799,
//         name: '海淀黄庄-地铁站'
//     },
//     destination: {
//         lat:40.053424,
//         lng: 116.30556,
//         name: '西二旗-地铁站'
//     },
//     device: {
//         imei: '358565074359522'
//     },
//     estimate_id: '00a6b83eabed5d142eebe7d1b4ef9120',
//     map_type: 'baidu'
// }, (err, result) => {
//     console.log(result);
// });