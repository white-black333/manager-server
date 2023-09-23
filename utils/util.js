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
    success(data = '', msg = '', code = CODE.SUCESS) {
        log4js.debug(data);
        return { code, data, msg };
    },
    fail(msg = '', code = CODE.BUSINESS_ERROR, data = '') {
        log4js.debug(msg);
        return { code, data, msg };
    },
    CODE,
    getTreeMenu(menuList, id, list) {
        for (let i = 0; i < menuList.length; i++) {
            const element = menuList[i];
            if (String(element.parentId.slice().pop()) === String(id)) {
                list.push(element._doc);
            }
        }
        // console.log('list=>', list);
        list.map((element) => {
            element.children = [];
            this.getTreeMenu(menuList, element._id, element.children);
            if (element.children.length == 0) {
                // 删除元素无children的空数据
                delete element.children;
                // 筛选出二级菜单
            } else if (element.children.length > 0 && element.children[0].menuType == 2) {
                // 快速区分按钮和菜单，用于后期做菜单那按钮权限控制
                element.operate = element.children;
            }
        });
        return list;
    },
    dataFormater(date, fmt) {
        fmt = fmt || "yyyy-MM-dd hh:mm:ss"; //没有规则默认日期格式
        date = new Date(date);
        if (/(y+)/.test(fmt)) {
            const t = (/(y+)/.exec(fmt)[1]);
            fmt = fmt.replace(t, date.getFullYear());
        }
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
        };
        for (let k in o) {
            const reg = new RegExp(`(${k})`);
            if (reg.test(fmt)) {
                const t = reg.exec(fmt)[1];
                // console.log(t.length);
                // console.log(o[k]);
                // fmt = fmt.replace(t, o[k]);
                fmt = fmt.replace(t, t.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    },
};