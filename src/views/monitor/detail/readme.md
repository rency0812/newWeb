# 地图监控 —— 详情

## 1. 当前状态

请求：

```javascript
// POST /table/monitor/realTimeData
{
  "devNos": [ "013000298738" ] // 设备号（列表）
}
```

响应：

```javascript
{
  code: '0',
  error: null,
  msg: null,
  detail: [{

    // ？：车籍地
    // ？：左转
    // ？：右转
    // ？：远光灯
    // ？：近光灯
    // ？：开关门
    // ？：油路
    // ？：电路
    // ？：刹车

    id: 25161,
    devNo: '013000298738',            // 设备号
    deptName: '房县恒达出租汽车有限公司', // 组织机构
    vehTy: null,                      // 车辆类型
    vehPCor: '蓝色',                   // 车牌颜色
    speed: '29',                      // 最后速度
    pos: null,
    dir: 281,
    latLng: { lat: 32.053531, lng: 110.736956 },
    // 状态(1 行驶；2 停车；3 熄火；4 定位失败；5 通讯中断)
    sta: 1,
    vehNo: '鄂CT7600',
    time: '2019-03-27 10:13:15',      // 更新时间
    dayMile: '56.00',                 // 今日里程
    dayHour: 35702.0,                 // 今日时长
    sumMile: '8618.4',                // 总里程
    position: null,                   // 最后位置
    isLocation: null,                 // 定位状态
    accStatus: null,                  // ACC
  }],
  retain: null,
}
```

```javascript
{
  /** 状态 @type {number} 1 行驶；2 停车；3 熄火；4 定位失败；5 通讯中断 */
  status: 0,
  /** 更新时间 @type {string} '2019-03-27 10:13:15' */
  updateTime: '',
  /** 设备号。 @type {string} '12345678890' */
  clientId: '',
  /** 在线状态 @type {string} '在线' | '不在线'（status = 5） */
  onlineStatus: '',
  /** 组织机构 @type {string} 'XX组织机构' */
  deptName: '',
  /** 行驶状态 @type {string} '行驶'(status = 1)、'停车'(status = 2)、'熄火'(status = 3) */
  drivingState: '',
  /** 车牌颜色 @type {string} '蓝色' */
  licensePlateColor: '',
  /** 定位状态 @type {string} '已定位' */
  positioningStatus: '',
  /** 车辆类型 @type {string} */
  vehicleType: '',
  /** 今日时长（单位 秒） @type {number} */
  todayTime: 0,
  /** 车籍地 @type {string} */
  vehicleSite: '',
  /** 今日里程 @type {number} */
  todayKilometers: 0,
  /** 总里程 @type {number} */
  totalKilometers: 0,
  /** 最后速度。单位 km/h @type {number} */
  lastSpeed: 0,
  /** 最后位置 @type {string} */
  lastPosition: '',
}
```

## 2. 报警列表

请求：

```javascript
// POST /table/monitor/alarmList
{
  "devNos": [ "013000298738" ] // 设备号（列表）
}
```

## 3. 车辆信息

请求：

```javascript
// POST /table/vehicleManage/queryPage
{
  "devNo": "013000298738",
  "pageIndex": 1,
  "pageSize": 10
}
```

响应：

```javascript
{
  "code": "0",
  "error": null,
  "msg": null,
  "detail": {
    "total": 1,
    "list": [
      {
        "id": 25161,
        "vehNo2": null,
        "vehNo": "鄂CT7600",
        "devNo": "013000298738",
        "deptId": 21542653,
        "deptName": null,
        "licensePlateColor": 1,
        "installTime": "2017-05-12 11:00:00",
        "terminalId": "0",
        "cameraNum": 0,
        "checkDate": "2017-05-12 11:00:00",
        "endCheckDate": null,
        "transferFlag": null,
        "shortName": null,
        "deviceBrand": "",
        "transportPermit": null,
        "transportBusiness": null,
        "purchaseMethod": null,
        "tonnage": null,
        "vehicleColor": "10",
        "contact": "0",
        "contactPhone": null,
        "remark": null,
        "createUserId": null,
        "createTime": null,
        "modifyUserId": null,
        "modifyTime": null,
        "isDel": 0,
        "vehicleType": null,
        "deviceType": "",
        "factoryId": "",
        "vehicleSite": null,
        "useState": null,
        "engineNo": null,
        "license": null,
        "superviseType": null,
        "vehicleLevel": null,
        "vehicleManuDate": null,
        "vehiclePurchaseDate": null,
        "loadNum": null
      }
    ],
  },
  "retain": null
}
```
