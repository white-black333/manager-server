const router = require('koa-router')();//处理路由
const util = require('../utils/util');
const User = require('./../models/userSchema');
// 视图渲染 router.get(url,)=>get请求
router.get('/', async (ctx, next) => {
  // ctx.render方法第一个参数是模板相对路径，相对于views目录下 
  // 第二个参数就是传入到模板的数据
  ctx.cookies.set('mycookie', Math.random()); //Koa设置Cookie
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  });
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json',
    // cookie: ctx.cookies.get('mycookie') //Koa获取Cookie
  };
});

module.exports = router;
