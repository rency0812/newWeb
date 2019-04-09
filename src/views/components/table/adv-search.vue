<template>
    <div class="layout-adv-search">
        <Form ref="formInline" inline label-position="right" :label-width="100">
            <FormItem v-if="item" :label="item.label+':'" v-for="item in searchPanel" :key="item.id" style="max-width: 250px">

                <!--表单控件-->
                <!--输入框-->
                <Input type="text" v-model="searchModel[item.name]" :placeholder="'请输入'+item.label.replace('*', '')+'...'" size="small"
                       v-if="item.type == 'input'"/>

                <!--时间日期选择器-->
                <selectDatepicker v-model="searchModel[item.name]"
                                  v-if="item.type == 'date' || item.type == 'datetime' || item.type == 'datetimerange' || item.type == 'daterange'"
                                  v-on:changeDateFormat="changeDateFormat"
                                  :dateValue="item.value"
                                  :name="item.name"
                                  :sName="item.name"
                                  :sType="item.type"/>

                <!--时间选择器-->
                <selectTimepicker v-model="searchModel[item.name]"
                                  v-if="item.type == 'time' || item.type == 'timerange'"
                                  v-on:changeTimeFormat="changeTimeFormat"
                                  :name="item.name"
                                  :sName="item.name"
                                  :sType="item.type"/>

                <!--多选组合框-->
                <CheckboxGroup v-model="searchModel[item.name]" v-if="item.type == 'checkbox-group'" size="small">
                    <Checkbox :label="option.value" v-for="(option, key) in item.option" :key="key">
                        <Icon :type="option.icon" v-if="option.icon"></Icon>
                        <span>{{option.label}}</span>
                    </Checkbox>
                </CheckboxGroup>
                <!--单选框-->
                <RadioGroup v-model="searchModel[item.name]" v-if="item.type == 'radio'">
                    <Radio :label="i.label" v-for="i in item.children" :key="i.label"></Radio>
                </RadioGroup>
                <!--复选框-->
                <CheckboxGroup v-model="searchModel[item.name]" v-if="item.type == 'checkbox'">
                    <Checkbox :label="i.label" v-for="i in item.children" :key="i.label"></Checkbox>
                </CheckboxGroup>
                <!--选择下拉-->
                <Select v-model="searchModel[item.name]" clearable filterable v-if="item.type == 'select'"
                        size="small">
                    <Option :value="i.value" v-for="i in item.option" :key="i.value" :label="i.label"></Option>
                </Select>
                <!--动态渲染下拉-->
                <selectRemote v-model="searchModel[item.name]"
                              v-if="item.type == 'select-remote'"
                              :name="item.name"
                              :option="item.dicType"
                              :isShow="true"
                              size="small"
                              v-on:toTreeModal="hanldeSelectRemote"
                              :selectOptionValue="searchModel[item.name]"/>

                <!--自动完成-->
                <selectRemoteAutoComplete
                        v-model="searchModel[item.name]"
                        v-on:autoCompleteData="autoCompleteData"
                        :option="item.option"
                        :name="item.name"
                        :sName="item.name"
                        v-if="item.type == 'auto-complete'"/>

                <!--选择接口渲染下拉-->
                <select-device-type v-model="formModal[item.name]"
                                    v-if="item.type == 'select-device-type'"
                                    :name="item.name"
                                    :option="item.option"
                                    size="small"
                                    v-on:toTreeModal="hanldeSelectRemote"
                                    :selectOptionValue="formModal[item.name]"/>


            </FormItem>
            <FormItem>
                <!--查询和重置按钮不需要修改，api已经专门挑出来与页面组件公用了-->
                <Button type="info" size="small" icon="md-search" class="adv-search-btn" @click="handleSearch"
                        v-if="searchBtnCfg.indexOf('query')>-1"> 查询
                </Button>
                <Button html-type="reset" size="small" buttonId="200" class="adv-search-btn" @click="handleReset">重置
                </Button>


            </FormItem>
            <FormItem>
                <!--通过searchBtn的配置，传入相应的api地址和渲染相应的功能权限-->
                <span v-for="item in searchBtnData" :key="item.id" style="float: left; margin: 0 3px;">
                    <!--添加菜单按钮-->
                    <saveMenu :api="item.api" v-if="item.name.indexOf('insertMenu')>-1" @handleSearch="handleSearch"/>
                    <!--导出菜单-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name.indexOf('exportMenu')>-1"> 导出</Button>
                    <!--删除菜单-->
                    <deleteMenu name="批量删除" :api="item.api" :rowData="dIds" v-if="item.name.indexOf('deleteMenu')>-1" @handleSearch="handleSearch"/>
                    <!--添加部门按钮-->
                    <save-department :api="item.api" v-if="item.name.indexOf('insertDepartment')>-1" @handleSearch="handleSearch"></save-department>
                    <!--导出部门-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name.indexOf('exportDepartment')>-1"> 导出</Button>
                    <!--删除部门-->
                    <deleteMenu name="批量删除" :api="item.api" :rowData="dIds" v-if="item.name.indexOf('deleteDepartment')>-1" @handleSearch="handleSearch"/>
                    <!--导出登录日志数据-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name.indexOf('exportLoginLog')>-1"> 导出</Button>
                    <!--导出操作日志数据-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name == 'exportOperation'"> 导出</Button>
                    <!--新增车辆-->
                    <save-vehicle :api="item.api" v-if="item.name.indexOf('insertVehicle')>-1" @handleSearch="handleSearch"></save-vehicle>
                    <!--删除车辆-->
                    <delete-vehicle name="批量删除" :api="item.api" :rowData="dIds" v-if="item.name == 'deleteVehicle'" @handleSearch="handleSearch"/>
                    <!--导出车辆-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name == 'exportVehicle'"> 导出</Button>
                    <!--新增设备-->
                    <save-device :api="item.api" v-if="item.name == 'insertDevice'" @handleSearch="handleSearch"></save-device>
                    <!--删除设备-->
                    <delete-device name="批量删除" :api="item.api" :rowData="dIds" v-if="item.name == 'deleteDevice'" @handleSearch="handleSearch"/>
                    <!--新增设备类型-->
                    <save-device-type :api="item.api" v-if="item.name == 'insertDeviceType'" @handleSearch="handleSearch"></save-device-type>
                    <!--删除设备类型-->
                    <delete-device-type name="批量删除" :api="item.api" :rowData="dIds" v-if="item.name.indexOf('deleteDeviceType')>-1" @handleSearch="handleSearch"/>
                    <Button type="warning" size="small" icon="md-cloud" class="adv-search-btn" @click="handleDeleteEvent(item.api)" v-if="item.name.indexOf('deleteDeviceType')>-1"> 批量删除</Button>
                    <!--导出设备类型-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name.indexOf('exportDeviceType')>-1"> 导出</Button>

                    <!--新增驾驶员-->
                    <save-driver :api="item.api" v-if="item.name == 'insertDriver'" @handleSearch="handleSearch"></save-driver>
                    <!--删除驾驶员-->
                    <delete-driver name="批量删除" :api="item.api" :rowData="dIds" v-if="item.name == 'deleteDriver'" @handleSearch="handleSearch"/>
                    <!--导出驾驶员-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name.indexOf('exportDriver')>-1"> 导出</Button>

                    <!--新增SIM卡-->
                    <save-sim :api="item.api" v-if="item.name == 'insertSim'" @handleSearch="handleSearch"></save-sim>
                    <!--删除SIM卡-->
                    <delete-sim name="批量删除" :api="item.api" :rowData="dIds" v-if="item.name == 'deleteSim'" @handleSearch="handleSearch"/>
                    <!--导出SIM卡-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name.indexOf('exportSim')>-1"> 导出</Button>

                    <!--新增数据字典-->
                    <save-data-dictionary :api="item.api" v-if="item.name == 'insertDataDiction'" @handleSearch="handleSearch"></save-data-dictionary>
                    <!--删除数据字典-->
                    <delete-data-dictionary name="批量删除" :api="item.api" :rowData="dIds" v-if="item.name == 'deleteDataDiction'" @handleSearch="handleSearch"/>

                    <import-device name="导入设备" :api="item.api" v-if="item.name == 'importDevice'" @handleSearch="handleSearch"></import-device>
                    <import-sim name="导入SIM卡" :api="item.api" v-if="item.name == 'importSim'" @handleSearch="handleSearch"></import-sim>
                    <import-vehicle name="导入车辆" :api="item.api" v-if="item.name == 'importVehicle'" @handleSearch="handleSearch"></import-vehicle>

                    <!--车辆注册-->
                    <register-vehicle :api="item.api" v-if="item.name == 'registerVehicle'" @handleSearch="handleSearch"></register-vehicle>

                    <!--车辆注册导出-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name.indexOf('exportRegisterVehicle')>-1"> 导出</Button>

                    <!--导出车辆操作记录-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name.indexOf('exportVehicleOprLog')>-1"> 导出</Button>

                    <!--车辆信息转发-->
                    <transfer-vehicle-info :api="item.api" v-if="item.name == 'vehicleTransferInfo'" @handleSearch="handleSearch"></transfer-vehicle-info>

                    <!--导出报警明细-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name.indexOf('exportAlarmDetail')>-1"> 导出</Button>

                    <!--导出报警统计-->
                    <Button size="small" icon="ios-cloud-download-outline" class="adv-search-btn" @click="handleExportEvent(item.api)" v-if="item.name.indexOf('exportAlarmStat')>-1"> 导出</Button>

                </span>
            </FormItem>
        </Form>

        <Button type="default" shape="circle" size="small" icon="md-chevron-down" class="btn_show_  more"
                @click="handleShowMore" v-if="searchCfg.length > 4"></Button>
        <Button type="default" shape="circle" size="small" icon="md-chevron-up" class="btn_show_more"
                @click="handleShowMore" v-if="showMoreSearch !==''"></Button>

    </div>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,init-declarations,no-unused-vars */

import Util from '../../../libs/util'
import {mapGetters, mapMutations, mapActions} from 'vuex'

//组件类
import selectRemote from '../form/select-remote'
import selectRemoteAutoComplete from '../form/select-remote-auto-complete'
import selectDatepicker from '../form/select-datepicker'
import selectTimepicker from "../form/select-timepicker"
import selectDeviceType from "../form/select-device-remote"
import selectTree from "../form/select-tree"


// 弹窗类
import plusUser from './modal/plus-user'        // 添加用户
import saveDepartment from './modal/save-department'  // 添加部门
import editTreePermisson from './modal/edit-tree-permission'    //编辑权限树
import saveMenu from './modal/save-menu'        // 添加菜单
import plusFuncRole from './modal/plus-data-role'       //添加
import deleteMenu from './modal/delete-menu'        // 批量删除菜单
import deleteDepartment from './modal/delete-department'        // 批量删除部门
import saveVehicle from './modal/save-vehicle'        // 新增车辆
import deleteVehicle from './modal/delete-vehicle'        // 删除车辆
import saveDevice from './modal/save-device'        // 新增设备
import deleteDevice from './modal/delete-device'        // 删除设备
import saveDeviceType from './modal/save-device-type'        // 新增设备类型
import deleteDeviceType from './modal/delete-device-type'        // 新增设备类型
import saveDriver from './modal/save-driver'                // 新增驾驶员
import deleteDriver from './modal/delete-driver'            // 删除驾驶员
import saveSim from './modal/save-sim'                // 新增sim
import deleteSim from './modal/delete-sim'            // 删除sim
import saveDataDictionary from "./modal/save-data-dictionary";            // 新增数据字典
import deleteDataDictionary from "./modal/delete-data-dictionary";            // 删除数据字典
import importDevice from './modal/import-device'        // 导入设备
import importSim from './modal/import-sim'        // 导入sim
import importVehicle from './modal/import-vehicle'        // 导入车辆
import registerVehicle from './modal/register-vehicle'        // 注册车辆
import transferVehicleInfo from './modal/transfer-vehicle-info'        // 车辆信息转移

const PostDataUrl = require('../../../libs/api').PostDataUrl   //页面数据交换接口
const api = require('../../../libs/api')   //页面数据交换接口

export default {
    props: ['deleteIds'],
    components: {
        // 组件类
        selectRemote,
        selectRemoteAutoComplete,
        selectDatepicker,
        selectTimepicker,
        selectDeviceType,
        selectTree, // 下拉树

        // 弹窗类
        saveMenu,      //新增菜单
        deleteMenu,   // 批量删除菜单


        saveDepartment, // 新增部门
        plusUser, // 新增用户
        editTreePermisson, // 编辑权限树
        plusFuncRole, // 添加功能角色,
        deleteDepartment, // 批量删除菜单
        saveVehicle, // 新增车辆
        deleteVehicle, // 删除车辆
        saveDevice, // 新增设备
        deleteDevice, //删除设备
        saveDeviceType, //新增设备类型
        deleteDeviceType, // 删除设备类型
        saveDriver, //新增驾驶员
        deleteDriver, //删除驾驶员
        saveSim, //新增sim
        deleteSim, //删除sim
        saveDataDictionary, //新增数据字典
        deleteDataDictionary, //删除数据字典
        importDevice, //导入设备
        importSim, // 导入SIM
        importVehicle, //导入车辆
        registerVehicle, // 注册车辆
        transferVehicleInfo, //车辆信息转移

    },
    data() {
        return {
            searchCfg: {cfg: null, button: []},
            searchModel: {},
            //页面辅助数据池
            showMoreSearch: '',
            // searchBtnCfg: [],
            deleteUrl: '',
            modaLoading: false,
            modalShow: false,
        }
    },
    methods: {
        //查询
        handleSearch(e) {
            let self = this
            let searchModel = self.searchModel
            self.queryGridData({menuId: self.menuId, pamars: searchModel, queryApi: self.queryApi})
        },

        //重置
        handleReset() {
            let self = this
            self.searchModel = {}
            // self.queryMenuGridData({menuId: self.menuId, pamars: {}, queryApi: self.queryApi})   是否需要重置后查询？
        },

        // 统一导出按钮
        handleExportEvent(api) {
            let self = this
            let searchValue = Util.toParams(self.searchModel)
            if(searchValue){
                window.open('/jt808web'+ api + '?' + searchValue, '_blank')
            }else{
                window.open('/jt808web'+ api, '_blank')
            }
        },

        // 统一删除按钮 传进来每一个按钮的api 进行删除操作
        handleDeleteEvent(v) {
            let ids = this.deleteModel.ids
            console.log(ids)
            if (!ids) return

            if (ids) {
                if (ids.length == 0) return
            }
            this.deleteUrl = v
            this.modalShow = true
        },

        // 弹窗里面的点击确定删除的操作事件
        handleDelete() {
            let self = this
            let ids = this.deleteModel.ids
            self.modaLoading = true
            Util.ojax.post(self.deleteUrl + '?ids=' + ids.join(',')).then(function (res) {
                if (res.data.code == 0) {
                    self.$Notice.success({
                        title: '提示',
                        desc: '删除成功!',
                        duration: 3
                    })
                    self.modalShow = false
                    self.modaLoading = false
                    self.queryGridData({menuId: self.menuId, queryApi: self.queryApi})
                } else {
                    self.modaLoading = false
                    self.$Message.error(res.data.msg)
                }
            })
        },

        // 取消
        handleCancel() {
            this.modalShow = false
        },

        hanldeSelectTree(v) {
            this.searchModel[v.name] = v.value
        },

        //初始化功能权限按钮
        initSearchBtnCfg(data) {
            let self = this
            let componentCfg = data
            let searchBtnCfg = new Set()
            for (var key in componentCfg) {
                searchBtnCfg.add(key)
            }
            self.searchBtnCfg = Array.from(searchBtnCfg)
        },

        //还未修改
        handleShowMore() {
            var self = this
            if (!self.showMoreSearch) {
                self.showMoreSearch = 'show_more'
            } else {
                self.showMoreSearch = ''
            }
            console.log(self.showMoreSearch)
        },

        // 同步
        handleTongbu() {
        },

        // 获取数据字典 动态渲染下拉菜单
        hanldeSelectRemote(v) {
            this.searchModel[v.name] = v.value
        },

        // 自动完成数据
        autoCompleteData(v) {
            let self = this
            self.searchModel[v.name] = v.value
        },

        // 选择日期区间
        changeDateFormat(v) {
            if (v.value == " | ") {
                this.searchModel[v.name] = null
            } else {
                this.searchModel[v.name] = v.value
            }
        },

        // 选择时间
        changeTimeFormat(v) {
            this.searchModel[v.name] = v.value
        },

        ...mapMutations('tableState', [
            'queryGridData',    //查询表格数据
            // 'searchGrid', //初始化页面
            // 'exportGrid',
            // 'queryPageDepartment'
            'setSearchParams'
        ])
    },
    computed: {
        menuId() {
            return this.$route.meta.menuId
        },
        //删除的数组
        dIds() {
            return this.deleteIds
        },
        queryApi() {
            //分析查询API地址
            console.log('处理api地址')
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
        searchBtnCfg() {
            let self = this
            let searchBtnData = self.searchBtnData
            let searchBtnCfg = new Array()
            for (var i in searchBtnData) {
                searchBtnCfg.push(searchBtnData[i].name)
            }
            return searchBtnCfg
        },
        searchBtnData() {
            let pageCfg = this.pageCfg
            for (var i in pageCfg) {
                if (pageCfg[i].menuId == this.menuId) {
                    return pageCfg[i].cfg.searchButton
                } else {
                    return false
                }
            }
        },
        searchPanel() {
            let iData = this.pageCfg
            for (var i in iData) {
                if (iData[i].menuId == this.menuId) {
                    return iData[i].cfg.searchPanel
                } else {
                    return false
                }
            }
        },
        ...mapGetters('tableState', [
            'pageCfg',
            'deleteModel', // 删除的数据
        ])
    },
    watch:{
        searchModel(data){
            console.log(data)
            if(data){
                this.setSearchParams(data)
            }
        }
    }
}
</script>
