<template>
    <Collapse v-model="collapseValue">
      <Panel name="1">
        基本信息
        <div slot="content">

          <Row v-for="(row, index) in baseTable" :key="index">
            <Col v-for="col in row" :span="col.span" :key="col.key">
              <span class="label">{{ col.label }}</span>
              <span class="content">{{ col.content }}</span>
            </Col>
          </Row>

        </div>
      </Panel>

      <Panel name="2">
        其他信息
        <div slot="content">

          <Row v-for="(row, index) in otherTable" :key="index">
            <Col v-for="col in row" :span="col.span" :key="col.key">
              <span class="label">{{ col.label }}</span>
              <span class="content">{{ col.content }}</span>
            </Col>
          </Row>

        </div>
      </Panel>
    </Collapse>
</template>
<script>
import service from '../service';

export default {
  created() {
    this.getData();
  },
  props: {
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
      collapseValue: ['1'],
      baseTable: [
        [
          { span: 12, label: '车牌号', key: 'vehNo', content: null },
          { span: 12, label: '联系电话', key: 'contactPhone', content: null },
        ],
        [
          { span: 12, label: '组织机构', key: 'deptName', dicName: '', content: null },
          { span: 12, label: '发动机号', key: 'engineNo', content: null },
        ],
        [
          { span: 12, label: '车牌颜色', key: 'licensePlateColor', content: null },
          { span: 12, label: '行驶证号', key: 'license', content: null },
        ],
        [
          { span: 12, label: '使用状态', key: 'useState', content: null },
          { span: 12, label: '监管类型', key: 'superviseType', content: null },
        ],
        [
          { span: 12, label: '车辆类型', key: 'vehicleType', content: null },
          { span: 12, label: '创建人', key: 'createUserId', content: null },
        ],
        [
          { span: 12, label: '车辆用途', key: 'transportBusiness', content: null },
          { span: 12, label: '创建时间', key: 'createTime', content: null },
        ],
        [
          { span: 12, label: '车辆品牌', key: 'deviceBrand', content: null },
          { span: 12, label: '修改人', key: 'modifyUserId', content: null },
        ],
        [
          { span: 12, label: '车辆颜色', key: 'vehicleColor', content: null },
          { span: 12, label: '修改时间', key: 'modifyTime', content: null },
        ],
        [
          { span: 12, label: '联系人', key: 'contact', content: null },
        ],
      ],
      otherTable: [
        [
          { span: 12, label: '安装日期', key: 'installTime', content: null },
          { span: 12, label: '车辆出厂日期', key: 'vehicleManuDate', content: null },
        ],
        [
          { span: 12, label: '车辆等级', key: 'vehicleLevel', content: null },
          { span: 12, label: '车辆购买日期', key: 'vehiclePurchaseDate', content: null },
        ],
        [
          { span: 12, label: '核定载人数', key: 'loadNum', content: null },
          { span: 12, label: '年检日期', key: 'checkDate', content: null },
        ],
        [
          { span: 12, label: '核定载重(吨)', key: 'tonnage', content: null },
          { span: 12, label: '车籍地', key: 'vehicleSite', content: null },
        ],
        [
          { span: 12, label: '注册平台', key: '?', content: '?' },
        ],
      ],
    };
  },
  methods: {
    getData() {
      service.getCarInfo(this.clientId)
        .then((result) => {
          const { code, detail } = result;

          if (code !== '0') {
            return this.$Notice.error({ desc: '获取车辆信息失败！' });
          }

          // 使用分页接口获取单条详情数据
          const { list: [data], total } = detail;

          if (total === 0) {
            return this.$Notice.error({ desc: '使用分页接口获取单条详情数据 失败！' });
          }

          [...this.baseTable, ...this.otherTable].forEach((rows) => {
            rows.forEach((col) => {
              if (col.key in data) {
                col.content = data[col.key];
              } else {
                console.error('未进行匹配的字段', JSON.stringify(col));
              }
            });
          });

          return null;
        });
    },
  },
};
</script>
<style scoped lang="less">
  .label {
    display: inline-block;
    padding: 0.25em 0.5em;
    min-width: 100px;
    text-align: right;
    color: #666;
  }
  .content {
    color: #333;
  }
</style>
