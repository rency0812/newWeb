<template>
    <Modal v-model="modalShow" :width="800" :draggable="true" :mask-closable="false" class="layou-modal-input"  :z-index="124">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>选择车辆</span>
            </p>
            <div class="layout-tree-body">
                <div class="layout-modal">
                    <div class="tree-title-box">
                        <Icon type="ios-user"></Icon>
                        可选择车辆
                    </div>
                    <div class="modal-tree-container">
                        <VJstree :data='vehicleTreeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
                                 ref="vehicleTree" :allow-batch="true"
                                 :show-checkbox="true" :multiple="true" @item-click="treeNodeClick">
                        </VJstree>
                    </div>
                </div>
                <div class="layout-modal">
                    <div class="tree-title-box">
                        <Icon type="ios-user"></Icon>
                        已选择车辆
                    </div>
                    <div class="modal-tree-container">
                        <Input type="text" v-model="searchValue" placeholder="请输入车牌号" size="small" style="width: 80%;margin: 5px 0;"/>
                        <Button size="small" @click="initGridData"> 查询 </Button>
                        <Table :columns="tableColumns"
                               ref="table"
                               :data="gridData"
                               :height="420"
                               :loading="loadingValue"
                               highlight-row
                               border stripe
                               @on-select-cancel="handleSelectionCancel"
                               @on-select-all-cancel="handleSelectionCancel"
                               @on-select-all="handleSelection"
                               @on-select="handleSelection" style="border: 1px solid #dfdfdf;">
                        </Table>
                    </div>
                </div>
            </div>

            <div slot="footer" class="layout-modal-button">
                <Button @click="handleCancel"> 取 消</Button>
                <Button type="success" icon="checkmark-round" :loading="buttonLoading" @click="handleSave"> 确 定</Button>
            </div>
        </Modal>
</template>


<script>
    //调用依赖库
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    import Util from '../../../../libs/util'
    import VJstree from 'vue-jstree'

    const GetBaseTreeUrl = require('../../../../libs/api').GetBaseTreeUrl

    export default {
        props: ['show'],

        components: {VJstree},

        data() {
            return {
                loadingValue: false,
                modalShow: false,
                buttonLoading: false,
                vehicleTreeData:[],
                tableColumns: [
                    {type: 'selection', width: 30, align: 'center'},
                    {title: '车牌号', key: 'vehNo',align:'center'},
                    {title: '组织机构', key: 'deptName',align:'center'},
                    {title: '设备号', key: 'devNo',align:'center'}
                ],
                gridData:[],
                selectedVehicles: [],
                treeId: [],
                searchValue: null
            }
        },
        methods: {
            // 请求左侧树
            initLeftTree(){
                let self = this
                Util.ojax.post(GetBaseTreeUrl, {treeName: 'departmentTree'}).then(function (res) {
                    if (res.data.code == 0) {
                        self.vehicleTreeData = res.data.detail
                    }
                })
            },

            // 只要选中项发生变化时就会触发，返回值为 selection，已选项
            handleSelection(v, row){
                this.selectedVehicles = this.selectedVehicles.concat(v)
                this.selectedVehicles = Util.uniqueArrayId(this.selectedVehicles)
            },

            // 取消勾选
            handleSelectionCancel(v,row){
                for(let i in this.selectedVehicles){
                    if(this.selectedVehicles[i].id == row.id){
                        this.selectedVehicles.splice(i, 1)
                    }
                }
            },

            // 点击按钮事件,弹出窗体
            handlePlus(e) {

            },

            // 点击树节点
            treeNodeClick(n, i) {
                let self = this
                let cIds = []
                if (i.children) {
                    cIds = Util.getTreeNodesChildren(i.children, cIds)
                }
                cIds.push(i.id)
                if(i.selected == true){
                    self.treeId = self.treeId.concat(cIds)
                }else{
                    let len = self.treeId.length
                    for(let j = len -1;j>=0;j--){
                        let value = self.treeId[j]
                        if(cIds.indexOf(value) > -1){
                            self.treeId.splice(j, 1)
                        }
                    }
                }
                self.initGridData()
            },

            // 合并去除重复
            insertArrJson(arr1, arr2){
                let len = arr1.length
                for(let j = len -1;j>=0;j--){
                    let value = arr1[j]
                    if(arr2.indexOf(value) > -1){
                        arr1.splice(j, 1)
                    }
                }
                return arr1
            },



            // 请求表格数据
            initGridData(){
                let self = this
                self.loadingValue = true
                Util.ojax.post('/table/vehicleManage/queryPage', {treeId: self.treeId,pageSize: 20, pageIndex: 1, vehNo: self.searchValue}).then(function (res) {
                    if (res.data.code == 0) {
                        self.gridData =  res.data.detail.list
                    }
                    self.loadingValue = false
                })
            },

            // 保存
            handleSave() {
                this.$emit('selectedVehicle', this.selectedVehicles)
                this.handleCancel()
            },

            // 取消
            handleCancel() {
                this.gridData = []
                this.selectedVehicles = []
                this.treeId = [],
                this.searchValue = null
                this.modalShow = false
                this.$emit('selectedVehicle', [])
            }
        },
        watch:{
            show: {
                handler(data) {
                    this.modalShow = data
                    if(data){
                        this.initLeftTree()
                    }
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>
<style>
    .tree-title-box{background: #ffffff;color: #333333;line-height: 2;padding-left: 10px;border: 1px solid #ccc;}
    .layout-modal{width:50%;padding: 5px;float: left}
    .modal-tree-container{padding: 5px 0 0 0;height: 460px;overflow: auto}
    .layout-tree-body{height:500px;}
</style>