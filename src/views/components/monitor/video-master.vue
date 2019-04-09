<template>
    <div class="layout-video-box">
        <!--视频-->
        <div class="layout-video">
            <!--主体窗口-->
            <div class="layout-video-main">
                <Row class="v-box">
                    <Col :span="v.span" v-for="v,index in videoBoxFrame" :key="v.id"
                         :style="{'height':v.height,'display':v.vDispaly}"
                    >
                        <div class="v-box-li" :class="{active:index == curIndex}">
                            <VideoBox :toplay="v.toplay" :userId="v.userId" :devNo="v.devNo" :chnId="v.chnId"
                                      :wsUrl="v.wsUrl" :id="v.id" :vehNo="v.vehNo" :data-index="index" :clientId="v.clientId"
                                      :data-vehno="v.vehNo">
                            </VideoBox>
                        </div>
                    </Col>
                </Row>
            </div>

            <!--视频控制条-->
            <div class="layout-video-top">
                <Button @click="closeAllVideo">关闭全部视频</Button>
                <ButtonGroup class="fr">
                    <Button style="color:rgb(14, 168, 245);">视频个数</Button>
                    <Button @click="changeVideoBox(1)">1</Button>
                    <Button @click="changeVideoBox(2)">2</Button>
                    <Button @click="changeVideoBox(4)">4</Button>
                    <Button @click="changeVideoBox(6)">6</Button>
                    <Button @click="changeVideoBox(9)">9</Button>
                    <Button @click="changeVideoBox(16)">16</Button>
                </ButtonGroup>
            </div>

        </div>
        <!--地图-->
<!--        <div class="layout-video-map" ref="layoutMap">-->
<!--            <div class="ivu-split-trigger ivu-split-trigger-vertical fl" @click="closeMapComponets">-->
<!--                <div class="ivu-split-trigger-bar-con vertical"><i class="ivu-split-trigger-bar"></i><i-->
<!--                        class="ivu-split-trigger-bar"></i><i class="ivu-split-trigger-bar"></i><i-->
<!--                        class="ivu-split-trigger-bar"></i><i class="ivu-split-trigger-bar"></i><i-->
<!--                        class="ivu-split-trigger-bar"></i><i class="ivu-split-trigger-bar"></i><i-->
<!--                        class="ivu-split-trigger-bar"></i></div>-->
<!--            </div>-->
<!--            <mapMain :mapWidth="mapWidth" :mapHeight="mapHeight" :mapControl="mapControl"/>-->
<!--        </div>-->
        <div class="layout-video-map" ref="layoutMap" v-if="isShowMap">
            <div class="map-vechileVideo" id="videoMap"></div>
        </div>

    </div>
</template>

<script>
    //调用的组件
    import VideoBox from '../../components/video/videoboxInside'
    import {mapState, mapMutations, mapGetters} from 'vuex'
/*地图引入*/

    // 指令下发
    import Instruction from '../../monitor/instruction/index';
    // 详情
    import Detail from '../../monitor/detail/index';

    //调用依赖库
    import Util from '../../../libs/util'
    require('../../../libs/leaflet-1.0.3/leaflet-src.js');
    require('../../../libs/map-lib/ExSunMap-2.4.0-src.js');
    require('../../../libs/map-lib/leaflet.markercluster-src.js');
    require('../../../libs/map-lib/MovingMarker.js');
    const pageUrl = require('../../../libs/api.js').mapMonitor;


    let vNum = 16
    export default {
        components: {
            'remote-js': {
                render(createElement) {
                    return createElement('script', {attrs: {type: 'text/javascript', src: this.src}});
                },
                props: {
                    src: {type: String, required: true}
                }
            },
            VideoBox,  // 播放窗口
/*            mapMain    // 地图组件*/
        },
        data() {
            return {
                videoBoxFrame: [],
                selectedVideoData: [],
                resVideoData: [],
                isAddVideo:false,
                addVideoData: [],
                reduceVideoData: [],
                toplay: false,
                devNo: "018080100234",
                userId: '502',
                mapWidth: null,
                mapHeight: null,
                mapControl: {
                    poi: false,
                    tile: true,
                    toolbox: false,
                    vehno: null,
                    lat: 30.222,
                    lng: 113.255,
                    mapContainerId: 'videoMap',
                    cluster:true,
                    webSocket:true,
                    liveMange:true
                },
                curIndex: 0,
                //地图相关对象
                mapObj: null,
                poiText: '',
                vehNo: null,
                cluster: null,
                map: null,
                liveMange: null,
                webSocket: null,
                modalShow: false,
                rowData:null,
                locationLayer:null,
                isShowMap:true
            }
        },
        computed: {
            ...mapGetters('monitorState', [
                'getVechileVideoData'
            ]),

            mapwidth() {
                // this.mapObj.resize(this.$props.mapWidth, this.mapheight);
                return this.mapWidth
            },
            mapheight() {
                // this.mapObj.resize(this.mapwidth, this.$props.mapHeight);
                return this.mapHeight
            },
            mapToolCfg() {
                return this.mapControl
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
            getVechileVideoData: {
                handler(newValue, oldValue) {
                    let self = this
                    this.selectedVideoData = []
                    let newChannelVideoIds = []
                    let oldChannelVideoIds = []
                    if(newValue.length){
                        for(let item of newValue){
                            if(item.type === 'channel'){
                                this.selectedVideoData.push(item)
                                newChannelVideoIds.push(item.$treeNodeId)
                            }
                        }
                    }

                    let newChannelVideo = this.selectedVideoData
                    let oldChannelVideo = []
                    if(oldValue.length){
                        for(let item of oldValue){
                            if(item.type === 'channel'){
                                oldChannelVideo.push(item)
                                oldChannelVideoIds.push(item.$treeNodeId)
                            }
                        }
                    }


                    let addVideoIds = []
                    let reduceVideoIds = []
                    if(newChannelVideoIds.length>oldChannelVideoIds.length){
                        this.isAddVideo = true
                        for(let item of newChannelVideoIds) {
                            if(oldChannelVideoIds.indexOf(item)===-1){
                                addVideoIds.push(item)
                            }
                        }
                    }else {
                        this.isAddVideo = false
                        for(let item of oldChannelVideoIds) {
                            if(newChannelVideoIds.indexOf(item)===-1){
                                reduceVideoIds.push(item)
                            }
                        }
                    }
                    let addVideo = [] //新增的视频
                    let reduceVideo = [] // 减少的视频
                    for(let item of addVideoIds){
                        for(let res of newChannelVideo){
                            if(item === res.$treeNodeId){
                                addVideo.push(res)
                            }

                        }
                    }
                    for(let item of reduceVideoIds){
                        for(let res of oldChannelVideo){
                            if(item === res.$treeNodeId){
                                reduceVideo.push(res)
                            }

                        }
                    }

                    this.addVideoData =  addVideo
                    this.reduceVideoData =  reduceVideo
                    if(this.addVideoData.length){
                        for(let i=0;i<this.addVideoData.length;i++){
                            for(let j=0;j<this.videoBoxFrame.length;j++){
                                if(!this.videoBoxFrame[j].wsUrl){
                                    this.videoBoxFrame[j].clientId = this.addVideoData[i].data.devNo // 设备编号
                                    this.videoBoxFrame[j].channelLine = this.addVideoData[i].data.channelLine
                                    this.videoBoxFrame[j].channelName = this.addVideoData[i].data.channelName
                                    this.videoBoxFrame[j].channelNum = this.addVideoData[i].data.channelNum
                                    this.videoBoxFrame[j].wsUrl = `ws://36.111.196.84:1078/mediawebsocket/1_${this.addVideoData[i].data.devNo}_1.flv`
                                    break
                                }
                            }
                        }
                    }
                    if(this.reduceVideoData.length){
                        for(let i=0;i<this.reduceVideoData.length;i++){
                            for(let j=0;j<this.videoBoxFrame.length;j++){
                                if(this.reduceVideoData[i].data.devNo ===  this.videoBoxFrame[j].clientId){ // 根据设备id关闭相应设备
                                    this.videoBoxFrame[j] =   {
                                        id: this.videoBoxFrame[j].id,
                                        span: 0,
                                        height: 'auto',
                                        vDispaly: 'none',
                                        toplay: false
                                    }
                                    break
                                }
                            }
                        }
                    }

                    let len = this.selectedVideoData.length


                    if (len > 16) {
                        this.$Message.error({
                            duration: 3,
                            content:'最多播放16个视频'
                        })
                        return
                    }
                  if(len===1){
                      this.changeVideoBox(1)
                  }else if(len===2) {
                      this.changeVideoBox(2)
                  }else if(len > 2 && len < 5){
                      this.changeVideoBox(4)
                  } else if(len > 4 && len < 7){
                      this.changeVideoBox(6)
                  } else if(len > 6 && len < 10){
                      this.changeVideoBox(9)
                  } else if(len > 10 && len <17){
                      this.changeVideoBox(16)
                  }
                    // 根据设备查询详情
                    self.cluster.clearLayer() //清除之前的点位
                    let params = []
                    for(let item of this.selectedVideoData){
                        params.push(item.data.devNo)
                    }
                    let param = {
                        devNos:params
                    }
                    /*                   let layGroup =new L.FeatureGroup  L.LayerGroup
                                        let layGroup =new L.LayerGroup
                                        let _map = self.mapObj.getMap()
                                        layGroup.addTo(_map)
                                        layGroup.clearLayers()
                                        // 请求接口创建maker
                                        let Makers = []*/
                    // if(self.resVideoData.length!==0){
                    //     self.cluster.removeLayers({acId:self.resVideoData})
                    // }
                    if(params.length!==0){
                        Util.ojax.post(pageUrl.realLocation, param).then(function (response) {
                            if (response.data.code !== '0') {
                                self.$Message.error({
                                    duration: 3,
                                    content:response.data.error
                                })
                                return;
                            }
                            self.cluster.drawLayers({aoData: response.data.detail});
                            self.resVideoData = response.data.detail
                            if(newValue.length > oldValue.length){
                                let flyObj = {}
                                for(let item of self.resVideoData){
                                    if(addVideo[addVideo.length-1].data.devNo === item.devNo){
                                        flyObj = item
                                    }
                                }
                                if(flyObj.latLng!==null){
                                    self.mapObj.flyTo(flyObj.latLng,{zoom:14,duration:1}); // 新增时定位新增的点
                                }
                            }
                            /*                            var myIcon = new L.Icon.Default
                                                        let options = {
                                                            icon: myIcon
                                                        }
                                                        self.resVideoData.forEach(res=>{
                                                            let point = L.marker(res.latLng, options)
                                                            layGroup.addLayer(point)
                                                            Makers.push(point)
                                                        })*/
                        })
                    }
                    this.commitVechileVideoData_frame(this.videoBoxFrame)
                },
                deep: true
            },
            mapWidth(n, o) {
                //console.log(n)
                this.mapObj.resize(n, this.mapHeight);
            },
            mapHeight(n, o) {
                //console.log(n)
                this.mapObj.resize(this.mapWidth, n);
            }
        },
        mounted() {
            const self = this
            self.$nextTick(function () {
                self.initVideBox()
                self.changeVideoBox(4)
                self.mapWidth = self.$refs.layoutMap.offsetWidth - 12
                self.mapHeight = self.$refs.layoutMap.offsetHeight
            })

            // 地图引用
            this.initMap();
            this._initOn();
        },
        methods: {
            ...mapMutations('monitorState', [
                'commitVechileVideoData_frame'
            ]),
            ...mapMutations('monitorState', [
                'commitRetTree'
            ]),
            ...mapMutations('monitorState', [
                'commitVechileVideoData_frame'
            ]),
            // 初始化视频容器
            initVideBox() {
                            this.videoBoxFrame = []
                            for (var i = 0; i < vNum; i++) {
                                this.videoBoxFrame.push(
                                    {
                                        id: 'video' + (i + 1),
                                        span: 0,
                                        height: 'auto',
                                        vDispaly: 'none',
                                        toplay: false,
               /*                         chnId: 0,
                                        devNo: '',
                                        vehNo: ''*/
                                    }
                                )
                            }
                this.commitVechileVideoData_frame(this.videoBoxFrame)
                        },
            //变化窗体数量
            changeVideoBox(n) {
                var self = this
                switch (n) {
                    case 1:
                        for (var i = 0; i < vNum; i++) {
                            self.videoBoxFrame[i].span = 24
                            self.videoBoxFrame[i].height = '100%'
                            self.videoBoxFrame[i].vDispaly = 'block'
                            self.videoBoxFrame[i].cid = 1
                            if (i >= 1) {
                                self.videoBoxFrame[i].span = 0
                                self.videoBoxFrame[i].height = 'auto'
                                self.videoBoxFrame[i].vDispaly = 'none'
                            }
                        }
                        break
                    case 2:
                        for (var i = 0; i < vNum; i++) {
                            self.videoBoxFrame[i].span = 24
                            self.videoBoxFrame[i].height = '50%'
                            self.videoBoxFrame[i].vDispaly = 'block'
                            self.videoBoxFrame[i].cid = i + 1
                            if (i >= 2) {
                                self.videoBoxFrame[i].span = 0
                                self.videoBoxFrame[i].height = 'auto'
                                self.videoBoxFrame[i].vDispaly = 'none'
                            }
                        }
                        break
                    case 4:
                        for (var i = 0; i < vNum; i++) {
                            self.videoBoxFrame[i].span = 12
                            self.videoBoxFrame[i].height = '50%'
                            self.videoBoxFrame[i].vDispaly = 'block'
                            self.videoBoxFrame[i].cid = 1
                            if (i >= 4) {
                                self.videoBoxFrame[i].span = 0
                                self.videoBoxFrame[i].height = 'auto'
                                self.videoBoxFrame[i].vDispaly = 'none'
                            }
                        }
                        break
                    case 6:
                        for (var i = 0; i < vNum; i++) {
                            self.videoBoxFrame[i].span = 8
                            self.videoBoxFrame[i].height = '33.33%'
                            self.videoBoxFrame[i].vDispaly = 'block'
                            self.videoBoxFrame[i].cid = 1
                            if (i == 0) {
                                self.videoBoxFrame[i].span = 16
                                self.videoBoxFrame[i].height = '66.65%'
                                self.videoBoxFrame[i].vDispaly = 'block'
                            } else if (i >= 6) {
                                self.videoBoxFrame[i].span = 0
                                self.videoBoxFrame[i].height = 'auto'
                                self.videoBoxFrame[i].vDispaly = 'none'
                            }
                        }
                        break
                    case 9:
                        for (var i = 0; i < vNum; i++) {
                            self.videoBoxFrame[i].span = 8
                            self.videoBoxFrame[i].height = '33.33%'
                            self.videoBoxFrame[i].vDispaly = 'block'
                            self.videoBoxFrame[i].cid = 1
                            if (i >= 9) {
                                self.videoBoxFrame[i].span = 0
                                self.videoBoxFrame[i].height = 'auto'
                                self.videoBoxFrame[i].vDispaly = 'none'
                            }
                        }
                        break
                    case 16:
                        for (var i = 0; i < vNum; i++) {
                            self.videoBoxFrame[i].span = 6
                            self.videoBoxFrame[i].height = '25%'
                            self.videoBoxFrame[i].vDispaly = 'block'
                            self.videoBoxFrame[i].cid = 1
                        }
                        break
                }
            },
            //显示地图控件
            showMap(index) {
                this.isShowMap = !this.isShowMap
            },
            // 处理后台返回的treeData数据
            dealTreeData(tree) {
                let arr = []
                let self = this
                if (tree && tree.length !== 0) {
                    tree.forEach(item => {
                        let obj = {}
                        obj.title = item.text
                        obj.expand = item.opened
                        obj.data = item.data
                        obj.type = item.type
                        obj.pid = item.pid
                        obj.id = item.id
                        obj.children = self.dealTreeData(item.children)// 递归调用
                        arr.push(obj)
                    });
                }
                return arr
            },
            closeAllVideo(){
                for(let j=0;j<this.videoBoxFrame.length;j++){
                    if(this.videoBoxFrame[j].wsUrl){
                        this.videoBoxFrame[j] =   {
                            id: this.videoBoxFrame[j].id,
                            span: 0,
                            height: 'auto',
                            vDispaly: 'none',
                            toplay: false
                        }
                    }
                }
                this.changeVideoBox(1)
                this.commitRetTree(false)
                // this.commitVechileVideoData_frame(this.videoBoxFrame)
            },
            /*地图相关方法*/
            _initOn: function () {
                const self = this;


                //触发跟踪事件
                this.$on('track', function (data) {
                    self.track(data);

                });


                this.$on('history', function (data) {
                    self.history(data);

                });

                // 取消跟踪
                this.$on('untrack', function (data) {
                    self.untrack(data);

                });

                // 触发定位事件
                this.$on('location', function (data) {
                    self.location(data);
                });

                // 点名
                this.$on('send-call-name', function (data) {
                    const { devNo: clientId, vehNo: plateNum } = data;
                    Instruction.callForCarPosition(clientId, plateNum);
                });
                // 拍照
                this.$on('send-camera', function (data) {
                    const { devNo: clientId, vehNo: plateNum } = data;
                    Instruction.takePhoto(clientId, plateNum);
                });
                // 下方文本
                this.$on('send-text', function (data) {
                    const { devNo: clientId, vehNo: plateNum } = data;
                    Instruction.sendText(clientId, plateNum);
                });
                // 监听
                this.$on('send-monitor', function (data) {
                    const { devNo: clientId, vehNo: plateNum } = data;
                    Instruction.setListener(clientId, plateNum);
                });
                // 参数设置
                this.$on('send-config', function (data) {
                    const { devNo: clientId, vehNo: plateNum } = data;
                    Instruction.setParamsConfig(clientId, plateNum);
                });

                // 详情
                this.$on('detail', function(data) {
                  debugger;
                  const { devNo: clientId, vehNo: plateNum } = data;
                  Detail.show(clientId, plateNum);
                });
            },

            initMap() {
                const self = this

                self.mapObj = new L.ExSunMap.ESMapMaster(this, {
                    containerClass: 'map-vechileVideo',
                    mapContainerId: this.mapControl.mapContainerId,
                    lat: this.mapControl.lat||30.2355,
                    lng: this.mapControl.lng||114.255
                });
                self.mapObj.loadMap(self.mapWidth, self.mapWidth);
                // 加载其他地图控件
                self.mapCfg()
                self.resizeMap();
                self.cluster = new L.ExSunMap.VehClusterLayer(self, {url: pageUrl.realLocation},self.mapObj.getMap());
                self.cluster.drawLayers({aoData: []})
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

                    let layer = this.locationLayer.drawLayer(data); // 在地图上绘制图层
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


            cancelMonitor:function (data) {
                const self = this;
                let index = Util.InObjArrayOfIndex(self.listData.list, data.devNo, 'devNo')
                if (index<0) {
                    return ;
                }

                self.listData.list.splice(index,1);

            }
        }
    }
</script>

<style scoped lang="less">
    @import '../../../libs/leaflet-1.0.3/leaflet.css';
    .layout-video-box {
        width: 100%;
        height: 100%;
        background-color: #f1f1f1;

        .layout-video {
            width: calc(70% - 20px);
            height: 100%;
            float: left;
            transition: width .5s ease-in-out;

            .layout-video-top {
                width: 100%;
                line-height: 39px;
                height: 39px;
                padding: 6px 10px 0;
            }

            .layout-video-main {
                height: calc(100% - 45px);
                background-color: #ececf0;
            }

            .v-box {
                width: 100%;
                overflow: hidden;
            }

            .v-box > div.ivu-col {
                transition: all .5s;
            }

            .v-box .v-box-li {
                width: 100%;
                height: 100%;
                background: #333 url("/assets/img/play_video_bg.jpg") center no-repeat;
                background-size: cover;
                margin: 0.5px;
                border: 1px solid #1b1b1b;
                position: relative;
                z-index: 1;
                cursor: pointer;
            }

            .v-box .v-box-li.active {
                border-color: #0ad100;
            }

            .v-box-li-title {
                background-color: rgba(0, 0, 0, .45);
                color: #fff;
                padding: 7px 15px;
            }

        }

        .layout-video-map {
            float:right;
            width: 30%;
            height: 100%;
            transition: width .5s ease-in-out
        }
        .map-container{
           width:100%;
            height: 100%;
        }
        map-container /deep/ .leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {
            -ms-touch-action: none;
            touch-action: none;
            float: right;
        }
    }



</style>
