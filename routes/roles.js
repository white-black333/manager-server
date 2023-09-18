const router = require('koa-router')();
const util = require('../utils/util');
const Role = require('../models/roleSchema');
router.prefix('/roles');

// 角色名称列表接口（仅包括 _id 和roleName字段）
router.get('/allList', async (ctx) => {
  try {
    const res = await Role.find({}, "_id roleName");
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`);
  }
});

// 角色列表接口
router.get('/list', async (ctx) => {
  const { roleName } = ctx.request.query;
  const params = {};
  try {
    if (roleName) params.roleName = roleName;
    const query = Role.find(params);
    const { page, skipIndex } = util.pager(ctx.request.query);
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await Role.countDocuments(params);
    ctx.body = util.success({
      list,
      page: { ...page, total }
    });
  } catch (error) {
    ctx.body = util.fail(`查询失败${error.stack}`);
  }
});

// 角色创建/编辑/删除 : add edit delete
router.post('/operate', async (ctx) => {
  const { _id, action, remark, roleName } = ctx.request.body;
  try {
    let info, res;
    if (action == 'delete') {
      res = await Role.findByIdAndRemove(_id);
      info = '删除成功';
    } else if (action == 'edit') {
      res = await Role.findByIdAndUpdate(_id, { roleName, remark });
      info = '编辑成功';
    } else {
      res = await Role.create({ roleName, remark });
      info = '创建成功';
    }
    ctx.body = util.success(res, info);
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`);
  }
});

// 权限设置
router.post('/update/permission', async (ctx) => {
  try {
    const { _id, permissionList } = ctx.request.body;
    console.log('permissionList=>', permissionList);
    const res = await Role.findByIdAndUpdate(_id, { permissionList });
    console.log('res=>', res);
    ctx.body = util.success('', "权限设置成功");
  } catch (error) {
    ctx.body = util.fail(`权限设置失败：${error.stack}`);
  }
});

module.exports = router;