/**
 * Created by Garry on 2017/6/6.
 */

const express = require('express');
const app = express();
const config = require('./config');
const bodyParser = require('body-parser');
const mongo = require('@boluome/mongo');
const expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

mongo.getInstance(config.MONGODB_CONNECT_STR, (err, db) => {
    if (err) {
        console.log(err);
        return;
    }

    global.mongoDb = db;

    //提取请求参数
    app.use((req, res, next) => {
        let data = req.method.toLowerCase() == 'post' ? req.body : req.query;

        req.data = data;
        next();
    });

    app.use('/zhuanche/v1', require('./routes/v1'));
    app.use(require('./routes/common'));

    //中间件,往前端返回数据
    app.use((req, res) => {
        let data = {
            code: 0,
            data: res.data
        };

        if (req.query.callback) {
            res.jsonp(data);
        } else {
            res.json(data);
        }
    });

    //中间件,错误处理
    app.use((err, req, res, next) => {
        console.log(err);

        let data = {
            code: 1000,
            message:err.message || err
        };

        if (req.query.callback) {
            res.jsonp(data);
        } else {
            res.json(data);
        }
    });

    app.listen(config.PORT, () => {
        console.log('dianying app listening at port %s', config.PORT);
    });
});

process.on('exit', () => {
    if (global.mongoDb) {
        global.mongoDb.close();
    }
});
