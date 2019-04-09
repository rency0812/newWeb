<style>
    .map-view-alert-box{
        width            :65%;
        height           :33px;
        overflow         :hidden;
        background-color :transparent;
        position         :absolute;
        bottom           :0px;
        left             :0px;
        z-index          :1020;
        transition       :height .35s ease-in-out;
        }
    .map-view-alert-box .ivu-tabs{
        border-radius :4px;
        box-shadow    :0 0 3px rgba(0, 0, 0, .05);
        }
    .map-view-alert-box .ivu-tabs-tab{
        padding     :0 5px !important;
        margin-left :7px !important;
        }
    .map-view-alert-box .ivu-tabs-tab i{
        font-size    :18px;
        line-height  :30px;
        color        :#f60;
        margin-right :5px;
        }
    .map-view-alert-box .ivu-tabs-tab-active{
        text-shadow             :0 1px 0 rgba(0, 0, 0, .35);
        background-color        :#3ab0ee !important;
        color                   :#fff !important;
        background-image        :-webkit-linear-gradient(-45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent) !important;
        background-image        :-o-linear-gradient(-45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent) !important;
        background-image        :linear-gradient(-45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent) !important;
        -webkit-background-size :40px 40px !important;
        background-size         :40px 40px !important;
        }
    .map-view-alert-box .ivu-tabs-tab-active i{
        color       :#fff !important;
        text-shadow :0 1px 0 rgba(0, 0, 0, .35);
        }
    .map-view-alert-box .alert-box-content{
        width    :95%;
        position :absolute;
        left     :15px;
        top      :0;
        }
    .alert-box-content .ivu-tabs-nav-container{
        line-height :1;
        }
    .alert-box-content .ivu-tabs-tabpane{
        height                  :85px;
        border-radius           :4px;
        box-shadow              :0 2px 3px rgba(0, 0, 0, .05);
        background-color        :#3ab0ee;
        background-image        :-webkit-linear-gradient(-45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
        background-image        :-o-linear-gradient(-45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
        background-image        :linear-gradient(-45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
        -webkit-background-size :40px 40px;
        background-size         :40px 40px;
        }
    .map-view-alert-box .ivu-tabs-tab .ivu-badge-dot{
        top    :-17px;
        right  :-12px;
        border :1px solid #fff;
        }
    .map-view-alert-box .ivu-tabs-tab .ivu-badge-count{
        height      :15px;
        line-height :15px;
        top         :-9px;
        right       :-7px;
        }
    .alert-card-box{
        width            :20%;
        height           :75px;
        overflow         :hidden;
        margin           :5px;
        float            :left;
        background-color :rgba(255, 255, 255, .85);
        cursor           :pointer;
        }
</style>
<template>
    <div class="map-view-alert-box" ref="alertBox">
        <div class="alert-box-content">
            <Tabs value="alert" type="card">
                <Button type="info" @click="handleAlertBox(true)" v-show="arrow" size="small" slot="extra">
                    <Icon type="arrow-up-a"></Icon>
                </Button>
                <Button type="info" @click="handleAlertBox(false)" v-show="!arrow" size="small" slot="extra">
                    <Icon type="arrow-down-a"></Icon>
                </Button>
                <TabPane :label="item.label" :name="item.name" v-for="item in labels" :key="item.name"
                         @on-click="handleAlertBox">
                    <Card :bordered="false" class="alert-card-box">
                        <p>无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充。</p>
                    </Card>
                    <Card :bordered="false" class="alert-card-box">
                        <p>无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充无边框内容填充。</p>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>
<script>
    /* eslint-disable indent,linebreak-style,no-var,comma-spacing,no-undef,quotes,no-console,no-unused-vars */
    const GpsHubsUrl = require('../../libs/api').GpsHubsUrl



    export default {
        data() {
            return {
                arrow: true,
                labels: [{
                    label: (h) => {
                        return h('div', [
                            h('i', {
                                class: 'ex-icon ex-icon-alert'
                            }),
                            h('span', '报警状态'),
                            h('Badge', {
                                props: {
                                    dot: true,
                                    count: 0,
                                    'overflow-count': 999
                                }
                            })
                        ])
                    },
                    name: 'alert',
                    icon: 'ex-icon ex-icon-alert'
                }, {
                    label: (h) => {
                        return h('div', [
                            h('i', {
                                class: 'ex-icon ex-icon-truck'
                            }),
                            h('span', '车辆状态'),
                            h('Badge', {
                                props: {
                                    dot: true,
                                    count: 0,
                                    'overflow-count': 999
                                }
                            })
                        ])
                    },
                    name: 'truck',
                    icon: 'ex-icon ex-icon-truck'
                }]
            }
        },
        mounted() {

        },
        created() {
        },
        methods: {
            handleAlertBox(e) {
                if (e) {
                    this.$refs.alertBox.style.height = '123px'
                    this.arrow = false
                } else {
                    this.$refs.alertBox.style.height = '33px'
                    this.arrow = true
                }
            }
        }
    }
</script>