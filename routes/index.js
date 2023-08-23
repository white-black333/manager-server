const router = require('koa-router')();//处理路由

// 视图渲染
router.get('/', async (ctx, next) => {
  // ctx.render方法第一个参数是模板相对路径，相对于views目录下 
  // 第二个参数就是传入到模板的数据
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  });
});

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string';
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  };
});

module.exports = router;
