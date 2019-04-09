<template>
    <!--新增部门弹窗-->
    <div class="extra-button-container">
        <Button type="success" size="small" icon="md-add" class="adv-search-btn"
                @click="handleSaveDepartment"> 新增
        </Button>
        <Modal v-model="modalShow" width="700" :draggable="true" :mask-closable="false" :scrollable="true" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>新增设备</span>
            </p>
            <div>
                <Collapse v-model="colValue" accordion>
                    <Panel name="1">
                        基本信息
                        <form-ext slot="content" :formCfg="saveBasicCfg" :formModal="editModal" :isShow="modalShow" @updateFormData="updateFormData" class="form-col-2"></form-ext>
                    </Panel>
                    <Panel name="2">
                        配置信息
                        <form-ext slot="content" :formCfg="saveConfigCfg" :formModal="editModal" :isShow="modalShow" @updateFormData="updateFormData" class="form-col-2"></form-ext>
                    </Panel>
                    <Panel name="3">
                        通道信息
                        <div slot="content" class="form-col-2">
                            <Form ref="formInline" inline label-position="right" :label-width="100">
                                <FormItem label="摄像头数量">
                                    <Select clearable filterable size="small" v-model="editModal.cameraNum" :transfer="true">
                                        <Option v-for="n in cameraNum" :value="n">{{n}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="录像存储介质容量">
                                    <Input type="text" v-model="editModal.videoSaveCapacity" placeholder="请输入..." size="small" style="width: 80%;float: right"/>
                                </FormItem>
                                <FormItem label="通道数目">
                                    <Select clearable filterable size="small" v-model="editModal.channelNum" @on-change="handleChanelNumChange" :transfer="true">
                                        <Option v-for="n in cameraNum" :value="n" :key="n">{{n}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="录像存储介质类型">
                                    <Input type="text" v-model="editModal.videoSaveType" placeholder="请输入..." size="small" style="width: 80%;float: right"/>
                                </FormItem>
                            </Form>
                            <div v-if="chanelArr.length > 0" v-for="(item, index) in chanelArr"  :key="index">
                                <div class="panel-title">
                                    通道{{index + 1}}
                                </div>
                                <form-ext :formCfg="item.cfg" :formModal="item.editChannelModal"></form-ext>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
                <Alert type="error" show-icon v-show="errorTip !== null">
                    <p v-html="errorTip"></p>
                </Alert>
            </div>
            <div slot="footer" class="layout-modal-button">
                <Button @click="handleCancel"> 取 消</Button>
                <Button type="success" icon="checkmark-round" :loading="buttonLoading" @click="handleSave"> 保 存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Util from '../../../../libs/util'
    import {mapGetters, mapMutations} from 'vuex'
    import formExt from '../formExt'
    import selectRemote from '../../form/select-remote'


    export default {
        components: {formExt,selectRemote},
        props: ['api'],
        data() {
            return {
                colValue: '1',
                modalShow: false,
                buttonLoading: false,
                saveBasicCfg: [
                    {id: 1, type: 'input', label: '*设备号', name: 'devNo'},
                    {id: 2, type: 'select-device-type', label: '*设备类型', name: 'deviceTypeId', dicType: '/table/deviceType/querySelectRemote'},
                    {id: 3, type: 'select-tree', label: '*组织机构', name: 'deptId', treeType: 'departmentTree'},
                    {id: 4, type: 'input', label: 'IMEI', name: 'imei'},
                    {id: 5, type: 'select-sim', label: '*SIM卡号', name: 'simNo', dicType: '/table/simManage/querySim'},
                    {id: 6, type: 'input', label: '安装地点', name: 'fixAddress'},
                    // {id: 7, type: 'input', label: '*ICCID', name: 'iccid'},
                    {id: 7, type: 'input', label: '备注', name: 'remark'},
                ],
                saveConfigCfg:[
                    {id: 1, type: 'input', label: '服务器地址1', name: 'serverAddress1'},
                    {id: 2, type: 'input', label: '身份校验密码', name: 'idPassword'},
                    {id: 3, type: 'input', label: '服务器端口1', name: 'serverPort1'},
                    {id: 4, type: 'input', label: '省域ID', name: 'provinceId'},
                    {id: 5, type: 'input', label: '服务器地址2', name: 'serverAddress2'},
                    {id: 6, type: 'input', label: '市域ID', name: 'cityId'},
                    {id: 7, type: 'input', label: '服务器端口2', name: 'serverPort2'}
                ],

                // 通道编辑框数组
                chanelArr: [],

                editModal: {
                    "cameraNum": null,
                    "channelInfos": [],
                    "channelNum": null,
                    "cityId": null,
                    "deptId": null,
                    "devNo": null,
                    "deviceTypeId":null,
                    "fixAddress": null,
                    // "iccid": null,
                    "idPassword": null,
                    "imei": null,
                    "provinceId": null,
                    "remark": null,
                    "serverAddress1": null,
                    "serverAddress2": null,
                    "serverPort1": null,
                    "serverPost2": null,
                    "simNo": null,
                    "videoSaveCapacity": null,
                    "videoSaveType": null
                },
                errorTip: null,
                record:{
                    name: 'videoSaveType',
                    dicType: 15
                },
                cameraNum: 6
            }
        },
        methods: {
            // 选择录像存储介质类型
            hanldeSelectRecordRemote(v){
                this.editModal[v.name] = v.value
            },
            // 改变通道数目 显示对应数目的通道编辑框
            handleChanelNumChange(v){
                let self = this
                self.chanelArr = []
                self.editModal.channelInfos = []
                for(let i =0;i<v;i++){
                    self.chanelArr[i] = {
                        id: i+1,
                        cfg: [
                            {id: 1, type: 'input', label: '名称', name: 'channelName'},
                            {id: 2, type: 'select-number', label: '接入线路', name: 'channelLine', option: 10},
                            {id: 3, type: 'input', label: '安装说明', name: 'installInfo'},
                            {id: 4, type: 'radio', label: '云台功能', name: 'cloudFunction', children: [{value: 1,label:'启用'}, {value: 2,label:'禁用'}]},
                            {id: 5, type: 'select-remote', label: '型号', name: 'modelNumber', dicType: 16}
                        ],
                        editChannelModal:{
                            "channelLine": 1,
                            "channelName": 'CH' + (i+1),
                            "cloudFunction": 1,
                            "installInfo": null,
                            "modelNumber": null
                        }
                    }
                }
                console.log(self.chanelArr)
                console.log(self.editModal.channelInfos)
            },


            // 实时更新表单里的数据
            updateFormData(e){
                this.editModal = e
            },

            // 添加部门按钮 点击出现弹窗
            handleSaveDepartment(e) {
                this.modalShow = true
            },

            // 保存
            handleSave() {
                const self = this
                self.buttonLoading = true
                let nArr = []
                for(let v = 0; v<self.chanelArr.length;v++){
                    nArr.push(self.chanelArr[v].editChannelModal)
                }
                self.editModal.channelInfos = nArr
                console.log(self.editModal)
                Util.ojax.post(self.api, self.editModal).then(function (res) {
                    if (res.data.code == 0) {
                        self.resetFormData()
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!',
                            duration: 3
                        })
                        self.errorTip = null
                        self.modalShow = false
                        self.$emit('handleSearch')
                    } else {
                        self.errorTip = res.data.msg
                    }
                    self.buttonLoading = false
                }).catch(function (error) {
                    console.log(error)
                })
            },

            // 取消事件
            handleCancel() {
                var self = this
                self.resetFormData()
                self.buttonLoading = false
                self.modalShow = false
            },
            // 清空表单数据
            resetFormData(){
                this.editModal = {
                    "cameraNum": null,
                    "channelInfos": [],
                    "channelNum": null,
                    "cityId": null,
                    "deptId": null,
                    "devNo": null,
                    "deviceTypeId":0,
                    "fixAddress": null,
                    // "iccid": null,
                    "idPassword": null,
                    "imei": null,
                    "provinceId": null,
                    "remark": null,
                    "serverAddress1": null,
                    "serverAddress2": null,
                    "serverPort1": null,
                    "serverPost2": null,
                    "simNo": null,
                    "videoSaveCapacity": null,
                    "videoSaveType": null
                }
                this.chanelArr = []
                this.colValue = '1'
                this.errorTip = null
            }
        },
        computed: {
            menuId() {
                return this.$route.meta.menuId
            },
            ...mapGetters('tableState', [
                'pageCfg'
            ])
        },
        watch: {}
    }
</script>