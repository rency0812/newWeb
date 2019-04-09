<template>
    <div style="height: 100%">
        <Modal v-model="show" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>处理告警 - {{vehNo}}</span>
            </p>
            <div class="modal-form">
                <Form inline label-position="right" :label-width="100">
                    <FormItem label="操作时间">
                        <DatePicker type="datetime" placeholder="选择操作时间" v-model="handleAlarmModal.processTime" size="small"></DatePicker>
                    </FormItem>
                    <FormItem label="操作方式">
                        <Checkbox v-model="value1" @on-change="checkMethods1">文本</Checkbox>
                        <Checkbox v-model="value2" @on-change="checkMethods2">监听</Checkbox>
                        <Checkbox v-model="value3" @on-change="checkMethods3">拍照</Checkbox>
                        <Checkbox v-model="value4" @on-change="checkMethods4">人工处理</Checkbox>
                    </FormItem>
                    <FormItem label="监听号码" v-show="value2">
                        <Input size="small" v-model="handleAlarmModal.listenNo" type="text"></Input>
                    </FormItem>
                    <FormItem label="拍照通道" v-show="value3">
                        <Select size="small" v-model="handleAlarmModal.cameraChannel">
                            <Option v-for="item in chanelArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="拍照张数" v-show="value3">
                        <Input size="small" v-model="handleAlarmModal.cameraNum" type="text"></Input>
                    </FormItem>
                    <FormItem label="拍照间隔(秒)" v-show="value3">
                        <Input size="small" v-model="handleAlarmModal.cameraSpace" type="text"></Input>
                    </FormItem>
                    <FormItem label="文本内容" v-show="value1">
                        <Input size="small" v-model="handleAlarmModal.message" type="textarea" placeholder="请输入短信内容..." :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    <FormItem label="备注">
                        <Input size="small" v-model="handleAlarmModal.remark" type="textarea" placeholder="请输入短信内容..." :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                </Form>
                <Alert type="error" show-icon v-show="errorTip !== null">
                    <p v-html="errorTip"></p>
                </Alert>
            </div>
            <div slot="footer">
                <div class="layout-modal-button">
                    <Button @click="handleCancel"> 取 消 </Button>
                    <Button type="success" icon="md-checkmark-circle" :loading="buttonLoading" @click="handleOk">确定</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Util from '../../../libs/util'
    const handleAlarmUrl = require('../../../libs/api').handleAlarmUrl
    export default {
        props: ['rowData', 'modalShow'],
        data() {
            return {
                show: false,
                buttonLoading: false,
                handleAlarmModal: {
                    "processTime": null,
                    "listenNo": null,
                    "cameraChannel": null,
                    "cameraNum": null,
                    "cameraSpace": null,
                    "message": null,
                    "remark": null,
                    "type": "emergencyAlert",
                    "mobile": null, //
                    "methods": [],
                    "handleMode":"",
                },
                chanelArr: [
                    {value: 0, label: '全部'},
                    {value: 1, label: '1'},
                    {value: 2, label: '2'},
                    {value: 3, label: '3'},
                    {value: 4, label: '4'},
                    {value: 5, label: '5'},
                ],
                errorTip: null,
                vehNo: '',
                inData: null,
                value1: false,
                value2: false,
                value3: false,
                value4: false,
            }
        },
        methods: {
            checkMethods1(v){
                if(!v){
                    this.handleAlarmModal.message = null
                    this.spliceArr(109)
                }else{
                    this.handleAlarmModal.methods.push(109)
                }
            },
            checkMethods2(v){
                if(!v){
                    this.handleAlarmModal.listenNo = null
                    this.spliceArr(114)
                }else{
                    this.handleAlarmModal.methods.push(114)
                }
            },
            checkMethods3(v){
                if(!v){
                    this.handleAlarmModal.cameraChannel = null
                    this.handleAlarmModal.cameraNum = null
                    this.handleAlarmModal.cameraSpace = null
                    this.spliceArr(128)
                }else{
                    this.handleAlarmModal.methods.push(128)
                }
            },
            checkMethods4(v){
                if(!v){
                    this.spliceArr(4)
                }else{
                    this.handleAlarmModal.methods.push(4)
                }
            },
            spliceArr(n){
                let index = this.handleAlarmModal.methods.indexOf(n)
                this.handleAlarmModal.methods.splice(index, 1)
            },
            // 取消
            handleCancel(){
                this.show = false
                this.errorTip = null
                this.buttonLoading = false
                this.value1 = false
                this.value2 = false
                this.value3 = false
                this.value4 = false
                this.handleAlarmModal = {
                    "processTime": null,
                    "listenNo": null,
                    "cameraChannel": null,
                    "cameraNum": null,
                    "cameraSpace": null,
                    "message": null,
                    "remark": null,
                    "type": "emergencyAlert",
                    "mobile": this.$props.rowData.mobile,
                    "methods": [],
                    "handleMode":"",
                }
                this.$emit('hideModal', {showModal: false})
            },
            // 保存
            handleOk(){
                let self = this
                self.buttonLoading = true
                self.handleAlarmModal.handleMode = self.handleAlarmModal.methods.join(',')
                Util.ojax.post(handleAlarmUrl, self.handleAlarmModal).then(function (res) {
                    if (res.data.code == 0) {
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!',
                            duration: 3
                        })
                        self.handleCancel()
                    } else {
                        self.errorTip = res.data.msg
                    }
                    self.buttonLoading = false
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
        watch:{
            modalShow: {
                handler(data) {
                    this.show = data
                    if(data){
                        this.handleAlarmModal.processTime = Util.formatUnixTime(new Date().getTime())
                        this.handleAlarmModal.mobile = this.rowData.mobile
                        this.inData = this.rowData
                    }
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>
