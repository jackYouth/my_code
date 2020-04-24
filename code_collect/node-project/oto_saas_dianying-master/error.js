/**
 * Created by garry on 16/8/31.
 */
'use strict';

const configLoader = require('@boluome/consul')('dianying');

class ParamError extends Error {
    constructor(message, code) {
        super(message);

        const config = configLoader.getConfig();

        this.name = 'ParamError';
        this.message = message;
        this.code = code || config.PARAMERROR_DEFAULT_CODE;
        this.stack = (new Error()).stack;
    }
}

class FilmError extends Error {
    constructor(film_error_enum) {
        super(film_error_enum.message);

        const config = configLoader.getConfig();

        this.name = 'FilmError';
        this.message = film_error_enum.message;
        this.code = film_error_enum.code || config.FILMERROR_DEFAULT_CODE;
        this.stack = (new Error()).stack;
    }
}

class KouError extends Error {
    constructor(message, code) {
        super(message);

        const config = configLoader.getConfig();

        this.name = 'KouError';
        this.message = message;
        this.code = code || config.KOUERROR_DEFAULT_CODE;
        this.stack = (new Error()).stack;
    }
}

module.exports = {
    ParamError: ParamError,
    FilmError: FilmError,
    KouError: KouError,
    FilmError_Enum: {
        general: {
            success: {code: 0, message: '处理成功'},
            params: {code: 100, message: '请求参数有误'},
        },
        dianying: {
            city: {code: 300, message: '城市查询错误'},
            region: {code: 301, message: '区域查询错误'},
            cinema: {code: 302, message: '影院查询错误'},
            film: {code: 303, message: '影片查询错误'},
            show: {code: 304, message: '排期查询错误'},
            seat: {code: 305, message: '座位查询错误'},
            order: {
                create: {code: 306, message: '订单创建错误'},
                query: {code: 307, message: '订单查询错误'},
                confirm: {code: 308, message: '确认订单错误'},
                cancel: {code: 309, message: '取消订单错误'}
            }
        }
    }
};