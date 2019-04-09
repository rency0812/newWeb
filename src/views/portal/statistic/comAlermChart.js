const echarts = require('echarts');

const comAlermChart = {};


comAlermChart.create = (elt) => {
  let element = elt;

  if (typeof element === 'string') {
    element = document.getElementById(element);
  }

  const instance = echarts.init(element);

  const top5Company = { companyName: [], alarmCount: [] };

  const option = {
    color: '#53b7ff',
    grid: {
      top: 25,
      left: 85,
      right: 15,
      bottom: 15,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'value',
      minInterval: 1,
      boundaryGap: false,
      position: 'top',
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
      // max: 100000
    },
    yAxis: {
      type: 'category',
      data: top5Company.companyName,
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
      data: top5Company.alarmCount,
      type: 'bar',
      barWidth: 7,
      itemStyle: {
        barBorderRadius: [0, 5, 5, 0],
      },
    }],
  };

  instance.setOption(option);

  return instance;
};

export default comAlermChart;
