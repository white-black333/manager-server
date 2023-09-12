const router = require('koa-router')();
const util = require('../utils/util');
const User = require('./../models/userSchema');
const Counter = require('./../models/counterSchema');
const md5 = require('md5');
require('./../config/db');
const jwt = require('jsonwebtoken');

router.prefix('/users');

// 用户登录接口
router.post('/login', async (ctx, next) => {
  try {
    // console.log('ctx.request.body=>', ctx.request.body);
    const { userName, userPwd } = ctx.request.body;
    const res = await User.findOne({
      userName,
      userPwd
    }, "userId userName userEmail state role deptId roleList");
    console.log('res=>', res);
    console.log('res=>', { ...res });
    if (res) {
      const data = res._doc;
      const token = jwt.sign({ data: data }, 'lxhbbd', { expiresIn: "2h" });
      // console.log('token=>', token);
      data.token = token;
      // console.log('res=>', res);
      ctx.body = util.success(data);//ctx.response.body属性就是发送给用户的内容。
      // ctx.body.data = token;
    } else {
      ctx.body = util.fail("账号或密码不正确");
    }

  } catch (error) {
    ctx.body = util.fail(`查询异常：${error.stack}`);
  }
});

// 用户列表接口
router.get('/list', async (ctx) => {
  const res = ctx.request.query;
  if (res) {
    const { page, skipIndex } = util.pager(res);
    let params = {};
    if (res.userId) params.userId = res.userId;
    if (res.userName) params.userName = res.userName;
    if (res.state && res.state != 0) params.state = res.state;
    try {
      const list = await User.find(params, { userPwd: 0, __v: 0 }).skip(skipIndex).limit(page.pageSize);
      const total = await User.countDocuments(params);
      page.total = total;
      ctx.body = util.success({ page, list });
    } catch (error) {
      ctx.body = util.fail(`查询异常：${error.stack}`);
    }
  }
});

// 用户删除接口
router.post('/delete', async (ctx) => {
  const { userIds } = ctx.request.body;
  const res = User.updateMany({ userId: { $in: { userIds } } }, { state: 2 });
  if (res.acknowledged) {
    ctx.body = util.success({ nModified: res.modifiedCount }, `删除成功${res.modifiedCount}条`);
    return;
  }
  ctx.body = util.fail("删除失败");
});

// 用户编辑/新增接口
router.post('/operate', async (ctx) => {
  const { userId, userName, userEmail, mobile, job, state, roleList, deptId, action } = ctx.request.body;
  if (action == 'add') {
    if (!userEmail || !userName || !deptId) {
      ctx.body = util.fail("参数错误", util.CODE.PARAMS_ERROR);
      return;
    }
    const res = await User.findOne({ $or: [{ userName }, { userEmail }] }, "_id userName userEmail");
    if (res) {
      ctx.body = util.fail(`系统检测到有重复的用户：${res.userName}-${res.userEmail}`);
    } else {
      const doc = await Counter.findOneAndUpdate({ c_id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true });
      const user = new User({
        userId: doc.sequence_value,
        userName,
        userPwd: md5('123456'),
        userEmail,
        mobile,
        job,
        state,
        roleList,
        deptId,
        role: 1
      });
      user.save();
      ctx.body = util.success({}, "用户创建成功");
      return;
    }
    ctx.body = util.fail("新增失败");
  }
  else {
    if (!deptId) {
      ctx.body = util.fail("部门不能为空", util.CODE.PARAMS_ERROR);
      return;
    }
    try {
      const res = await User.findOneAndUpdate({ userId }, { userEmail, mobile, job, state, roleList });
      ctx.body = util.success({}, "用户信息修改成功");
    } catch (error) {
      ctx.body = util.fail(`更新失败:${error.stack}`);
    }
  }
});


module.exports = router;
