<template>
    <div class="layout-table">
        <h2>
            <Icon type="ios-home"></Icon>
            <a href="/"> 首页 </a> > {{this.$route.meta.title}}
        </h2>
        <Split v-model="panelSplit">
            <div slot="left" class="layout-tree-content">
                <div class="left-tab-panel">
                    <div class="left-tab-tree" v-for="(item,index) in pageTree" :key="item.id" :class="{'active': index == currentTree}" @click="switchTree(index)">
                        {{item.treeName}}
                    </div>
                </div>
                <Dropdown style="margin-left: 20px" v-for="item in buttonGroup" :key="item.id" @on-click="handleClickItem" v-if="monitorBtn.saveBtn">
                    <Button type="default">{{item.buttonText}}</Button>
                    <DropdownMenu slot="list" >
                        <!--@on-click="addCloudMap"-->
                        <DropdownItem v-for="i in item.children" :key="i.id" :name="i.id" >{{i.buttonText}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button type="default" @click="editCloudMap" v-if="monitorBtn.editBtn">编辑</Button>
                <Button type="default" @click="deleteCloudMap" v-if="monitorBtn.deleteBtn">删除</Button>
                <!--组织树-->
                <div style="margin-left: 30px">
                    <div class="search-box" style="white-space: nowrap">
                        <Input v-model="searchValue" size="small" autofocus enter-button
                               :placeholder="$t('formText.searchTip')"
                               class="fl" style="max-width: 70%;"
                               @on-change="searchTreeData" @on-click="searchTreeData" @on-enter="searchTreeData"/>
                        <Button icon="md-refresh" size="small" style="margin: 1px 0 0 7px" @click="refreshTree">
                            {{$t('formText.fresh')}}
                        </Button>
                    </div>

                    <vue-js-tree :data='treeData'
                                 :whole-row="false"
                                 :loading-text="'loading....'"
                                 :collapse="true"
                                 ref="tree"
                                 :allow-batch="true"
                                 :show-checkbox="false"
                                 v-if="treeData" @item-click="treeNodeClick"/>
                </div>
                <Spin size="large" fix v-if="spinShow">
                    <Icon type="ios-loading" size=18 class="componet-loading"></Icon>
                    <div>Loading</div>
                </Spin>
            </div>
            <div slot="right" class="layout-table-content">
                <div class="edit-button-group" v-if="showSaveBtn">
                    <Button type="success" @click="saveCloudMap">保 存</Button>
                    <Button type="default" @click="cancelCloudMap">取 消</Button>
                </div>
                <div class="layout-table cloud-map-layout"
                     style="text-align: center; height: calc(100vh - 110px); overflow: hidden;">

                </div>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </div>
        </Split>

        <saveWnd :title='modalTitle' :api="apiUrl" :mapData="mapDataModal" :aoLatLng="aoLatLng" :isShow="isShow" @handleCancel="handleCancel" @handleReset="handleReset"/>

    </div>

</template>


<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations,camelcase,no-case-declarations */

import Util from '../../../../libs/util'
import vueJsTree from 'vue-jstree'
import formExt from '../../../components/table/formExt'

require('../../../../libs/leaflet-1.0.3/leaflet-src.js');
require('../../../../libs/map-lib/ExSunMap-2.4.0-src.js');
require('../../../../libs/map-lib/leaflet.draw-src.js');
require('../../../../libs/map-lib/JT808EditMap-2.4.0-src');
require('../../../../libs/map-lib/zh-cn.js');

const GetPageCfgUrl = require('../../../../libs/api').GetPageCfgUrl // 页面配置接口
const GetCloudMapTree = require('../../../../libs/api').GetCloudMapTree // 云图树
const SaveCloudMap = require('../../../../libs/api').SaveCloudMap // 保存云图
const EditCloudMap = require('../../../../libs/api').EditCloudMap // 编辑云图
const DeleteCloudMap = require('../../../../libs/api').DeleteCloudMap // 删除云图
const QueryCloudMap = require('../../../../libs/api').QueryCloudMap // 查询云图
const GetPoiAddress = require('../../../../libs/api').GetPoiAddress // 查询云图中心点地址
const GetCloudTable = require('../../../../libs/api').GetCloudTable // 云图表格列表
const pageUrl = require('../../../../libs/api').mapMonitor;

import saveWnd from '../modal/save-administrative'

export default {
    components: {vueJsTree, formExt,saveWnd},
    data(){
        return{
            currentTree: 0,
            isActive: true,
            panelSplit: 0.175,
            treeData:[],
            searchValue: null,
            spinShow: false,
            menuId: null,
            treeIndex: 0,
            mapControl:{
                lat: Util.mapCenter.lat,
                lng: Util.mapCenter.lng,
                mapContainerId:'administrativeMap',
            },
            pageTree: [
                {'id': 1,'treeName': '行政区域', 'treeValue': 'departmentTree'},
                // {'id': 2,'treeName': '关键点', 'treeValue': 'railTree'}
            ],
            buttonGroup: [
                {
                    id:1,
                    buttonText: '新增',
                    children: [
                        {id:1, buttonText: '矩形', api: '/cloudMap/insertRectangle'},
                        {id:2, buttonText: '圆形', api: '/cloudMap/insertRectangle'},
                        {id:3, buttonText: '多边形', api: '/cloudMap/insertRectangle'}
                    ]
                }
            ],
            tableColumns: [
                // {type: 'selection', width: 30, align: 'center'},
                // {title: ' ', key: 'name', width: '5px',align:'center'},
                {title: '行政区域', key: 'cloudName',align:'center'},
                {title: '组织机构', key: 'deptName',align:'center'}
            ],
            tableData: [],
            rectHandler:null,
            circleHandler:null,
            polygonHandler:null,
            mapObj:null,
            map:null,
            apiUrl:'',
            isShow: false,
            mapDataModal:{
                "addr": null,
                "cloudName": null,
                "cloudType": 3,
                "deptId": null,
                "mapPoint": {
                    "aoLatLng": [],
                    "nType": 0,
                    "oOption": {}
                },
                "mapType": 3
            },
            aoLatLng:[],
            tablePage:{
                pageIndex:1,
                total: 1,
                pageSize: 20,
                cloudName: '',
                cloudTypeId: 0
            },
            editCloudMapModal: [],
            monitorBtn: {
                saveBtn: false,
                editBtn: false,
                deleteBtn: false
            },
            editTool: null,
            showSaveBtn: false,
            showCancelBtn: false,
            dataFromJs: null,
            modalTitle: null
        }
    },
    mounted(){
        let self = this
        self.$nextTick(function () {
            // 获取左侧树
            self.initPageCfg()
            self.switchTree(0)
            self.editTool = new L.MapLib.MapEditControl(self.mapObj, {});
        })

        this.initMap();
        this.rectHandler = new L.Draw.Rectangle(this.mapObj.getMap(), {});
        this.circleHandler = new L.Draw.Circle(this.mapObj.getMap(), {});
        this.polygonHandler = new L.Draw.Polygon(this.mapObj.getMap(), {});
    },

    methods:{
        // 保存云图数据
        saveCloudMap(){
            this.editTool.disEditMap()
            for(let i in this.dataFromJs){
                this.editCloudMapModal[i] = this.dataFromJs[i]
            }
            this.mapDataModal = this.editCloudMapModal
            this.aoLatLng = this.editCloudMapModal.aoLatLng[0]
            let cLat = this.getCenter(this.aoLatLng,'lat')
            let cLon = this.getCenter(this.aoLatLng,'lng')
            this.getCenterPoi(cLon + ',' + cLat) //转化实时地址
            this.isShow = true
            // this.editTool._oParent.fire('draw:edited', this.editCallBack, this);
        },
        // 取消当前云图操作
        cancelCloudMap(){
            this.showSaveBtn = false
            this.editTool.disEditMap()
            this.editTool.clearLayers()
        },

        // 获取页面权限
        initPageCfg(){
            let self = this
            let menuId = self.$route.meta.menuId
            let roleId = JSON.parse(localStorage.getItem('$userState')).roleId || 0
            Util.ojax.post(GetPageCfgUrl, {menuId: menuId, roleId: roleId}).then(function (res) {
                let cfg = res.data.detail.monitorButton
                for(let i in cfg){
                    if(cfg[i].name == 'updateAdministrative'){
                        self.monitorBtn.editBtn = true
                    }
                    if(cfg[i].name == 'insertAdministrative'){
                        self.monitorBtn.saveBtn = true
                    }
                    if(cfg[i].name == 'deleteAdministrative'){
                        self.monitorBtn.deleteBtn = true
                    }
                }
            }).catch(function (error) {
                console.log(error)
            })

        },
        handleCancel(v){
            this.isShow = v
        },
        handleReset(){
            this.isShow = false
            this.showSaveBtn = false
            this.initCloudMapGrid()
            this.initCloudMapTree()
        },
        // 获取中心点
        getCenter(array, key){
            var sum = 0
            for (var i = 0; i < array.length; i++) {
                sum += array[i][key];
            }
            return sum / array.length;
        },
        // 获取Poi地址
        getCenterPoi(v){
            let self = this
            Util.ojax.post(GetPoiAddress, {location: v}).then(function (res) {
                if (res.data.code == 0) {
                    self.mapDataModal.addr = res.data.detail.regeocode.formatted_address
                }
            })
        },
        // 画图完成的回调
        createdCallBack:function (e) {
            var oLayer = e.layer;

            if(oLayer instanceof L.Circle) {
                var oLatLng = oLayer.getLatLng();
                var radius = oLayer.getRadius();

                // 保存点
            }
            else  {
                var aoLatLng = oLayer.getLatLngs();
                var ao = []
                aoLatLng[0].map(function (oItem) {
                    ao.push({lat: oItem.lat, lng: oItem.lng})
                });
                this.aoLatLng = ao
                let cLat = this.getCenter(ao,'lat')
                let cLon = this.getCenter(ao,'lng')
                debugger
                this.getCenterPoi(cLon + ',' + cLat) //转化实时地址
            }
            this.isShow = true
            this.modalTitle = '新增线路'
        },
        // 初始化地图
        initMap() {

            const self = this
            self.mapObj = new L.ExSunMap.ESMapMaster(this, {
                containerClass: 'cloud-map-layout',
                mapContainerId: this.mapControl.mapContainerId,
                lat: this.mapControl.lat,
                lng: this.mapControl.lng
            });
            const container = document.querySelector('.cloud-map-layout');

            self.mapObj.loadMap(container.clientWidth, container.clientHeight - 10);
            // 加载其他地图控件
            //self.mapCfg()
            //self.resizeMap();
            // 加载poi查询控件
            self.mapObj.loadSearch({cUrl: pageUrl.searchUrl});
            self.mapObj.loadMapTile();
            self.mapObj.loadToolBox();

            this.map = self.mapObj.getMap();
        },
        // 点击下拉进行选择 进行地图交互 获取到的是api值 根据api来判断是弹出什么样的类型的弹窗
        handleClickItem(e){
            if (e === 1) {
                // 编辑矩形
                this.rectHandler.enable();

            }else if (e === 2) {
                // 圆形
                this.circleHandler.enable();

            } else if (e === 3) {
                // 多边形
                this.polygonHandler.enable();

            }

            this.map.once('draw:created', this.createdCallBack, this);
        },
        // 切换树
        switchTree(e){
            let self = this
            self.currentTree = e
            if(e == 1){
                self.initCloudMapGrid()
            }else{
                self.initCloudMapTree()
            }
        },
        // 初始化左侧云图表格数据
        initCloudMapGrid(){
            let self = this
            Util.ojax.post(GetCloudTable, self.tablePage).then(function (res) {
                if (res.data.code == 0) {
                    self.tableData = res.data.detail.list
                    self.tablePage.pageIndex = res.data.detail.pageNum
                    self.tablePage.pageSize = res.data.detail.size
                    self.tablePage.total = res.data.detail.total
                }
            })
        },
        // 初始化云图树
        initCloudMapTree(){
            let self = this
            Util.ojax.post(GetCloudMapTree, {cloudTypeId: 0}).then(function (res) {
                if (res.data.code == 0) {
                    self.treeData = res.data.detail
                }
            })
        },
        // 点击左侧树节点
        treeNodeClick(e) {
            if(e.data.id >0){
                return
            }
            this.getDrawMapData(e.data.id * -1)
        },
        getDrawMapData(id){
            let self = this
            Util.ojax.post(QueryCloudMap, {ids: id}).then(function (res) {
                if (res.data.code == 0) {
                    self.cancelCloudMap()
                    self.editCloudMapModal = res.data.detail
                    let drawMapJson = JSON.parse(self.editCloudMapModal.mapJson)
                    self.editTool.editDraw({drawMapJson: drawMapJson, type: res.data.detail.cloudType, name: res.data.detail.cloudName})
                    // self.mapObj.fire('ESMapEdit:editDraw', {drawMapJson: drawMapJson, type: res.data.detail.cloudType})
                }
            })
        },
        // 编辑云图
        editCloudMap(){
            this.modalTitle = '编辑线路'
            this.editTool.editMap()
            this.showSaveBtn = true
        },
        // 翻页页码改变
        handlePageChange(v){
            this.tablePage.pageIndex = v
            this.initCloudMapGrid()
        },
        // 每页条数改变
        handlePageSizeChange(v){
            this.tablePage.pageSize = v
            this.queryGridData()
        },
        // 点击表格每一行触发事件
        onRowClick(row, index){
            this.editCloudMapModal = row
            this.getDrawMapData(row.id)
        },
        // 删除云图
        deleteCloudMap(){
            let self = this
            self.$Modal.confirm({
                title: "删除云图",
                content: '确认删除' + self.editCloudMapModal.cloudName + '  该云图？',
                loading: true,
                onOk: () => {
                    Util.ojax.post(DeleteCloudMap, {ids: self.editCloudMapModal.id}).then(function (res) {
                        if (res.data.code == 0) {
                            self.$Notice.success({
                                title: '提示',
                                desc: '操作成功!',
                                duration: 3
                            })
                            self.editTool.clearLayers()
                            self.handleReset()
                            self.$Modal.remove()
                        }else{
                            self.$Notice.error({
                                title: '提示',
                                desc: '删除失败!',
                                duration: 3
                            })
                        }
                    })
                }
            });
        },
        // 选择表格列表
        onSelectGrid(sel, row){
            this.editCloudMapModal = sel
        },
        // 取消选择表格列表
        onSelectCancelGrid(sel, row){
            this.editCloudMapModal = sel
        },
        // 保存节点配置信息
        handleSave(){
            let self = this
            self.spinShow = true
            debugger
            // Util.ojax.post(SaveCloudMap, self.columnList).then(function (res) {
            //     if (res.data.code == 0) {
            //         self.$Notice.success({
            //             title: '提示',
            //             desc: '操作成功!',
            //             duration: 3
            //         })
            //         self.getColumnCfg()
            //     }
            // })
        },
        searchTreeData(){},
        refreshTree(){},
    }
}
</script>

<style scoped>
    @import '../../../../libs/leaflet-1.0.3/leaflet.css';
</style>
