import service from '../service';

import vechileType from '../config/vechileType';

const echarts = require('echarts');


const mapChart = {};

const DEFAULT_CENTER_LOCATION = [115.0086900000, 31.1733300000];

const BMAP = {
  center: DEFAULT_CENTER_LOCATION,
  zoom: 11,
  roam: true,
  mapStyle: {
    styleJson: [
      { featureType: 'water', elementType: 'all', stylers: { color: '#17202fff' } },
      { featureType: 'land', elementType: 'all', stylers: { color: '#060a12ff' } },
      { featureType: 'highway', elementType: 'geometry', stylers: { color: '#3c4a5cff', weight: '0.8', lightness: -32 } },
      { featureType: 'highway', elementType: 'labels.text.fill', stylers: { color: '#a0adbbff', visibility: 'off' } },
      { featureType: 'arterial', elementType: 'all', stylers: { color: '#3c4a5cff', lightness: -32 } },
      { featureType: 'arterial', elementType: 'labels.text.fill', stylers: { color: '#a0adbbff' } },
      { featureType: 'local', elementType: 'geometry.fill', stylers: { color: '#3c4a5cff', lightness: -2 } },
      { featureType: 'local', elementType: 'labels.text.fill', stylers: { color: '#a0adbbff' } },
      { featureType: 'districtlabel', elementType: 'labels.text.fill', stylers: { color: '#a0adbbff', visibility: 'off' } },
      { featureType: 'districtlabel', elementType: 'labels.text.stroke', stylers: { color: '#a0adbbff', lightness: -100, saturation: -100 } },
      { featureType: 'railway', elementType: 'all', stylers: { visibility: 'off' } },
      { featureType: 'subway', elementType: 'all', stylers: { visibility: 'off' } },
      { featureType: 'boundary', elementType: 'all', stylers: { color: '#20124dff' } },
      { featureType: 'districtlabel', elementType: 'labels.icon', stylers: { visibility: 'off' } },
      { featureType: 'green', elementType: 'all', stylers: { visibility: 'off' } },
      { featureType: 'manmade', elementType: 'all', stylers: { visibility: 'off' } },
      { featureType: 'building', elementType: 'all', stylers: { visibility: 'off' } },
      { featureType: 'town', elementType: 'labels.text.fill', stylers: { color: '#a0adbbff', visibility: 'off' } },
      { featureType: 'district', elementType: 'labels.text.fill', stylers: { color: '#a0adbbff', visibility: 'off' } },
      { featureType: 'city', elementType: 'labels.text.fill', stylers: { color: '#b7c6d6ff', lightness: -66, visibility: 'off' } },
      { featureType: 'poilabel', elementType: 'labels.text.fill', stylers: { color: '#a0adbbff', visibility: 'on' } },
      { featureType: 'road', elementType: 'all', stylers: { color: '#565a61ff', lightness: -30, visibility: 'off' } },
      { featureType: 'administrative', elementType: 'labels.text.fill', stylers: { color: '#a0adbbff', lightness: -44, visibility: 'on' } },
      { featureType: 'poilabel', elementType: 'all', stylers: { visibility: 'off' } },
    ],
  },
};

/**
 * 创建地图
 * @param elt {HTMLElement | String} 地图挂载点
 * @returns {Promise<*>}
 */
mapChart.create = async (elt) => {
  let element = elt;

  if (typeof element === 'string') {
    element = document.getElementById(element);
  }

  const instance = echarts.init(element);

  let center = DEFAULT_CENTER_LOCATION;

  await service.amp.getCurrentLocation().then((loc) => {
    center = loc.split(',');
  });

  const option = {
    legend: {
      show: true,
      orient: 'vertical',
      bottom: '15',
      right: '15',
      data: vechileType.map(({ text }) => text),
      textStyle: {
        color: '#fff',
      },
    },
    bmap: { ...BMAP, center },
    series: [],
  };


  instance.setOption(option);

  await mapChart.setData(instance);

  return Promise.resolve(instance);
};

/**
 * 给指定 echart 地图实例填充数据
 */
mapChart.setData = (instance) => {
  const color = [
    'rgba(32, 117, 208, 0.55)',
    'rgba(37, 140, 249, 0.55)',
    'rgba(101, 147, 222, 0.55)',
    'rgba(23, 192, 193, 0.55)',
    'rgba(14, 241, 242, 0.55)',
    'rgba(129, 210, 237, 0.55)',
    'rgba(255, 255, 255, 0.55)',
    'rgba(26, 70, 244, 0.55)',
  ];

  return service.getMapGisData()
    .then((mapData) => {
      const series = [];

      mapData.forEach((mapDataItem, mapDataIndex) => {
        const eLocation = [];
        const { vehicleType, latLonList } = mapDataItem;

        latLonList.forEach((latLon) => {
          const { lon, lat } = latLon;
          eLocation.push([lon.toFixed(4), lat.toFixed(4), 1]);
          // console.log(lon, lat);
        });

        let vechileTypeTxt = '';

        vechileType.some((vechileTypeItem) => {
          const { typeId, text } = vechileTypeItem;

          if (typeId === vehicleType) {
            vechileTypeTxt = text;
            return true;
          }

          return false;
        });

        series.push({
          name: vechileTypeTxt,
          vechileType: vehicleType,
          type: 'scatterGL',
          coordinateSystem: 'bmap',
          symbolSize: 3,
          itemStyle: {
            shadowBlur: 12,
            shadowColor: color[mapDataIndex],
            color: color[mapDataIndex],
          },
          data: eLocation,
        });
      });

      instance.setOption({ series });
    });
};

export default mapChart;
