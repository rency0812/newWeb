<template>
    <div style="height: 100%">
        <h4 class="list-title">{{listTitle}}
            <Input v-model="searchKey" size="small" :placeholder="placeholder"
                   class="monitor-panel-list-search"
                   icon="ios-search" @on-change="searchData"></Input>
        </h4>
        <ul class="aseets-list">
            <li style="background-color: rgba(93, 144, 255, .75);" v-if="panelType == 'truck'">
                <div class="fav">
                    <Icon type="star"></Icon>
                </div>
                <div class="number" style="text-align: center">
                    状态 - 车牌号
                </div>
                <div style="width:45%;text-align:center;">
                    操作
                </div>
            </li>
            <li style="background-color: rgba(93, 144, 255, .75);" v-if="panelType == 'site'">
                <div class="fav">
                    <Icon type="star"></Icon>
                </div>
                <div class="number" style="text-align: center">
                    工地名称(工地内车辆)
                </div>
                <div style="width:15%;text-align:center;">
                    操作
                </div>
            </li>
            <li style="background-color: rgba(93, 144, 255, .75);" v-if="panelType == 'unearthed'">
                <div class="fav">
                    <Icon type="star"></Icon>
                </div>
                <div class="number" style="text-align: center">
                    消纳场名称(消纳场内车辆)
                </div>
                <div style="width:15%;text-align:center;">
                    操作
                </div>
            </li>
            <li v-for="item in listData" :key="item.id" v-if="panelType == 'truck'">
                <div class="fav">
                    <Icon type="star" v-if="item.fav"></Icon>
                </div>
                <div class="number">
                    <Tag color="green" v-if="item.state == '在线'">{{item.state}}</Tag>
                    <Tag color="red" v-else-if="item.state == '失联'">{{item.state}}</Tag>
                    <Tag color="default" v-else>{{item.state}}</Tag>
                    - {{item.vechileNum}}
                </div>
                <ButtonGroup size="small">
                    <Button type="info" v-on:click="showState" :data-devno="item.devNo">详情</Button>
                    <Button type="info" v-on:click="showTravel" :data-devno="item.devNo">跟踪</Button>
                    <Button type="warning">轨迹</Button>
                </ButtonGroup>
            </li>
            <li v-for="item in listData" :key="item.id" v-if="panelType == 'site'">
                <div class="fav">
                    <Icon type="star" v-if="item.fav"></Icon>
                </div>
                <div class="number">
                    <span class="shortName">{{item.vechileNum}}</span> [ {{item.state}} 辆 ]
                </div>
                <ButtonGroup size="small">
                    <Button type="info">详情</Button>
                </ButtonGroup>
            </li>
            <li v-for="item in listData" :key="item.id" v-if="panelType == 'unearthed'">
                <div class="fav">
                    <Icon type="star" v-if="item.fav"></Icon>
                </div>
                <div class="number">
                    <span class="shortName">{{item.vechileNum}}</span> [ {{item.state}} 辆 ]
                </div>
                <ButtonGroup size="small">
                    <Button type="info">详情</Button>
                </ButtonGroup>
            </li>
        </ul>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations */
    export default {
        props: ['listData', 'listTitle', 'panelType'],
        data() {
            return {
                searchKey: '',
                placeholder: '请输入车牌号'
            }
        },
        mounted() {
            var self = this
            this.$nextTick(function () {

            })
        },
        watch: {
            panelType(e) {
                var self = this
                switch (self.panelType) {
                    case 'truck':
                        self.placeholder = '请输入车牌号'
                        break
                    case 'site':
                        self.placeholder = '请输入工地名称'
                        break
                    case 'unearthed':
                        self.placeholder = '请输入消纳场名称'
                        break
                }
            },
            listData(e) {


            }
        },
        methods: {
            searchData(e) {
                var self = this
                var searchKey = e.target.value.toUpperCase()
                self.$emit('searchData', searchKey)
            },
            showTravel(e) {
                console.log(e.target.tagName)
                var devNo
                if (e.target.tagName == 'SPAN') {
                    console.log('aaaaaaaaaaaa====================')
                    devNo = e.target.parentNode.dataset.devno
                    e.target.parentNode.style.backgroundColor = '#20b36a'
                    console.log(devNo)
                } else {
                    devNo = e.target.dataset.devno
                    e.target.style.backgroundColor = '#20b36a'
                }
                if (devNo) {
                    this.$emit('showVechileTravel', devNo)
                }
            },
            showState(e) {
                var devNo
                if (e.target.tagName == 'SPAN') {
                    console.log('aaaaaaaaaaaa====================')
                    devNo = e.target.parentNode.dataset.devno
                    console.log(devNo)
                } else {
                    devNo = e.target.dataset.devno
                }
                if (devNo) {
                    this.$emit('showVechileState', devNo)
                }
            }
        },
        name: "item-monitor-assets-list"
    }
</script>

<style>
    .aseets-list {
        width: 100%;
        height: calc(100% - 32px);
        color: #fff;

        overflow-y: auto;
        overflow-x: hidden;
    }

    .aseets-list > li {
        display: flex;
        line-height: 30px;
        border-top: 1px solid #2e2977;
        border-bottom: 1px solid #4c4698;
        background-color: rgba(82, 76, 164, .65);
        box-shadow: inset 0 -2px 12px rgba(0, 0, 0, .15);
        cursor: pointer;
        position: relative;
    }

    .aseets-list > li:hover {
        background-color: rgba(93, 144, 255, .75);
    }

    .aseets-list > li .fav {
        width: 10%;
        color: #fc0;
        font-size: 16px;
        padding: 0 2.5%;
        text-align: center;
        line-height: 30px;
        white-space: nowrap;
    }

    .aseets-list > li .number {
        width: 80%;
        padding: 0 1.5%;
        white-space: nowrap;
    }

    .aseets-list > li .ivu-btn-group {
        position: absolute;
        top: 0;
        right: 0;

    }

    .aseets-list > li .ivu-btn-group .ivu-btn, .aseets-list > li .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary:last-child:not(:first-child) {
        border-radius: 0;
        border-color: transparent;
        border-left-color: #4c4698 !important;
        border-right-color: #4c4698 !important;
        height: 30px;
    }

    .aseets-list .shortName {
        display: block;
        float: left;
        width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

</style>