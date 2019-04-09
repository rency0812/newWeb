<template>
    <div class="layout-migrate-pages" id="pageOverview" style="position: relative">
      <!--
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
      -->

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
                            <li class="flip-in-right" v-for="(item,index) in truckAlerm" :key="index" @click="toBehavior">
                                <div class="o-vechileNum">{{item.vechileNum}}</div>
                                <div class="o-vechileAlerm" :title="item.vachileAlerm">{{item.vachileAlerm}}</div>
                                <div class="o-vechileLocation">{{item.vachileLocation}}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="overview-box overview-box-small"
                         style="height:calc(50% - 10px);margin-bottom: 10px;padding: 15px 15px 0px 15px;">
                        <h3>报警类型统计(单位:次)</h3>
                        <Row style="overflow: hidden;height: calc(100% - 30px);">
                            <Col span="7">
                                <ul class="o-charts-driver">
                                    <li>
                                        <div class="driver-box"
                                             style="float: none;
                                                    display: inline-block;
                                                    width: auto;
                                                    padding: 0;
                                                    background-color: transparent;">今日
                                        </div>
                                        <div class="driver-box driver-today"
                                             style="width: 5px;"></div>
                                    </li>
                                    <li v-for="item in typeCount" :key="item.label">
                                        <div class="driver-box driver-today">
                                            {{item.today}}
                                        </div>
                                        
                                    </li>
                                </ul>
                            </Col>
                            <Col span="10">
                                <ul class="o-charts-driver">
                                    <li>&nbsp;</li>
                                    <li v-for="item in typeCount" :key="item.label">
                                        <!--{{item.label}}-->
                                        <div class="driver-box" :title="item.label">{{item.label}}</div>
                                    </li>
                                </ul>
                            </Col>
                            <Col span="7">
                                <ul class="o-charts-driver">
                                    <li style="text-align: right;">
                                        <div class="driver-box driver-yestoday"
                                             style="width: 5px;"></div>
                                        <div class="driver-box"
                                             style="background-color: transparent;
                                             float: none;
                                             padding: 0;
                                             margin: 0;">昨日
                                        </div>

                                    </li>
                                    <li v-for="item in typeCount" :key="item.label">
                                        <div class="driver-box driver-yestoday">
                                            {{item.yestoday}}
                                        </div>
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
<script src="./portal.js"></script>
<style src="./style.css"></style>
