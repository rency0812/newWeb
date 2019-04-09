const echarts = require('echarts');

const carInChart = {};


carInChart.create = (elt) => {
  let element = elt;

  if (typeof element === 'string') {
    element = document.getElementById(element);
  }

  const instance = echarts.init(element);

  const option = {
    grid: {
      top: 15,
      left: 45,
      right: 5,
      bottom: 25,


    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b} <br/>{a}: {c}',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      axisLabel: {
        textStyle: {
          color: '#fff',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#474955',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#474955',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        textStyle: {
          color: '#fff',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#474955',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#474955',
        },
      },
    },
    series: [{
      name: '车辆运营数',
      data: [],
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#2cc7b7',
      },
      lineStyle: {
        color: '#2cc7b7',
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(44, 199, 183,.75)',
        }, {
          offset: 1,
          color: 'rgba(44, 199, 183,.15)',
        }]),
      },
    }],
  };

  instance.setOption(option);

  return instance;
};

export default carInChart;
