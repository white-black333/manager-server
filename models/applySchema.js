const mongoose = require('mongoose');
const applySchema = mongoose.Schema({
    "orderNo": String,//申请单号
    "applyType": Number,//申请类型  1:事假 2：调休 3:年假
    "startTime": { type: Date, default: Date.now() },//开始时间
    "endTime": { type: Date, default: Date.now() },//结束时间
    "applyUser": {//申请人信息
        "userId": String,
        "userName": String,
        "userEmail": String
    },
    "leaveTime": String,//休假时间
    "reasons": String,//休假原因
    "auditUsers": String,//完整审批人
    "curAuditUserName": String,//当前审批人
    "applyState": { type: Number, default: 1 },// 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
    "auditFlows": [//审批流
        {
            "userId": String,
            "userName": String,
            "userEmail": String
        },
    ],
    "auditLogs": [
        {
            "userId": String,
            "userName": String,
            "createTime": Date,
            "remark": String,
            "action": String
        }
    ],
    "createTime": { type: Date, default: Date.now() },//申请时间
});

module.exports = mongoose.model('apply', applySchema, 'apply');