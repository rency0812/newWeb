import Vue from 'vue';
import Modal from './view/Modal.vue';

// 公共样式
import './asset/style.less';

let vm = null;

const detail = {
  /**
   * 详情页的模态框
   * @param clientId {string} 设备号
   * @param plateNum {string} 车牌号，如 '粤A111111'
   * @example
   *
   *    detail.show('012011113333', '粤A111111');
   */
  show(clientId, plateNum) {
    this.createInstance(Modal, {
      isShow: true,
      clientId,
      plateNum,
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

export default detail;
