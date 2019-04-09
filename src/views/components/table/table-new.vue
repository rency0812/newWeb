<template>
    <div>
        <Table :columns="tableColumns" ref="table" :data="gridData" :height="tableHeight" :loading="loadingValue"
               @on-selection-change="selectIds"
               highlight-row
               border stripe @on-select="handleSelection">

            <template slot-scope="{ row, index }" slot="sex">
                <span v-if="row.sex == 0">男</span>
                <span v-else>女</span>
            </template>
            <template slot-scope="{ row, index }" slot="enable">
                <span v-if="row.enable == true">启用</span>
                <span v-else>禁用</span>
            </template>

            <template slot-scope="{ row, index }" slot="action">

                <!--通过searchBtn的配置，传入相应的api地址和渲染相应的功能权限-->
                <span v-for="item in gridBtnData" :key="item.id" style="float: left; margin: 0 3px;">
                    <!--编辑菜单按钮-->
                    <updateMenu :api="item.api" :rowData="row" :rowIndex="index"
                                @updateTable="updateTable" v-if="item.name.indexOf('updateMenu')>-1"/>
                    <!--删除菜单按钮-->
                    <deleteMenu name="删除" :api="item.api" :rowData="row.id"
                                @updateTable="updateTable" v-if="item.name.indexOf('deleteMenu')>-1"/>

                    <!--编辑部门按钮-->
                    <update-department :api="item.api" :rowData="row" :rowIndex="index" @updateTable="updateTable" v-if="item.name.indexOf('updateDepartment')>-1"></update-department>
                    <!--查看部门按钮-->
                    <query-department :api="item.api" :rowData="row" :rowIndex="index" v-if="item.name.indexOf('queryOneDepartment')>-1"></query-department>

                    <!--编辑设备类型按钮-->
                    <update-device-type :api="item.api" :rowData="row" :rowIndex="index" @updateTable="updateTable" v-if="item.name.indexOf('updateDeviceType')>-1"></update-device-type>
                    <!--删除设备类型按钮-->
                    <!--<delete-device-type :api="item.api" :rowData="row" :rowIndex="index" v-if="item.name.indexOf('updateDeviceType')>-1"></delete-device-type>-->
                    <!--查看设备类型按钮-->
                    <view-device-type :api="item.api" :rowData="row" :rowIndex="index" v-if="item.name.indexOf('viewDeviceType')>-1"></view-device-type>

                    <!--编辑驾驶员信息-->
                    <update-driver :api="item.api" :rowData="row" :rowIndex="index" @updateTable="updateTable" v-if="item.name.indexOf('updateDriver')>-1"></update-driver>
                    <!--查看驾驶员信息-->
                    <view-driver :api="item.api" :rowData="row" :rowIndex="index" v-if="item.name.indexOf('viewDriver')>-1"></view-driver>

                    <!--编辑设备信息-->
                    <update-device :api="item.api" :rowData="row" :rowIndex="index" @updateTable="updateTable" v-if="item.name == 'updateDevice'"></update-device>
                    <!--查看设备信息-->
                    <view-device :api="item.api" :rowData="row" :rowIndex="index" v-if="item.name == 'viewDevice'"></view-device>

                    <!--编辑车辆信息-->
                    <update-vehicle :api="item.api" :rowData="row" :rowIndex="index" @updateTable="updateTable" v-if="item.name == 'updateVehicle'"></update-vehicle>
                    <!--查看车辆信息-->
                    <view-vehicle :api="item.api" :rowData="row" :rowIndex="index" v-if="item.name == 'viewVehicle'"></view-vehicle>
                    <!--绑定设备-->
                    <bind-device :api="item.api" :rowData="row" :rowIndex="index" @updateTable="updateTable" v-if="item.name == 'bindDevice' && row.devNo == ''"></bind-device>
                    <!--解绑设备-->
                    <un-bind-device :api="item.api" :rowData="row" :rowIndex="index" @updateTable="updateTable" v-if="item.name == 'unbindDevice' && row.devNo != ''"></un-bind-device>

                    <!--编辑sim信息-->
                    <update-sim :api="item.api" :rowData="row" :rowIndex="index" @updateTable="updateTable" v-if="item.name == 'updateSim'"></update-sim>
                    <!--查看sim信息-->
                    <view-sim :api="item.api" :rowData="row" :rowIndex="index" v-if="item.name == 'viewSim'"></view-sim>

                    <!--编辑数据字典类型-->
                    <update-data-dictionary :api="item.api" :rowData="row" :rowIndex="index" @updateTable="updateTable" v-if="item.name == 'updateDataDiction'"></update-data-dictionary>

                    <!--回复信息-->
                    <reply-message :api="item.api" :rowData="row" v-if="item.name == 'replyMessage'" @handleSearch="updateTable"></reply-message>
                    <!--查看信息-->
                    <view-message :api="item.api" :rowData="row" v-if="item.name == 'viewMessage'"></view-message>
                    <!--查看报警详情-->
                    <view-alarm-detail :api="item.api" :rowData="row" v-if="item.name == 'solveCheck' && row.solved"></view-alarm-detail>
               </span>
            </template>
        </Table>

        <Page :current="tablePage.pageNum"
              :total="tablePage.total"
              :page-size="tablePage.size" size="small" show-elevator show-sizer show-total
              class="table-page" @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange"/>

        <Spin size="large" fix v-if="spinShow">
            <Icon type="ios-loading" size=18 class="componet-loading"></Icon>
            <div>Loading</div>
        </Spin>


        <!--前期用来页面刷新渲染用  后期再找一个好点的方法-->
        <div style="display: none">{{initColumns}}</div>
    </div>
</template>
<script>
    //调用vuex状态管理
    import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
    // 弹窗类
    import updateMenu from './modal/update-menu'        // 编辑菜单
    import deleteMenu from './modal/delete-menu'        // 删除菜单
    import updateDepartment from './modal/update-department'        // 编辑部门
    import queryDepartment from './modal/query-department'        // 查看部门
    import updateDeviceType from './modal/update-device-type'        // 编辑设备类型
    import deleteDeviceType from './modal/delete-device-type'
    import viewDeviceType from "./modal/view-device-type";        // 查看设备类型
    import updateDriver from "./modal/update-driver";        // 编辑驾驶员
    import viewDriver from "./modal/view-driver";        // 查看驾驶员
    import viewDevice from "./modal/view-device";        // 查看设备
    import updateDevice from "./modal/update-device";        // 编辑设备
    import viewVehicle from "./modal/view-vehicle";        // 查看车辆信息
    import updateVehicle from "./modal/update-vehicle";        // 编辑车辆信息
    import viewSim from "./modal/view-sim";        // 查看sim
    import updateSim from "./modal/update-sim";        // 编辑sim
    import updateDataDictionary from "./modal/update-data-dictionary";        // 编辑数据字典
    import bindDevice from "./modal/bind-device";        // 绑定设备
    import unBindDevice from "./modal/unbind-device";        // 解绑设备
    import replyMessage from './modal/reply-message'        // 回复信息
    import viewMessage from './modal/view-message'        // 查看信息
    import viewAlarmDetail from './modal/view-alarm-detail'        // 查看报警详情
    export default {
        components: {
            // 弹窗类
            updateMenu, //编辑菜单
            deleteMenu,   // 删除菜单
            updateDepartment, //编辑部门
            queryDepartment,  //查看部门
            updateDeviceType, //编辑设备类型
            // deleteDeviceType, // 删除设备类型
            viewDeviceType, // 查看设备类型
            updateDriver, //编辑驾驶员
            viewDriver, //查看驾驶员
            viewDevice, //查看设备
            updateDevice, //编辑设备
            viewVehicle, //查看车辆信息
            updateVehicle, //编辑车辆信息
            viewSim, //查看sim
            updateSim, //编辑sim
            updateDataDictionary, //编辑数据字典
            bindDevice, //绑定设备
            unBindDevice, //解绑设备
            replyMessage, //回复信息
            viewMessage, //查看信息
            viewAlarmDetail, //查看报警详情
        },
        data() {
            return {
                tableColumns: [],
                gridFinalData: [],
                spinShow: false,
                tablePage: {
                    pageNum: 0,
                    total: 0,
                    size: 20
                }
            }
        },
        // mounted() {
        //     this.$nextTick(function(){
        //         if (this.menuId == 218 && !this.searchParmas.alarmTime) {
        //             this.searchModel.alarmTime = Util.getLastDay(-7) + ' | ' + Util.getTodayDate()
        //             this.queryGridData({menuId: this.menuId, pamars: this.searchParmas, queryApi: '/table/alarmDetail/queryPage'})
        //         }
        //     })
        // },
        methods: {
            // 点击表格前面的checkbox操作事件
            handleSelection(e) {
                let ids = []
                for (var i in e) {
                    ids.push(e[i].id)
                }
                console.log(ids)
                this.deleteGridData({ids: ids})
            },
            //用来刷新表格数据
            updateTable() {
                const self = this
                self.queryGridData({menuId: self.menuId, pamars: {}, queryApi: self.queryApi})
            },
            // 点击页码改变
            handlePageChange(v){
                const self = this
                self.searchParmas.pageIndex = v
                self.queryGridData({menuId: self.menuId, pamars: self.searchParmas, queryApi: self.queryApi})
            },
            // 每页条数改变
            handlePageSizeChange(v){
                const self = this
                self.searchParmas.pageSize = v
                self.queryGridData({menuId: self.menuId, pamars: self.searchParmas, queryApi: self.queryApi})
            },

            //表格多选
            selectIds(data) {
                console.log(data)
                let ids = []
                const self = this
                for (var i in data) {
                    ids.push(data[i].id)
                }
                ids = ids.join(',')
                self.$emit('updateDeleteModel', ids)
            },

            ...mapMutations('tableState', [
                'queryGridData',  //查询表格方法
                'deleteGridData'  // 批量删除方法
            ]),
            gridPage() {
                let self = this
                let tableData = self.tableData
                for (var i in tableData) {
                    let tableDatum = tableData[i];
                    if (tableDatum.menuId == self.menuId) {
                        let pageInfo = tableDatum.pageInfo;
                        self.tablePage.pageNum = tableData[i].pageInfo.pageNum
                        self.tablePage.total = tableData[i].pageInfo.total
                        self.tablePage.size = tableData[i].pageInfo.pageSize
                        return pageInfo
                    } else {
                        return false
                    }
                }
            },
        },
        computed: {
            menuId() {
                return this.$route.meta.menuId
            },
            queryApi() {
                let self = this
                let pageCfg = self.pageCfg
                let queryApi
                for (var i in pageCfg) {
                    if (pageCfg[i].menuId == self.menuId) {
                        queryApi = pageCfg[i].queryApi
                    }
                }
                return queryApi
            },
            initColumns() {
                let self = this
                let columns = self.gridCfg
                if (columns) {
                    for (var i in columns) {
                        if (columns[i].slot == 'action') {
                            columns.slice(i, 1)
                        }
                    }
                } else {
                    columns = []
                }
                self.tableColumns = columns
                // 添加多选checkbox
                if (self.tableColumns.length > 0) {
                    let selection = {
                        type: 'selection',
                        width: 30,
                        align: 'center'
                    }
                    self.tableColumns.unshift(selection)

                }
                self.queryGridData({menuId: self.menuId, pamars: {}, queryApi: self.queryApi})
                return columns
            },
            gridBtnCfg() {
                let self = this
                let gridBtnData = self.gridBtnData
                let gridBtnCfg = new Array()
                for (var i in gridBtnData) {
                    gridBtnCfg.push(gridBtnData[i].name)
                }
                return gridBtnCfg
            },
            gridBtnData() {
                let pageCfg = this.pageCfg
                for (var i in pageCfg) {
                    if (pageCfg[i].menuId == this.menuId) {
                        return pageCfg[i].cfg.gridButton
                    } else {
                        return false
                    }
                }
            },
            gridData() {
                let self = this
                let tableData = self.tableData
                for (var i in tableData) {
                    if (tableData[i].menuId == self.menuId) {
                        console.log(tableData[i])
                        self.gridPage();
                        return tableData[i].data
                    }
                }
            },
            gridCfg() {
                let self = this
                let pageCfg = self.pageCfg
                for (var i in pageCfg) {
                    if (pageCfg[i].menuId == self.menuId) {
                        let col = [].concat(pageCfg[i].cfg.grid)
                        if(pageCfg[i].cfg.gridButton.length>0){
                            col = col.concat([{
                                title: '操作',
                                fixed: 'right',
                                minWidth: 60,
                                align: 'center',
                                slot: 'action'
                            }])
                        }
                        return col
                    } else {
                        return false
                    }
                }
            },
            ...mapGetters('tableState', [
                'pageCfg',
                'tableData',
                'tableHeight',
                'searchParmas',
                'loadingValue'
            ])
        }
    }
</script>
