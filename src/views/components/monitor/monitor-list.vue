<template>
    <div style="height: 100%">
        <Table :columns="listColumns" :data="listData.list" :pageSize="pageSize" class="tab-componet-list"  >
            <template slot-scope="{ row }" slot="sta">
                <Icon type="md-arrow-dropup-circle"
                      :class="{green:row.sta==1,green:row.sta==2,green:row.sta==3,green:row.sta==4,offline:row.sta==5}">{{row.sta}}
                </Icon>
            </template>
            <template slot-scope="{ row }" slot="vehNo">
                {{ row.vehNo }}
            </template>
            <template slot-scope="{ row }" slot="devNo">
                {{ row.devNo }}
            </template>
            <template slot-scope="{ row }" slot="deptName">
                {{ row.deptName }}
            </template>
            <template slot-scope="{ row }" slot="vehNo">
                {{ row.vehNo }}
            </template>
            <template slot-scope="{ row }" slot="vehTy">
                {{ row.vehTy }}
            </template>
            <template slot-scope="{ row }" slot="vehPCor">
                {{ row.vehPCor }}
            </template>
            <template slot-scope="{ row }" slot="pos">
                {{ row.pos }}
            </template>
            <template slot-scope="{ row }" slot="speed">
                {{ row.speed }}
            </template>
            <template slot-scope="{ row }" slot="time">
                {{ row.time }}
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <!--
                <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">跟踪</Button>
                -->
                <TrackButton type="primary" size="small" style="margin-right: 5px"
                             :data="row"
                             :page="page">跟踪</TrackButton>
                <Button type="error" size="small" @click="cancelMonitor(row)">取消监控</Button>
                <Button type="error" size="small" @click="location(row)">位置</Button>
                <Button type="error" size="small" @click="history(row)">轨迹</Button>
            </template>

        </Table>

        <Page :current="listData.pageNum"
              :total="listData.total"
              :page-size="listData.size" size="small" show-total simple
              class="table-page ive-page" @on-change="handlePageChange" style="margin: 0 10px"/>
    </div>
</template>

<script>
    import   eventsMixin   from 'vue'
    const pageUrl = require('../../../libs/api.js').mapMonitor;
    import Util from '../../../libs/util'
    import TrackButton from './track-button.vue';

    export default {
        props: {
            page: {
                type: eventsMixin,
                default () {
                    return new eventsMixin()
                }
            },
            pageSize: {
                type: Number,
                default: 100
            }
        },

        components: {
            TrackButton
        },

        data: function () {
            return {

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
                        key: 'vehNo',
                        slot: 'vehNo'
                    },
                    {
                        title: '设备号',
                        key: 'devNo',
                        slot: 'devNo'
                    },
                    {
                        title: '组织机构',
                        key: 'deptName',
                        slot: 'deptName'
                    },
                    {
                        title: '车辆类型',
                        key: 'vehTy',
                        slot: 'vehTy'
                    },
                    {
                        title: '车牌颜色',
                        key: 'vehPCor',
                        slot: 'vehPCor'
                    },
                    {
                        title: '车辆位置',

                        key: 'pos',
                        slot: 'pos'
                    },
                    {
                        title: '速度（km/h）',
                        key: 'speed',
                        slot: 'speed'
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
                        align: 'center'
                    }
                ],
                listData: {
                    pageNum: 1,
                    total: 0,
                    size: 100,
                    list: []
                },

            }
        },

        mounted: function () {
            let self = this;
            this.page.$on('monitor', function (data) {

                if (Util.isInObjArray(self.listData.list, data.devNo, 'devNo')) {
                    return;
                }

                Util.ojax.post(pageUrl.realLocation, {devNos: [data.devNo]}).then(function (response) {
                    if (response.data.code !== '0') {
                        // 查询数据为0
                        return;
                    }

                    if (response.data.detail.length <= 0) {
                        return;
                    }

                    self.handlerPoi(response.data.detail[0]);
                })
            });

        },

        computed: {

        },

        methods: {

            // 广播定位事件
            location: function (data) {

                this.page.$emit('location',data)
            },

            // 历史轨迹
            history: function (data) {

                window.open('/WebHisTrack/html/trackview.html?PhoneNum=' + data.devNo + '&VehicleNo=' + data.vehNo);
            },

            getStatusCls: function (data) {
                debugger
                let cls = 'green'
                switch (data.sta){
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    case 5:
                        cls = 'offline'
                        break;
                }

                return cls;
            },


            handlerPoi: function (data) {
                let self = this;
                Util.ojax.post(pageUrl.regeo,
                    {
                        radius: 1000,
                        location: data.latLng.lng + ',' + data.latLng.lat
                    }).then(function (response) {
                    if (response.data.code !== '0') {
                        // 查询数据为0
                        console.log('逆地址请求失败！');
                        return;
                    }

                    data.pos = response.data.detail.regeocode.formatted_address;

                    self.listData.list.unshift(data);
                    self.listData.total = self.listData.list.length;

                })

            },

            handlePageChange(pageIndex) {
                this.$emit('searchGrid', {pageIndex: pageIndex, pageSize: this.pageSize})
            },

            // 定位
            location: function (data) {
                this.page.$emit('location', data)
            },

            // 历史轨迹
            history: function (data) {
                this.page.$emit('history', data)
            },

            // 跟踪
            track: function (data, cText) {

            },

            cancelMonitor: function (data) {

                let self = this;
                let index = Util.InObjArrayOfIndex(self.listData.list, data.devNo, 'devNo')
                if (index < 0) {
                    return;
                }

                self.listData.list.splice(index, 1);
            },

        }
    }
</script>
