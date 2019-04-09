<template>
    <div class="monitor-adv-control" :style="{top:topNumber}">
        <a href="javascript:void(0);" class="adv-control-button" @click="showAdvControl">
            <Icon type="android-arrow-dropup" v-if="topNumber !== 0"></Icon>
            <Icon type="android-arrow-dropdown" v-else></Icon>
            高级功能
        </a>
        <service-list :stasticTopData="stasticTopData" :serviceData="serviceData"></service-list>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations */
    const initTop = 'calc(100% - 42px)'
    import serviceList from './item-monitor-service-box'

    export default {
        components: {
            'service-list': serviceList
        },
        props:['stasticTopData'],
        data() {
            return {
                topNumber: initTop,
                serviceData: [{
                    'label': '企业管理',
                    'url': '/demo/manage/companyManage',
                    'iconName': 'ex-icon-building'
                }, {
                    'label': '车辆管理',
                    'url': '/demo/manage/vehicleManage',
                    'iconName': 'ex-icon-building'
                }, {
                    'label': '车辆-资质变更',
                    'url': '/demo/manage/vehicleManage',
                    'iconName': 'ex-icon-building'
                }, {
                    'label': '车辆-企业变更',
                    'url': '/demo/manage/vehicleManage',
                    'iconName': 'ex-icon-building'
                }, {
                    'label': '工地管理',
                    'url': '/demo/manage/vehicleManage',
                    'iconName': 'ex-icon-building'
                }, {
                    'label': '消纳点管理',
                    'url': '/demo/manage/vehicleManage',
                    'iconName': 'ex-icon-building'
                }, {
                    'label': '线路管理',
                    'url': '/demo/manage/vehicleManage',
                    'iconName': 'ex-icon-building'
                }, {
                    'label': '处置证管理',
                    'url': '/demo/manage/vehicleManage',
                    'iconName': 'ex-icon-building'
                }, {
                    'label': '卡口管理',
                    'url': '/demo/manage/vehicleManage',
                    'iconName': 'ex-icon-building'
                }]
            }
        },
        methods: {
            showAdvControl() {
                var self = this
                if (self.topNumber !== 0) {
                    self.topNumber = 0
                } else {
                    self.topNumber = initTop
                }
            }
        },
        name: "item-monitor-adv-control"
    }
</script>

<style>
    .monitor-adv-control {
        width: 100%;
        height: 100%;
        background-color: #2d3d90;
        box-shadow: inset 12px 0 12px rgba(0, 0, 0, .15);
        position: absolute;
        left: 0;
        z-index: 1000;
        overflow-x: hidden;
        overflow-y: auto;
        transition: top 0.3s ease-in-out;
    }

    .adv-control-button, .adv-control-button:hover {
        color: #fff;
        width: 100%;
        height: 42px;
        line-height: 42px;
        text-align: center;
        display: block;
        background-color: #3f51b5;
        background-image: -webkit-linear-gradient(-45deg, rgba(255, 255, 255, .05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .05) 50%, rgba(255, 255, 255, .05) 75%, transparent 75%, transparent) !important;
        background-image: -o-linear-gradient(-45deg, rgba(255, 255, 255, .05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .05) 50%, rgba(255, 255, 255, .105) 75%, transparent 75%, transparent) !important;
        background-image: linear-gradient(-45deg, rgba(255, 255, 255, .05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .1) 50%, rgba(255, 255, 255, .05) 75%, transparent 75%, transparent) !important;
        -webkit-background-size: 5px 5px !important;
        background-size: 5px 5px !important;
        box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
    }

    .adv-control-button > .ivu-icon {
        font-size: 17px;
        margin-right: 7px;
    }
</style>