<template>
    <div style="height:100%;background: #e6e6ec;padding: 10px">
        <div>
            <span @click="refreshAlarm" style="cursor: pointer"><Icon type="md-refresh" /> 刷新</span>
            <a class="ivu-modal-close" style="color:inherit" @click="handleClose"><i class="ivu-icon ivu-icon-ios-close"></i></a>
        </div>
        <div class="right-alarm-box">
            <div class="alerm-card" v-for="item, key in imagingData" @click="clickItemAsync(item)" :key="key">
                <ul>
                    <li><p>{{item.vehicleNo}}</p></li>
                    <li><p>{{item.icon}}</p></li>
                    <li><p>{{item.alarmTime}}</p></li>
                    <li><p>{{item.address}}</p></li>
                </ul>
            </div>
        </div>
        <!--<Timeline class="alerm-box">-->
            <!--<TimelineItem color="red" v-for="item,index in alermData" :key="index">-->
                <!--<div class="number">{{item.vehicleNo}} - {{item.icon}}</div>-->
                <!--<div class="time">-->
                    <!--<Time :time="item.alarmTime"/>-->
                <!--</div>-->
                <!--<div class="address">-->
                    <!--<Icon type="ios-pin"/>-->
                    <!--{{item.address}}-->
                <!--</div>-->
            <!--</TimelineItem>-->
        <!--</Timeline>-->


        <Modal v-model="alarmModal.show"
               :title="alarmModal.title"
               @on-cancel="handleCancel"
               :draggable="true" :mask-closable="false" class="layou-modal-input">
            <div class="alarm-box-form-item" style="width: 100%">
                <Form inline label-position="right" :label-width="140">
                    <FormItem label="操作人员">
                        <Input v-model="formItem.account" placeholder="请输入操作人员..." size="small" readonly></Input>
                    </FormItem>
                    <FormItem label="操作时间">
                        <DatePicker type="datetime" placeholder="选择操作时间" v-model="formItem.processTime"
                                    size="small"></DatePicker>
                    </FormItem>
                    <FormItem label="操作方式">
                        <Select v-model="formItem.methods" multiple clearable filterable size="small"
                                @on-open-change="onOpenChange" @on-change="initShowItem">
                            <Option v-for="item in actionTypes" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="监听号码" v-show="isShowNumber">
                        <Input size="small" v-model="formItem.methodPhone" type="text"></Input>
                    </FormItem>
                    <FormItem label="拍照通道" v-show="isShowCamera">
                        <Select size="small" v-model="formItem.cameraChanel">
                            <Option v-for="item in chanelArr" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="拍照张数" v-show="isShowCamera">
                        <Input size="small" v-model="formItem.cameraNumber" type="text"></Input>
                    </FormItem>
                    <FormItem label="拍照间隔(秒)" v-show="isShowCamera">
                        <Input size="small" v-model="formItem.cameraInterval" type="text"></Input>
                    </FormItem>
                    <FormItem label="短信内容" v-show="isShowText">
                        <Input size="small" v-model="formItem.methodMessage" type="textarea" placeholder="请输入短信内容..."
                               :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <div class="layout-modal-button">
                    <Button type="success" icon="md-checkmark-circle" :loading="buttonLoading" @click="handleOk">确定
                    </Button>
                    <Button @click="handleCancel"> 取 消</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>/* eslint-disable linebreak-style,complexity,no-var,brace-style,no-console,comma-spacing,indent,no-cond-assign,quotes,init-declarations */
import Util from '../../../libs/util'
const GetSimAlermUrl = require('../../../libs/api').GetSimAlermUrl

//调用vuex状态管理
import {mapState, mapMutations} from 'vuex'

export default {
    props: ['infoData', 'float'],
    data() {
        return {
            imagingData:[
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
                {vehicleNo: '1',icon: '1', alarmTime:'1',address:  '1'},
            ],
            allData: this.$props.infoData,
            alarmData: [],
            messageData: [],
            caseData: [],
            scrollHeight: null,
            currentTabName: 'name1',
            alarmModal: {
                title: '',
                show: false
            },
            formItem: {
                dvo: '', // 设备号
                alarmTime: '',  // 报警时间
                account: 'exsun', // 处理人
                processTime: {type: Date}, // 处理时间
                methods: [], // 处理方式
                methodMessage: {type: String}, // 短信内容
                methodPhone: {type: String}, // 监听号码
                cameraChanel: {type: Number}, // 通道号
                cameraInterval: {type: Number}, // 拍照间隔
                cameraNumber: {type: Number} // 拍照数量
            },
            actionTypes: [
                {value: 0, label: '发送短信'},
                {value: 1, label: '人工处理'},
                {value: 2, label: '监听'},
                {value: 3, label: '拍照'}
            ],
            chanelArr: [
                {value: 1, label: '1'},
                {value: 2, label: '2'},
                {value: 3, label: '3'},
                {value: 4, label: '4'}
            ],
            postValue: {},
            isShowText: false,
            isShowNumber: false,
            isShowCamera: false,
            buttonLoading: false
        }
    },
    mounted() {
        let self = this
        //临时模拟获取报警数据
        // Util.ojax.get(GetSimAlermUrl).then(function (res) {
        //     // console.log(res)
        //
        //     self.changeAlermData(res.data)
        // }).catch(function (error) {
        //     console.log(error)
        // })
    },
    methods: {
        // 刷新数据
        refreshAlarm(){

        },
        // 报警处理
        handleOk() {
            let self = this
            self.postValue = Util.insetArray(self.postValue, self.formItem)
            self.postValue.alarmType = parseInt(self.postValue.alarmId)
            if (self.postValue.processTime == "" || self.postValue.methods.length <= 0) {
                self.$Notice.error({
                    title: '错误提示！',
                    desc: '请确认时间或方式已选择!',
                    duration: 3
                })
                return
            }
            self.postValue.processTime = Util.changeDate(self.postValue.processTime)
            self.buttonLoading = true
            Util.ojax.post('/Alarm/Process', self.postValue).then(function (res) {
                if (res.data.code == 1) {
                    self.$Notice.error({
                        title: '操作成功！',
                        desc: res.data.msg,
                        duration: 3
                    })
                } else {
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: res.data.msg,
                        duration: 3
                    })
                }
                self.buttonLoading = false
            }).catch(function (error) {
                self.$Notice.error({
                    title: '错误提示！',
                    desc: error.data.msg,
                    duration: 3
                })
                self.buttonLoading = false
            })
        },
        // 取消事件
        handleCancel() {
            let self = this
            self.alarmModal.show = false
            self.alarmModal.title = ''
            self.formItem.processTime = ''
            self.isShowText = false
            self.isShowNumber = false
            self.isShowCamera = false
            self.formItem.methods = []
        },
        // Tab点击
        handleClick(name) {
            this.currentTabName = name
            if (name == 'name3') {
                this.alarmData = this.allData
            }
        },
        // 点击单条记录
        clickItemAsync(item) {
            let self = this
            let nDate = new Date().getTime()
            let account = JSON.parse(localStorage.getItem('$userState')).account
            self.formItem.account = account
            self.formItem.processTime = Util.formatUnixTime(nDate)
            self.alarmModal.title = item.vehicleNo + ' - 报警处理'
            self.formItem.dvo = item.deviceNo
            self.postValue = item
            self.alarmModal.show = true
        },
        // 监听多选项变化
        onOpenChange(v) {
            let self = this
            if (!v) {
                self.initShowItem()
            }
        },
        initShowItem() {
            let self = this
            if (self.formItem.methods.indexOf(0) > -1) {
                self.isShowText = true
            } else {
                self.isShowText = false
            }
            if (self.formItem.methods.indexOf(2) > -1) {
                self.isShowNumber = true
            } else {
                self.isShowNumber = false
            }
            if (self.formItem.methods.indexOf(3) > -1) {
                self.isShowCamera = true
            } else {
                self.isShowCamera = false
            }
        },
        handleFloat() {
            var self = this
            self.float = !self.float
            self.$emit('handleFloat', self.float)

        },
        handleClose() {
            this.$emit('handleClose', false)
        },
        ...mapMutations('platformState', [
            'changeAlermData'
        ])
    },
    watch: {
        'alarmModal.show': {
            handler(n) {
                if (!n) {
                    this.handleCancel()
                }
            },
            immediate: true,
            deep: true
        },
        isShowText: {
            handler(n) {
                if (!n) {
                    this.formItem.methodMessage = null
                }
            },
            immediate: true,
            deep: true
        },
        isShowNumber: {
            handler(n) {
                if (!n) {
                    this.formItem.methodPhone = null
                }
            },
            immediate: true,
            deep: true
        },
        isShowCamera: {
            handler(n) {
                if (!n) {
                    this.formItem.cameraNumber = null
                    this.formItem.cameraInterval = null
                    this.formItem.cameraChanel = null
                } else {
                    this.formItem.cameraNumber = 1
                    this.formItem.cameraInterval = 10
                    this.formItem.cameraChanel = 1
                }
            },
            immediate: true,
            deep: true
        },
        // infoData: {
        //     handler(n) {
        //         if(n.length> 50){
        //             this.formItem.cameraNumber = null
        //             this.formItem.cameraInterval = null
        //             this.formItem.cameraChanel = null
        //         }
        //     },
        //     immediate: true,
        //     deep: true
        // }
    },
    computed: {
        ...mapState('platformState', {
            alermData: (state) => state.alermState.alermData,
        })
    }
}
</script>
<style>
    .layout-alerm-box .ivu-tabs-tabpane {
        overflow-y: auto;
        max-height: 900px;
    }

    .layout-alerm-box .alerm-card {
        cursor: pointer
    }

    .alarm-box-form-item .ivu-form-item {
        width: 80%
    }
    .right-alarm-box{overflow-y: scroll;max-height: 98%;}
    .right-alarm-box .alerm-card{background: #f2f2f2;color: #666666}
</style>