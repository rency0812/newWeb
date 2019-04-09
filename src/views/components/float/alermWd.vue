<template>
    <div class="layout-alerWd" v-if="isAllShow">
        <div class="flip-in-bottom alert-alarm-container" v-for="item,index in alertData" v-if="isShow"
               :key="index">
            <div class="alarm-info-box">
                <h4>{{item.icon}}</h4>
                <h4>
                    <span>{{item.vehicleNo}}</span>
                    <span>{{item.alarmTime}}</span>
                </h4>
                <span slot="desc">{{item.address}}</span>
            </div>
            <div slot="footer">
                <div class="layout-modal-button">
                    <Button type="info" size="small" @click="handleClick(item)"> 处 理</Button>
                    <Button size="small" @click="handleCloseOnce"> 关 闭</Button>
                    <Button @click="noLongerAlert" size="small">不再提示</Button>
                </div>
            </div>
        </div>

        <!--<Alert closable type="warning" show-icon class="flip-in-bottom" v-for="item,index in alertData"-->
               <!--:key="index">-->
            <!--<div @click="handleClick(item)" class="alarm-info-box">-->
                <!--<h3>{{item.icon}}</h3>-->
                <!--<h4>-->
                    <!--<span>{{item.vehicleNo}}</span>-->
                    <!--<span>{{item.alarmTime}}</span>-->
                <!--</h4>-->
                <!--<span slot="desc">{{item.address}}</span>-->
            <!--</div>-->
        <!--</Alert>-->

        <Modal v-model="alarmModal.show"
               :title="alarmModal.title"
               @on-cancel="handleCancel"
               :draggable="true" :mask-closable="false">
            <div class="alarm-box-form-item" style="width: 100%">
                <Form inline label-position="right" :label-width="140">
                    <FormItem label="操作人员">
                        <Input v-model="formItem.account" placeholder="请输入操作人员..." size="small" readonly></Input>
                    </FormItem>
                    <FormItem label="操作时间">
                        <DatePicker type="datetime" placeholder="选择操作时间" v-model="formItem.processTime" size="small"></DatePicker>
                    </FormItem>
                    <FormItem label="操作方式">
                        <Select v-model="formItem.methods" multiple clearable filterable size="small" @on-open-change="onOpenChange" @on-change="initShowItem">
                            <Option v-for="item in actionTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="监听号码" v-show="isShowNumber">
                        <Input size="small" v-model="formItem.methodPhone" type="text"></Input>
                    </FormItem>
                    <FormItem label="拍照通道" v-show="isShowCamera">
                        <Select size="small" v-model="formItem.cameraChanel">
                            <Option v-for="item in chanelArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="拍照张数" v-show="isShowCamera">
                        <Input size="small" v-model="formItem.cameraNumber" type="text"></Input>
                    </FormItem>
                    <FormItem label="拍照间隔(秒)" v-show="isShowCamera">
                        <Input size="small" v-model="formItem.cameraInterval" type="text"></Input>
                    </FormItem>
                    <FormItem label="短信内容" v-show="isShowText">
                        <Input size="small" v-model="formItem.methodMessage" type="textarea" placeholder="请输入短信内容..." :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <div class="layout-modal-button">
                    <Button type="success" icon="md-checkmark-circle" :loading="buttonLoading" @click="handleOk">确定</Button>
                    <Button @click="handleCancel"> 取 消 </Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>/* eslint-disable linebreak-style,complexity,no-var,brace-style,no-console,comma-spacing,indent,no-cond-assign,quotes,init-declarations */
import util from '../../../libs/util'
export default {
    props: ['alertData', 'title'],
    data() {
        return {
            alarmModal:{
                title: '',
                show: false
            },
            formItem: {
                dvo:'', // 设备号
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
            actionTypes:[
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
            buttonLoading: false,
            isShow: true,
            isAllShow:true
        }
    },
    mounted() {},
    methods: {
        // 不再提示操作
        noLongerAlert(){
            this.isAllShow = false
        },
        // 关闭单条记录操作
        handleCloseOnce(){
            this.isShow = false
        },
        // 报警处理
        handleOk(){
            let self = this
            self.postValue = util.insetArray(self.postValue, self.formItem)
            self.postValue.alarmType = parseInt(self.postValue.alarmId)
            if(self.postValue.processTime == "" || self.postValue.methods.length <= 0){
                self.$Notice.error({
                    title: '错误提示！',
                    desc: '请确认时间或方式已选择!',
                    duration: 3
                })
                return
            }
            self.postValue.processTime = util.changeDate(self.postValue.processTime)
            self.buttonLoading = true
            util.ojax.post('/Alarm/Process', self.postValue).then(function(res){
                if (res.data.code == 1) {
                    self.$Notice.success({
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
            }).catch(function(error){
                self.$Notice.error({
                    title: '错误提示！',
                    desc: error.data.msg,
                    duration: 3
                })
                self.buttonLoading = false
            })
        },
        // 取消事件
        handleCancel(){
            let self = this
            self.alarmModal.show = false
            self.alarmModal.title = ''
            self.formItem.processTime = ''
            self.isShowText = false
            self.isShowNumber = false
            self.isShowCamera = false
            self.formItem.methods = []
        },
        // 点击单条记录
        handleClick(item){
            let self = this
            let nDate = new Date().getTime()
            let account = JSON.parse(localStorage.getItem('$userstatus')).account
            self.formItem.account = account
            self.formItem.processTime = util.formatUnixTime(nDate)
            self.alarmModal.title = item.vehicleNo + ' - 报警处理'
            self.formItem.dvo = item.deviceNo
            self.postValue = item
            self.alarmModal.show = true
        },
        // 监听多选项变化
        onOpenChange(v){
            let self = this
            if(!v){
                self.initShowItem()
            }
        },
        initShowItem(){
            let self = this
            if(self.formItem.methods.indexOf(0) > -1){
                self.isShowText = true
            }else{
                self.isShowText = false
            }
            if(self.formItem.methods.indexOf(2) > -1){
                self.isShowNumber = true
            }else{
                self.isShowNumber = false
            }
            if(self.formItem.methods.indexOf(3) > -1){
                self.isShowCamera = true
            }else{
                self.isShowCamera = false
            }
        },
    },
    watch:{
        'alarmModal.show':{
            handler(n) {
                if (!n) {
                    this.handleCancel()
                }
            },
            immediate: true,
            deep: true
        },
        isShowText:{
            handler(n) {
                if(!n){
                    this.formItem.methodMessage = null
                }
            },
            immediate: true,
            deep: true
        },
        isShowNumber:{
            handler(n) {
                if(!n){
                    this.formItem.methodPhone = null
                }
            },
            immediate: true,
            deep: true
        },
        isShowCamera:{
            handler(n) {
                if(!n){
                    this.formItem.cameraNumber = null
                    this.formItem.cameraInterval = null
                    this.formItem.cameraChanel = null
                }else{
                    this.formItem.cameraNumber = 1
                    this.formItem.cameraInterval = 10
                    this.formItem.cameraChanel = 1
                }
            },
            immediate: true,
            deep: true
        },
        alertData: {
            handler(n) {
                if(n.length > 0){
                    this.isShow = true
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style>
    .layout-alerWd {position: absolute;right: 15px;bottom: 15px;z-index: 80;width: 250px; z-index: 10000;}
    .layout-alerWd .alert-alarm-container{padding: 5px 10px;border: 1px solid #ffd77a;background-color: #fff9e6;}
    .layout-alerWd .ivu-alert-desc, .layout-alerWd .ivu-alert-message {font-size: 12px !important;}
    .layout-alerWd .ivu-alert-with-desc.ivu-alert-with-icon {padding: 5px 10px 5px 55px;border-radius: 3px !important;}
    .layout-alerWd .ivu-alert-close {right: 5px;top: 0;}
    .layout-alerWd .ivu-alert-with-desc .ivu-alert-icon {left: 10px;}
    .layout-alerWd .ivu-alert.ivu-alert-with-icon{padding: 8px 20px 8px 38px;}
    .alarm-info-box{cursor: pointer;}
</style>
