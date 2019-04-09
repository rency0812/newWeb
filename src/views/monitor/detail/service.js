import Util from '../../../libs/util';
import API from './api';

const service = {};

function catchHandler(e) {
  console.error(e);
  return { code: '-1' };
}

/**
 * 获取 “状态信息” 数据
 * @param clientId {string}
 * @return {Promise<{code: string, detail: {}}>}
 */
service.getStatusInfo = clientId => Util.ojax.post(API.GET_STATUS_INFO, { devNos: [clientId] })
  .then(res => res.data).catch(e => catchHandler(e));

/**
 * 获取 “车辆信息” 数据
 * @param clientId {string}
 * @return {Promise<{code: string, detail: {}}>}
 */
service.getCarInfo = clientId => Util.ojax.post(API.GET_CAR_INFO, {
  devNo: clientId,
  pageIndex: 1,
  pageSize: 10,
})
  .then(res => res.data)
  .catch(e => catchHandler(e));

/**
 * 获取 “报警信息” 分页数据
 * @param devNo {string|*}
 * @return {Promise<{code: string, detail: {}}>}
 */
service.getAlertTableData = devNo => Util.ojax.post(API.GET_ALERT_TABLE_DATA, { devNo })
  .then(res => res.data)
  .catch(e => catchHandler(e));


export default service;
