<template>
  <Collapse v-model="collapseValue">
    <Panel name="1">
      状态信息
      <div slot="content">
        <Row>
          <Col span="12" class="car-info">

            <Row v-for="(row, index) in statusInfo.table" :key="index">
              <Col v-for="col in row" :span="col.span" :key="col.key">
                <span class="label">{{ col.label }}</span>
                <span class="content">{{ col.content }}{{ col.content ? col.aside : '' }}</span>
              </Col>
            </Row>

          </Col>
          <Col span="12" class="car-status">
            <template v-for="status in statusInfo.statusSet">
              <!-- 正常 -->
              <div v-if="status.isOk === 0" :key="status.id"
                   class="car-status__item car-status__item_success">
                <Icon class="status-icon" type="ios-checkmark-circle" />
                <div class="text">{{ status.text }}</div>
              </div>

              <!-- 不正常 -->
              <div v-else-if="status.isOk === 1" :key="status.id"
                   class="car-status__item car-status__item_error">
                <Icon class="status-icon" type="ios-close-circle" />
                <div class="text">{{ status.text }}</div>
              </div>

              <!-- 未知 -->
              <div v-else :key="status.id"
                   class="car-status__item car-status__item_warning">
                <Icon class="status-icon" type="md-help-circle" />
                <div class="text">{{ status.text }}</div>
              </div>
            </template>
          </Col>
        </Row>
      </div>
    </Panel>
    <Panel name="2">
      报警信息
      <div slot="content">
        <Table border
               :loading="alertInfo.loading"
               :columns="alertInfo.columns"
               :data="alertInfo.data"></Table>
        <Page style="margin: 1em 0 0 0;"
              :current="alertInfo.pager.current"
              :total="alertInfo.pager.total"
              :page-size="alertInfo.pager.pageSize"
              :page-size-opts="alertInfo.pager.pageSizeOpts"
              show-total
              show-sizer
              show-elevator
              @on-change="onPageChange"
              @on-page-size-change="onPageSizeChange"></Page>
      </div>
    </Panel>
  </Collapse>
</template>
<script>
import service from '../service';

export default {
  created() {
    this.reload();
    this.getStatusInfo();
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
      collapseValue: ['1', '2'],
      statusInfo: {
        table: [
          [
            { span: 12, label: '更新时间：', key: 'updateTime', content: null, aside: null },
          ],
          [
            { span: 12, label: '设备号：', key: 'clientId', content: null, aside: null },
            { span: 12, label: '在线状态：', key: 'onlineStatus', content: null, aside: null },
          ],
          [
            { span: 12, label: '组织机构：', key: 'deptName', content: null, aside: null },
            { span: 12, label: '行驶状态：', key: 'drivingState', content: null, aside: null },
          ],
          [
            { span: 12, label: '车牌颜色：', key: 'licensePlateColor', content: null, aside: null },
            { span: 12, label: '定位状态：', key: 'positioningStatus', content: null, aside: null },
          ],
          [
            { span: 12, label: '车辆类型：', key: 'vehicleType', content: null, aside: null },
            { span: 12, label: '今日时长：', key: 'todayTime', content: null, aside: ' h' },
          ],
          [
            { span: 12, label: '车籍地：', key: '？', content: '？', aside: null },
            { span: 12, label: '今日里程：', key: 'todayKilometers', content: null, aside: ' km' },
          ],
          [
            { span: 12, label: '最后速度：', key: 'lastSpeed', content: null, aside: ' km/h' },
            { span: 12, label: '总里程：', key: 'totalKilometers', content: null, aside: ' km' },
          ],
          [
            { span: 24, label: '最后位置：', key: 'lastPosition', content: null, aside: '' },
          ],
        ],

        statusSet: {
          accStatus: { text: 'ACC', value: null },
          leftTurnStatus: { text: '左转', isOk: null },
          rightTurnStatus: { text: '右转', isOk: null },
          highBeamStatus: { text: '远光灯', isOk: null },
          lowBeamStatus: { text: '近光灯', isOk: null },
          switchDoorStatus: { text: '开关门', isOk: null },
          oilStatus: { text: '油路', isOk: null },
          electricStatus: { text: '电路', isOk: null },
          brakeStatus: { text: '刹车', isOk: null },
        },
      },
      alertInfo: {
        loading: false,

        columns: [
          { title: '报警类型', key: 'alertType' },
          { title: '报警位置', key: 'alertPosition' },
          { title: '首次报警时间', key: 'firstAlertTime' },
          { title: '最后报警时间', key: 'lastAlertTime' },
          { title: '处理状态', key: 'handleStatus' },
          {
            title: '操作',
            key: 'ope',
            width: 60,
            align: 'center',
            render: (h, params) => {
              const { handleStatus } = params.row;

              const viewButton = h('Button', {
                props: { type: 'default', size: 'small' },
                style: { marginRight: '0' },
                on: {
                  click: () => {
                    this.viewAlert(handleStatus);
                  },
                },
              }, '查看');

              const handleButton = h('Button', {
                props: { type: 'primary', size: 'small' },
                on: {
                  click: () => {
                    this.handleAlert(handleStatus);
                  },
                },
              }, '处理');

              return h('div', [
                handleStatus === '未处理' ? handleButton : viewButton,
              ]);
            },
          },
        ],

        allData: [],
        data: [],

        pager: {
          current: 1,
          total: 0,
          pageSize: 5,
          pageSizeOpts: [5, 10, 20, 50, 100],
        },
      },
    };
  },
  methods: {
    viewAlert() {
      console.log('viewAlert()');
    },
    handleAlert() {
      console.log('handleAlert()');
    },
    getStatusInfo() {
      service.getStatusInfo(this.clientId)
        .then((result) => {
          const { code, detail } = result;

          if (code !== '0') {
            return this.$Notice.error({ desc: '获取状态信息失败！' });
          }

          const [
            {
              devNo: clientId, // 设备号
              time: updateTime, // 更新时间
              // 状态(1 行驶；2 停车；3 熄火；4 定位失败；5 通讯中断)
              sta: status,
              deptName, // 组织机构
              vehPCor: licensePlateColor, // 车牌颜色
              vehTy: vehicleType, // 车辆类型
              dayHour: todayTime, // 今日时长
              dayMile: todayKilometers, // 今日里程
              speed: lastSpeed, // 最后速度
              sumMile: totalKilometers, // 总里程
              position: lastPosition, // 最后位置
              accStatus, // ACC
            },
          ] = detail;

          let onlineStatus = '在线';
          let drivingState = '';
          let positioningStatus = '已定位';

          switch (status) {
            case 1: {
              drivingState = '行驶';
              break;
            }
            case 2: {
              drivingState = '停车';
              break;
            }
            case 3: {
              drivingState = '熄火';
              break;
            }
            case 4: {
              drivingState = '定位失败';
              positioningStatus = '定位失败';
              break;
            }
            case 5: {
              drivingState = '通讯中断';
              onlineStatus = '不在线';
              break;
            }
            default: {
              console.error('未知状态', status);
            }
          }

          const data = {
            clientId,
            onlineStatus,
            drivingState,
            updateTime,
            status,
            positioningStatus,
            deptName,
            licensePlateColor,
            vehicleType,
            todayTime: (todayTime / 3600).toFixed(2),
            todayKilometers,
            lastSpeed,
            totalKilometers,
            lastPosition,
          };

          this.statusInfo.table.forEach((rows) => {
            rows.forEach((col) => {
              if (col.key in data) {
                col.content = data[col.key];
              } else {
                console.error('未进行匹配的字段', JSON.stringify(col));
              }
            });
          });

          this.statusInfo.statusSet.accStatus.isOk = accStatus;

          return null;
        });
    },
    getAlertData() {
      return service.getAlertTableData(this.clientId)
        .then((result) => {
          const { code, detail } = result;

          if (code !== '0') {
            this.$Notice.error({ desc: '获取报警信息数据失败！' });
            return;
          }

          this.alertInfo.allData = detail;
        });
    },

    getAlertTableData(pageNum) {
      const { pageSize } = this.alertInfo.pager;
      const start = (pageNum - 1) * pageSize;
      const end = pageNum * pageSize;

      if (this.alertInfo.allData.length === 0) {
        return this.getAlertData().then(() => this.alertInfo.allData.slice(start, end));
      } else {
        return Promise.resolve(this.alertInfo.allData.slice(start, end));
      }
    },

    reload(pageNum = 1) {
      this.alertInfo.loading = true;

      this.getAlertTableData(pageNum)
        .then((data) => {
          this.alertInfo.loading = false;
          this.alertInfo.data = data;
          this.alertInfo.pager.current = pageNum;
          this.alertInfo.pager.total = this.alertInfo.allData.length;
        });
    },

    onPageChange(pageNum) {
      this.reload(pageNum);
    },
    onPageSizeChange(pageSize) {
      this.alertInfo.pager.pageSize = pageSize;
      this.reload();
    },
  },
};
</script>
<style scoped lang="less">
  .color_aside {
    &,
    .label,
    .content {
      color: #888;
    }
  }
  .car-info {
    line-height: 2;
  }
  .label {
    display: inline-block;
    min-width: 70px;
    text-align: right;
    color: #555;
  }
  .content {
    color: #333;
  }

  .car-status {
    min-height: 200px;
    overflow: hidden;
    border: 1px solid #abdcff;
    background-color: #f0faff;
  }
  .car-status__item {
    float: left;
    margin: 8px 0;
    width: 90px;
    text-align: center;

    .status-icon {
      font-size: 32px;
    }
  }

  .car-status__item_success {
    .status-icon {
      color: #19be6b;
    }
  }

  .car-status__item_error {
    .status-icon {
      color: #ed4014;
    }
  }

  .car-status__item_warning {
    .status-icon {
      color: #ff9900;
    }
  }

</style>
