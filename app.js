const Koa = require('koa');//导入koa (一个class)
const app = new Koa();//创建一个Koa对象标识web app本身
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');//处理响应错误
const bodyparser = require('koa-bodyparser');//处理请求体
// const logger = require('koa-logger');//输出服务日志
const log4js = require('./utils/log4j');//
const index = require('./routes/index');
const users = require('./routes/users');

// error handler  错误处理
onerror(app);

// middlewares  挂载中间件
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
// app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));//处理静态资源

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger 日志中间件
app.use(async (ctx, next) => {  // 对于任何请求，app将调用该异步函数处理请求
  await next();
});

// routes 路由
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling  全局错误处理
app.on('error', (err, ctx) => {
  log4js.error('error');
});

module.exports = app

