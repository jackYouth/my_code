/**
 * Created by garry on 16/8/31.
 */

const express = require('express');
const logger = require('@boluome/log').getLogger('dianying');
const app = express();
const configLoader = require('@boluome/consul')('dianying');
const message = require('./message');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongo = require('@boluome/mongo');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

//提取请求参数
app.use((req, res, next) => {
    const data = req.method.toLowerCase() == 'post' ? req.body : req.query;

    req.data = Object.assign(data, {
        appCode: req.get('appCode')
    });

    next();
});

app.use('/dianying/v1', require('./routes/v1'));
app.use('/dianying/v2', require('./routes/v2'));
app.use(require('./routes/common'));

//中间件,往前端返回数据
app.use((req, res) => {
    const data = message.success(req.result);

    if (req.query.callback) {
        res.jsonp(data);
    } else {
        res.json(data);
    }
});

//中间件,错误处理
app.use((err, req, res, next) => {
    logger.error(err.stack || err);

    var data = message.error(err);
    if (req.query.callback) {
        res.jsonp(data);
    } else {
        res.json(data);
    }
});

const port = configLoader.getConfig().PORT;

app.listen(port, () => {
    logger.info('dianying app listening at port %s', port);
});

process.on('exit', () => {
    mongo.close();
});



