<template>
  <div>
    <Modal
      class="instruction-modal instruction-modal_monitor"
      v-model="modal.isShow"
      :title="modal.title"
      :width="modal.width"
      draggable
    >

      <Form ref="formModel" :model="formModel" :rules="ruleValidate" :label-width="100" label-position="left">
        <FormItem label="操作时间" prop="opeDate">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" v-model="formModel.opeDate" />
        </FormItem>
        <FormItem label="监听方式" prop="listenMethod">
          <RadioGroup v-model="formModel.listenMethod">
            <Radio :label="1">监听</Radio>
            <Radio :label="0">普通通话</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="回拨号码" prop="tel">
          <Input v-model="formModel.tel" />
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text"  size="large"  @click="handleCancel">取消</Button>
        <Button type="primary"  size="large" :loading="modal.loading" @click.stop="handleSubmit">下发</Button>
      </div>
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
      modal: {
        isShow: this.isShow,
        width: 400,
        title: `${this.plateNum}-监听`,
        loading: false,
      },
      formModel: {
        opeDate: new Date(),
        listenMethod: 1,
        tel: '',
      },
      ruleValidate: {
        opeDate: [
          {
            type: 'date', required: true, message: '请选择操作时间', trigger: 'change',
          },
        ],
        listenMethod: [
          {
            type: 'number', required: true, message: '请选择监听方式', trigger: 'change',
          },
        ],
        tel: [
          {
            type: 'string', required: true, message: '请填写回拨号码', trigger: 'change',
          },
          {
            type: 'string', pattern: /^[0-9][0-9-]{2,}/, message: '请填写正确的格式，如 012-123456、18712345678', trigger: 'change',
          },
        ],
      },
    };
  },
  methods: {
    handleCancel() {
      this.modal.isShow = false;
    },
    handleSubmit() {
      const params = {};

      this.$refs.formModel.validate((valid) => {
        console.log(valid);
        if (!valid) {
          console.warn('表单验证不通过');
          return;
        }

        this.$Modal.confirm({
          title: `确认下发指令到${this.plateNum}？`,
          onOk: () => {
            this.request();
          },
        });
      });
    },
    request() {
      this.modal.loading = true;

      /*
      {
          "operationTime": 1553131014085, // 操作时间。毫秒数
          "flag": 0,                      // 监听方式。“0” 为 普通电话，“1” 为监听
          "phoneNum": "18700000000"       // 回拨号码。
      }
       */
      const params = {
        operationTime: new Date(this.formModel.opeDate).getTime(),
        flag: this.formModel.listenMethod,
        phoneNum: this.formModel.tel,
      };
      service.setMonitorSettingInstruction(this.clientId, params)
        .then((res) => {
          const { code, detail, msg } = res.data;

          if (code !== '0') {
            this.$Notice.error({ desc: '下发失败！' });
            return;
          }

          this.$Notice.success({ desc: '下发成功！' });
          // this.modal.isShow = false;
        })
        .catch((e) => {
          console.warn(e);
          this.$Notice.error({ desc: '下发失败！' });
        })
        .finally(() => { this.modal.loading = false; });
    },
  },
};
</script>
<style lang="less">
  .instruction-modal_monitor {
    .ivu-modal-body {
      padding: 16px;
    }
  }
</style>
