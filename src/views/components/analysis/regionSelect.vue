<template>
    <div class="layout-analysis-spoilMigrate-select" @mouseover="handleSelect(true)" @mouseout="handleSelect(false)">
        <div class="analysis-select">
            <span>武汉市</span>
            <ul v-show="showRegion">
                <li :data-code="item.areCode" v-for="item in regionList" @click="handleAreaCode">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>

<script>/* eslint-disable indent,no-undef,init-declarations,linebreak-style,no-unused-vars,camelcase,no-var,quotes,comma-spacing,comma-dangle,semi,no-console */


export default {
    data() {
        return {
            regionList: [
                {name: '江岸区', coord: [114.3096000000, 30.5998200000], "areid": 65, "areCode": "420102"},
                {name: '江汉区', coord: [114.2781500000, 30.5752500000], "areid": 72, "areCode": "420103"},
                {name: '硚口区', coord: [114.2149800000, 30.5814500000], "areid": 77, "areCode": "420104"},
                {name: '汉阳区', coord: [114.2177200000, 30.5547300000], "areid": 37, "areCode": "420105"},
                {name: '武昌区', coord: [114.3159900000, 30.5538600000], "areid": 88, "areCode": "420106"},
                {name: '青山区', coord: [114.3841500000, 30.6403900000], "areid": 86, "areCode": "420107"},
                {name: '洪山区', coord: [114.3425300000, 30.4998400000], "areid": 44, "areCode": "420111"},
                {name: '东湖高新区', coord: [114.3862100000, 30.5142400000], "areid": 21, "areCode": "420118"},
                {name: '武汉开发区', coord: [114.1680300000, 30.4893200000], "areid": 93, "areCode": "420119"},
                {name: '东湖风景区', coord: [114.3732100000, 30.5692300000], "areid": 454, "areCode": "420120"},
                {name: '东西湖区', coord: [114.1370200000, 30.6199600000], "areid": 27, "areCode": "420112"},
                {name: '蔡甸区', coord: [114.0291900000, 30.5820300000], "areid": 19, "areCode": "420114"},
                {name: '江夏区', coord: [114.3216800000, 30.3755900000], "areid": 53, "areCode": "420115"},
                {name: '黄陂区', coord: [114.3750900000, 30.8813100000], "areid": 59, "areCode": "420116"},
                {name: '新洲区', coord: [114.8011400000, 30.8415400000], "areid": 35, "areCode": "420117"},
                {name: '汉南区', coord: [114.0846900000, 30.3089500000], "areid": 35, "areCode": "420113"}
            ],
            showRegion: false
        }
    },
    methods: {
        handleSelect(b) {
            var self = this
            if (b) {
                self.showRegion = true
            } else {
                self.showRegion = false
            }
        },
        handleAreaCode(e) {
            var self = this
            var areaCode = e.target.dataset.code
            var areaName = e.target.innerHTML
            self.$emit('handleRegionSelect', areaCode,areaName)
        }
    }
}
</script>