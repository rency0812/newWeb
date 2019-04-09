import * as types from '../../libs/types';

import service from './service';
import VECHILE_TYPE from './config/vechileType';

import mapChart from './statistic/mapChart';
import carTypeChart from './statistic/carTypeChart';
import carOnlineChart from './statistic/carOnlineChart';
import carInChart from './statistic/carInChart';
import comOfflineChart from './statistic/comOfflineChart';
import comAlermChart from './statistic/comAlermChart';
import vehicleAlarmChart from './statistic/vehicleAlarmChart';


require('echarts-gl');
require('../../../statics/bmap.min.js');


export default {
  data() {
    return {
      // 入网车辆类别(单位:辆)
      carTypeCharts: null,

      // 车辆上线情况
      carOnlineCharts: null,

      // 地图
      mapCharts: null,

      // 车辆运营数(单位:辆)
      carInCharts: null,

      // 企业报警次数TOP5
      comAlermCharts: null,

      // 企业报离线次数TOP5
      comOfflineCharts: null,

      // 车辆报警次数TOP5(单位:次)
      vehicleAlarmCharts: null,

      // 报警类型统计(单位:次)
      typeCount: [],

      // 实时报警信息
      truckAlerm: [],

      top5VehicleAlarm: { name: ['', '', '', '', ''], vehCount: [0, 0, 0, 0, 0] },

      // ws接收数据
      top5Company: { companyName: [], alarmCount: [] },

      EnterVehicle: { name: ['', '', '', '', ''], vehCount: [0, 0, 0, 0, 0] },
      vStatusData: [{ name: '', value: 0 }],
      vTypeData: [{ name: '', value: 0 }],

      // 车辆上线情况
      vStatusOnineData: [
        1, // 行驶车辆
        1, // 停车车辆
        1, // 熄火车辆
      ],

      // 入网车辆类别：入网车辆总数
      vStatusTotal: 0,

      // 入网车辆类别：在线车辆总数
      vOnlineTotal: 0,
      top5Vehicle: [{ vehicleNumber: 0, alarmCount: 0 }],
      vechileType: VECHILE_TYPE,

      timerId: null,
      resizeHandler: null,
    };
  },
  mounted() {
    this.createCharts();

    this.getData();

    this.createWebSocket();

    this.createRequestTimer();

    this.resizeHandler = () => this.resizeCharts();

    window.addEventListener('resize', this.resizeHandler, false);

  },
  destroyed() {
    this.destroyRequestTimer();
    window.removeEventListener('resize', this.resizeHandler, false);
    this.websock.close();
  },
  methods: {
    createCharts() {
      mapChart.create('mapCharts').then((instance) => {
        this.mapCharts = instance;
      });
      this.carTypeCharts = carTypeChart.create('carTypeCharts');
      this.carOnlineCharts = carOnlineChart.create('carOnlineCharts');
      this.carInCharts = carInChart.create('carInCharts');
      this.comOfflineCharts = comOfflineChart.create('comOfflineCharts');
      this.comAlermCharts = comAlermChart.create('comAlermCharts');
      this.vehicleAlarmCharts = vehicleAlarmChart.create('vehicleAlarmCharts');
    },
    resizeCharts() {
      this.mapCharts.resize();
      this.carTypeCharts.resize();
      this.carOnlineCharts.resize();
      this.carInCharts.resize();
      this.comAlermCharts.resize();
      this.comOfflineCharts.resize();
      this.vehicleAlarmCharts.resize();
    },
    createWebSocket() {
      this.websock = service.createWebSocket();

      // 获取推送过来的数据，在 “实时报警信息” 显示
      this.websock.onmessage = (res) => {
        const { data } = res;

        if (data.includes('连接成功')) {
          console.warn('【web socket】获取到消息 —— “连接成功”，等待有效数据。');
          return;
        }

        const { vechileAlarm } = JSON.parse(data);

        vechileAlarm.forEach((item) => {
          const { vehicleNo, icon, city } = item;

          this.truckAlerm.unshift({
            vechileNum: vehicleNo,
            vachileAlerm: icon,
            vachileLocation: city,
          });
        });

        this.truckAlerm = this.truckAlerm.slice(0, 6);
      };

      this.websock.onopen = () => {
        console.warn('【web socket】成功连接');
        this.websock.send('Holle');
      };

      this.websock.onclose = () => {
        console.warn('【web socket】连接关闭');
      };

      this.websock.onerror = (e) => {
        console.error('【web socket】连接发生错误', e);
        // this.$Notice.error({
        //   title: types.SEARVICE_ERROR_TITLE,
        //   desc: types.SEARVICE_ERROR,
        //   duration: 60,
        // });
      };
    },
    getData() {
      this.getBigDataVehviewcount();
      this.getBigDataStatistics();
    },
    getBigDataVehviewcount() {
      service.getBigDataVehviewcount({ actiontype: 'VehicleStatusData' }).then((data) => {
        const {
          vStatusData,
          vTypeData,
          vStatusOnineData,
          vStatusTotal,
          vOnlineTotal,
          enterVehicle,
          monthInCarXAxis,
          monthInCarSeries,
        } = data;

        Object.assign(this, {
          vStatusData,
          vTypeData,
          vStatusOnineData,
          vStatusTotal,
          vOnlineTotal,
        });


        this.comOfflineCharts.setOption({
          xAxis: { data: enterVehicle.name },
          series: { data: enterVehicle.vehCount },
        });
        this.carInCharts.setOption({
          xAxis: { data: monthInCarXAxis.reverse() },
          series: { data: monthInCarSeries.reverse() },
        });

        this.carOnlineCharts.setOption({ series: { data: vStatusData } });
        this.carTypeCharts.setOption({ series: { data: vTypeData } });
      });
    },
    getBigDataStatistics() {
      service.getBigDataStatistics().then((data) => {
        const {
          top5Company,
          top5VehicleAlarm,
          typeCount,
        } = data;


        this.comAlermCharts.setOption({
          yAxis: {
            data: top5Company.companyName,
          },
          series: [
            {
              data: top5Company.alarmCount,
            },
          ],
        });

        this.vehicleAlarmCharts.setOption({
          xAxis: { data: top5VehicleAlarm.name },
          series: { data: top5VehicleAlarm.vehCount },
        });

        this.top5Company = top5Company;
        this.top5VehicleAlarm = top5VehicleAlarm;

        console.log(typeCount);
        this.typeCount = typeCount;
      });
    },
    toBehavior() {
      window.open('/assetsManage/vehicleManage', '_blank');
    },

    destroyRequestTimer() {
      if (this.timerId) {
        window.clearInterval(this.timerId);
      }
    },
    createRequestTimer() {
      this.timerId = window.setInterval(() => this.getData(), 30000);
    },
  },
};
