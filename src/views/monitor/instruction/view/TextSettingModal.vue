<template>
  <div>
    <Modal
      class="instruction-modal instruction-modal_text"
      v-model="modal.isShow"
      :title="modal.title"
      :width="modal.width"
      draggable
    >

      <Form ref="formModel" :model="formModel" :rules="ruleValidate" :label-width="100" label-position="left">
        <FormItem label="操作时间" prop="opeDate">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" v-model="formModel.opeDate" />
        </FormItem>
        <FormItem label="显示方式" prop="displayMethod">
          <CheckboxGroup v-model="formModel.displayMethod">
            <Checkbox label="1" v-model="formModel.urgency">紧急</Checkbox>
            <Checkbox label="2" v-model="formModel.terminalDisplay">终端显示器</Checkbox>
            <Checkbox label="3" v-model="formModel.ttsPlay">终端TTS播读</Checkbox>
            <Checkbox label="4" v-model="formModel.screenDisplay">广告屏显示</Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem label="文本内容" prop="content">
          <Input v-model="formModel.content" type="textarea" />
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
        title: `${this.plateNum}-文本`,
        loading: false,
      },
      formModel: {
        opeDate: new Date(),
        displayMethod: [], // ['1', '2']
        urgency: false,
        terminalDisplay: false,
        ttsPlay: false,
        screenDisplay: false,
        content: '',
      },
      ruleValidate: {
        opeDate: [
          { type: 'date', required: true, message: '请选择操作时间', trigger: 'change'  },
        ],
        displayMethod: [
          { type: 'array', required: true, min: 1, message: '最少选择一种', trigger: 'change'  },
        ],
        content: [
          { type: 'string', required: true, message: '请填写文本内容', trigger: 'change'  },
        ],
      }
    };
  },
  methods: {
    handleCancel() {
      this.modal.isShow = false;
    },
    handleSubmit() {

      this.$refs.formModel.validate((valid) => {
        console.log(valid);
        if (!valid) {
          console.warn('表单验证不通过');
          return;
        }

        this.$Modal.confirm({
          title: `确认下发指令到${this.plateNum}？`,
          onOk: () => {
            /*
            {
                "operationTime": 1553131014085, // 操作时间。毫秒数
                "urgency": true,                // 显示方式：紧急
                "terminalDisplay": true,        // 显示方式：终端显示器
                "ttsPlay": true,                // 显示方式：终端 TTS 播读
                "screenDisplay": true,          // 显示方式：终端 TTS 播读
                "content": true                 // 文本内容
            }
             */
            const params = {
              operationTime: new Date(this.formModel.opeDate).getTime(),
              urgency: this.formModel.urgency,
              terminalDisplay: this.formModel.terminalDisplay,
              ttsPlay: this.formModel.ttsPlay,
              screenDisplay: this.formModel.screenDisplay,
              content: this.formModel.content,
            };
            this.request(this.clientId, params);
          },
        });
      });

    },
    request(clientId, params) {
      this.modal.loading = true;

      service.setTextSettingInstruction(clientId, params)
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
  }
};
</script>
<style lang="less">
  .instruction-modal_text {
    .ivu-modal-header {
      /*border-bottom: none 0;*/
    }
    .ivu-modal-footer {
      /*border-top: none 0;*/
    }
    .ivu-modal-body {
      padding: 16px;
    }
  }
</style>