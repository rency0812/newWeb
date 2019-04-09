const echarts = require('echarts');

const vehicleAlarmChart = {};


vehicleAlarmChart.create = (elt) => {
  let element = elt;

  if (typeof element === 'string') {
    element = document.getElementById(element);
  }

  const instance = echarts.init(element);

  const top5VehicleAlarm = { name: ['', '', '', '', ''], vehCount: [0, 0, 0, 0, 0] };

  const option = {
    color: '#2cc7b7',
    grid: {
      top: 15,
      left: 45,
      right: 15,
      bottom: 30,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: '{b} <br/>车辆报警次数: {c}',
    },
    xAxis: {
      type: 'category',
      data: top5VehicleAlarm.name,
      boundaryGap: true,
      axisLabel: {
        interval: 0,
        // rotate:20,
        textStyle: {
          color: '#fff',
        },
        // formatter:function(value)
        // {
        //     var ret = "";//拼接加\n返回的类目项
        //     var maxLength = 4;//每项显示文字个数
        //     var valLength = value.length;//X轴类目项的文字个数
        //     var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
        //     if (rowN > 1)//如果类目项的文字大于3,
        //     {
        //         for (var i = 0; i < rowN; i++) {
        //             var temp = "";//每次截取的字符串
        //             var start = i * maxLength;//开始截取的位置
        //             var end = start + maxLength;//结束截取的位置
        //             //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
        //             temp = value.substring(start, end) + "\n";
        //             ret += temp; //凭借最终的字符串
        //         }
        //         return ret;
        //     }
        //     else {
        //         return value;
        //     }
        // }
      },
      axisLine: {
        lineStyle: {
          color: '#474955',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#474955',
        },
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
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
    series: {
      data: top5VehicleAlarm.vehCount,
      type: 'bar',
      barWidth: 7,
      itemStyle: {
        barBorderRadius: [5, 5, 0, 0],
      },
    },
  };

  instance.setOption(option);

  return instance;
};

export default vehicleAlarmChart;
