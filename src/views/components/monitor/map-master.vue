
<template>
    <div class="map-container">
        <div class="layout-map-grid" v-if="mapToolCfg.grid">
            <Tabs>
                <TabPane label="监控列表" icon="logo-apple">
                    <listBox   @location="location" @track="track" @history="history" :page="page"/>
                </TabPane>

                <TabPane label="报警列表" icon="logo-windows">
                    <listAlarm  @location="location" @track="track" :page="page"/>
                </TabPane>

            </Tabs>

        </div>
    </div>
</template>

<script>
    // 指令下发
    import Instruction from '../../monitor/instruction/index';
    // 详情
    import Detail from '../../monitor/detail/index';


    //调用的状态管理
    import {mapState, mapGetters} from 'vuex'

    //页面使用组件
    import pLoading from '../common/pageLoading'
    import listBox from './monitor-list'
    import listAlarm from './alarm-list'

    //调用依赖库
    import Util from '../../../libs/util'

    require('../../../libs/leaflet-1.0.3/leaflet-src.js');
    require('../../../libs/map-lib/ExSunMap-2.4.0-src.js');
    require('../../../libs/map-lib/leaflet.markercluster-src.js');
    require('../../../libs/map-lib/MovingMarker.js');

    const pageUrl = require('../../../libs/api.js').mapMonitor;
    const vehicleAttention = require('../../../libs/api').vehicleAttention
    const vehicleUnAttention = require('../../../libs/api').vehicleUnAttention

    export default {
        props: ['mapWidth', 'mapHeight', 'mapControl', 'page'],

        components: {
            pLoading,
            listBox,
            listAlarm
        },

        data() {
            return {
                mapObj: null,
                poiText: '',
                vehNo: null,
                cluster: null,
                map: null,
                liveMange: null,
                webSocket: null,
                modalShow: false,
                rowData:null,
                locationLayer:null
            }
        },

        mounted() {
            this.initMap();
            if(this.mapToolCfg.cluster){
                this.loadCluster();
            }

            this._initOn();
            if(this.mapToolCfg.liveMange){
                this.loadLiveMange();
            }
            if(this.mapToolCfg.webSocket){
                this.loadWebSocket();
            }
            if(this.mapToolCfg.grid){
                //this.loadAramGrid();
            }

        },

        methods: {

            _initOn: function () {
                this.listData = {
                    pageNum: 1,
                    total: 0,
                    size: 100,
                    list: []
                };
                const self = this;

                if (!this.page) {
                    return;
                }

                //触发关注事件
                this.page.$on('veh-attend', function (data) {
                    let oParams = {
                        vehNo: data.vehNo,
                        vehicleId: data.id
                    }
                    Util.ojax.post(vehicleAttention, oParams).then(function (response) {
                        if (response.data.code == '0') {
                            self.$Notice.success({
                                title: '提示',
                                desc: '关注成功!',
                                duration: 3
                            })
                        }
                    })
                });

                // 取消关注事件
                this.page.$on('veh-unattend', function (data) {
                    self
                    debugger
                    let oParams = {ids: data.id}
                    Util.ojax.post(vehicleUnAttention, oParams).then(function (response) {
                        if (response.data.code == '0') {
                            self.$Notice.success({
                                title: '提示',
                                desc: '取消关注成功!',
                                duration: 3
                            })
                        }
                    })
                });

                //触发跟踪事件
                this.page.$on('track', function (data) {
                    self.track(data);

                });


                this.page.$on('history', function (data) {
                    self.history(data);

                });

                // 取消跟踪
                this.page.$on('untrack', function (data) {
                    self.untrack(data);

                });

                // 触发定位事件
                this.page.$on('location', function (data) {
                    self.location(data);
                });


              // 点名
              this.page.$on('send-call-name', function (data) {
                const { devNo: clientId, vehNo: plateNum } = data;
                Instruction.callForCarPosition(clientId, plateNum);
              });
              // 拍照
              this.page.$on('send-camera', function (data) {
                const { devNo: clientId, vehNo: plateNum } = data;
                Instruction.takePhoto(clientId, plateNum);
              });
              // 下方文本
              this.page.$on('send-text', function (data) {
                const { devNo: clientId, vehNo: plateNum } = data;
                Instruction.sendText(clientId, plateNum);
              });
              // 监听
              this.page.$on('send-monitor', function (data) {
                const { devNo: clientId, vehNo: plateNum } = data;
                Instruction.setListener(clientId, plateNum);
              });
              // 参数设置
              this.page.$on('send-config', function (data) {
                const { devNo: clientId, vehNo: plateNum } = data;
                Instruction.setParamsConfig(clientId, plateNum);
              });
              // 详情
              this.page.$on('detail', function(data) {
                const { devNo: clientId, vehNo: plateNum } = data;
                Detail.show(clientId, plateNum);
              });
            },

            initMap() {
                const self = this

                self.mapObj = new L.ExSunMap.ESMapMaster(this.page, {
                    containerClass: 'map-container',
                    mapContainerId: this.mapControl.mapContainerId,
                    lat: this.mapControl.lat||30.2355,
                    lng: this.mapControl.lng||114.255
                });
                self.mapObj.loadMap(self.mapWidth, self.mapWidth);
                // 加载其他地图控件
                self.mapCfg()
                self.resizeMap();

            },

            // 加载聚合数据
            loadCluster: function () {

                var self = this;
                Util.ojax.post(pageUrl.cluderUrl, {}).then(function (response) {
                    if (response.data.code !== '0') {
                        // 查询数据为0
                        return;
                    }
                    self.cluster = new L.ExSunMap.VehClusterLayer(self.page, {url: pageUrl.realLocation},self.mapObj.getMap());
                    self.cluster.drawLayers({aoData: response.data.detail});
                });
            },

            // 加载跟踪数据
            loadLiveMange: function () {
                this.liveMange = new L.ExSunMap.LiveMange(this.page, {url: pageUrl.realLocation},this.mapObj.getMap());

                // 负责定位使用
                this.locationLayer = new L.ExSunMap.LocationLayer(this.page, {url: pageUrl.realLocation},this.mapObj.getMap());

            },

            // 加载websocket
            loadWebSocket: function () {
                this.webSocket = new L.WebSocketSvr(this.page, {url: pageUrl.websocket});
            },

            mapCfg() {
                const self = this
                let mapCfg = self.mapToolCfg

                // 加载poi查询控件
                if (mapCfg.poi) self.mapObj.loadSearch({cUrl: pageUrl.searchUrl});
                if (mapCfg.tile) self.mapObj.loadMapTile();
                if (mapCfg.toolbox) self.mapObj.loadToolBox();

            },

            resizeMap() {
                const self = this
                self.mapObj.resize(self.mapWidth, self.mapHeight);
            },

            // 定位
            location: function (data) {

                if (!data || !data.latLng) {
                    return;
                }

                if(!data.hasOwnProperty('dir'))
                {
                    data.dir = 0;
                }

                this.mapObj.flyTo(data.latLng,{zoom:14,duration:1});

                this.locationLayer.clearLayer();
                // 找到点对象触发点击事件
                // 在聚会中的函数是找不到点
                let aoLayer =this.mapObj.findLayerInMap(data.devNo);
                if(!aoLayer || aoLayer.length <=0){

                    let layer = this.locationLayer.drawLayer(data);
                    // 触发点击事件
                    layer.fire('click');
                }
                else {
                    aoLayer[0].openPopup();
                }
            },

            // 历史轨迹
            history: function (data) {
                window.open('/WebHisTrack/html/trackview.html?PhoneNum=' + data.devNo + '&VehicleNo=' + data.vehNo);
            },

            // 跟踪
            track: function (data) {
                // 单个点添加监控
                this.liveMange.addLivePos({oGpsInfo: data});
                this.webSocket.subGps({devNos: [data.devNo]});
            },

            untrack:function (data) {
                this.liveMange.removePos({oGpsInfo: data});
                this.webSocket.unsubGps({devNos: [data.devNo]});
            },

        },

        computed: {
            mapwidth() {
                // this.mapObj.resize(this.$props.mapWidth, this.mapheight);
                return this.$props.mapWidth
            },
            mapheight() {
                // this.mapObj.resize(this.mapwidth, this.$props.mapHeight);
                return this.$props.mapHeight
            },
            mapToolCfg() {
                return this.$props.mapControl
            },

            menuId() {
                return this.$route.meta.menuId
            },
            ...mapState('mapState', {
                mapData: (state) => state.mapData
            }),
            ...mapGetters('mapState', [
                'pageCfg'

            ])
        },

        watch: {
            mapWidth(n, o) {
                //console.log(n)
                this.mapObj.resize(n, this.mapHeight);
            },
            mapHeight(n, o) {
                //console.log(n)
                this.mapObj.resize(this.mapWidth, n);
            }
        }
    }
</script>

<style scoped>
    @import '../../../libs/leaflet-1.0.3/leaflet.css';
</style>

