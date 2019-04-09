<template>
    <!--新增部门弹窗-->
    <div class="extra-button-container">
        <Button type="default" size="small" icon="ios-create-outline" class="adv-search-btn"
                @click="handleSaveDepartment"> 查看
        </Button>
        <Modal v-model="modalShow" width="700" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>查看设备</span>
            </p>
            <div>
                <Collapse v-model="colValue" accordion>
                    <Panel name="1">
                        基本信息
                        <form-ext slot="content" :formCfg="saveBasicCfg" :formModal="editModal" class="form-col-2"></form-ext>
                    </Panel>
                    <Panel name="2">
                        配置信息
                        <form-ext slot="content" :formCfg="saveConfigCfg" :formModal="editModal" class="form-col-2"></form-ext>
                    </Panel>
                    <Panel name="3">
                        通道信息
                        <div slot="content" class="form-col-2">
                            <form-ext slot="content" :formCfg="channelCfg" :formModal="editModal" class="form-col-2"></form-ext>
                            <div v-if="chanelArr.length > 0" v-for="(item, index) in chanelArr">
                                <div class="panel-title">
                                    通道{{index + 1}}
                                </div>
                                <form-ext :formCfg="item.cfg" :formModal="editModal.channelInfos[index]"></form-ext>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <div slot="footer" class="layout-modal-button">
                <Button type="success" icon="checkmark-round" :loading="buttonLoading" @click="handleCancel" style="display: none"> 保 存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Util from '../../../../libs/util'
    import {mapGetters, mapMutations} from 'vuex'
    import formExt from '../formExt'

    export default {
        components: {formExt},
        props: ['api', 'rowData', 'rowIndex'],
        data() {
            return {
                colValue: '1',
                modalShow: false,
                buttonLoading: false,
                saveBasicCfg: [
                    {id: 1, type: 'readonly-input', label: '设备号', name: 'devNo'},
                    {id: 2, type: 'readonly-input', label: '设备类型', name: 'deviceTypeId', postUrl: '/table/deviceType/querySelectRemote'},
                    {id: 3, type: 'readonly-input', label: '组织机构', name: 'deptId', treeType: 'departmentTree'},
                    {id: 4, type: 'readonly-input', label: 'IMEI', name: 'imei'},
                    {id: 5, type: 'readonly-input', label: 'SIM卡号', name: 'simNo'},
                    {id: 6, type: 'readonly-input', label: '安装地点', name: 'fixAddress'},
                    // {id: 7, type: 'readonly-input', label: 'ICCID', name: 'iccid'},
                    {id: 8, type: 'readonly-input', label: '备注', name: 'remark'},
                    {id: 9, type: 'readonly-input', label: '创建人', name: 'createName'},
                    {id: 10, type: 'readonly-input', label: '修改人', name: 'modifyName'},
                    {id: 11, type: 'readonly-input', label: '创建时间', name: 'createTime'},
                    {id: 12, type: 'readonly-input', label: '修改时间', name: 'modifyName'},
                ],
                saveConfigCfg:[
                    {id: 1, type: 'readonly-input', label: '服务器地址1', name: 'serverAddress1'},
                    {id: 2, type: 'readonly-input', label: '身份校验密码', name: 'idPassword'},
                    {id: 3, type: 'readonly-input', label: '服务器端口1', name: 'serverPort1'},
                    {id: 4, type: 'readonly-input', label: '省域ID', name: 'provinceId'},
                    {id: 5, type: 'readonly-input', label: '服务器地址2', name: 'serverAddress2'},
                    {id: 6, type: 'readonly-input', label: '市域ID', name: 'cityId'},
                    {id: 7, type: 'readonly-input', label: '服务器端口2', name: 'serverPort2'}
                ],
                channelCfg:[
                    {id: 1, type: 'readonly-input', label: '摄像头数量', name: 'cameraNum'},
                    {id: 2, type: 'readonly-input', label: '录像存储介质容量', name: 'videoSaveCapacity'},
                    {id: 3, type: 'readonly-input', label: '录像存储介质类型', name: 'videoSaveType'},
                    {id: 4, type: 'readonly-input', label: '通道数目', name: 'channelNum'}
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
                    "iccid": null,
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
            }
        },
        methods: {
            // 将已有的数据传到弹窗里
            pushExsitChannelData(len, v){
                let self = this
                for(let i = len; i < v; i++){
                    self.chanelArr[i] = {
                        id: i+1,
                        cfg: [
                            {id: 1, type: 'readonly-input', label: '名称', name: 'channelName'},
                            {id: 2, type: 'readonly-input', label: '接入线路', name: 'channelLine', dicType: 2},
                            {id: 3, type: 'readonly-input', label: '安装说明', name: 'installInfo', treeType: 'departmentTree'},
                            {id: 4, type: 'readonly-input', label: '云台功能', name: 'cloudFunction'},
                            {id: 5, type: 'readonly-input', label: '型号', name: 'modelNumber'}
                        ]
                    }
                }
                console.log(self.chanelArr)
            },

            // 添加部门按钮 点击出现弹窗
            handleSaveDepartment(e) {
                console.log(this.rowData)
                this.modalShow = true
                this.editModal = this.rowData
                console.log(this.rowData.channelNum)
                let v = this.editModal.channelInfos.length
                this.pushExsitChannelData(0, v)
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
                    "deviceTypeId":null,
                    "fixAddress": null,
                    "iccid": null,
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