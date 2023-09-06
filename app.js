const Koa = require('koa');//导入koa (一个class)
const app = new Koa();//创建一个Koa对象标识web app本身
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');//处理响应错误
const bodyparser = require('koa-bodyparser');//处理请求体
const logger = require('koa-logger');//输出服务日志
const log4js = require('./utils/log4j');//
const index = require('./routes/index');
const users = require('./routes/users');
const router = require('koa-router')();
const jwt = require('jsonwebtoken');
const koajwt = require('koa-jwt');
const util = require('./utils/util');

// error handler  错误处理
onerror(app);

// middlewares  挂载中间件
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));//处理静态资源

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger 日志中间件
app.use(async (ctx, next) => {  // 对于任何请求，app将调用该异步函数处理请求
  await next().catch((err) => {       //next() 在注册的函数中调用用以执行下一个中间件
    if (err.status == 401) {
      ctx.status = 200;
      ctx.body = util.fail('认证失败或TOKEN过期', util.CODE.AUTH_ERROR);
    } else {
      throw err;
    }
  });
});

app.use(koajwt({ secret: 'lxhbbd' }).unless({
  path: '/api/users/login'
}));//koajwt中间件 验证token的有效性 过滤login请求token验证

router.prefix('/api');// routes 路由

router.get('/leave/count', (ctx, next) => {
  // 拿到请求头中的token数据
  token = ctx.request.header.authorization.split(' ')[1];
  // 验证token是否有效
  const payload = jwt.verify(token, 'lxhbbd');
  ctx.body = payload;
});

router.use(users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods()); //将koa - router对象的所有路由和处理函数注册成为中间件;

// error-handling  全局错误处理
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`);
});

module.exports = app

