const router = require('koa-router')();
const util = require('../utils/util');
const jwt = require('jsonwebtoken');
const Apply = require('../models/applySchema');
const Dept = require('../models/deptSchema');


router.prefix('/leave');


// 休假申请列表接口
router.get('/list', async (ctx) => {
  const { applyState, type } = ctx.request.query;
  const token = ctx.request.header.authorization.split(' ')[1];
  const { data } = jwt.verify(token, 'lxhbbd');
  const { page, skipIndex } = util.pager(ctx.request.query);
  let params = {};
  try {
    // 审核人(对应部门/财务/人事 管理员)可以看见申请列表
    if (type == 'approve') {
      if (applyState == 1 || applyState == 2) {//当前审批人是我 且处于 待审批
        params.curAuditUserName = data.userName;
        params.$or = [{ applyState: 1 }, { applyState: 2 }];
      } else if (applyState > 2) {//审批流中包括我 且不属于待审批
        params = { "auditFlows.userId": data.userId, applyState };
      } else {//applyState='',表示全部
        params = { "auditFlows.userId": data.userId };
      }
    } else {
      // 申请人才能看见申请列表
      params = { "applyUser.userId": data.userId };
      if (applyState) params.applyState = applyState;
    }
    console.log(params);
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
    ctx.body = util.fail(`查询失败：${error.stack}`);
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

// 审核通过
router.post('/approve', async (ctx) => {
  const token = ctx.request.header.authorization.split(' ')[1];
  const { data } = jwt.verify(token, 'lxhbbd');
  const { _id, remark, action } = ctx.request.body;
  const params = {};
  try {
    const doc = await Apply.findById(_id);
    const auditLogs = doc.auditLogs || [];
    // 如果驳回
    if (action == 'reject') {
      params.applyState = 3;// 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
    } else {//规定三级审核通过（根据auditLogs的长度判断）
      // 审核通过
      if (auditLogs.length == doc.auditFlows.length) {
        ctx.body = util.success('', '当前申请单以及处理，请勿重复提交');
        return;
      } else if (auditLogs.length + 1 == doc.auditFlows.length) {
        params.applyState = 4;
      } else if (auditLogs.length < doc.auditFlows.length) {
        params.applyState = 2;
        params.curAuditUserName = doc.auditUsers.split(',')[auditLogs.length + 1];
        console.log(params.curAuditUserName);
      }
    }
    auditLogs.push({  // push改变原数组，返回值为添加完后的数组的长度
      userId: data.userId,
      userName: data.userName,
      createTime: Date.now(),
      remark,
      action
    });
    params.auditLogs = auditLogs;
    const res = await Apply.findByIdAndUpdate(_id, params);
    ctx.body = util.success(res, "处理成功");
  } catch (error) {
    ctx.body = util.fail(`查询失败：${error.stack}`);
  }
});

// 待审批通知数量
router.get('/count', async (ctx) => {
  const token = ctx.request.header.authorization.split(' ')[1];
  const { data } = jwt.verify(token, 'lxhbbd');
  const params = {};
  try {
    params.curAuditUserName = data.userName;
    params.$or = [{ applyState: 1 }, { applyState: 2 }];
    const count = await Apply.countDocuments(params);
    ctx.body = util.success(count, "查询成功");
  } catch (error) {
    ctx.body = util.fail(`查询失败：${error.stack}`);
  }
});

module.exports = router;
