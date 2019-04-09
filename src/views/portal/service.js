
import axios from 'axios';

import Util from '../../libs/util';
import env from './config/env';
import api, { OLD_API } from './api';
import alarmType from './config/alarmType';
import alarmTypeOld from './config/alarmType.old';

const { isUseDemo } = env;

const SUCCESS_CODE_LIST = [
  /** “http://bdlbs.comlbs.com” 的接口的 code */
  1,
  /** “新部标” 的接口的 code */
  '0',
];

/**
 * 请求是否成功
 * @param {*} code
 */
function isSuccess(code = -10000) {
  return SUCCESS_CODE_LIST.includes(code);
}


// 新部标
let config = null;
let $axios = Util.ojax;
let API = api;
let ALARM_TYPE = alarmType;

if (isUseDemo) {
  $axios = axios;

  API = OLD_API;
  ALARM_TYPE = alarmTypeOld;

  config = {
    headers: { token: '78A5B5FE6AA64489852C6863CB56430A' },
  };
}

const service = {
  /** 高德地图 */
  amp: {},
};

service.getBigDataStatistics = () => $axios.post(API.BIG_DATA_STATISTICS, {}, config)
  .then((res) => {
    const { code, detail } = res.data;

    if (!isSuccess(code)) {
      throw new Error('【大数据页面数据接口】失败');
    }

    const returnData = {
      top5Company: { companyName: [], alarmCount: [] },
      top5VehicleAlarm: { name: ['', '', '', '', ''], vehCount: [0, 0, 0, 0, 0] },
      typeCount: [],
    };

    ALARM_TYPE.forEach((item) => {
      returnData.typeCount.push({ ...item });
    });

    // 处理企业报警top5
    const { top5Company } = detail;

    returnData.top5Company.companyName = [];
    returnData.top5Company.alarmCount = [];
    top5Company.sort((val1, val2) => (val1.alarmCount - val2.alarmCount));

    Object.keys(top5Company).forEach((i) => {
      returnData.top5Company.companyName.push(top5Company[i].companyName);
      returnData.top5Company.alarmCount.push(top5Company[i].alarmCount);
    });

    const { yesterdayAlarmStatistic } = detail;
    const { alarmStatistic } = detail;

    // 报警类型统计:昨日
    yesterdayAlarmStatistic.forEach((item) => {
      const { alarmId, alarmCount } = item;

      returnData.typeCount.some((typeCountItem) => {
        if (typeCountItem.alarmId === alarmId) {
          typeCountItem.yestoday = alarmCount;
          return true;
        }
        return false;
      });
    });


    // 报警类型统计:今日
    if (alarmStatistic && Array.isArray(alarmStatistic.alarmType)) {
      const { alarmType } = alarmStatistic;

      alarmType.forEach((item) => {
        const { alarmId, alarmCount } = item;
        returnData.typeCount.some((typeCountItem) => {
          if (typeCountItem.alarmId === alarmId) {
            typeCountItem.today = alarmCount;
            return true;
          }
          return false;
        });
      });


      returnData.typeCount.sort((val1, val2) => (val1.alarmCount - val2.alarmCount));
    }

    // TODO 暂时去掉过滤条件
    // returnData.typeCount = returnData.typeCount.filter(item => item.yestoday > 0);

    const vehicleAlarmVehicleNumber = [];
    const vehicleAlarmCount = [];

    const { top5Vehicle } = detail;

    top5Vehicle.forEach((item) => {
      vehicleAlarmVehicleNumber.push(item.vehicleNumber);
      vehicleAlarmCount.push(item.alarmCount);
    });

    // top5VehicleAlarm:{name: ['', '', '', '', ''], vehCount: [0, 0, 0, 0, 0]},
    returnData.top5VehicleAlarm.name = vehicleAlarmVehicleNumber;
    returnData.top5VehicleAlarm.vehCount = vehicleAlarmCount;


    return returnData;
  });

service.getBigDataVehviewcount = params => $axios.post(API.BIG_DATA_VEHVIEWCOUNT, params, config)
  .then((res) => {
    const { code, detail } = res.data;

    if (!isSuccess(code)) {
      throw new Error('【统计页面图表数据接口】失败');
    }

    const returnData = {
      vStatusData: [{ name: '', value: 0 }],
      vTypeData: [{ name: '', value: 0 }],
      vStatusOnineData: [1, 1, 1],
      vStatusTotal: 0,
      vOnlineTotal: 0,
    };

    const {
      enterpriceVehicleData,
      vehicleStatusData,
      vehicleTypeData,
    } = detail;
    const monthInCarXAxis = [];
    const monthInCarSeries = [];

    const { monthOnlineData } = detail;

    Object.keys(monthOnlineData).forEach((key) => {
      monthInCarXAxis.push(key);
      monthInCarSeries.push(monthOnlineData[key]);
    });

    const enterVehicle = { name: ['', '', '', '', ''], vehCount: [0, 0, 0, 0, 0] };
    const vStatusData = [];
    const vTypeData = [];

    enterpriceVehicleData.forEach((item, i) => {
      let { name, vehCount } = item;


      if (!name) {
        name = '';
      }
      if (!vehCount) {
        vehCount = 0;
      }

      enterVehicle.name[i] = name;
      enterVehicle.vehCount[i] = vehCount;
    });

    let vStatusTotal = 0;
    let vOnlineTotal = 0;

    vehicleStatusData.forEach((item) => {
      const { dicCount, dicValue, dicKey } = item;

      vStatusTotal += dicCount;

      vStatusData.push({
        name: dicValue,
        value: dicCount,
      });

      switch (dicKey) {
        case '1':
          returnData.vStatusOnineData[0] = dicCount;
          vOnlineTotal += dicCount;
          break;
        case '2':
          returnData.vStatusOnineData[1] = dicCount;
          vOnlineTotal += dicCount;
          break;
        case '3':
          returnData.vStatusOnineData[2] = dicCount;
          vOnlineTotal += dicCount;
          break;
        default: {
          // do nothing
        }
      }
    });

    returnData.vStatusData = vStatusData;
    returnData.vStatusTotal = vStatusTotal;
    returnData.vOnlineTotal = vOnlineTotal;

    vehicleTypeData.forEach((item) => {
      vTypeData.push({
        name: item.dicValue,
        value: item.dicCount,
      });
    });

    returnData.vTypeData = vTypeData;

    returnData.enterVehicle = enterVehicle;
    returnData.monthInCarXAxis = monthInCarXAxis;
    returnData.monthInCarSeries = monthInCarSeries;

    return returnData;
  });

service.createWebSocket = () => {
  let { id } = JSON.parse(localStorage.getItem('$userState'));

  // 测试用
  id = 99;

  // “/2”：大数据。“/0” 是驾驶行为分析
  let url = `${api.BIG_DATA_WEBSOCKET}/${id}/2`;

  if (isUseDemo) {
    url = `${OLD_API.BIG_DATA_WEBSOCKET}/513/2`;
  }

  return new WebSocket(url);
};

service.getMapGisData = () => $axios.post(API.BIG_DATA_MAP_GIS, {}, config).then((res) => {
  const { code, detail } = res.data;

  if (!isSuccess(code)) {
    return Promise.reject(new Error('【获取地图车辆信息】失败'));
  }
  return detail;
});


service.amp.getCurrentLocation = async () => {
  const host = 'https://restapi.amap.com/v3';
  const key = '0ef6825bdde97686378638eb43882ccb';
  let adcode;
  let currentLocation = null;

  // IP 定位
  await axios.get(`${host}/ip?key=${key}`).then((res) => {
    const {
      status,
    } = res.data;

    ({ adcode } = res.data);

    if (status !== '1') {
      throw new Error('【高德地图 API】IP 定位失败');
    }

    // 左下点
    currentLocation = res.data.rectangle.split(';')[0].split(',');
  });

  // 行政区域查询
  await axios.get(`${host}/config/district?keywords=${adcode}&key=${key}`).then((res) => {
    if (res.data.status === '1') {
      // 中心点
      ({
        districts: [
          { center: currentLocation },
        ],
      } = res.data);
    }
  });

  // 坐标转换：将用户输入的非高德坐标（GPS坐标、mapbar坐标、baidu坐标）转换成高德坐标
  await axios.get(`${host}/assistant/coordinate/convert?locations=${currentLocation}&coordsys=baidu&key=${key}`).then((res) => {
    if (res.data.status === '1') {
      ({ locations: currentLocation } = res.data);
    }
  });

  return Promise.resolve(currentLocation);
};

export default service;
