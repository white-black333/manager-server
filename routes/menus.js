const router = require('koa-router')();
const util = require('../utils/util');
const Menu = require('../models/menuSchema');

router.prefix('/menu');

// 菜单列表接口
router.post('/list', async (ctx) => {
  const { menuName, menuState } = ctx.request.body;
  const params = {};
  if (menuName) params.menuName = menuName;
  if (menuState) params.menuState = menuState;
  const menuList = await Menu.find(params) || [];
  const treeList = getTreeMenu(menuList, null, []);
  // console.log('treeList=>', treeList);
  ctx.body = util.success(treeList);
});

// 递归拼接树形列表
function getTreeMenu(menuList, id, list) {
  for (let i = 0; i < menuList.length; i++) {
    const element = menuList[i];
    if (String(element.parentId.slice().pop()) === String(id)) {
      list.push(element._doc);
    }
  }
  // console.log('list=>', list);
  list.map((element) => {
    element.children = [];
    getTreeMenu(menuList, element._id, element.children);
    if (element.children.length == 0) {
      // 删除元素无children的空数据
      delete element.children;
      // 筛选出二级菜单
    } else if (element.children.length > 0 && element.children[0].menuType == 2) {
      // operate标识快速区分按钮和菜单，用于后期做菜单那按钮权限控制
      element.operate = element.children;
    }
  });
  return list;
}

// 菜单创建/编辑/删除 接口
router.post('/operate', async (ctx) => {
  const { _id, action, ...params } = ctx.request.body;
  try {
    let res, info;
    if (action == 'delete') {
      res = await Menu.findByIdAndRemove(_id);
      await Menu.deleteMany({ parentId: { $all: _id } });//删除子数据
      info = "删除成功";
    } else if (action == 'add') {
      info = "创建成功";
      res = await Menu.create(params);
    } else {
      params.updateTime = new Date();
      res = await Menu.findByIdAndUpdate(_id, params);
      info = "编辑成功";
    }
    ctx.body = util.success('', info);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});








module.exports = router;