<template>
    <div class="layout-monitor-container" :class="{right:tabRight,full:tabClose}">
        <monitorTab :tabCfg="tabCfg" @containerChange="ChangeComponets"/>
        <div class="monitor-container">
            <!--关闭侧边面板-->
            <div class="ivu-split-trigger ivu-split-trigger-vertical fl" @click="closeTabComponets">
                <div class="ivu-split-trigger-bar-con vertical"><i class="ivu-split-trigger-bar"></i><i
                        class="ivu-split-trigger-bar"></i><i class="ivu-split-trigger-bar"></i><i
                        class="ivu-split-trigger-bar"></i><i class="ivu-split-trigger-bar"></i><i
                        class="ivu-split-trigger-bar"></i><i class="ivu-split-trigger-bar"></i><i
                        class="ivu-split-trigger-bar"></i>
                </div>
            </div>
            <div class="fl" :style="{width:mapWidth +'px',height:mapHeight +'px'}">
                <mapMain v-if="tabFlag.indexOf('map') > -1" :mapWidth="mapWidth" :mapHeight="mapHeight"
                         :mapControl="mapControl"/>
                <videoMain v-if="tabFlag.indexOf('video') > -1"/>
            </div>
        </div>
    </div>
</template>


<script>

    //调用依赖的组件
    import monitorTab from '../components/monitor/map-tab'             // 监控侧边栏
    import mapMain from '../components/monitor/map-master'    // 地图组件
    import videoMain from '../components/monitor/video-master'  // 视频组件

    //依赖库
    import {mapState, mapMutations, mapGetters} from 'vuex'


    export default {

        components: {
            mapMain,         // 地图组件
            videoMain,       // 视频组件
            monitorTab       // 监控侧边栏
        },

        data() {
            return {
                tabRight: false,   // 控制TAB选项卡左右分布
                tabClose: false,
                tabFlag: 'map',      // 调用主体组件的类型，默认为地图--map ，其余:视频--video ， 扬尘噪音--air ， 门禁组件--door

                mapWidth: window.innerWidth - 344,
                mapHeight: window.innerHeight - 64,

                mapControl: {
                    poi: true,
                    tile: true,
                    toolbox: true,
                    grid: true,
                    lat: 30.222,
                    lng: 113.255
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

        methods: {
            //调用不同的组件
            ChangeComponets(data) {
                // console.log(data)
                const self = this
                self.tabClose = false
                self.container = data
                setTimeout(function () {
                    self.mapWidth = window.innerWidth - 344
                }, 300)
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
                }, 300)
            },
            ...mapMutations('monitorState', [
                'initPageCfg' //初始化页面
            ])
        },

        computed: {
            menuId() {
                return this.$route.meta.menuId
            },
            tabCfg() {
                let self = this
                let pageCfg = self.pageCfg
                for (var i in pageCfg) {
                    if (pageCfg[i].menuId == self.menuId) {
                        let monitorBtn = [].concat(pageCfg[i].monitorButton)
                        self.container = monitorBtn[0].type
                        // console.log(monitorBtn)
                        // localStorage.setItem('$tempCfg2', JSON.stringify(monitorBtn))
                        return monitorBtn
                    }
                }
            },
            ...mapGetters('monitorState', [
                'pageCfg'  //返回页面配置
            ])
        }

    }
</script>
