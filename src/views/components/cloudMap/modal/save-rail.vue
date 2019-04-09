<template>
    <!--新增围栏弹窗-->
    <div class="extra-button-container">
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" :closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>{{title}}</span>
            </p>
            <div class="modal-form">
                <form-ext :formCfg="saveDeptCfg" :formModal="editModal" :isShow="modalShow" @updateFormData="updateFormData"></form-ext>
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
    import formExt from '../../table/formExt'

    const SaveCloudMap = require('../../../../libs/api').SaveCloudMap // 保存云图
    const EditCloudMap = require('../../../../libs/api').EditCloudMap // 编辑云图
    const DeleteCloudMap = require('../../../../libs/api').DeleteCloudMap // 删除云图

    export default {
        components: {formExt},
        props: ['api', 'isShow', 'mapData', 'aoLatLng', 'title'],
        data() {
            return {
                modalShow: false,
                buttonLoading: false,
                saveDeptCfg: [
                    {id: 1, type: 'input', label: '*围栏名称', name: 'cloudName'},
                    {id: 2, type: 'select-tree', label: '*组织机构', name: 'deptId', treeType: 'departmentTree'},
                ],

                editModal: {
                    "addr": '',
                    "cloudName": null,
                    "cloudType": 3,
                    "deptId": null,
                    "mapPoint": {
                        "aoLatLng": [],
                        "nType": 0,
                        "oOption": {}
                    },
                    "mapType": 3
                },
                errorTip: null,
                postUrl: null
            }
        },
        methods: {
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
                self.editModal.addr = self.mapData.addr
                self.editModal.mapPoint.aoLatLng = self.aoLatLng
                self.editModal.id = self.mapData.id || 0
                Util.ojax.post(self.postUrl, self.editModal).then(function (res) {
                    if (res.data.code == 0) {
                        self.resetFormData()
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!',
                            duration: 3
                        })
                        self.errorTip = null
                        self.modalShow = false
                        self.resetFormData()
                        self.$emit('handleReset')
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
                this.resetFormData()
                this.buttonLoading = false
                this.modalShow = false
                this.$emit('handleCancel', false)
            },
            // 清空表单数据
            resetFormData(){
                this.editModal = {
                    "addr": null,
                    "cloudName": null,
                    "cloudType": 3,
                    "deptId": null,
                    "mapPoint": {
                        "aoLatLng": [],
                        "nType": 0,
                        "oOption": {}
                    },
                    "mapType": 3
                }
                this.errorTip = null
                this.postUrl = null
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
        watch: {
            isShow: {
                handler(data) {
                    this.modalShow = data
                    if(data && this.mapData.cloudName){
                        this.editModal.cloudName = this.mapData.cloudName
                        this.editModal.deptId = this.mapData.deptId
                        this.postUrl = EditCloudMap
                    }else{
                        this.resetFormData()
                        this.postUrl = SaveCloudMap
                    }
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>