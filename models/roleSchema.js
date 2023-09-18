const mongoose = require('mongoose');
const roleSchema = mongoose.Schema({
    "roleName": String,//角色名称
    "remark": String,//备注信息
    "permissionList": {
        "checkedKeys": [],//选中的按钮
        "halfCheckedKeys": []//半选中的菜单
    },//创建数据
    "createTime": {
        type: Date,
        default: Date.now()
    },//创建时间
});

module.exports = mongoose.model('roles', roleSchema, 'roles');