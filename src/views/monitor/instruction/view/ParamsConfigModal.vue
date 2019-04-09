<template>
  <div>
    <Modal
      class="instruction-modal instruction-modal_params"
      v-model="modal.isShow"
      :title="modal.title"
      draggable
      width="94%">
      <Row type="flex" class="equal-height-cols">
        <Col span="6">
          <div class="panel params-list">
            <div class="panel__title">
              指令列表
            </div>
            <div class="panel__body">
              <Tree :data="treeData" @on-select-change="handleSelectChange"></Tree>
            </div>
          </div>
        </Col>
        <Col span="6">
          <div class="panel params-input">
            <div class="panel__title">
              指令参数
            </div>
            <div class="panel__body">
              <Form ref="paramForm" :model="paramFormModel">

                <!--其他指令-->
                <template v-if="param.id === '其他指令'">
                  <FormItem>
                    <div class="input-group">
                      <label class="input-group__label">指令类型</label>
                      <Input type="text" v-model="paramFormModel.id" />
                    </div>
                  </FormItem>
                  <FormItem>
                    <div class="input-group">
                      <label class="input-group__label">指令内容</label>
                      <Input type="textarea" v-model="paramFormModel.value" />
                    </div>
                  </FormItem>
                </template>

                <!--参数查询-->
                <template v-else-if="param.id === '参数查询'">
                  查看以下参数：
                  <Tag type="dot">终端心跳间隔</Tag>
                  <Tag type="dot">主服务器地址，IP或域名</Tag>
                  <Tag type="dot">服务器TCP端口</Tag>
                  <Tag type="dot">最高速度</Tag>
                  <Tag type="dot">超速持续时间</Tag>
                  <Tag type="dot">连续驾驶时间门限</Tag>
                  <Tag type="dot">当天累计驾驶时间门限</Tag>
                  <Tag type="dot">最小休息时间</Tag>
                  <Tag type="dot">最长停车时间</Tag>
                </template>

                <!-- 常规指令 -->
                <template v-else>
                  <FormItem>
                    <div class="input-group">
                      <label class="input-group__label">{{ param.title }}</label>
                      <Input type="text" v-model="paramFormModel.value" />
                      <span class="input-group__unit">{{ param.unit }}</span>
                    </div>
                    <p class="param-tips">{{ param.tips }}</p>
                  </FormItem>
                </template>

              </Form>

            </div>
          </div>
        </Col>
        <Col span="12">
          <div class="panel params-vehicle">
            <div class="panel__title">
              车辆选择
            </div>
            <div class="panel__body">
              <div class="table-search">
                <div class="search-group">
                  车牌号
                  <Input v-model="table.searchKeyword"
                         placeholder="请输入内容" style="width: auto">
                    <Icon type="ios-search" slot="prefix" />
                  </Input>
                  <Button @click="searchVehicle">查询</Button>
                </div>
                <div class="fn-group">
                  <Button type="success" @click.stop="addVehicle">添加</Button>
                  <Button type="error" @click="deleteVehicle" style="margin-left: 0.5em;">删除</Button>
                </div>
              </div>
              <Table border ref="table"
                     :height="table.height"
                     :columns="table.columns"
                     :data="table.filterData"></Table>
              <p class="table-pager">共计 {{ table.data.length }} 条</p>
            </div>
          </div>
        </Col>
      </Row>

      <div slot="footer">
        <Button type="text"  size="large"  @click="handleModalCancel">取消</Button>
        <Button type="primary"  size="large" :loading="modal.loading" @click.stop="handleModalConfirm">下发</Button>
      </div>
    </Modal>
    <!--
    -->
    <CarChosen :isShow="isShowCarChosen"
               :deselectedVehicleList="table.deselectedVehicleList"
               @closed="finishChooseVehicle"></CarChosen>

  </div>
</template>
<script>
import CarChosen from './CarChosenModal.vue';
import service from '../service';

let prevLeafNode = null;

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CarChosen,
  },
  data() {
    const validators = {
      hasValue(value) {
        return !(value === null || value === undefined || value === '');
      },
      required(rule, value, callback) {
        if (validators.hasValue(value)) {
          return callback(new Error('必填项！'));
        }
        return callback();
      },
      positiveInteger(rule, value, callback) {
        if (validators.hasValue(value)) {
          callback(new Error('必填项！'));
          return;
        }

        const fmtValue = Number(value);

        if (!Number.isInteger(fmtValue) || fmtValue < 0) {
          callback(new Error('请输入正整数！'));
          return;
        }

        callback();
      },
    };

    return {
      isShowCarChosen: false,
      modal: {
        isShow: this.isShow,
        width: 600,
        title: '参数设置',
        loading: false,
      },
      param: {
        id: null,
        title: '',
        unit: '',
        tips: '',
      },
      paramFormModel: {
        id: null,
        value: null,
      },
      treeData: [
        {
          id: '1',
          title: '网络配置',
          expand: true,
          children: [
            {
              id: '0x0001', title: '终端心跳间隔', unit: 's', tips: '', rules: { validator: validators.positiveInteger },
            },
            {
              id: '0x0010', title: '主服务器APN', unit: '', tips: '',
            },
            { id: '0x0013', title: '主服务器地址，IP或域名' },
            { id: '0x0018', title: '服务器TCP端口' },
          ],
        },
        {
          id: '2',
          title: '车辆信息',
          expand: true,
          children: [
            { id: '0x0080', title: '车辆里程表读数', unit: '1/10km' },
            { id: '0x0081', title: '车辆所在省域ID', tips: '（范围：1-255）' },
            { id: '0x0082', title: '车辆所在市域ID', tips: '（范围：1-255）' },
            { id: '0x0083', title: '车辆机动车号码' },
            { id: '0x0084', title: '车牌颜色', tips: '（值：1蓝 2黄 3黑 4白 9其他）' },
          ],
        },
        {
          id: '3',
          title: '行驶参数',
          expand: true,
          children: [
            {
              id: '0x0055', title: '最高速度', unit: 'km/h', tips: '（范围：0-255）',
            },
            { id: '0x0056', title: '超速持续时间', unit: 's' },
            { id: '0x0057', title: '连续驾驶时间门限', unit: 's' },
            { id: '0x0058', title: '当天累计驾驶时间门限', unit: 's' },
            { id: '0x0059', title: '最小休息时间', unit: 's' },
            { id: '0x005A', title: '最长停车时间', unit: 's' },
          ],
        },
        {
          id: '4',
          title: '更多指令',
          expand: true,
          children: [
            { id: '参数查询', title: '参数查询' },
            { id: '其他指令', title: '其他指令' },
          ],
        },
      ],
      table: {
        height: 500,
        searchKeyword: '',
        columns: [
          { type: 'index', width: 48, align: 'center' },
          { type: 'selection', width: 48, align: 'center' },
          { title: '车牌号', key: 'text' },
          { title: '组织机构', key: 'deptName' },
          { title: '设备号', key: 'devNo' },
        ],
        filterData: [],
        data: [],
        deselectedVehicleList: [],
      },
    };
  },
  methods: {
    handleSelectChange(selectedList, currentItem) {
      const { selected, children } = currentItem;

      // 如果不是叶子节点，取消去选中状态且让前一个叶子节点被选中。
      if (Array.isArray(children) && children.length > 0) {
        currentItem.selected = false;
        if (prevLeafNode) {
          prevLeafNode.selected = true;
        }
        return;
      }

      prevLeafNode = currentItem;

      this.param = { ...currentItem };
      this.paramFormModel = {
        id: null,
        value: null,
      };
    },
    handleModalCancel() {
      this.modal.isShow = false;
    },
    handleModalConfirm() {
      const { value } = this.paramFormModel;


      if (!prevLeafNode) {
        this.$Notice.warning({ desc: '请在“指令列表”中选择指令！' });
        return;
      }

      if (value === null || value === '') {
        this.$Notice.warning({ desc: '请在“指令参数”中请输入指令内容！' });
        return;
      }

      if (this.table.data.length === 0) {
        this.$Notice.warning({ desc: '请在“车辆选择”中添加车辆！' });
        return;
      }

      this.$Modal.confirm({
        title: `确认下发指令到 ${this.table.data.length} 辆车？`,
        onOk: () => {
          this.request();
        },
      });
    },
    request() {
      this.modal.loading = true;

      const { value } = this.paramFormModel;
      let { id } = this.param;
      const clientIds = this.table.data.map(item => item.id);

      switch (id) {
        case '参数查询': {
          id = 'query params';
          break;
        }
        case '其他指令': {
          ({ id } = this.paramFormModel);
          break;
        }
        default: {
          // do nothing
        }
      }

      const params = {
        clientIds,
        paramItem: { id, value },
      };

      service.setParamsConfigInstruction(params)
        .then(function (res) {
          const { code, detail, msg } = res.data;

          if (code === '0') {
            this.$Notice.error({ desc: '下发失败！' });
            return;
          }

          this.$Notice.success({ desc: '下发成功！' });
        })
        .catch(() => {
          this.$Notice.error({ desc: '下发失败！' });
        })
        .finally(() => { this.modal.loading = false; });
    },

    searchVehicle() {
      if (this.table.data.length === 0) {
        this.$Notice.warning({ desc: '请先添加的车辆！' });
        return;
      }

      this.table.filterData = this.table.data.filter((item) => {
        const { text } = item;

        return text.includes(this.table.searchKeyword);
      });
    },

    deleteVehicle() {
      const selectedItems = this.$refs.table.getSelection();

      // console.log(this.$refs.table, selectedItems);

      if (selectedItems.length === 0) {
        return this.$Notice.warning({ desc: '请选择要删除的车辆！' });
      }

      this.table.data = this.table.data.filter((item) => {
        const { id } = item;
        let isOk = true;

        selectedItems.some((selectedItem) => {
          if (id === selectedItem.id) {
            isOk = false;
            return true;
          }
          return false;
        });

        return isOk;
      });

      this.table.deselectedVehicleList = selectedItems.map((item) => {
        const {
          id, devNo, text, deptName,
        } = item;
        return {
          id, devNo, text, deptName,
        };
      });

      return this.searchVehicle();
    },

    addVehicle() {
      this.isShowCarChosen = true;
    },
    finishChooseVehicle(data) {
      this.isShowCarChosen = false;
      this.table.data = data;
      this.searchVehicle();
    },
  },
};
</script>
<style lang="less">
  .instruction-modal_params {
    font-size: 14px;

    .params-input {
      .panel__body {
        padding: 1em;
      }
      .input-label {
        display: block;
      }
      .input-field {
        margin-top: 0.5em;
        width: 160px;
      }
      .input-aside {
        margin-left: 0.5em;
      }
    }
    .ivu-tag {
      display: block;
      margin: 1em 1em 0 1em;
    }

  }
</style>
<style scoped lang="less">
  .panel {
    height: 100%;
    border-right: solid 1px #ccc;
  }
  .panel__title {
    padding: 0 1em;
    line-height: 32px;
    background: #f2f2f2;
  }
  .input-group {
    display: flex;
    justify-content: space-between;
    .input-group__label {
      white-space: nowrap;
      margin-right: 0.2em;
    }
    .input-group__unit {
      display: block;
      margin-left: 0.2em;
    }
  }


  .param-tips {
    margin-top: 0.5em;
    text-align: right;
    color: #666;
  }

  .params-vehicle {
    .panel__body {
      // padding: 1em;
    }
  }

  .table-pager {
    margin-top: 0.5em;
    padding-left: 1em;
    font-size: 14px;
  }
  .table-search {
    display: flex;
    align-content: space-between;
    padding: 1em;

    .search-group {
      flex: 2;
    }
    .fn-group {
      flex: 1;
    }

    .fn-group {
      text-align: right;
    }
  }
</style>
