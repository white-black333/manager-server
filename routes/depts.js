const router = require('koa-router')();
const util = require('../utils/util');
const Dept = require('../models/deptSchema');

router.prefix('/dept');

// 部门列表接口
router.get('/list', async (ctx) => {
  const { deptName } = ctx.request.body;
  const params = {};
  try {
    if (deptName) params.deptName = deptName;
    const deptList = await Dept.find(params) || [];
    if (deptName) {//查询某个部门，则不必返回树形结构
      ctx.body = util.success(deptList);
    } else {//查询所有部门，返回部门列表的树形结构
      const treeList = getTreeDept(deptList, null, []);
      // console.log('treeList=>', treeList);
      ctx.body = util.success(treeList);
    }
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`);
  }
});

// 递归拼接树形列表
function getTreeDept(deptList, id, list) {
  for (let i = 0; i < deptList.length; i++) {
    const element = deptList[i];
    if (String(element.parentId.slice().pop()) === String(id)) {
      list.push(element._doc);
    }
  }
  // console.log('list=>', list);
  list.map((element) => {
    element.children = [];
    getTreeDept(deptList, element._id, element.children);
    if (element.children.length == 0) {
      // 删除元素无children的空数据
      delete element.children;
    }
  });
  return list;
}


// 部门创建/编辑/删除 接口
router.post('/operate', async (ctx) => {
  const { _id, action, ...params } = ctx.request.body;
  try {
    let res, info;
    if (action == 'delete') {
      res = await Dept.findByIdAndRemove(_id);
      await Dept.deleteMany({ parentId: { $all: _id } });//删除子数据
      info = "删除成功";
    } else if (action == 'add') {
      res = await Dept.create(params);
      info = "创建成功";
    } else {
      params.updateTime = new Date();
      res = await Dept.findByIdAndUpdate(_id, params);
      info = "编辑成功";
    }
    ctx.body = util.success('', info);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});








module.exports = router;