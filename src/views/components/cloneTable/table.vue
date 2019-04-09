<template>
    <div style="position: relative">
        <Table :columns="tableColumns" ref="table" :data="gridData" :height="tableHeight"
            @on-selection-change="handleSelection"
            highlight-row
            border stripe>
            <template slot-scope="{row, index}" slot="userType">
                <div>{{row.userType?'安装人员':'普通人员'}}</div>
            </template>
            <template slot-scope="{row, index}" slot="enable">
                <div>{{row.enable?'禁用':'启用'}}</div>
            </template>
            <template slot-scope="{row, index}" slot="statu">
                <div>{{row.enable?'启用':'禁用'}}</div>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" v-if="tabBtn.indexOf('updateDataRole')>-1" size="small" icon="md-create" class="adv-search-btn"
                @click="edit(row,1)">编辑
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('viewDataRole')>-1" size="small" icon="ios-book" class="adv-search-btn"
                @click="view(row,1)">查看
                </Button>
                <Button type="primary" v-if="tabBtn.indexOf('updateRoleInfo')>-1" size="small" icon="md-create" class="adv-search-btn"
                @click="edit(row,2)">编辑
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('viewRoleInfo')>-1" size="small" icon="ios-book" class="adv-search-btn"
                @click="view(row,2)">查看
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('alarmRoleInfo')>-1" size="small" icon="ios-book" class="adv-search-btn"
                @click="alertType(row)">报警类型
                </Button>
                <Button type="primary" v-if="tabBtn.indexOf('updateUser')>-1" size="small" icon="md-create" class="adv-search-btn"
                @click="edit(row,3)">编辑
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('viewUser')>-1" size="small" icon="ios-book" class="adv-search-btn"
                @click="view(row,3)">查看
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('permissionUser')>-1" size="small" icon="ios-book" class="adv-search-btn"
                @click="sec(row)">权限
                </Button>
                <!-- client cfg -->
                <Button type="default" v-if="tabBtn.indexOf('clientView')>-1" size="small" icon="ios-book" class="adv-search-btn"
                @click="view(row,4)">查看
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('updateClient')>-1" size="small" icon="md-create" class="adv-search-btn"
                @click="edit(row,4)">编辑
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('clientPageSet')>-1" size="small" icon="ios-settings" class="adv-search-btn"
                @click="cPageSet(row)">页面设置
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('clientFuncSet')>-1" size="small" icon="ios-settings" class="adv-search-btn"
                @click="cFuncSet(row)">功能设置
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('clientAlertSet')>-1" size="small" icon="ios-book" class="adv-search-btn"
                @click="cAlertType(row)">报警类型
                </Button>
                <!-- add rule -->
                <Button type="default" v-if="tabBtn.indexOf('viewRule')>-1" size="small" icon="ios-book" class="adv-search-btn"
                @click="view(row,5)">查看
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('updateRule')>-1" size="small" icon="md-create" class="adv-search-btn"
                @click="edit(row,5)">编辑
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('vehicleBind')>-1" size="small" icon="ios-settings" class="adv-search-btn"
                @click="vehSet(row)">车辆设置
                </Button>
            </template>
            <template slot-scope="{row}" slot="action">
                <Button type="default" v-if="tabBtn.indexOf('viewMedia')>-1" size="small" icon="ios-book" class="adv-search-btn"
                    @click="viewMedia(row)">查看
                </Button>
                <Button type="default" v-if="tabBtn.indexOf('downMedia')>-1" size="small" icon="ios-cloud-download-outline" class="adv-search-btn"
                    @click="exportExcl(row)">下载
                </Button>
            </template>
        </Table>
        <Page v-if="tablePage" :current="tablePage.pageNum" :total="tablePage.total"
              :page-size="tablePage.size" @on-change="change" size="small" show-elevator show-sizer show-total
              class="table-page"/>
        <Spin size="large" fix v-if="spinShow">
            <Icon type="ios-loading" size=18 class="componet-loading"></Icon>
            <div>Loading</div>
        </Spin>      
        <!--前期用来页面刷新渲染用  后期再找一个好点的方法-->
        <div style="display: none">{{initColumns}}</div>
        <!-- template modal-->
        <alert-type v-if="tabBtn.indexOf('alarmRoleInfo')>-1" ref="alertType" />
        <plus-sec v-if="tabBtn.indexOf('permissionUser')>-1" ref="plusSec" />
        <page-set ref="pageSet"/>
        <func-set ref="funcSet"/>
        <alert-type v-if="tabBtn.indexOf('clientAlertSet')>-1" ref="cType"/>
        <query-bind-veh v-if="tabBtn.indexOf('vehicleBind')>-1" ref="vehSet"/>
        <view-media ref="viewMedia"></view-media>
    </div>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style */

//调用vuex状态管理
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
import alertType from './modal/alert-type'
import plusSec from './modal/plus-sec'
import pageSet from './modal/cfg-page-set'
import funcSet from './modal/cfg-func-set'
import queryBindVeh from './modal/query-bind-veh'
import util from '../../../libs/util.js'
import viewMedia from './modal/view-media'
 
export default {
    data() {
        return {
            tableColumns: [],
            gridFinalData: [],
            spinShow: false,
            tablePage: {
                pageNum: 0,
                total: 0,
                size: 20
            },
            pageApi: {},
            // tabBtn:[],
            // round: 0,
            path: null
        }
    },
    components: {
        alertType,
        plusSec,
        pageSet,
        funcSet,
        queryBindVeh,
        viewMedia
    },
    mounted() {
        this.path = this.$route.path
    },
    watch: {
      path(newVal){
        this.tranDelData([])
      }  
    },
    methods: {
        viewMedia(row){
            const $viewMedia = this.$refs.viewMedia
            $viewMedia.show = true
            // $viewMedia.vehNo = row.vehNo
        },
        // 下载列表
        exportExcl(row){
            const url = 'http://180.101.255.219:10024/'+ row.fileUrl
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', row.fileName+'.zip')
            document.body.appendChild(link)
            link.click()
        },
        vehSet(row){
            let $vehSet = this.$refs.vehSet
            $vehSet.ruleTypeId = this.ruleTypeId||172
            $vehSet.queryData(row.id)
            $vehSet.show = true
            $vehSet.sign = 1
            $vehSet.rowId = row.id
            $vehSet.bindApi = this.pageApi.vehicleBind
            $vehSet.queryApi = this.queryApi
        },
        cAlertType(row){
            let $cType = this.$refs.cType
            $cType.show = true
            $cType.alertApi = this.pageApi.clientAlertSet
            $cType.queryApi = this.queryApi
            $cType.rowId = row.id
            $cType.view(['client'])
        },
        cFuncSet(row){
            let $funcSet = this.$refs.funcSet
            $funcSet.show = true
            $funcSet.pageApi = this.pageApi
            $funcSet.rowId = row.id
            $funcSet.queryApi = this.queryApi
            $funcSet.setNodeSelected()
        },
        cPageSet(row){
            const $pageSet = this.$refs.pageSet
            $pageSet.show = true
            $pageSet.queryApi = this.queryApi
            $pageSet.rowId = row.id
            $pageSet.pageSetApi = this.pageApi.clientPageSet
            $pageSet.fileList = []
            $pageSet.formData.description = ''
            $pageSet.name1 = ''
            $pageSet.name2 = ''
            $pageSet.name3 = ''
        },
        change(index){
            this.tranDelData([])
            this.queryGridData({menuId: this.menuId,pamars:{pageIndex: index},queryApi:this.queryApi})
        },
        //
        view (row, id) {
            row.modalTit='查看'
            row.mId = id
            this.tranData(row)
            if(row.deptIds||row.menuIds){
                let ids = row.deptIds||row.menuIds
                let data = {ids:ids}
                top.postMessage(data, '*')
            }
        },
        edit (row,id) {
            row.modalTit='编辑'
            row.mId = id
            row.pageApi = this.pageApi
            row.queryApi = this.queryApi
            // console.log(row)
            this.tranData(row)
            if(row.deptIds||row.menuIds){
                let ids = row.deptIds||row.menuIds
                let data = {ids:ids}
                top.postMessage(data, '*')
            }
        },
        alertType (row) {
            const $alertType = this.$refs.alertType
            $alertType.show = true
            $alertType.alertApi = this.pageApi.alarmRoleInfo
            $alertType.queryApi = this.queryApi
            $alertType.roleId = row.id
            $alertType.view(row.alarmTypeIds)
        },
        sec(row){
            let $sec = this.$refs.plusSec
            $sec.show = true
            $sec.pageApi = this.pageApi
            $sec.rowId = row.id
            $sec.queryApi = this.queryApi
            //console.log($sec)
            //$sec.initTree()
            var data={
                dataIds: row.dataRoleId,
                funcIds: row.funRoleId
            }
            top.postMessage(data, '*')
        },
        handleSelection(e) {
            this.tranDelData([])
            let ids = []
            for (var i in e) {
                ids.push(e[i].id)
            }
            this.tranDelData(ids)
            //this.deleteGridData({ids: ids})
        },
        gridPage() {
            let self = this
            let tableData = self.tableData
            for (var i in tableData) {
                if (tableData[i].menuId == self.menuId) {
                    self.tablePage.pageNum = tableData[i].pageInfo.pageNum
                    self.tablePage.total = tableData[i].pageInfo.total
                    self.tablePage.size = tableData[i].pageInfo.pageSize
                    return tableData[i].pageInfo
                } else {
                    return false
                }
            }
        },
        ...mapMutations('tableState', [
            'queryGridData',
            'tranData',
            'tranDelData'
        ]),
        isEnable(col){
            if(this.menuId === 22){
                col.forEach(v => {
                    if(v.key === 'enable'){
                        v.slot = 'statu'
                    }
                })
            }
        },
        tranColData(col,id,key,slotVal){
            if(this.menuId === id){
                col.forEach(v => {
                    if(v.key === key){
                        v.slot = slotVal
                    }
                })
            }
        }
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
                    this.$emit('get-tab-menu', pageCfg[i].cfg.monitorButton)
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
            if(self.tableColumns.length > 0){
                // 添加多选checkbox
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

        gridData() {
            let self = this
            let tableData = self.tableData
            for (var i in tableData) {
                if (tableData[i].menuId == self.menuId) {
                    //console.log(tableData[i])
                    this.gridPage()
                    return tableData[i].data
                }
            }
        },
        
        tabBtn () {
            let pageCfg = this.pageCfg
            let newArr = []
            if (!pageCfg||!pageCfg.length) { return [] }
            pageCfg.forEach(val => {
                if(val.menuId = this.menuId){
                   val.cfg.gridButton.length&&val.cfg.gridButton.forEach(v => {
                       this.pageApi[v.name] = v.api
                       newArr.push(v.name)
                   })
                }
            })
            return newArr
        },
        gridCfg() {
            let self = this
            let pageCfg = self.pageCfg
            for (var i in pageCfg) {
                if (pageCfg[i].menuId == self.menuId) {
                    let col = [].concat(pageCfg[i].cfg.grid)
                    this.isEnable(col)
                    if(!pageCfg[i].cfg.gridButton.length){
                        return col
                    }
                    col = col.reverse().concat([{
                        title: '操作',
                        fixed: 'right',
                        minWidth: 120,
                        align: 'center',
                        slot: 'action'
                    }])
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
        ])
    }
}
</script>