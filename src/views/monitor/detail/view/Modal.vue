<template>
  <Modal
    class="map-detail-modal"
    v-model="modal.isShow"
    :title="modal.title"
    :width="modal.width"
    draggable
    :footer-hide="true">

    <Tabs type="card" :animated="false">

      <TabPane label="当前状态">
        <CurrentStatus :clientId="clientId" :plateNum="plateNum"/>
      </TabPane>

      <TabPane label="车辆信息">
        <CarInfo :clientId="clientId" :plateNum="plateNum" />
      </TabPane>

    </Tabs>

  </Modal>
</template>
<script>
import CurrentStatus from './CurrentStatus.vue';
import CarInfo from './CarInfo.vue';


export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    plateNum: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
  },
  components: {
    CurrentStatus,
    CarInfo,
  },
  data() {
    return {
      modal: {
        isShow: this.isShow,
        width: 1000,
        title: `详情-${this.plateNum}`,
        loading: false,
      },
    };
  },
  methods: {
  },
};
</script>
<style lang="less">
  .map-detail-modal {
    font-size: 14px;

    .ivu-modal-header {
      border-bottom: none 0;
    }
    .ivu-modal-footer {
      border-top: none 0;
    }
    .ivu-modal-body {
      padding-top: 10px;
    }
    .ivu-icon-ios-loading:before {
      content: "\F45B";
    }

    .ivu-modal-content {
      background-clip: padding-box;
      box-shadow: 0 4px 12px rgba(0,0,0,.15);
    }

    .ivu-tabs-bar {
      padding: 0 16px;
      margin-bottom: 0;
    }

    .ivu-tabs .ivu-tabs-content-animated {
      padding: 16px;
    }

    .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header > i {
      margin-right: 14px;
    }

    .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
      padding-left: 20px;
    }

    .ivu-table table {
      border-collapse: collapse;
    }

    .ivu-table-border th,
    .ivu-table-border td {
      border: 1px solid #dfdfdf;
    }

    // loading 遮罩层
    .ivu-spin-fix {
      display: block;

      .ivu-spin-main {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: auto;
        height: auto;
        transform: translate(-50%,-50%);
      }
    }

    .ivu-tabs-content {
      padding: 16px;
    }

    .ivu-collapse {
      border: none 0;

      > .ivu-collapse-item {
        /*border-top: none 0;*/
        /*border-bottom: 1px solid #c0c1d8;*/

        /*&:() {*/
          /*border-bottom: none 0;*/
        /*}*/
      }
    }
  }
</style>
