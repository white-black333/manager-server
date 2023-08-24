/* 通用工具函数 */

const log4js = require("./log4j");

const CODE = {
    SUCESS: 200,
    PARAMS_ERROR: 1001,//参数错误
    USER_ACCOUNT_ERROR: 2001,//账号或密码错误
    USER_LOGIN_ERROR: 3001,//用户未登录
    BUSINESS_ERROR: 4001,//业务请求错误
    AUTH_ERROR: 5001//认证失败或TOKEN过期
};

module.exports = {

    pager({ pageNum = 1, pageSize = 10 }) {
        pageNum *= 1;
        pageSize *= 1;
        const skipIndex = (pageNum - 1) * pageSize;
        return {
            page: {
                pageNum,
                pageSize
            },
            skipIndex
        };
    },
    sucess(data = '', msg = '', code = CODE.SUCESS) {
        log4js.debug(data);
        return { code, data, msg };
    },
    fail(msg = '', code = CODE.BUSINESS_ERROR) {
        log4js.debug(msg);
        return { code, data, msg };
    }
};