import Vue from 'vue';
import CarPosition from './view/CarCallingModal.vue';
import Photo from './view/PhotoModal.vue';
import Text from './view/TextSettingModal.vue';
import Listener from './view/MonitorSettingModal.vue';
import ParamsConfig from './view/ParamsConfigModal.vue';
import CarChosen from './view/CarChosenModal.vue';

// 公共样式
import './asset/style.less';

let vm = null;

const instruction = {
  /**
   * 点名下发获取位置信息
   * @param clientId {string} 设备号
   * @param plateNum {string} 车牌号，如 '粤A111111'
   * @example
   *
   *    instruction.callForCarPosition('012011113333', '粤A111111');
   */
  callForCarPosition(clientId, plateNum) {
    this.createInstance(CarPosition, {
      isShow: true,
      plateNum,
      clientId,
    });
  },
  /**
   * 拍照
   * @param clientId {string} 设备号
   * @param plateNum {string} 车牌号
   * @example
   *
   *    instruction.takePhoto('012011113333', '粤A22222');
   */
  takePhoto(clientId, plateNum) {
    this.createInstance(Photo, {
      isShow: true,
      plateNum,
      clientId,
    });
  },
  /**
   * 文本
   * @param clientId {string} 设备号
   * @param plateNum {string} 车牌号
   * @example
   *
   *    instruction.sendText('012011113333', '粤A22222');
   */
  sendText(clientId, plateNum) {
    this.createInstance(Text, {
      isShow: true,
      plateNum,
      clientId,
    });
  },
  /**
   * 监听
   * @param clientId {string} 设备号
   * @param plateNum {string} 车牌号
   * @example
   *
   *    instruction.setListener('012011113333', '粤A22222');
   */
  setListener(clientId, plateNum) {
    this.createInstance(Listener, {
      isShow: true,
      plateNum,
      clientId,
    });
  },
  /**
   * 选车
   * @example
   *
   *    instruction.setListener('012011113333', '粤A22222');
   */
  chooseCar() {
    this.createInstance(CarChosen, {
      isShow: true,
    });
  },
  /**
   * 参数设置
   * @example
   *
   *    instruction.setListener('012011113333', '粤A22222');
   */
  setParamsConfig() {
    this.createInstance(ParamsConfig, {
      isShow: true,
    });
  },


  createInstance(vueComponent, props = {}) {
    this.destroyInstance();

    vm = new Vue({
      render: h => h(vueComponent, { props }),
    });

    // API：https://cn.vuejs.org/v2/api/#vm-mount
    vm.$mount();

    document.body.appendChild(vm.$el);

    return vm;
  },
  destroyInstance() {
    if (vm && (vm instanceof Vue)) {
      vm.$destroy(true);
      vm.$el.parentNode.removeChild(vm.$el);
    }
  },
};

export default instruction;
