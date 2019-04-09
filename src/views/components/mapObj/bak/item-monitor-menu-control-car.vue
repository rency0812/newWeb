<template>
    <div>
        <h3 class="title">车辆监控选项</h3>
        <h5>车辆在线状况显示：
            <label>是否显示
                <i-switch size="small" v-model="controlSwitch.truckshow" @on-change="hanldeMapMarkerShowTruck">
                </i-switch>
            </label>

        </h5>
        <ul class="menu-control-list">
            <li>
                <label>行驶车辆
                    <i-switch size="large" v-model="controlSwitch.travel" @on-change="hanldeMapMarkerTravel">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
                    </i-switch>
                </label>
            </li>
            <li>
                <label>熄火车辆
                    <i-switch size="large" v-model="controlSwitch.flameout" @on-change="hanldeMapMarkerFlameout">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
                    </i-switch>
                </label>
            </li>
            <li>
                <label>停车车辆
                    <i-switch size="large" v-model="controlSwitch.stop" @on-change="hanldeMapMarkerStop">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
                    </i-switch>
                </label>
            </li>
            <li>
                <label>定位失败
                    <i-switch size="large" v-model="controlSwitch.offgps" @on-change="hanldeMapMarkerOffGps">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
                    </i-switch>
                </label>
            </li>
            <li>
                <label>通讯中断
                    <i-switch size="large" v-model="controlSwitch.offline" @on-change="hanldeMapMarkerOffline">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
                    </i-switch>
                </label>
            </li>
        </ul>
        <h5>查询选项：</h5>
        <control-list v-on:handeControlBtn="handeControlBtn" :controlData="btnData"></control-list>

    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations */
    import controlList from './item-monitor-control-box'


    let controlSwitch = {
        truckshow: true,
        travel: true,
        flameout: true,
        stop: true,
        offgps: false,
        offline: false
    }

    export default {
        props: ['amount'],
        components: {
            'control-list': controlList
        },
        data() {
            return {
                controlSwitch: controlSwitch,
                btnData: [{
                    'label': '行驶车辆',
                    'type': 'truckList',
                    'value': '0辆'
                }, {
                    'label': '熄火车辆',
                    'type': 'truckList',
                    'value': '0辆'
                }, {
                    'label': '停车车辆',
                    'type': 'truckList',
                    'value': '0辆'
                }, {
                    'label': '定位失败',
                    'type': 'truckList',
                    'value': '0辆'
                }, {
                    'label': '通讯中断',
                    'type': 'truckList',
                    'value': '0辆'
                }, {
                    'label': '关注车辆',
                    'type': 'favList',
                    'value': '0辆'
                }, {
                    'label': '未密闭车辆',
                    'type': 'lawList',
                    'value': '0辆'
                }, {
                    'label': '超载车辆',
                    'type': 'lawList',
                    'value': '0辆'
                }, {
                    'label': '超速车辆',
                    'type': 'lawList',
                    'value': '0辆'
                }]
            }
        },
        watch: {
            amount(data) {
                var self = this
                var btnData = self.btnData
                btnData[0].value = data[0] + '辆'
                btnData[1].value = data[1] + '辆'
                btnData[2].value = data[2] + '辆'
                btnData[3].value = data[3] + '辆'
                btnData[4].value = data[4] + '辆'
                self.btnData = btnData
            }
        },
        methods: {
            handeControlBtn(e) {
                this.$emit('handeControlBtn', e)
            },
            hanldeMapMarkerShowTruck(e) {
                this.$emit('mapMarkerDisplay', 'truckShow', e)
            },
            hanldeMapMarkerTravel(e) {
                this.$emit('mapMarkerDisplay', 'travel', e)
            },
            hanldeMapMarkerFlameout(e) {
                this.$emit('mapMarkerDisplay', 'flameout', e)
            },
            hanldeMapMarkerStop(e) {
                this.$emit('mapMarkerDisplay', 'stop', e)
            },
            hanldeMapMarkerOffGps(e) {
                this.$emit('mapMarkerDisplay', 'offgps', e)
            },
            hanldeMapMarkerOffline(e) {
                this.$emit('mapMarkerDisplay', 'offline', e)
            }
        },
        name: "item-monitor-menu-control-car"
    }
</script>

<style>
    .stastic-card {
        display: inline-block;
        width: 100%;
    }

    .monitor-menu-control {
        width: 100%;
        min-height: 100px;
        height: calc(100% - 400px);
        overflow-y: auto;
        overflow-x: hidden;
        background: url("/assets/img/analysis/body_bg.png") left bottom no-repeat;
    }

    .monitor-menu-control h5 {
        color: #F2CC4B;
        font-size: 14px;
        display: block;
        padding: 10px 15px;
        position: relative;

    }

    .monitor-menu-control h5 label {
        color: #d7dde4;
        font-weight: normal;
        font-size: 13px;
        position: absolute;
        right: 15px;
        top: 10px;
    }

    .monitor-menu-control .tips {
        color: #d7dde4;
        font-size: 13px;
        font-weight: normal;
        padding: 10px 15px;
        clear: both;
    }

    .menu-control-list {
        display: inline-block;
        width: 90%;
        margin: 0 5% 15px;
        border-bottom: 1px solid #3f51b5;
    }

    .menu-control-list > li {
        float: left;
        width: 25%;
        padding: 2.5%;
        text-align: center;
    }

    .menu-control-list > li label {
        color: #d7dde4;
        line-height: 1.9;

    }

    .monitor-menu-control hr {
        border: none;
        margin: 0 15px;
    }


</style>