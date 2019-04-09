<template>
    <div>
        <div class="behavior-monitor-location-box">
            <h3>
                <Icon type="clock"></Icon>
                最后定位时间:
            </h3>
            <p>
                {{datetime}}  [
                <Time :time="datetime"/>
                ]
            </p>
            <h3>
                <Icon type="android-pin"></Icon>
                最后定位位置:
            </h3>
            <p>
                {{vechileState.address}}
            </p>
        </div>
        <div class="behavior-monitor-state-box">
            <!--速度载重-->
            <div class="speed-box">
                <div :class="{'danger':truckState.s9}" v-show="truckState.s9">
                    <p><i class="ex-icon ex-icon-speed"></i></p>
                    <p>{{speed}}km/h</p>
                </div>
                <div :class="{'danger':truckState.s10}" v-show="truckState.s10">
                    <p><i class="ex-icon ex-icon-icon-car-door-switch"></i></p>
                    <p v-show="truckState.s10">顶棚开</p>
                    <p v-show="!truckState.s10">顶棚关</p>
                </div>
            </div>
            <!--实时状态-->
            <ul>
                <li v-show="truckState.s0">
                    <Tooltip content="ACC" placement="bottom">
                        <Icon class="ivu-icon ex-icon ex-icon-icon-car-acc"></Icon>
                    </Tooltip>
                </li>
                <li v-show="truckState.s1">
                    <Tooltip content="左转" placement="bottom">
                        <Icon class="ivu-icon ex-icon ex-icon-icon-car-left-turn"></Icon>
                    </Tooltip>
                </li>
                <li v-show="truckState.s2">
                    <Tooltip content="右转" placement="bottom">
                        <Icon class="ivu-icon ex-icon ex-icon-icon-car-right-turn"></Icon>
                    </Tooltip>
                </li>
                <li v-show="truckState.s3">
                    <Tooltip content="远光灯" placement="bottom">
                        <Icon class="ivu-icon ex-icon ex-icon-icon-car-big-light"></Icon>
                    </Tooltip>
                </li>
                <li v-show="truckState.s4">
                    <Tooltip content="近光灯" placement="bottom">
                        <Icon class="ivu-icon ex-icon ex-icon-icon-car-small-light"></Icon>
                    </Tooltip>
                </li>
                <li v-show="truckState.s5">
                    <Tooltip content="油路" placement="bottom">
                        <Icon class="ivu-icon ex-icon ex-icon-icon-car-stop-oil"></Icon>
                    </Tooltip>
                </li>
                <li v-show="truckState.s6">
                    <Tooltip content="刹车" placement="bottom">
                        <Icon class="ivu-icon ex-icon ex-icon-icon-car-stop"></Icon>
                    </Tooltip>
                </li>
                <li v-show="truckState.s7">
                    <Tooltip content="阴极" placement="bottom">
                        <Icon class="ivu-icon ex-icon ex-icon-icon-car-cathode"></Icon>
                    </Tooltip>
                </li>
                <li v-show="truckState.s8">
                    <Tooltip content="阳极" placement="bottom">
                        <Icon class="ivu-icon ex-icon ex-icon-icon-car-anode"></Icon>
                    </Tooltip>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>/* eslint-disable linebreak-style,indent,no-console,no-unused-vars,quotes,no-var,camelcase,no-undef */
import Util from '../../../libs/util'

export default {
    props: ['vechileState'],
    data() {
        return {
            truckState: {
                s0: false,
                s1: false,
                s2: false,
                s3: false,
                s4: false,
                s5: false,
                s6: false,
                s7: false,
                s8: false,
                s9: false,
                s10: false
            },
            datetime: new Date().getTime(),
            speed: '-'
        }
    },
    mounted() {
    },
    methods: {

        coverState(data) {
            let self = this
            let truckState = self.truckState
            for (var i in data) {
                switch (data[i]) {
                    case 1:
                        truckState.s0 = true
                        break
                    case 10:
                        truckState.s6 = true
                        break
                    case 11:
                        truckState.s1 = true
                        break
                    case 12:
                        truckState.s2 = true
                        break
                    case 13:
                        truckState.s3 = true
                        break
                    case 7:
                        truckState.s5 = true
                        break
                    case 14:
                        truckState.s4 = true
                        break
                    case 15:
                        truckState.s10 = true
                        break
                }
            }
        }
    },
    watch: {
        vechileState(n, o) {
            // console.log(n)
            let self = this
            if (n) {
                self.datetime = n.alarmTime
                self.speed = n.speed
                if (self.speed > 60) {
                    self.truckState.s9 = true
                } else {
                    self.truckState.s9 = false
                }
                self.coverState(n.status)
            }
        }
    }
}
</script>