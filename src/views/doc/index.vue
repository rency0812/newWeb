<template>
    <div class="layout-migrate-pages" id="pageOverview" style="position: relative">
        <div class="layout-btn-screen">
            <Tooltip content="退出全屏模式" placement="left">
                <Button type="text" shape="circle" @click="handleScreen(false)" v-show="screen">
                    <Icon type="md-contract"></Icon>
                </Button>
            </Tooltip>
            <Tooltip content="进入全屏模式" placement="left">
                <Button type="text" shape="circle" @click="handleScreen(true)" v-show="!screen">
                    <Icon type="md-expand"></Icon>
                </Button>
            </Tooltip>
        </div>
        <div class="layout-overview">
            <Row>
                <Col span="5">
                    <div class="overview-box overview-box-small" style="margin-bottom: 10px">
                        <h3>入网车辆类别(单位:辆)</h3>
                        <div class="o-charts-box-01" id="carTypeCharts"></div>
                        <ul class="o-car-type-total">
                            <li>
                                <div class="count">{{vStatusTotal}}</div>
                                <p>入网车辆总数</p>
                            </li>
                            <li>
                                <div class="count count2">{{vOnlineTotal}}</div>
                                <p>在线车辆总数</p>
                            </li>
                        </ul>
                    </div>
                    <div class="overview-box overview-box-small" style="margin-bottom: 10px">
                        <h3>车辆上线情况</h3>
                        <div class="o-charts-box-01" id="carOnlineCharts"></div>

                        <ul class="o-online-top">
                            <li>
                                <div class="online-label">行驶车辆</div>
                                <div class="online-box">
                                    <div class="online-li"
                                         :style="{'width':(vStatusOnineData[0]*100/vStatusTotal) +'%'}">
                                        {{vStatusOnineData[0]}}辆
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="online-label">停车车辆</div>
                                <div class="online-box">
                                    <div class="online-li"
                                         :style="{'width':(vStatusOnineData[1]*100/vStatusTotal) +'%'}">
                                        {{vStatusOnineData[1]}}辆
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="online-label">熄火车辆</div>
                                <div class="online-box">
                                    <div class="online-li"
                                         :style="{'width':(vStatusOnineData[2]*100/vStatusTotal) +'%'}">
                                        {{vStatusOnineData[2]}}辆
                                    </div>
                                </div>
                            </li>
                        </ul>

                    </div>
                    <div class="overview-box overview-box-small" style="height:calc(20% - 10px);">
                        <h3>车辆报警次数TOP5(单位:次)</h3>
                        <div class="o-charts-box-02" id="vehicleAlarmCharts"></div>

                        <!--<ul class="o-alerm-top">-->
                            <!--<li v-for="item in top5Vehicle">-->
                                <!--<p>{{item.alarmCount}}</p>-->
                                <!--<div class="alerm-box">-->
                                    <!--<div class="alerm-li" :style="{height:(item.alarmCount/50)+'%'}"></div>-->
                                <!--</div>-->
                                <!--<p>{{item.vehicleNumber}}</p>-->
                            <!--</li>-->
                        <!--</ul>-->
                    </div>
                </Col>
                <Col span="14">
                    <div class="overview-box-map">
                        <div class="o-charts-box-map" id="mapCharts"></div>

                    </div>
                    <Row>
                        <Col span="16">
                            <div class="overview-box overview-box-small" style="height:calc(20% - 10px);">
                                <h3>车辆运营数(单位:辆)</h3>
                                <div class="o-charts-box-02" id="carInCharts"></div>
                            </div>
                        </Col>
                        <Col span="8">
                            <div class="overview-box overview-box-small" style="height:calc(20% - 10px);">
                                <h3>企业报警次数TOP5</h3>
                                <div class="o-charts-box-02" id="comAlermCharts"></div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span="5">
                    <div class="overview-box overview-box-small" style="height:calc(30% - 10px);margin-bottom: 10px">
                        <h3>实时报警信息</h3>
                        <ul class="o-box-alerm-all">
                            <li class="flip-in-right" v-for="item,index in truckAlerm" :key="index" @click="toBehavior">
                                <div class="o-vechileNum">{{item.vechileNum}}</div>
                                <div class="o-vechileAlerm" :title="item.vachileAlerm">{{item.vachileAlerm}}</div>
                                <div class="o-vechileLocation">{{item.vachileLocation}}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="overview-box overview-box-small" style="height:calc(50% - 10px);margin-bottom: 10px;padding: 15px 15px 0px 15px;">
                        <h3>报警类型统计(单位:次)</h3>
                        <Row style="overflow: hidden;height: calc(100% - 30px);">
                            <Col span="7">
                                <ul class="o-charts-driver">
                                    <li>
                                        <div class="driver-box" style="background-color: transparent;float: left">今日
                                        </div>
                                        <div class="driver-box driver-today" style="width: 5px; margin: 0 5px 0 0 ;"></div>
                                    </li>
                                    <li v-for="item in driverCount" :key="item.label" v-if="item.today>0">
                                        <div class="driver-box driver-today">
                                            {{item.today}}
                                        </div>
                                        <!--<div class="driver-box driver-today"-->
                                             <!--:style="{'width':(item.today / persentBase)*100+'%'}">-->
                                            <!--{{item.today}}-->
                                        <!--</div>-->
                                        <!--{{item.today}}-->
                                    </li>
                                </ul>
                            </Col>
                            <Col span="10">
                                <ul class="o-charts-driver">
                                    <li>&nbsp;</li>
                                    <li v-for="item in driverCount" :key="item.label" v-if="item.today>0">
                                        <!--{{item.label}}-->
                                        <div class="driver-box" :title="item.label">{{item.label}}</div>
                                    </li>
                                </ul>
                            </Col>
                            <Col span="7">
                                <ul class="o-charts-driver">
                                    <li>
                                        <div class="driver-box driver-yestoday" style="width: 5px; margin: 0 0 0 5px;"></div>
                                        <div class="driver-box" style="background-color: transparent;float: left">昨日
                                        </div>

                                    </li>
                                    <li v-for="item in driverCount" :key="item.label" v-if="item.today>0">
                                        <div class="driver-box driver-yestoday">
                                            {{item.yestoday}}
                                        </div>
                                        <!--<div class="driver-box driver-yestoday"-->
                                             <!--:style="{'width':(item.yestoday / persentBase)*100+'%'}">-->
                                            <!--{{item.yestoday}}-->
                                        <!--</div>-->
                                        <!--{{item.yestoday}}-->
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </div>
                    <div class="overview-box overview-box-small" style="height:calc(20% - 10px);">
                        <h3>企业报离线次数TOP5</h3>
                        <div class="o-charts-box-02" id="comOfflineCharts"></div>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations,camelcase,complexity,no-unused-vars,no-global-assign */
const echarts = require('echarts')
require('echarts-gl')
import * as types from '../../libs/types'
import Util from '../../libs/util'
import axios from 'axios'


//接口地址
const wsForBigDataUrl = require('../../libs/api').wsForBigDataUrl   //ws推送接口
const getVehviewcountUrl = require('../../libs/api').getVehviewcountUrl   //车辆状态类型统计接口
const getMapVehicleDataUrl = require('../../libs/api').getMapVehicleDataUrl   //所有在线车辆
const getBigDataStatisticsUrl = require('../../libs/api').getBigDataStatisticsUrl   //大数据的统计报警接口

const alermCfg = {
    0: "紧急报警",
    1: "超速报警",
    2: "疲劳驾驶",
    3: "预警",
    4: "GNSS模块发生故障",
    5: "GNSS天线未接或被剪断",
    6: "GNSS天线短路",
    7: "终端主电源欠压",
    8: "终端主电源掉电",
    9: "终端LCD或显示器故障",
    10: "TTS模块故障",
    11: "摄像头故障",
    12: "当天累计驾驶超时",
    13: "超时停车",
    14: "进出区域",
    15: "进出路线",
    16: "路段行驶时间不足 / 过长",
    17: "路线偏离报警路线偏离报警",
    18: "车辆VSS故障",
    19: "车辆油量异常",
    20: "车辆被盗",
    21: "车辆非法点火",
    22: "车辆非法位移",
    23: "碰撞侧翻报警",
    24: "SD卡异常",
    25: "前向碰撞报警",
    26: "车道偏离报警",
    27: "车距过近报警",
    28: "行人碰撞报警",
    29: "频繁变道报警",
    30: "道路标识超限报警",
    31: "障碍物报警",
    32: "道路标志识别事件",
    33: "主动抓拍事件",
    34: "Adas疲劳驾驶报警",
    35: "接打电话报警",
    36: "抽烟报警",
    37: "分神驾驶报警",
    38: "驾驶员异常报警",
    39: "自动抓拍事件",
    40: "驾驶员变更事件",
    41: "胎压过高报警",
    42: "胎压过低报警",
    43: "胎温过高报警",
    44: "传感器异常报警",
    45: "胎压不平衡报警",
    46: "慢漏气报警",
    47: "电池电量低报警",
    48: "后方接近报警",
    49: "左侧后方接近报警",
    50: "右侧后方接近报警",
    100: "渣土车未密闭报警",
    101: "渣土车超载报警",
    102: "渣土车正常消纳报警",
    103: "渣土车正常出土报警",
    104: "渣土车可疑消纳报警",
    105: "渣土车可疑出土报警",
    106: "渣土车超速报警",
    107: "渣土车线路偏移报警",
    108: "渣土车进区域报警",
    109: "渣土车出区域报警",
    110: "路段限速报警",
    111: "非法驾驶报警",
    112: "非法停车报警",
    113: "车辆未保养报警"
}

require('../../../statics/bmap.min.js')
var alermId, vehicleId
let currentLocation

export default {
    data() {
        return {
            screen: false,
            carTypeCharts: null,
            carOnlineCharts: null,
            mapCharts: null,
            carDriverCharts: null,
            carDriverRightCharts: null,
            carInCharts: null,
            comAlermCharts: null,
            comOfflineCharts: null,
            vehicleAlarmCharts: null,
            driverCount: [{
                "label": "紧急报警",
                "alarmId": 0,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "超速报警",
                "alarmId": 1,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "疲劳驾驶",
                "alarmId": 2,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "预警",
                "alarmId": 3,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "GNSS模块发生故障",
                "alarmId": 4,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "GNSS天线未接或被剪断",
                "alarmId": 5,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "GNSS天线短路",
                "alarmId": 6,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "终端主电源欠压",
                "alarmId": 7,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "终端主电源掉电",
                "alarmId": 8,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "终端LCD或显示器故障",
                "alarmId": 9,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "TTS模块故障",
                "alarmId": 10,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "摄像头故障",
                "alarmId": 11,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "当天累计驾驶超时",
                "alarmId": 12,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "超时停车",
                "alarmId": 13,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "进出区域",
                "alarmId": 14,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "进出路线",
                "alarmId": 15,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "路段行驶时间不足 / 过长",
                "alarmId": 16,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "路线偏离报警路线偏离报警",
                "alarmId": 17,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "车辆VSS故障",
                "alarmId": 18,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "车辆油量异常",
                "alarmId": 19,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "车辆被盗",
                "alarmId": 20,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "车辆非法点火",
                "alarmId": 21,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "车辆非法位移",
                "alarmId": 22,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "碰撞侧翻报警",
                "alarmId": 23,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "SD卡异常",
                "alarmId": 24,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "前向碰撞报警",
                "alarmId": 25,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "车道偏离报警",
                "alarmId": 26,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "车距过近报警",
                "alarmId": 27,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "行人碰撞报警",
                "alarmId": 28,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "频繁变道报警",
                "alarmId": 29,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "道路标识超限报警",
                "alarmId": 30,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "障碍物报警",
                "alarmId": 31,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "道路标志识别事件",
                "alarmId": 32,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "主动抓拍事件",
                "alarmId": 33,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "Adas疲劳驾驶报警",
                "alarmId": 34,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "接打电话报警",
                "alarmId": 35,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "抽烟报警",
                "alarmId": 36,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "分神驾驶报警",
                "alarmId": 37,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "脱离方向盘",
                "alarmId": 38,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "自动抓拍事件",
                "alarmId": 39,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "驾驶员变更事件",
                "alarmId": 40,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "胎压过高报警",
                "alarmId": 41,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "胎压过低报警",
                "alarmId": 42,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "胎温过高报警",
                "alarmId": 43,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "传感器异常报警",
                "alarmId": 44,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "胎压不平衡报警",
                "alarmId": 45,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "慢漏气报警",
                "alarmId": 46,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "电池电量低报警",
                "alarmId": 47,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "后方接近报警",
                "alarmId": 48,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "左侧后方接近报警",
                "alarmId": 49,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "右侧后方接近报警",
                "alarmId": 50,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "渣土车未密闭报警",
                "alarmId": 100,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "渣土车超载报警",
                "alarmId": 101,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "渣土车正常消纳报警",
                "alarmId": 102,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "渣土车正常出土报警",
                "alarmId": 103,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "渣土车可疑消纳报警",
                "alarmId": 104,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "渣土车可疑出土报警",
                "alarmId": 105,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "渣土车超速报警",
                "alarmId": 106,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "渣土车线路偏移报警",
                "alarmId": 107,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "渣土车进区域报警",
                "alarmId": 108,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "渣土车出区域报警",
                "alarmId": 109,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "路段限速报警",
                "alarmId": 110,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "非法驾驶报警",
                "alarmId": 111,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "非法停车报警",
                "alarmId": 112,
                "today": 0,
                "yestoday": 0
            }, {
                "label": "车辆未保养报警",
                "alarmId": 113,
                "today": 0,
                "yestoday": 0
            }],
            persentBase: 10000,
            truckAlerm: [],

            top5VehicleAlarm:{name: ['', '', '', '', ''], vehCount: [0, 0, 0, 0, 0]},

            //ws接收数据
            top5Company: {companyName: [], alarmCount: []},
            EnterVehicle: {name: ['', '', '', '', ''], vehCount: [0, 0, 0, 0, 0]},
            vStatusData: new Array({name: '', value: 0}),
            vTypeData: new Array({name: '', value: 0}),
            vStatusOnineData: [1, 1, 1],
            vStatusTotal: 0,
            vOnlineTotal: 0,
            top5Vehicle: [{vehicleNumber: 0, alarmCount: 0}],
            vechileType: [
                {typeId: 51, text: '蓝牌货车'},
                {typeId: 52, text: '黄牌货车'},
                {typeId: 50, text: '危险品货车'},
                {typeId: 53, text: '客运班线车'},
                {typeId: 54, text: '农村班线车'},
                {typeId: 55, text: '校车'},
                {typeId: 56, text: '乘用车（小车）'},
                {typeId: 99, text: '其他'}]
        }
    },
    //获取地图中心点
    beforeMount() {
        let adcode
        axios.get('https://restapi.amap.com/v3/ip?key=0ef6825bdde97686378638eb43882ccb').then(function (res) {
            if(res.data.status == 1){
                currentLocation = res.data.rectangle.split(';')
                adcode = res.data.adcode
                currentLocation = currentLocation[0].split(',')
                axios.get('https://restapi.amap.com/v3/config/district?keywords='+adcode+'&key=0ef6825bdde97686378638eb43882ccb').then(function (res) {
                    currentLocation = res.data.districts[0].center
                    axios.get('https://restapi.amap.com/v3/assistant/coordinate/convert?locations='+currentLocation+'&coordsys=baidu&key=0ef6825bdde97686378638eb43882ccb').then(function (res) {
                        console.log(res)
                        currentLocation = res.data.locations

                    }).catch(function (error) {
                        console.log(error)
                    })
                }).catch(function (error) {
                    console.log(error)
                })
            }
        }).catch(function (error) {
            console.log(error)
        })
    },
    mounted() {
        let self = this
        clearInterval(alermId)
        self.carTypeCharts = echarts.init(document.getElementById('carTypeCharts'))
        self.carOnlineCharts = echarts.init(document.getElementById('carOnlineCharts'))
        self.carInCharts = echarts.init(document.getElementById('carInCharts'))
        self.comAlermCharts = echarts.init(document.getElementById('comAlermCharts'))
        self.comOfflineCharts = echarts.init(document.getElementById('comOfflineCharts'))
        self.vehicleAlarmCharts = echarts.init(document.getElementById('vehicleAlarmCharts'))
        self.mapCharts = echarts.init(document.getElementById('mapCharts'))
        window.onresize = function () {
            self.carTypeCharts.resize()
            self.carOnlineCharts.resize()
            self.mapCharts.resize()
            self.carInCharts.resize()
            self.comAlermCharts.resize()
            self.comOfflineCharts.resize()
        }
        self.initWebSocket()
        self.initTypeCharts()
        self.initOnlineCharts()
        self.initInCharts()
        self.initComAlermCharts()
        self.initComOfflineCharts()
        self.initVehicleAlarmCharts()
        self.GetVehData()
        self.intervalGet()
        self.initGetData()
        self.initGetData2()
        setTimeout(function () {
            self.initMapCharts()
        }, 1500)


        /*
        let finalCfg = []

        for (var key in alermCfg) {

            finalCfg.push({
                label: alermCfg[key],
                alarmId: parseInt(key),
                today: 0,
                yestoday: 0
            })
        }

        localStorage.setItem('$alermCfg', JSON.stringify(finalCfg))
*/

    },
    methods: {
        handleScreen(e) {
            var docElm = document.documentElement
            var pageContent = document.getElementById('pageOverview')
            if (e) {
                //W3C
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen()
                } else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen()
                } else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen()
                } else if (docElm.msRequestFullscreen) {
                    docElm.msRequestFullscreen()
                }
                this.screen = true
                pageContent.classList = 'layout-migrate-pages overview-full'
                pageContent.style.position = 'fixed'

            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
                this.screen = false
                pageContent.classList = 'layout-migrate-pages'
                pageContent.style.position = 'relative'
            }
            this.$store.commit(types.SCREEN, this.screen)
        },
        //连接websocket
        initWebSocket() {
            console.warn('开始连接！')
            let self = this
            let Account = JSON.parse(localStorage.getItem('$userstatus')).account
            let UserId = JSON.parse(localStorage.getItem('$userstatus')).id
            let DeptId = JSON.parse(localStorage.getItem('$userstatus')).deptId
            self.websock = new WebSocket(wsForBigDataUrl + UserId + '/2')
            //联调用
            // self.websock = new WebSocket(wsForBigDataUrl + '2/2')
            self.websock.onopen = function () {
                // Web Socket 已连接上，使用 send() 方法发送数据
                self.websock.send('Holle')
                console.log('数据发送中...')
            }
            self.websock.onmessage = function (evt) {
                let patt1 = new RegExp("连接");
                let patt2 = new RegExp("menuId");
                if (!patt1.test(evt.data) && !patt2.test(evt.data)) {
                    //实时推送
                    let vechileAlarm = JSON.parse(evt.data).vechileAlarm
                    for (var i in vechileAlarm) {
                        self.truckAlerm.unshift({
                            vechileNum: vechileAlarm[i].vehicleNo,
                            vachileAlerm: vechileAlarm[i].icon,
                            vachileLocation: vechileAlarm[i].city
                        })

                    }

                    function getLabel(alarmId) {
                        for (var e in driverCount) {
                            if (driverCount[e].alarmId == alarmId) {
                                return driverCount[e].label
                            }
                        }
                    }

                    self.truckAlerm = self.truckAlerm.slice(0, 6)
                }
            }
            self.websock.onclose = function () {
                // 关闭 websocket
                console.log('连接已关闭...')
            }
            //连接发生错误的回调方法
            self.websock.onerror = function (e) {
                console.log('连接发生错误...')
                console.log(e)
                self.$Notice.error({
                    title: types.SEARVICE_ERROR_TITLE,
                    desc: types.SEARVICE_ERROR,
                    duration: 60
                })
                self.spinShow = false
            };
            // 路由跳转时结束websocket链接
            self.$router.afterEach(function () {
                self.websock.close()
            })
        },
        //获取接口数据
        initGetData() {
            let self = this
            Util.ojax.post(getVehviewcountUrl, {"actiontype": "VehicleStatusData"}).then(function (res) {
                console.log(res)
                if (res.data.code == 1) {
                    let EnterpriceVehicleData = res.data.detail.enterpriceVehicleData
                    let VehicleStatusData = res.data.detail.vehicleStatusData
                    let VehicleTypeData = res.data.detail.vehicleTypeData
                    let MonthInCarDate = new Array()
                    let MonthInCarData = new Array()
                    for(let key in res.data.detail.monthOnlineData){
                        MonthInCarDate.push(key)
                        MonthInCarData.push(res.data.detail.monthOnlineData[key])
                    }
                    let EnterVehicle = {name: ['', '', '', '', ''], vehCount: [0, 0, 0, 0, 0]}
                    let vStatusData = new Array()
                    let vTypeData = new Array()
                    for (var i = 0; i < EnterpriceVehicleData.length; i++) {
                        EnterpriceVehicleData[i].name ? EnterVehicle.name[i] = EnterpriceVehicleData[i].name : EnterVehicle.name[i] = ''
                        EnterpriceVehicleData[i].vehCount ? EnterVehicle.vehCount[i] = EnterpriceVehicleData[i].vehCount : EnterVehicle.vehCount[i] = 0
                    }
                    let vStatusTotal = 0, vOnlineTotal = 0
                    for (var i = 0; i < VehicleStatusData.length; i++) {
                        vStatusTotal = vStatusTotal + VehicleStatusData[i].dicCount
                        vStatusData.push({
                            name: VehicleStatusData[i].dicValue,
                            value: VehicleStatusData[i].dicCount
                        })
                        switch (parseInt(VehicleStatusData[i].dicKey)) {
                            case 1:
                                self.vStatusOnineData[0] = VehicleStatusData[i].dicCount
                                vOnlineTotal = vOnlineTotal + VehicleStatusData[i].dicCount
                                break
                            case 2:
                                self.vStatusOnineData[1] = VehicleStatusData[i].dicCount
                                vOnlineTotal = vOnlineTotal + VehicleStatusData[i].dicCount
                                break
                            case 3:
                                self.vStatusOnineData[2] = VehicleStatusData[i].dicCount
                                vOnlineTotal = vOnlineTotal + VehicleStatusData[i].dicCount
                                break
                        }
                    }
                    self.vStatusData = vStatusData
                    self.vStatusTotal = vStatusTotal
                    self.vOnlineTotal = vOnlineTotal
                    for (var i = 0; i < VehicleTypeData.length; i++) {
                        vTypeData.push({
                            name: VehicleTypeData[i].dicValue,
                            value: VehicleTypeData[i].dicCount
                        })
                    }
                    self.vTypeData = vTypeData
                    self.comOfflineCharts.setOption({
                        xAxis: {data: EnterVehicle.name},
                        series: {data: EnterVehicle.vehCount,}
                    })
                    self.carInCharts.setOption({
                        xAxis: {data: MonthInCarDate.reverse()},
                        series: {data: MonthInCarData.reverse()}
                    })
                    self.carOnlineCharts.setOption({series: {data: vStatusData}})
                    self.carTypeCharts.setOption({series: {data: vTypeData}})
                }
            }).catch(function (error) {
                console.log(error)
            })
        },
        initGetData2() {
            let self = this
            Util.ojax.post(getBigDataStatisticsUrl, {}).then(function (evt) {
                if (evt.data.code == 1) {
                    //处理企业报警top5
                    let top5Company = evt.data.detail.top5Company
                    self.top5Company.companyName = new Array()
                    self.top5Company.alarmCount = new Array()
                    top5Company.sort(self.sortArray('alarmCount'))
                    for (var i in top5Company) {
                        self.top5Company.companyName.push(top5Company[i].companyName)
                        self.top5Company.alarmCount.push(top5Company[i].alarmCount)
                    }
                    self.comAlermCharts.setOption({
                        yAxis: {
                            data: self.top5Company.companyName
                        },
                        series: [
                            {
                                data: self.top5Company.alarmCount,
                            }
                        ]
                    })
                    //驾驶行为报警环比
                    let yesterdayAlarmStatistic = evt.data.detail.yesterdayAlarmStatistic
                    let getAlarmStatisticData = evt.data.detail.alarmStatistic
                    let driverCount = self.driverCount
                    // let yesterdayArr = []
                    if (yesterdayAlarmStatistic.length > 0) {
                        for (var i in yesterdayAlarmStatistic) {
                            for (var x in driverCount) {
                                if (yesterdayAlarmStatistic[i].alarmId == driverCount[x].alarmId) {
                                    driverCount[x].yestoday = yesterdayAlarmStatistic[i].alarmCount
                                    // yesterdayArr.push(yesterdayAlarmStatistic[i].alarmCount)
                                }
                            }
                        }
                    }
                    // let maxYesterday = yesterdayArr[0];
                    //
                    // for(var i = 1; i < yesterdayArr.length; i++) {
                    //     var cur = yesterdayArr[i];
                    //     cur > maxYesterday ? maxYesterday = cur : null
                    // }
                    // self.persentBase = maxYesterday
                    // console.log('maxYesterday:' + maxYesterday);


                    //============处理统计数据
                    if (getAlarmStatisticData && getAlarmStatisticData.alarmType.length > 0) {
                        for (var i in getAlarmStatisticData.alarmType) {
                            for (var e in driverCount) {
                                if (driverCount[e].alarmId == getAlarmStatisticData.alarmType[i].alarmId) {
                                    driverCount[e].today = parseInt(getAlarmStatisticData.alarmType[i].alarmCount)
                                }
                            }
                        }
                        getAlarmStatisticData.alarmType.sort(self.sortArray('alarmCount'))
                        self.persentBase = getAlarmStatisticData.alarmType[(getAlarmStatisticData.alarmType.length - 1)].alarmCount * 1.5
                        self.driverCount = driverCount
                    }

                    let vehicleAlarmVehicleNumber = new Array()
                    let vehicleAlarmCount = new Array()

                    for(let i in evt.data.detail.top5Vehicle){
                        vehicleAlarmVehicleNumber.push(evt.data.detail.top5Vehicle[i].vehicleNumber)
                        vehicleAlarmCount.push(evt.data.detail.top5Vehicle[i].alarmCount)
                    }
                    self.vehicleAlarmCharts.setOption({
                        xAxis: {data: vehicleAlarmVehicleNumber},
                        series: {data: vehicleAlarmCount}
                    })
                    // top5VehicleAlarm:{name: ['', '', '', '', ''], vehCount: [0, 0, 0, 0, 0]},
                    self.top5VehicleAlarm.name = vehicleAlarmVehicleNumber
                    self.top5VehicleAlarm.vehCount = vehicleAlarmCount
                    // self.top5Vehicle = evt.data.detail.top5Vehicle
                }
            }).catch(function (error) {
                console.log(error)
            })
        },
        initTypeCharts() {
            let self = this
            let option = {
                color: ['#0059df', '#f2ea7b', '#2cc7b7', '#53b7ff', '#3274ec', '#414fd3'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name: '车辆类别',
                        type: 'pie',
                        radius: ['45%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                        data: []
                    }
                ]
            };
            self.carTypeCharts.setOption(option)
        },
        initOnlineCharts() {
            let self = this
            let option = {
                color: ['#0059df', '#f2ea7b', '#2cc7b7', '#53b7ff', '#3274ec', '#414fd3'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name: '车辆在线状况',
                        type: 'pie',
                        radius: ['45%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                length: 3,
                                length2: 3
                            }
                        },
                        data: []
                    }
                ]
            };
            self.carOnlineCharts.setOption(option)
        },
        initMapCharts() {
            let self = this
            let centerLocation
            if(currentLocation){
                centerLocation =currentLocation.split(',')
            }else {
                centerLocation =[115.0086900000, 31.1733300000]
            }
            console.log(centerLocation)
            var bmap = {
                center: centerLocation,
                zoom: 11,
                roam: true,
                mapStyle: {
                    'styleJson': [
                        {
                            "featureType": "water",
                            "elementType": "all",
                            "stylers": {
                                "color": "#17202fff"
                            }
                        },
                        {
                            "featureType": "land",
                            "elementType": "all",
                            "stylers": {
                                "color": "#060a12ff"
                            }
                        },
                        {
                            "featureType": "highway",
                            "elementType": "geometry",
                            "stylers": {
                                "color": "#3c4a5cff",
                                "weight": "0.8",
                                "lightness": -32
                            }
                        },
                        {
                            "featureType": "highway",
                            "elementType": "labels.text.fill",
                            "stylers": {
                                "color": "#a0adbbff",
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "arterial",
                            "elementType": "all",
                            "stylers": {
                                "color": "#3c4a5cff",
                                "lightness": -32
                            }
                        },
                        {
                            "featureType": "arterial",
                            "elementType": "labels.text.fill",
                            "stylers": {
                                "color": "#a0adbbff"
                            }
                        },
                        {
                            "featureType": "local",
                            "elementType": "geometry.fill",
                            "stylers": {
                                "color": "#3c4a5cff",
                                "lightness": -2
                            }
                        },
                        {
                            "featureType": "local",
                            "elementType": "labels.text.fill",
                            "stylers": {
                                "color": "#a0adbbff"
                            }
                        },
                        {
                            "featureType": "districtlabel",
                            "elementType": "labels.text.fill",
                            "stylers": {
                                "color": "#a0adbbff",
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "districtlabel",
                            "elementType": "labels.text.stroke",
                            "stylers": {
                                "color": "#a0adbbff",
                                "lightness": -100,
                                "saturation": -100
                            }
                        },
                        {
                            "featureType": "railway",
                            "elementType": "all",
                            "stylers": {
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "subway",
                            "elementType": "all",
                            "stylers": {
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "boundary",
                            "elementType": "all",
                            "stylers": {
                                "color": "#20124dff"
                            }
                        },
                        {
                            "featureType": "districtlabel",
                            "elementType": "labels.icon",
                            "stylers": {
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "green",
                            "elementType": "all",
                            "stylers": {
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "manmade",
                            "elementType": "all",
                            "stylers": {
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "building",
                            "elementType": "all",
                            "stylers": {
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "town",
                            "elementType": "labels.text.fill",
                            "stylers": {
                                "color": "#a0adbbff",
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "district",
                            "elementType": "labels.text.fill",
                            "stylers": {
                                "color": "#a0adbbff",
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "city",
                            "elementType": "labels.text.fill",
                            "stylers": {
                                "color": "#b7c6d6ff",
                                "lightness": -66,
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "poilabel",
                            "elementType": "labels.text.fill",
                            "stylers": {
                                "color": "#a0adbbff",
                                "visibility": "on"
                            }
                        },
                        {
                            "featureType": "road",
                            "elementType": "all",
                            "stylers": {
                                "color": "#565a61ff",
                                "lightness": -30,
                                "visibility": "off"
                            }
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "labels.text.fill",
                            "stylers": {
                                "color": "#a0adbbff",
                                "lightness": -44,
                                "visibility": "on"
                            }
                        },
                        {
                            "featureType": "poilabel",
                            "elementType": "all",
                            "stylers": {
                                "visibility": "off"
                            }
                        }
                    ]
                }
            }
            let vechileTypeTxt = []
            for (var i in self.vechileType) {
                vechileTypeTxt.push(self.vechileType[i].text)
            }


            let option = {
                //color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
//                color: ['rgba(32, 117, 208, 0.65)', 'rgba(37, 140, 249, 0.65)', 'rgba(101, 147, 222, 0.65)', 'rgba(23, 192, 193, 0.65)', 'rgba(14, 241, 242, 0.65)', 'rgba(129, 210, 237, 0.65)', 'rgba(255, 255, 255, 0.65)'],
                legend: {
                    show: true,
                    orient: 'vertical',
                    bottom: '15',
                    right: '15',
                    data: vechileTypeTxt,
                    textStyle: {
                        color: '#fff'
                    }
                },
                bmap: bmap,
                series: []
            }
            self.mapCharts.setOption(option)
        },
        initInCharts() {
            let self = this
            let dataForm = [], dateForm = []
            let option = {
                grid: {
                    top: 15,
                    left: 45,
                    right: 5,
                    bottom: 25


                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: "{b} <br/>{a}: {c}"
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dateForm,
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#474955'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    }
                },
                series: [{
                    name: "车辆运营数",
                    data: dataForm,
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        color: '#2cc7b7'
                    },
                    lineStyle: {
                        color: '#2cc7b7'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(44, 199, 183,.75)'
                        }, {
                            offset: 1,
                            color: 'rgba(44, 199, 183,.15)'
                        }])
                    },
                }]
            }
            self.carInCharts.setOption(option)
        },
        initComAlermCharts() {
            let self = this
            let option = {
                color: '#53b7ff',
                grid: {
                    top: 25,
                    left: 85,
                    right: 15,
                    bottom: 15
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: {
                    type: 'value',
                    minInterval: 1,
                    boundaryGap: false,
                    position: 'top',
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#474955'
                        }
                    },
                    // max: 100000
                },
                yAxis: {
                    type: 'category',
                    data: self.top5Company.companyName,
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    }
                },
                series: [{
                    data: self.top5Company.alarmCount,
                    type: 'bar',
                    barWidth: 7,
                    itemStyle: {
                        barBorderRadius: [0, 5, 5, 0]
                    }
                }]
            }
            self.comAlermCharts.setOption(option)
        },
        initComOfflineCharts() {
            let self = this
            let option = {
                color: '#2cc7b7',
                grid: {
                    top: 15,
                    left: 35,
                    right: 15,
                    bottom: 30
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: "{b} <br/>车辆报警: {c}"
                },
                xAxis: {
                    type: 'category',
                    data: self.top5VehicleAlarm.name,
                    boundaryGap: true,
                    axisLabel: {
                        interval:0,
                        // rotate:-20,
                        textStyle: {
                            color: '#fff'
                        },
                        formatter:function(value)
                        {
                            var ret = "";//拼接加\n返回的类目项
                            var maxLength = 4;//每项显示文字个数
                            var valLength = value.length;//X轴类目项的文字个数
                            var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                            if (rowN > 1)//如果类目项的文字大于3,
                            {
                                for (var i = 0; i < rowN; i++) {
                                    var temp = "";//每次截取的字符串
                                    var start = i * maxLength;//开始截取的位置
                                    var end = start + maxLength;//结束截取的位置
                                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                                    temp = value.substring(start, end) + "\n";
                                    ret += temp; //凭借最终的字符串
                                }
                                return ret;
                            }
                            else {
                                return value;
                            }
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#474955'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1,
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    }
                },
                series: {
                    data: self.EnterVehicle.vehCount,
                    type: 'bar',
                    barWidth: 7,
                    itemStyle: {
                        barBorderRadius: [5, 5, 0, 0]
                    }
                }
            }
            self.comOfflineCharts.setOption(option)
        },
        initVehicleAlarmCharts() {
            let self = this
            let option = {
                color: '#2cc7b7',
                grid: {
                    top: 15,
                    left: 45,
                    right: 15,
                    bottom: 30
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: "{b} <br/>车辆报警次数: {c}"
                },
                xAxis: {
                    type: 'category',
                    data: self.top5VehicleAlarm.name,
                    boundaryGap: true,
                    axisLabel: {
                        interval:0,
                        // rotate:20,
                        textStyle: {
                            color: '#fff'
                        },
                        // formatter:function(value)
                        // {
                        //     var ret = "";//拼接加\n返回的类目项
                        //     var maxLength = 4;//每项显示文字个数
                        //     var valLength = value.length;//X轴类目项的文字个数
                        //     var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                        //     if (rowN > 1)//如果类目项的文字大于3,
                        //     {
                        //         for (var i = 0; i < rowN; i++) {
                        //             var temp = "";//每次截取的字符串
                        //             var start = i * maxLength;//开始截取的位置
                        //             var end = start + maxLength;//结束截取的位置
                        //             //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                        //             temp = value.substring(start, end) + "\n";
                        //             ret += temp; //凭借最终的字符串
                        //         }
                        //         return ret;
                        //     }
                        //     else {
                        //         return value;
                        //     }
                        // }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#474955'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1,
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#474955'
                        }
                    }
                },
                series: {
                    data: self.top5VehicleAlarm.vehCount,
                    type: 'bar',
                    barWidth: 7,
                    itemStyle: {
                        barBorderRadius: [5, 5, 0, 0]
                    }
                }
            }
            self.vehicleAlarmCharts.setOption(option)
        },
        toBehavior() {
            // window.open('/stastic/alermDetail', "_blank")
            window.open('/assetsManage/vehicleManage', "_blank")
        },
        //数组排序
        sortArray(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        //定时调用
        intervalGet() {
            let self = this
            alermId = setInterval(function(){
                self.initGetData()
                self.initGetData2()
            }, 30000)
        },
        // 地图数据
        GetVehData() {
            let self = this
            let vechileType = self.vechileType
            let color = ['rgba(32, 117, 208, 0.55)', 'rgba(37, 140, 249, 0.55)', 'rgba(101, 147, 222, 0.55)', 'rgba(23, 192, 193, 0.55)', 'rgba(14, 241, 242, 0.55)', 'rgba(129, 210, 237, 0.55)', 'rgba(255, 255, 255, 0.55)', 'rgba(26, 70, 244, 0.55)']
            Util.ojax.post(getMapVehicleDataUrl).then(function (res) {
                // let mapData = res.data.detail.vehicleTypeListBeanList
                let mapData = res.data.detail
                let serData = []
                for (var x in mapData) {
                    let eLocation = []
                    for (var i in mapData[x].latLonList) {
                        eLocation.push([mapData[x].latLonList[i].lon.toFixed(4), mapData[x].latLonList[i].lat.toFixed(4), 1])
                    }
                    let vechileTypeTxt = ''
                    for (var i in vechileType) {
                        if (vechileType[i].typeId == mapData[x].vehicleType) {
                            vechileTypeTxt = vechileType[i].text
                        }
                    }

                    serData.push({
                        name: vechileTypeTxt,
                        vechileType: mapData[x].vehicleType,
                        type: 'scatterGL',
                        coordinateSystem: 'bmap',
                        symbolSize: 3,
                        itemStyle: {
                            shadowBlur: 12,
                            shadowColor: color[x],
                            color: color[x]
                        },
                        data: eLocation
                    })
                }

                console.log(serData)

                self.mapCharts.setOption({series: serData})

                //self.initMapCharts(serData)


            }).catch(function (error) {
                console.log(error)
            })
        }
    }
}
</script>
<style>
    .layout-overview {
        background-color: #12151e;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-size: 13px !important;
    }

    .overview-full {
        z-index: 1100;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    .overview-box {
        padding: 15px 15px 20px 15px;
        border-radius: 5px;
        margin: 5px;
    }

    .overview-box h3 {
        color: #b6bbc7;
        font-size: 14px;
    }

    .overview-box-small {
        background-color: #191c2a;
        height: calc(40% - 10px);
    }

    .overview-box-map {
        background-color: #060a12;
        height: calc(80% - 10px);
        margin: 5px;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
    }

    .o-charts-box-01 {
        height: 60%;
    }

    .o-charts-box-02 {
        height: 100%;
    }

    .o-charts-box-map {
        width: 100%;
        height: 100%;
    }

    .overview-box-map-topside {
        width: 100%;
        height: 140px;

        position: absolute;
        left: 0;
        bottom: 0;
    }

    .overview-box-map-topside .ivu-card {
        background-color: transparent;
        color: #fff;
        border-radius: 0;

    }

    .overview-box-map-topside .ivu-card-head {
        border-bottom: none;
        color: #fff !important;
        height: 100px;
        background-color: rgba(50, 60, 85, .75);
    }

    .overview-box-map-topside .ivu-card-body {
        background-color: rgba(42, 50, 75, .55);
        height: 40px;
    }

    .overview-box-map-topside .ivu-card.side-02 .ivu-card-head {
        background-color: rgba(50, 60, 85, .95);
    }

    .overview-box-map-topside .ivu-card.side-02 .ivu-card-body {
        background-color: rgba(42, 50, 75, .95);
    }

    .o-charts-driver {
        height: calc(100% - 35px);
        margin-top: 10px;
        line-height: 1;
    }

    .o-charts-driver li {
        width: 100%;
        height: 10%;
        /*line-height: 10%;*/
        line-height: 1;
        display: inline-block;
        color: #fff;
        text-align: center;
        font-size: 15px;
        font-weight: bold;
        vertical-align: middle;
    }

    .driver-box {
        min-width: 0%;
        max-width: 100%;
        /*width: 100%;*/
        border-radius: 8px;
        /*display: inline-block;*/
        height: 16px;
        line-height: 16px;
        text-align: center;
        padding: 0 5px;
        margin: calc(5% - 10px) auto;
        font-size: 13px;
        font-weight: normal;
        text-shadow: 0 2px 2px rgba(0, 0, 0, .5);
        transition: width 2s;
        -moz-transition: width 2s; /* Firefox 4 */
        -webkit-transition: width 2s; /* Safari and Chrome */
        -o-transition: width 2s; /* Opera */
        white-space: nowrap;
        padding: 0 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0 5%;
    }

    .driver-today {
        background-color: #53b7ff;
        float: right;
        overflow: inherit;
        text-align: left;
    }

    .driver-yestoday {
        background-color: #3274ec;
        float: left;
        overflow: inherit;
        text-align: right;
    }

    .o-alerm-top {
        text-align: center;
        color: #f0f0f1;
        padding-top: 5px;
        height: 100%;
    }

    .o-alerm-top > li {
        width: 20%;
        float: left;
        height: 100%;
    }

    .alerm-box {
        height: 55%;
        position: relative;
    }

    .alerm-li {
        max-height: 100%;
        /*width: 100%;*/
        border-radius: 8px;
        /*display: inline-block;*/
        width: 16px;
        transition: height 2s;
        -moz-transition: height 2s; /* Firefox 4 */
        -webkit-transition: height 2s; /* Safari and Chrome */
        -o-transition: height 2s; /* Opera */
        background-color: #3274ec;
        position: absolute;
        left: 50%;
        margin-left: -10px;
        bottom: 0;
    }

    .o-alerm-top .company {
        color: #777b88 !important;
    }

    .o-car-type-total {
        width: 100%;
        height: 40%;
        line-height: 1;
    }

    .o-car-type-total li {
        width: 50%;
        height: 100%;
        display: inline-block;
        float: left;
        color: #b6bbc7;
        text-align: center;
        line-height: 32px;

    }

    .o-car-type-total li .count {
        width: 108px;
        height: 85px;
        background-image: url("../../../assets/img/overview_dashbord_bg_01.png");
        background-position: center;
        background-repeat: no-repeat;
        text-align: center;
        color: #fff;
        font-size: 22px;
        line-height: 105px;
        margin: 0 auto;
    }

    .count.count2 {
        background-image: url("../../../assets/img/overview_dashbord_bg_02.png") !important;
    }

    .o-online-top {
        margin-top: 10px;
    }

    .o-online-top > li {
        clear: both;
        height: 32px;
    }

    .online-label {
        width: 30%;
        line-height: 32px;
        color: #b6bbc7;
        float: left;
        text-align: right;
        padding-right: 10px;
    }

    .online-box {
        width: 70%;
        float: left;
    }

    .online-li {
        width: 50%;
        border-radius: 8px;
        height: 12px;
        margin-top: 8px;
        transition: height 2s;
        -moz-transition: height 2s;
        -webkit-transition: height 2s;
        -o-transition: height 2s;
        background-color: #2cc7b7;
        color: #fff;
        text-indent: 50%;
        line-height: 12px;
        white-space: nowrap;
    }

    .o-box-top-img {
        width: 42px;
        height: 42px;
        float: left;
        margin-right: 10px;
    }

    .o-box-title {
        margin-top: 7px;
    }

    .o-box-top-title {
        font-size: 14px;
        line-height: 24px;
    }

    .o-box-top-num {
        font-size: 32px;
    }

    .text-right {
        text-align: right;
    }

    .o-box-alerm-all {
        height: calc(100% - 30px);
        overflow: hidden;
        margin-top: 10px;

    }

    .o-box-alerm-all > li {
        height: 32px;
        line-height: 32px;
        white-space: nowrap;
        color: #fff;
        margin: 5px auto;
        cursor: pointer;
    }

    .o-box-alerm-all > li:after {
        clear: both;
    }

    .o-vechileNum {
        float: left;
        font-size: 16px;
        font-weight: bold;
        min-width: 100px;
        min-height: 32px;
    }

    .o-vechileAlerm {
        float: left;
        font-size: 13px;
        font-weight: 700;
        background-color: #f30;
        height: 24px;
        border-radius: 12px;
        margin-right: 15px;
        margin-top: 5px;
        padding: 0px 15px;
        line-height: 24px;
        width: 40%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .o-vechileLocation {
        float: right;
        font-size: 16px;
        font-weight: bold;
    }

    .layout-btn-screen {
        background-color: transparent;
        color: #fff;
        display: inline-block;
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 100;
    }

    .layout-btn-screen .ivu-btn-text {
        color: #fff;
        font-size: 16px;
    }


</style>
