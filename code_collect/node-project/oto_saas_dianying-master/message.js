/**
 * Created by garry on 16/8/31.
 */
'use strict';


var info = {
    "0": {
        code: 0,
        data: {}
    }
};

var default_info = function (msg) {
    return {
        code: 20000,
        message: msg
    };
};

module.exports = {
    error: function (err) {
        if (err.name == 'ParamError'
            || err.name == 'FilmError'
            || err.name == 'KouError') {
            return {
                code: err.code,
                message: err.message
            }
        }

        return info[err] || default_info(err.message || err);
    },

    success: function (reply) {
        var result = info['0'];
        result.data = reply;
        return result;
    }
};