const router = require('koa-router')();
const util = require('../utils/util');
const jwt = require('jsonwebtoken');
const Apply = require('../models/applySchema');
const Dept = require('../models/deptSchema');
const { url } = require('koa-router');

router.prefix('/leave');


// 休假申请列表接口
router.get('/list', async (ctx) => {
  const { applyState } = ctx.request.query;
  const token = ctx.request.header.authorization.split(' ')[1];
  const { data } = jwt.verify(token, 'lxhbbd');
  const { page, skipIndex } = util.pager(ctx.request.query);
  try {
    const params = {
      "applyUser.userId": data.userId,
    };
    if (applyState && applyState != 0) params.applyState = applyState;
    const query = Apply.find(params);
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await Apply.countDocuments(params);
    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
    });
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`);
  }
});

//创建申请单
router.post('/operate', async (ctx) => {
  const { action, _id, ...params } = ctx.request.body;
  const token = ctx.request.header.authorization.split(' ')[1];
  try {
    const { data } = jwt.verify(token, 'lxhbbd');
    if (action == 'delete') {
      await Apply.findByIdAndUpdate(_id, { applyState: 5 });
      util.success('', "删除成功");
    } else {
      const total = await Apply.countDocuments();
      const orderNo = 'XJ' + util.dataFormater(Date.now(), 'yyyyMMdd') + total;
      // 查找该用户的部门ID
      const curDeptId = data.deptId.pop();
      // 查找该用户的部门负责人信息
      const curDept = await Dept.findById(curDeptId);
      // 查找人事和财务部门负责人信息
      const HRAndFinancial = await Dept.find({ $or: [{ deptName: '人事部门' }, { deptName: '财务部门' }] });
      let auditUsers = curDept.userName;
      const auditFlows = [{ userId: curDept.userId, userName: curDept.userName, userEmail: curDept.userEmail }];
      HRAndFinancial.map((item) => {
        auditUsers += ',' + item.userName;
        auditFlows.push({ userId: item.userId, userName: item.userName, userEmail: item.userEmail });
      });
      const auditLogs = [];
      Apply.create({
        applyType: params.applyType,
        startTime: params.startTime,
        endTime: params.endTime,
        leaveTime: params.leaveTime,
        reasons: params.reasons,
        orderNo,
        applyUser: {
          userId: data.userId,
          userName: data.userName,
          userEmail: data.userEmail,
        },
        auditUsers,
        curAuditUserName: curDept.userName,
        applyState: 1,
        auditFlows,
        auditLogs,
        createTime: Date.now()
      });
    }
    ctx.body = util.success('', "创建申请成功");
  } catch (error) {
    ctx.body = util.fail(`${error.stack}`);
  }
});



module.exports = router;
