<template>
  <div>
    <Modal
      class="instruction-modal instruction-modal_car-chosen"
      :value="isShow"
      title="车辆选择"
      width="90%"
      draggable
      @on-ok="handleModalConfirm"
      @on-cancel="handleModalCancel"
      @on-visible-change="handleModalVisibleChange">

      <Row type="flex" class="equal-height-cols">
        <Col span="11">
          <div class="panel">
            <div class="panel__heading">可选择车辆</div>
            <div class="panel__body">

              <VehicleTree ref="vehicleTree"></VehicleTree>

            </div>
            <div class="panel__footer">共计 {{ tree.totalVehicle }} 条</div>
          </div>
        </Col>
        
        <Col span="2" style="text-align: center;">
          <Button type="success" size="large" @click="addVehicleToTable" style="margin-top: 240px;">添加 > </Button>
          <Button type="error" size="large" @click="removeVehicleFromTable" ghost style="margin-top: 20px;">撤销 < </Button>
        </Col>

        <Col span="11">
          <div class="panel">
            <div class="panel__heading">已选择车辆</div>
            <div class="panel__body">
              <div class="search-group">
                <Input v-model="table.searchKeyword"
                       placeholder="请输入内容" style="width: auto">
                  <Icon type="ios-search" slot="prefix" />
                </Input>
                <Button @click="searchVehicleInTable()">搜索</Button>
              </div>
              <Table border ref="table"
                     :height="table.height"
                     :columns="table.columns"
                     :data="table.filterPageData"
                     @on-selection-change="handleTableSelectRow"></Table>
            </div>
            <div class="panel__footer">
              <!--共计 {{ table.filterData.length }} 条-->
              <Page show-total
                    size="small"
                    :total="table.pager.total"
                    :current="table.pager.current"
                    :page-size="table.pager.pageSize"
                    :page-size-opts="table.pager.pageSizeOpts"
                    @on-change="handlePageChange" />
            </div>
          </div>
        </Col>
      </Row>

    </Modal>


  </div>
</template>
<script>
import Util from '../../../../libs/util';
import VehicleTree from './component/VehicleTree.vue';

const api = '/monitor/orderissue/callNames';
// const api = 'http://192.168.1.201:38009/jt808web/monitor/orderissue/callNames';
const addressApi = '/table/map/getRegeo';

export default {
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
    deselectedVehicleList: {
      type: Array,
      required: true,
    },
  },
  components: {
    VehicleTree,
  },
  data() {
    return {
      tree: {
        totalVehicle: 0,
      },
      table: {
        height: 450,
        searchKeyword: '',
        columns: [
          // { type: 'index', width: 48, align: 'center' },
          { type: 'selection', width: 48, align: 'center' },
          { title: '车牌号', key: 'text' },
          { title: '组织机构', key: 'deptName' },
          { title: '设备号', key: 'devNo' },
        ],
        data: [],
        filterData: [],
        filterPageData: [],
        selectedTableRows: [],
        pager: {
          current: 1,
          total: 0,
          pageSize: 50,
          pageSizeOpts: [50, 100, 200, 500],
        },
      },
    };
  },
  methods: {
    handleModalVisibleChange(value) {
      // 显示
      if (value) {
        // 初始化数据
        const nodeIds = this.deselectedVehicleList.map(item => item.id);
        this.$refs.vehicleTree.setCheckedNodes(nodeIds, false);
        this.addVehicleToTable();

        return;
      }

      // 关闭（隐藏）
      const deselectedVehicleList = this.table.data.map((item) => {
        const { id, devNo, text, deptName } = item;
        return { id, devNo, text, deptName };
      });

      this.$emit('closed', deselectedVehicleList);
    },
    handleModalConfirm() {
      console.log('handleModalConfirm()');
    },
    handleModalCancel() {
      console.log('onCancel()');
    },

    handleVehicleTreeCreated() {
      this.tree.totalVehicle = this.$refs.vehicleTree.getLeafCount();
      console.log(this.tree.totalVehicle);
    },

    searchVehicleInTable(pageNum = 1) {
      this.table.filterData = this.table.data.filter((item) => {
        const { text, deptName, devNo } = item;

        return `${text} ${deptName} ${devNo}`.includes(this.table.searchKeyword);
      });

      const { pageSize } = this.table.pager;

      const start = (pageNum - 1) * pageSize;
      const end = pageNum * pageSize;

      this.table.pager.total = this.table.filterData.length;
      this.table.pager.current = pageNum;

      this.table.filterPageData = this.table.filterData.slice(start, end);
    },

    addVehicleToTable() {
      this.table.data = [];
      this.$refs.vehicleTree.getCheckedNodes().forEach((node) => {
        if (node.isLeaf) {
          this.table.data.push({ ...node });
        }
      });
      this.searchVehicleInTable();
    },
    removeVehicleFromTable() {
      const { selectedTableRows } = this.table;

      if (selectedTableRows.length === 0) {
        this.$Notice.warning({ desc: '请选择要撤销的车辆！' });
        return;
      }

      const removeItemById = (list, id) => {
        list.some((item, index) => {
          if (item.id === id) {
            list.splice(index, 1);
            return true;
          }

          return false;
        });
      };

      const nodeIds = selectedTableRows.map((tbItem) => {
        const { id } = tbItem;

        removeItemById(this.table.filterPageData, id);
        removeItemById(this.table.filterData, id);
        removeItemById(this.table.data, id);

        return tbItem.id;
      });

      this.$refs.vehicleTree.setCheckedNodes(nodeIds, false);

      if (this.table.filterPageData.length === 0) {
        this.searchVehicleInTable();
      }
    },


    handlePageChange(current) {
      this.table.pager.current = current;
      this.searchVehicleInTable(current);
    },
    handleTableSelectRow(selectedTableRows, row) {
      console.log(selectedTableRows);
      this.table.selectedTableRows = selectedTableRows;
    },
  },
};
</script>
<style scoped lang="less">
  .panel {
    margin: 16px;
    border: solid 1px #ccc;
    border-radius: 6px;
  }
  .panel__heading {
    padding: 0 1em;
    line-height: 40px;
    border-bottom: solid 1px #ccc;
  }
  .panel__body {
    height: 500px;
    overflow: auto;
    padding: 0 1px;
  }
  .panel__footer {
    padding: 1em;
    border-top: solid 1px #ccc;
  }

  .search-group {
    padding: 0.5em;
  }
</style>
<style lang="less">
  .instruction-modal_car-chosen {


  }
</style>
