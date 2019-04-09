<template>
    <div class="layout-map-tab-group" :class="{active:active}" style="height: 100%;">

        <div class="tab-li" @click="switchTab">
            <Tooltip :content="tabLabel" placement="left">
                <Icon :type="tabIcon"/>
            </Tooltip>
        </div>
        <div class="tab-componet" v-show="active" :style="{top: tableIndex * (-32) + 'px'}">
            <h2>{{tabLabel}} &nbsp;&nbsp;<span>入网：{{listData.total}}辆</span></h2>

            <div class="group-box layout-tree">
                <div class="layout-tree-content" style="height: 100%">
                    <div class="search-box" style="white-space: nowrap">
                        <Input v-model="searchValue" size="small" search autofocus enter-button
                               :placeholder="$t('formText.searchTip')"
                               class="fl" style="max-width: 80%;"
                               @on-change="searchTreeData" @on-click="searchTreeData" @on-enter="searchTreeData"/>
                        <Button icon="md-refresh" size="small" style="margin: 1px 0 0 7px" @click="refreshGrid"/>
                    </div>

                    <div style="height: 100%">
                        <Table :columns="listColumns" :data="listData.list" :pageSize="pageSize" @on-row-click="location" class="tab-componet-list"  >
                            <template slot-scope="{ row }" slot="sta">
                                <Icon type="md-arrow-dropup-circle"
                                      :class="{green:(row.sta==1 || row.sta==2 ||row.sta==3||row.sta==4) ,offline:row.sta==5}">{{row.sta}}</Icon>
                            </template>
                            <template slot-scope="{ row }" slot="vehNo">
                                {{ row.vehNo }}
                            </template>
                            <template slot-scope="{ row }" slot="time">
                                {{ row.time }}
                            </template>
                            <template slot-scope="{ row, index }" slot="action">
                                <div v-if="tabType == 0 && !row.attention">
                                    <Button @click="handleAttend(row)" size="small">关注</Button>
                                </div>
                                <div v-else-if="tabType == 0 && row.attention">
                                    <Button @click="handleCancelAttend(row)" size="small">取消关注</Button>
                                </div>
                                <div v-else-if="tabType == 3">
                                    <Button @click="handleCancelAttend(row)" size="small">取消关注</Button>
                                </div>
                            </template>
                        </Table>

                        <Page :current="listData.pageNum"
                              :total="listData.total"
                              :page-size="listData.size" size="small" show-total simple
                              class="table-page ive-page" @on-change="handlePageChange" style="margin: 0 10px"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //调用依赖库
    import Util from '../../../../libs/util'


    //页面使用组件
    import pLoading from '../../common/pageLoading'
    import listBox from '../monitor-list'

    const vehicleAttention = require('../../../../libs/api').vehicleAttention
    const vehicleUnAttention = require('../../../../libs/api').vehicleUnAttention

    export default {
        props: ['api', 'tableIndex', 'tabLabel', 'tabIcon', 'tabType', 'page', 'act'],

        data() {
            return {
                active:true,
                pageSize: 20,
                pageIndex: 1,
                searchValue: null,
                spinShow: false,
                listColumns: [
                    {
                        title: '状态',
                        key: 'sta',
                        width: 60,
                        align: 'center',
                        slot: 'sta'
                    },
                    {
                        title: '车牌号',
                        width: 80,
                        key: 'vehNo',
                        slot: 'vehNo'
                    },
                    {
                        title: '最后定位时间',
                        key: 'time',
                        align: 'center',
                        slot: 'time'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        align: 'center',
                    }
                ],

                listData: {
                    pageNum: 0,
                    total: 0,
                    size: 20,
                    list: []
                }
            }
        },
        components: {
            pLoading,
            listBox
        },

        mounted() {

            this.active =this.$props.act;
            this.searchGrid({pageIndex: this.pageIndex, pageSize: this.pageSize});
            let self =this;
            this.page.$on('switchTab',function (e) {

                if(e.uid !== self._uid){
                    self.active = false;
                }
                else {
                    self.active =true;
                }
            });
        },

        methods: {

            //映射父组件的tab切换
            switchTab(e) {
                this.page.$emit('switchTab', {uid: this._uid, tabFlag: 'map'});
            },


            searchTreeData() {
                let data = {pageIndex: this.pageIndex, pageSize: this.pageSize, vehNo: this.searchValue};
                this.searchGrid(data);
            },

            refreshGrid(){
                let data = {pageIndex: this.pageIndex, pageSize: this.pageSize, vehNo: this.searchValue};
                this.searchGrid(data);
            },

            handlePageChange(pageIndex) {
                this.searchGrid({pageIndex:pageIndex,pageSize:this.pageSize})
            },

            searchGrid(data){

                let self = this;
                data.vehNo = this.searchValue;
                data.status = [1, 2, 3, 4, 5];
                Util.ojax.post(this.api, data).then(function (response) {

                    if (response.data.code !== '0') {
                        // 查询数据为0
                        return;
                    }
                    self.listData = response.data.detail;
                })
            },

            initOn: function () {
                this.page.$on('switchTab', function (e) {
                    if (e.uid === self._uid) {
                        return;
                    }
                    self.active = false;
                });
            },

            // 定位
            location: function (data) {

                this.page.$emit('location', data);
            },

            // 历史轨迹
            history: function (data) {
                data = data.row;
                window.open('http://ztc.comlbs.com/MapView/TrackView?PhoneNum='+data.devNo+'&VehicleNo='+data.vehNo);
            },

            monitor:function (data) {

                this.page.$emit('monitor', data.row);
            },

            // 跟踪
            track : function(data) {
                this.page.$emit('track', data.row);
            },

            // 关注事件
            handleAttend: function(data){
                let self = this;
                let oParams = {
                    vehNo: data.vehNo,
                    vehicleId: data.id
                }
                Util.ojax.post(vehicleAttention, oParams).then(function (response) {
                    if (response.data.code == '0') {
                        let data = {pageIndex: self.pageIndex, pageSize: self.pageSize, vehNo: self.searchValue};
                        self.searchGrid(data)
                    }
                })
            },

            // 取消关注事件
            handleCancelAttend: function(data){
                let self = this;
                let oParams = {
                    ids: data.id
                }
                Util.ojax.post(vehicleUnAttention, oParams).then(function (response) {
                    if (response.data.code == '0') {
                        let data = {pageIndex: self.pageIndex, pageSize: self.pageSize, vehNo: self.searchValue};
                        self.searchGrid(data)
                    }
                })
            }

        },
        computed: {
            select: function () {
                //this.$props.active= val;
            },
        },
        watch: {}

    }
</script>
