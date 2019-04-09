import API from './api';
import Util from '../../../libs/util';

const service = {};

/**
 * 指令下发
 * @param clientId {string|*} 设备号
 * @return {Promise<*>}
 */
service.setCarCallingInstruction = clientId => Util.ojax.post(
  API.CAR_CALLING_INSTRUCTION,
  { clientId },
);

/**
 * 根据经纬度获取详情地址
 * @param longitude {string} 经度
 * @param latitude {string} 唯独
 * @return {*}
 */
service.getAddress = (longitude, latitude) => {
  const params = {
    radius: 1000,
    location: `${longitude},${latitude}`,
  };

  return Util.ojax.post(API.GET_ADDRESS, params).then((res) => {
    const { code, detail } = res.data;

    if (code !== '0') {
      console.warn('获取地址失败');
      return '';
    }

    const {
      regeocode: {
        formatted_address: formattedAddress,
      },
    } = detail;

    return formattedAddress;
  });
};

/**
 * 拍照下发
 * @param clientId {string|*} 设备号
 * @param params {*}
 * @return {Promise}
 */
service.setTakePhotoInstruction = (clientId, params) => {
  const api = `${API.TAKE_PHOTO_INSTRUCTION}/${clientId}`;

  return Util.ojax.post(api, params);
};

/**
 * 获取指定设备的最大通道数
 * @param clientId {string|*} 设备号
 * @return {Promise}
 */
service.getMaxChannelNum = (clientId) => {
  const params = {
    devNo: clientId,
    pageIndex: 0,
    pageSize: 20,
  };

  return Util.ojax.post(API.GET_MAX_CHANNEL_NUM, params);
};

/**
 * 监听下发
 * @param clientId {string|*} 设备号
 * @param params {*}
 * @return {Promise}
 */
service.setMonitorSettingInstruction = (clientId, params) => {
  const api = `${API.MONITOR_SETTING_INSTRUCTION}/${clientId}`;
  return Util.ojax.post(api, params);
};


/**
 * 文本下发
 * @param clientId {string|*} 设备号
 * @param params {*}
 * @return {Promise}
 */
service.setTextSettingInstruction = (clientId, params) => {
  const api = `${API.TEXT_SETTING_INSTRUCTION}/${clientId}`;
  return Util.ojax.post(api, params);
};



let VEHICLE_TREE_CACHE = null;

/**
 * 获取车辆树
 * @return {Promise<Array>}
 */
service.getVehicleTree = () => {
  if (Array.isArray(VEHICLE_TREE_CACHE)) {
    return Promise.resolve(VEHICLE_TREE_CACHE);
  }

  return Util.ojax.post(API.GET_VEHICLE_TREE)
    .then((res) => {
      const { data: { code, detail } } = res;

      if (code !== '0') {
        console.warn('获取车辆树失败');
        return null;
      }

      VEHICLE_TREE_CACHE = detail;

      return VEHICLE_TREE_CACHE;
    });
};


/**
 * 参数配置下发
 * @param params {*}
 * @return {Promise}
 */
service.setParamsConfigInstruction = (params) => Util.ojax.post(
  API.PARAMS_CONFIG_INSTRUCTION,
  params,
);


export default service;
