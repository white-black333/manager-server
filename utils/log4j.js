/* log4js 日志打印及存储二次封装 */

const log4js = require('log4js');

const level = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL,
};

log4js.configure({
    appenders: {
        toConsole: { type: 'console' },
        toInfo: { type: 'file', filename: 'logs/all-logs.log' },
        toError: {
            type: 'dateFile',
            filename: 'logs/log',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true // filename+pattern
        }
    },
    categories: {
        default: { appenders: ['toConsole', 'toInfo'], level: level.debug },
        infoLog: { appenders: ['toConsole', 'toInfo'], level: level.info },
        errorLog: { appenders: ['toConsole', 'toError'], level: level.error },
    }
});

/* 日志输出，level为debug级别*/
function debug(content) {
    const logger = log4js.getLogger();
    logger.debug(content);
}

/* 日志输出，level为info级别*/
function info(content) {
    const logger = log4js.getLogger('infoLog');
    logger.info(content);
}

/* 日志输出，level为error级别*/
function error(content) {
    const logger = log4js.getLogger('errorLog');
    logger.error(content);
}

module.exports = { debug, info, error };
