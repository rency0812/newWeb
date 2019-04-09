export default {
  /** 实时车辆报警 websocket */
  BIG_DATA_WEBSOCKET: 'ws://180.101.255.219:38007/websocketForEnterpriseBigData',

  /** 大数据页面数据接口 */
  BIG_DATA_STATISTICS: '/table/bigdata/statistics',

  /** 统计页面图表数据接口 */
  BIG_DATA_VEHVIEWCOUNT: '/table/bigdata/vehviewcount',

  /** 获取地图车辆信息 */
  BIG_DATA_MAP_GIS: '/table/bigdata/getMapGisData',
};

export const OLD_API = {
  /** 实时车辆报警 websocket */
  BIG_DATA_WEBSOCKET: 'ws://socket.bdlbs.comlbs.com/websocketForBigData',

  /** 大数据页面数据接口 */
  BIG_DATA_STATISTICS: 'http://api.bdlbs.comlbs.com/bb/bigdata/statistics',

  /** 统计页面图表数据接口 */
  BIG_DATA_VEHVIEWCOUNT: 'http://api.bdlbs.comlbs.com/bb/bigdata/vehviewcount',

  /** 获取地图车辆信息 */
  BIG_DATA_MAP_GIS: 'http://api.bdlbs.comlbs.com/bb/bigdata/getMapGisData',
};
