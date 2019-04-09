/* eslint-disable linebreak-style,indent */
const preStr = '/jt808/'
let api = {

    //本地模拟数据地址

    // GetLoginUrl: '/json/userState.json', //本地登录JSON
    // GetPageCfgUrl: '/json/pageCfg.json', //本地配置json
    // GetPageTreeCfgUrl1: '/json/tree-location.json',  //本地树json
    // GetMenuUrl: '/json/menu.json',  //本地菜单

    //地图相关
    GetMapMonitorPageCfgUrl: '/json/mapMonitorCfg.json',     //这个就是pageCfg.json，为了本地模拟，临时做了个接口地址，记得修改
    GetCloudMapTree: '/map/cloudMap/cloudMapTree', // 云图树
    SaveCloudMap: '/map/cloudMap/save', //保存云图
    EditCloudMap: '/map/cloudMap/update', //编辑云图
    DeleteCloudMap: '/map/cloudMap/delete', //删除云图
    QueryCloudMap: '/map/cloudMap/queryOne', //查询云图
    GetPoiAddress: '/table/map/getRegeo', //转换poi地址
    GetCloudTable: '/map/cloudMap/cloudMapList', //云图表格列表

    //安全性管理接口
    GetLoginUrl: '/login', //登录接口
    GetMenuUrl: '/jt808/common/baseTree',  //获取菜单
    GetPlatUrl: '/table/clientConfig/platformConfig', //根据域名获取平台信息

    //报警推送接口
    wsForPopUrl: 'ws://socket.bdlbs.comlbs.com/websocketForPop/', //告警推送接口
    GetSimAlermUrl: '/json/alermData.json',  //模拟报警数据

    //基础接口
    GetPageCfgUrl: '/jt808/config/query', //获取页面配置接口
    GetPageTreeCfgUrl1: '/base/tree',  //获取树接口
    GetPageTreeCfgUrl2: '/json/tree-role.json',
    GetBaseTreeUrl: '/jt808/common/baseTree', // 通用树 table/videoManager/channelTree
    GetBasechannelTreeUrl: '/table/videoManager/channelTree',
    GetDicType: '/table/dataDictionary/queryByType', // 数据字典  dicType=2是机构类型 在配置input的时候需要添加dicType字段
    updatePassword: '/table/userManage/updatePassword',  // 修改密码接口
    resetPassword: '/table/userManage/resetPassword', // 第一次登陆重置密码接口
    handleAlarmUrl: '/table/monitor/handleAlarm', //处理告警接口

    // 企业管理
    QueryDepartmentTableDataUrl: '/jt808/sys/department/query', // 企业管理 - 表格数据

    //表格相关接口
    GetTableDataUrl: '/json/userGridData.json',

    //列项配置接口 (单独)
    gridColumnConfigUrl: '/table/columnConfig/queryConfigGrid', // 获取表单列项配置
    saveGridColumnUrl: '/table/columnConfig/saveConfigGrid',   // 设置表单列项

    // 关注车辆和取消关注车辆接口
    vehicleAttention: '/table/monitor/vehicleAttention', // 关注车辆
    vehicleUnAttention: '/table/monitor/vehicleUnAttention', // 取消关注车辆

    //角色管理
    dataRoleAdd: 'table/roleManage/save',
    dataRoleDel: 'table/roleManage/delete',
    dataRoleEdit: 'table/roleManage/update',
    dataRoleQuery: 'table/roleManage/queryPage',

    //部门管理
    saveDepartment: 'table/departmentManage/save', // 新增部门
    deleteDepartment: 'table/departmentManage/delete', //删除部门
    updateDepartment: 'table/departmentManage/update', // 编辑部门
    queryPageDepartment: 'table/departmentManage/queryPage', // 部门表格查询
    exportDepartment: 'table/departmentManage/export', // 导出部门

    // 菜单管理
    MenuTree: '/table/menuManage/tree', //获取菜单树
    saveMenu: '/table/menuManage/save',  //新增菜单
    updateMenu: '/table/menuManage/update',  //编辑菜单
    queryPageMenu:'/table/menuManage/queryPage', //菜单表格数据查询

    // 数据类型接口
    saveDataType : '', // 新增数据类型
    updateDataType : '', // 编辑数据类型
    deleteDataType : '', // 删除数据类型
    queryPageDataType: '', // 查询数据类型

    dataMenuDel: 'table/menuManage/delete',
    dataMenuEdit: 'table/menuManage/update',
    dataMenuQuery: 'table/menuManage/queryPage',

    // 获取报警类型数据
    getAlertType: '/table/alarmType/query',
    // 用户权限list
    getFuncRole: '/table/roleInfoManage/queryName',
    getDataRole: '/table/roleManage/queryName',
    // 恢复初始密码
    initPass: '/table/userManage/initPassword',
    // 客户配置
    getMenuIds: '/table/clientConfig/tenantFuncTreePc',
    getAppIds: '/table/clientConfig/tenantFuncTreeApp',
    getAlertTypeIds: '/table/clientConfig/queryTenantAlarmConfig',
     // 功能角色
     getFuncMenu: '/table/roleInfoManage/roleFuncTreePc',
     getFuncApp: '/table/roleInfoManage/roleFuncTreeApp',
     // 车辆状态统计
     getVehCountData: '/table/vehStatus/detail',
     getVehOutlineCount: '/table/noReport/detail',
     // 规则设置
     getViewData: '/table/ruleManage/queryCommand',
     queryBindVeh: '/table/ruleManage/queryVehicleBind',
     vehTree: '/table/monitor/vehicleTree',
     delBindVeh: '/table/ruleManage/vehicleUnBind'
}


// 接口命名统一如下
api.dataRole = {
    query: api.dataRoleQuery,
    add: api.dataRoleAdd,
    del: api.dataRoleDel,
    update: api.dataRoleEdit,
    export: '',
    import: ''
}
api.funcRole = {
  query: 'table/roleInfoManage/queryPage',
  add: 'table/roleInfoManage/save',
  del: 'table/roleInfoManage/delete',
  update: 'table/roleInfoManage/update',
  export: '',
  import: ''
}
api.userManage = {
  query: 'table/userManage/queryPage',
  add: 'table/userManage/save',
  del: 'table/userManage/delete',
  update: 'table/userManage/update',
  export: '',
  import: '',
  addRole: 'table/userManage/role'
}
api.dataMenu = {
    query: api.dataMenuQuery,
    add: api.dataMenuAdd,
    del: api.dataMenuDel,
    update: api.dataMenuEdit,
    export: '',
    import: ''
}


api.dataDepartment = {
    query: api.queryPageDepartment,
    add: api.saveDepartment,
    del: api.deleteDepartment,
    update: api.updateDepartment,
    export: api.exportDepartment,
    import: ''
}

api.mapMonitor = {
    //jt808web/table/map/getInputTip
    searchUrl: 'http://180.101.255.219:38009/jt808web/table/map/getInputTip',
    // 逆地址编码接口
    regeo: 'http://180.101.255.219:38009/jt808web/table/map/getRegeo',
    vehUrl: 'http://http://180.101.255.219:38009/jt808web/table/monitor/query',

    // 实时车辆查询接口
    realLocation: 'http://180.101.255.219:38009/jt808web/table/monitor/realTimeData',

    cluderUrl:'http://180.101.255.219:38009/jt808web/table/monitor/aggregateData',

    websocket:'ws://180.101.255.219:38009/jt808web/jt808webbackend/websocket/frontweb/admin',

    historyUrl:'http://ztc.comlbs.com/MapView/TrackView',

    alarmUrl:'http://180.101.255.219:38009/jt808web/table/monitor/alarmList',

    vehTreeUrl:'http://180.101.255.219:38009/jt808web/table/monitor/vehicleTree'

}

module.exports = api
