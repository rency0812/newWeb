const echarts = require('echarts');

const carTypeChart = {};


carTypeChart.create = (elt) => {
  let element = elt;

  if (typeof element === 'string') {
    element = document.getElementById(element);
  }

  const instance = echarts.init(element);
  const option = {
    color: ['#0059df', '#f2ea7b', '#2cc7b7', '#53b7ff', '#3274ec', '#414fd3'],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: [
      {
        name: '车辆类别',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '16',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: true,
          },
        },
        data: [],
      },
    ],
  };
  instance.setOption(option);

  return instance;
};

export default carTypeChart;
