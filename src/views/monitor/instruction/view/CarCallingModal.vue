<template>
  <div>
    <Modal
      class="instruction-modal instruction-modal_car-calling"
      v-model="value"
      :title="`${plateNum}-点名确认`"
      width="300"
      draggable
      :loading="loading"
      @on-ok="handleOk"
      @on-cancel="handleCancel">
      确认下发点名？
    </Modal>
  </div>
</template>
<script>
import service from '../service';

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
  data() {
    return {
      value: this.isShow,
      loading: true,
    };
  },
  methods: {
    handleOk() {
      this.requestCarCalling()
        .finally(() => {
          this.loading = false;
        });
    },
    handleCancel() {
      console.log('onCancel()');
    },
    async requestCarCalling() {
      let data = null;
      let address = '';

      this.loading = true;

      await service.setCarCallingInstruction(this.clientId)
        .then((res) => {
          const { code, detail } = res.data;

          if (code !== '0') {
            throw new Error('下发失败');
          }

          data = detail;
        })
        .catch((error) => {
          this.$Notice.error({ desc: '下发失败' });
          throw error;
        });

      const { longitude, latitude } = data;

      await service.getAddress(longitude, latitude).then((addr) => {
        address = addr;
      });

      this.$Notice.success({ desc: '下发成功！' });

      this.$Modal.info({
        title: '点名信息',
        content: `${this.plateNum}位置信息：${address}`,
      });

      return Promise.resolve(true);
    },
  },
};
</script>
<style lang="less">
  .instruction-modal_car-calling {
    .ivu-modal-header {
      /*border-bottom: none 0;*/
    }
    .ivu-modal-footer {
      border-top: none 0;
    }
    .ivu-modal-body {
      padding: 16px;
    }

  }
</style>
