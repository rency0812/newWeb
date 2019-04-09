<template>
    <div class="extra-button-container">
        <!--编辑数据类型弹窗-->
        <Button type="default" size="small" icon="ios-create-outline" class="adv-search-btn"
                @click="handlePlus">编辑
        </Button>
        <Modal v-model="modalShow" width="700" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>编辑驾驶员</span>
            </p>
            <div>
                <form-ext :formCfg="saveModalCfg" :formModal="editModal" :isShow="modalShow" @updateSaveMenuModel="updateSaveModel" class="form-col-2"/>
                <Form ref="formInline" inline label-position="right" :label-width="100">
                    <FormItem label="证件照:">
                        <Upload
                                :headers="postHeader"
                                :before-upload="handleBeforeUpload"
                                :on-success="handleUploadSuccess1"
                                :show-upload-list="false"
                                :action="ActionUploadUrl">
                            <Button> 上 传 </Button>
                            <span>{{fileValue1}}</span>
                            <img :src="editModal.licensePicUrl" alt="" style="margin-left: 20px;vertical-align: middle;">
                        </Upload>
                    </FormItem>
                    <FormItem label="照片:" style="margin-left: 40px">
                        <Upload
                                :before-upload="handleBeforeUpload"
                                :on-success="handleUploadSuccess2"
                                :show-upload-list="false"
                                :headers="postHeader"
                                :action="ActionUploadUrl">
                            <Button> 上 传 </Button>
                            <span>{{fileValue2}}</span>
                            <img :src="editModal.picUrl" alt="" style="margin-left: 20px;vertical-align: middle;">
                        </Upload>
                    </FormItem>
                </Form>
                <Alert type="error" show-icon v-show="errorTip !== null">
                    <p v-html="errorTip"></p>
                </Alert>
            </div>
            <div slot="footer" class="layout-modal-button">
                <Button @click="delectFile"> 删除文件</Button>
                <Button @click="handleCancel"> 取 消</Button>
                <Button type="success" icon="checkmark-round" :loading="buttonLoading" @click="handleSave"> 保 存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    //调用依赖库
    import Util from '../../../../libs/util'
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    //调用组件
    import formExt from '../formExt'

    export default {
        components: {
            formExt
        },
        props: ['api', 'rowData', 'rowIndex'],
        data() {
            return {
                modalShow: false,
                buttonLoading: false,

                //弹窗配置
                saveModalCfg: [
                    {id: 1, type: 'input', label: '*姓名', name: 'driverName'},
                    {id: 2, type: 'select-tree', label: '*组织机构', name: 'deptId', treeType: 'departmentTree'},
                    {id: 3, type: 'input', label: '工号', name: 'jobNumber'},
                    {id: 4, type: 'select', label: '*性别', name: 'sex', option: [{value:0,label:'男'}, {value:1,label:'女'}]},
                    {id: 5, type: 'input', label: '*电话', name: 'phone'},
                    {id: 6, type: 'input', label: '联系地址', name: 'contactAddress'},
                    {id: 7, type: 'input', label: '*身份证号', name: 'icCard'},
                    {id: 8, type: 'input', label: '*驾驶证号', name: 'license'},
                    {id: 9, type: 'select-remote', label: '*驾照类型', name: 'licenseType', dicType: 5},
                    {id: 10, type: 'select-remote', label: '*准驾车型', name: 'allowVehicleType', dicType: 6},
                    {id: 11, type: 'date', label: '*驾驶证办证日期', name: 'licenseTime'},
                    {id: 12, type: 'date', label: '*有效起始日期', name: 'licenseStartTime'},
                    {id: 13, type: 'date', label: '*有效截至日期', name: 'licenseEndTime'},
                    {id: 14, type: 'input', label: '从业资格证号', name: 'qualificationCertificate'},
                    {id: 15, type: 'input', label: '发证机关', name: 'licenseUrl'},
                    // {id: 16, type: 'input', label: '证件照', name: 'licensePicUrl'},
                    // {id: 17, type: 'input', label: '照片', name: 'picUrl'}
                ],

                //新增菜单提交参数
                editModal: {},
                errorTip: null,
                ActionUploadUrl: Util.ojaxUrl + '/table/driverManage/pushDriverImg',
                postHeader: {
                    token: JSON.parse(localStorage.getItem('$userState')).userGuid
                },
                fileValue1: '',
                fileValue2: '',
                fileAccept: '.png, .jpg, .jpeg',
            }
        },
        methods: {
            handleBeforeUpload(file) {
                if(file.size > 512*1024){
                    this.$Modal.error({
                        title: '上传失败',
                        content: "图片大小超过512KB,请重新上传",
                    });
                    return false
                }
            },
            // 删除文件
            delectFile(event, file, fileList) {
                this.editModal.licensePicUrl = null
                this.editModal.picUrl = null
                this.fileValue1 = ''
                this.fileValue2 = ''
            },
            handleUploadSuccess1(response, file, fileList) {
                this.editModal.licensePicUrl = response.detail
                this.fileValue1 = '上传成功'
            },
            handleUploadSuccess2(response, file, fileList) {
                this.editModal.picUrl = response.detail
                this.fileValue2 = '上传成功'
            },
            handleUploadError(event, file, fileList) {

            },



            //表单数值修改变化
            updateSaveModel(e) {
                console.log(e)
                let self = this
                self.editModal = e
            },

            // 点击按钮事件,弹出窗体
            handlePlus(e) {
                console.log(this.rowData)
                this.modalShow = true
                this.editModal = this.rowData
                this.editModal.licensePicUrl = this.rowData.licensePicUrl ? Util.picUrl + this.rowData.licensePicUrl : ''
                this.editModal.picUrl = this.rowData.picUrl ? Util.picUrl + this.rowData.picUrl  : ''
            },

            // 保存
            handleSave() {
                const self = this
                self.buttonLoading = true
                Util.ojax.post(self.api, self.editModal).then(function (res) {
                    if (res.data.code == 0) {
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!',
                            duration: 3
                        })
                        self.errorTip = null
                        self.modalShow = false
                        self.$emit('updateTable')
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
                self.buttonLoading = false
                self.editModal = {
                    "allowVehicleType": null,
                    "contactAddress": null,
                    "deptId": null,
                    "driverName": null,
                    "icCard": null,
                    "jobNumber": null,
                    "license": null,
                    "licenseEndTime": null,
                    "licensePicUrl": null,
                    "licenseStartTime": null,
                    "licenseTime": null,
                    "licenseType": null,
                    "licenseUrl": null,
                    "phone": null,
                    "picUrl": null,
                    "sex": 0,
                    'qualificationCertificate': null
                }
                self.modalShow = false
                self.errorTip = null
            }
        },
        computed: {
            menuId() {
                return this.$route.meta.menuId
            },
            ...mapGetters('tableState', [
                'pageCfg',
            ])
        },
        watch: {
            pageCfg(n) {
                console.log(n)
            }
        }
    }
</script>