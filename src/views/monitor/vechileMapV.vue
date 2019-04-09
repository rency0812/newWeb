<template>
    <div class="layout-monitor-container" :class="{right:tabRight,full:tabClose}">
        <!--<monitorTab :page=this :tabCfg="tabCfg" @containerChange="ChangeComponets"/>-->

        <div class="layout-map-tab">
            <!--// 车辆列表-->
            <vechileLists :api="vehLst.api" :tabLabel="vehLst.tabLabel" :act="vehLst.active"
                          :tabIcon="vehLst.tabIcon" :tableIndex="vehLst.index" :tabType="vehLst.index"
                          :style="{top:vehLst.index * 32 +'px'}"
                          :page="page"/>
            <!--车辆树形列表-->
            <structureVechile :api="vehTree.api" :tabLabel="vehTree.tabLabel" :act="vehTree.active"
                              :tabIcon="vehTree.tabIcon" :tableIndex="vehTree.index" :tabType="vehTree.index"
                              :style="{top:vehTree.index * 32 +'px'}"
                              :page="page" />

            <!--// 车辆视频-->
            <vechileVideo :api="vehVideo.api" :tabLabel="vehVideo.tabLabel" :act="vehVideo.active"
                          :tabIcon="vehVideo.tabIcon" :tableIndex="vehVideo.index" :tabType="vehVideo.index"
                          :style="{top:vehVideo.index * 32 +'px'}"
                          :page="page" />

            <!--// 关注车辆-->
            <vechileLists  :api="vehAttend.api" :tabLabel="vehAttend.tabLabel" :act="vehAttend.active"
                           :tabIcon="vehAttend.tabIcon" :tableIndex="vehAttend.index" :tabType="vehAttend.index"
                           :style="{top:vehAttend.index * 32 +'px'}"
                           :page="page"/>
        </div>


        <div class="monitor-container">
            <!--关闭侧边面板-->
            <div class="ivu-split-trigger ivu-split-trigger-vertical fl" @click="closeTabComponets">
                <div class="ivu-split-trigger-bar-con vertical">
                    <i class="ivu-split-trigger-bar"></i>
                    <i class="ivu-split-trigger-bar"></i>
                    <i class="ivu-split-trigger-bar"></i>
                    <i class="ivu-split-trigger-bar"></i>
                    <i class="ivu-split-trigger-bar"></i>
                    <i class="ivu-split-trigger-bar"></i>
                    <i class="ivu-split-trigger-bar"></i>
                    <i class="ivu-split-trigger-bar"></i>
                </div>
            </div>

            <div class="fl" :style="{width:mapWidth +'px',height:mapHeight +'px'}">

                <mapMain v-if="tabFlag ==='map'" :mapWidth="mapWidth" :mapHeight="mapHeight" :page="page"
                         :mapControl="mapControl"/>

                <videoMain :page="page" v-if="tabFlag ==='video'"/>
            </div>
        </div>

    </div>
</template>


<script>

    import structureVechile from '../components/monitor/monitorObj/structure-vechile'  //组织架构
    import vechileLists from '../components/monitor/monitorObj/vechile-lists'  //车辆列表

//  import favoriteVechile from '../components/monitor/monitorObj/favorite-vechile'  //关注车辆
    import vechileVideo from '../components/monitor/monitorObj/vechile-video'  //车辆视频

    import listBox from '../components/monitor/monitor-list'
    import pLoading from '../components/common/pageLoading'  //页面使用组件
    import mapMain from '../components/monitor/map-master'    // 地图组件
    import videoMain from '../components/monitor/video-master'  // 视频组件

    const pageUrl = require('../../libs/api.js').mapMonitor;

    //依赖库
    import {mapState, mapMutations, mapGetters} from 'vuex'
    import eventsMixin from 'vue'

    export default {
        components: {
            mapMain,
            videoMain,       // 视频组件
            pLoading,
            listBox,
            structureVechile,
            vechileLists,
            vechileVideo
        },
        data() {
            return {
                page:new eventsMixin(),          // 页面事件容器
                tabRight: false,    // 控制TAB选项卡左右分布
                tabClose: false,
                tabFlag: 'map',      // 调用主体组件的类型，默认为地图--map ，其余:视频--video ， 扬尘噪音--air ， 门禁组件--door
                tabCfg: {},
                mapWidth: window.innerWidth - 344,
                mapHeight: window.innerHeight - 64,
                listColumns: [],

                mapControl: {
                    poi: true,
                    tile: true,
                    toolbox: true,
                    grid: true,
                    lat: 30.222,
                    lng: 113.255,
                    mapContainerId:'mainMap',
                    cluster:true,
                    webSocket:true,
                    liveMange:true
                },

                mapToolCfg: {grid: true},
                listData: [],

                // 定义table 的写法
                vehLst: {
                    // 车辆分页查询接口
                    api: '/table/monitor/query',
                    tabLabel: '车辆列表',
                    tabIcon: 'md-car',
                    active: true,
                    index: 0

                },

                vehTree: {
                    // 车辆分页查询接口
                    api: '/table/monitor/query',
                    tabLabel: '组织架构',
                    tabIcon: 'md-git-merge',
                    active: false,
                    index: 1
                },

                vehVideo: {
                    // 车辆分页查询接口
                    api: '/table/monitor/query',
                    tabLabel: '车辆视频',
                    tabIcon: 'md-videocam',
                    active: false,
                    index: 2
                },
                vehAttend: {
                    // 车辆分页查询接口
                    api: '/table/monitor/query',
                    tabLabel: '关注列表',
                    tabIcon: 'md-link',
                    active: false,
                    index: 3
                }
            }
        },

        beforeMount() {
            let self = this
            self.$nextTick(function () {
                /*==================初始化页面==================*/
                //获取页面配置
                let roleId = 0
                let menuId = self.menuId
                self.initPageCfg({menuId: menuId, roleId: roleId})
            })
        },

        mounted() {
            var self =this;
            this.page.$on('switchTab',function (e) {
                self.tabFlag =e.tabFlag;
            });
        },

        methods: {

            //调用不同的组件
            ChangeComponets(data) {
                // console.log(data)
                const self = this
                self.tabClose = false
                self.container = data
                setTimeout(function () {
                    self.mapWidth = window.innerWidth - 344
                }, 300);
            },

            //关闭侧边面板
            closeTabComponets() {
                const self = this
                self.tabClose = !this.tabClose
                setTimeout(function () {
                    if (self.tabClose) {
                        self.mapWidth = window.innerWidth - 44
                    } else {
                        self.mapWidth = window.innerWidth - 344
                    }
                }, 300);
            },

            ...mapMutations('monitorState', [
                'initPageCfg' //初始化页面
            ]),


        },

        computed: {

            menuId() {
                return this.$route.meta.menuId
            },

            ...mapGetters('monitorState', [
                'pageCfg'  //返回页面配置
            ])
        },
    }
</script>


