const router = require('koa-router')();
const util = require('../utils/util');
const User = require('./../models/userSchema');
require('./../config/db');
const jwt = require('jsonwebtoken');

router.prefix('/users');

router.post('/login', async (ctx, next) => {
  try {
    console.log('ctx.request.body=>', ctx.request.body);
    const { userName, userPwd } = ctx.request.body;
    const res = await User.findOne({
      userName,
      userPwd
    }, "userId userName userEmail state role deptId roleList");
    const data = res._doc;
    const token = jwt.sign({ data: data }, 'lxhbbd', { expiresIn: 30 });
    console.log('token=>', token);
    if (res) {
      data.token = token;
      console.log('res=>', res);
      ctx.body = util.success(data);//ctx.response.body属性就是发送给用户的内容。
      // ctx.body.data = token;
    } else {
      ctx.body = util.fail("账号或密码不正确");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;
