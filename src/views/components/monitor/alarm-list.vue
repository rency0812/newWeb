<template>
    <div style="height: 100%">
        <Table :columns="listColumns" :data="listData.list"   class="tab-componet-list"  >

            <template slot-scope="{ row }" slot="typeName">
                {{ row.typeName }}
            </template>
            <template slot-scope="{ row }" slot="deptName">
                {{ row.deptName }}
            </template>
            <template slot-scope="{ row }" slot="vehNo">
                {{ row.vehNo }}
            </template>
            <template slot-scope="{ row }" slot="mobile">
                {{ row.mobile }}
            </template>
            <template slot-scope="{ row }" slot="count">
                {{ row.count }}
            </template>
            <template slot-scope="{ row }" slot="alarmTime">
                <Time :time="parseInt(row.alarmTime)"  type ="datetime"/>
            </template>

            <template slot-scope="{ row, index }" slot="action">

                <TrackButton type="primary" size="small" style="margin-right: 5px"
                    :data="row"
                    :page="page">跟踪</TrackButton>
                <Button type="error" size="small" @click="handler(row)">处理</Button>
                <Button type="error" size="small" @click="location(row)">位置</Button>
                <Button type="error" size="small" @click="history(row)">轨迹</Button>
            </template>

        </Table>
        <!--处理告警弹窗-->
        <alarm-handle-modal :modalShow="modalShow" :rowData="rowData" @hideModal="hideModal"></alarm-handle-modal>

    </div>
</template>

<script>


    import TrackButton from './track-button.vue';

    import Util from '../../../libs/util'
    import alarmHandleModal from './alarm-handle-modal'
    const pageUrl = require('../../../libs/api.js').mapMonitor;

    export default {
        props: ['page'],

        components: {
            TrackButton,
            alarmHandleModal
        },

        data: function () {
            return {
                trackName: '跟踪',
                // 告警列表
                listColumns: [
                    {
                        title: '报警类型',
                        key: 'typeName',
                        align: 'center',
                        slot: 'typeName'
                    },
                    {
                        title: '组织机构',
                        key: 'deptName',
                        slot: 'deptName'
                    },
                    {
                        title: '车牌号',
                        key: 'vehNo',
                        slot: 'vehNo'
                    },

                    {
                        title: '设备号',
                        key: 'mobile',
                        slot: 'mobile'
                    },
                    {
                        title: '报警次数',
                        key: 'count',
                        slot: 'count'
                    },
                    {
                        title: '报警时间',
                        key: 'alarmTime',
                        slot: 'alarmTime'
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        //width: 150,
                        align: 'center'
                    }
                ],
                data: [],
                listData: {
                    pageNum: 1,
                    total: 100,
                    size: 100,
                    list: []
                },
                modalShow: false,
                rowData: null
            }

        },

        mounted:function () {

            this.loadAramGrid();
        },

        methods: {

            handlePageChange(pageIndex) {
                this.$emit('searchGrid',{pageIndex:pageIndex,pageSize:this.pageSize})
            },

            // 加载告警数据
            loadAramGrid:function () {
                var self = this;

                Util.ojax.post(pageUrl.alarmUrl, {count: '20'}).then(function (response) {
                    if (response.data.code !== '0') {
                        // 查询数据为0
                        return;
                    }

                    for (let i = 0; i < response.data.detail.length; i++) {
                        response.data.detail[i].devNo = response.data.detail[i].mobile;
                    }

                    self.listData.list = response.data.detail;
                });
            },

            // 广播定位事件
            location: function (data) {

                this.page.$emit('location',data)
            },

            // 历史轨迹
            history: function (data) {

                window.open('/WebHisTrack/html/trackview.html?PhoneNum=' + data.devNo + '&VehicleNo=' + data.vehNo);
            },


            // 告警处理
            handler:function (data) {

                this.modalShow = true
                this.rowData = data
            },

            hideModal(v){
                this.modalShow = false
                this.rowData = null
            }
        }
    }
</script>
