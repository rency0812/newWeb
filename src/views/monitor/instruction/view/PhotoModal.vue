<template>
  <div>
    <Modal
      class="instruction-modal instruction-modal_photo"
      v-model="modal.isShow"
      :title="modal.title"
      :width="modal.width"
      draggable
    >

      <Form ref="formModel" :model="formModel" :rules="ruleValidate" :label-width="100" label-position="left">
        <FormItem label="操作时间" prop="opeDate">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" v-model="formModel.opeDate" />
        </FormItem>
        <FormItem label="拍照通道" prop="channelNo">
          <Select v-model="formModel.channelNo"
                  :loading="channel.loading"
                  :loading-text="channel.loadingText">
            <Option :value="-1">全部</Option>
            <Option v-for="i in channel.maxChannelNum" :value="i" :key="i">{{ i }}</Option>
          </Select>
        </FormItem>
        <FormItem label="拍照张数" prop="photoNum">
          <Select v-model="formModel.photoNum">
            <Option v-for="i in 10" :value="i" :key="i">{{ i }}</Option>
          </Select>
        </FormItem>
        <FormItem label="拍照间隔（s）" prop="interval">
          <Input v-model="formModel.interval" />
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
  created() {
    this.getMaxChannelNum();
  },
  data() {
    return {
      modal: {
        isShow: this.isShow,
        width: 400,
        title: `${this.plateNum}-拍照`,
        loading: false,
      },
      formModel: {
        opeDate: new Date(),
        channelNo: null,
        photoNum: null,
        interval: null,
      },
      channel: {
        maxChannelNum: 0,
        loading: true,
        loadingText: '正在加载通道数',
      },
      ruleValidate: {
        opeDate: [
          {
            type: 'date', required: true, message: '请选择操作时间', trigger: 'change',
          },
        ],
        photoNum: [
          {
            type: 'number', required: true, message: '请选择拍照张数', trigger: 'change',
          },
        ],
        channelNo: [
          {
            type: 'number', required: true, message: '请选择拍照通道', trigger: 'change',
          },
        ],
        interval: [
          {
            type: 'string', required: true, message: '请输入拍照间隔秒数', trigger: 'change',
          },
          {
            type: 'string',
            validator(rule, value, callback) {
              if (!(/^[1-9][0-9]*/.test(value))) {
                return callback(new Error('请输入大于 0 的整数'));
              }
              if (value > 65535) {
                return callback(new Error('请输入小于 65535 的整数'));
              }

              return callback();
            },
            trigger: 'change',
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
          "channelId": 1,                 // 拍照通道。“-1” 为全部
          "cmd": 2,                       // 拍照张数。单位：个。
          "time": 22,                     // 拍照间隔。单位：秒。
      }
       */
      const params = {
        operationTime: new Date(this.formModel.opeDate).getTime(),
        channelId: this.formModel.channelNo,
        cmd: this.formModel.photoNum,
        time: this.formModel.interval,
      };

      service.setTakePhotoInstruction(this.clientId, params)
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
    getMaxChannelNum() {
      service.getMaxChannelNum(this.clientId)
        .then((res) => {
          const { code, detail, msg } = res.data;

          if (code !== '0') {
            this.$Notice.error({ desc: '获取最大通道数失败！' });
            return;
          }

          const { total, list } = detail;

          if (total === 0) {
            this.$Notice.error({ desc: '获取最大通道数失败！' });
            return;
          }

          const [
            { channelNum },
          ] = list;

          this.channel.loading = false;
          this.channel.maxChannelNum = channelNum;
        })
        .catch((e) => {
          console.warn(e);
          this.$Notice.error({ desc: '获取最大通道数失败！' });
        })
        .finally(() => { this.modal.loading = false; });
    },
  },
};
</script>
<style lang="less">
  .instruction-modal_photo {
    .ivu-modal-body {
      padding: 16px;
    }
  }
</style>
