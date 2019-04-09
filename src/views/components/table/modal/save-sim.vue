<template>
    <!--新增部门弹窗-->
    <div class="extra-button-container">
        <Button type="success" size="small" icon="md-add" class="adv-search-btn"
                @click="handleSaveDepartment"> 新增
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>新增SIM卡</span>
            </p>
            <div class="modal-form">
                <form-ext :formCfg="saveModalCfg" :formModal="editModal" :isShow="modalShow" @updateFormData="updateFormData"></form-ext>
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

    export default {
        components: {formExt},
        props: ['api'],
        data() {
            return {
                modalShow: false,
                buttonLoading: false,
                saveModalCfg: [
                    {id: 1, type: 'input', label: '*SIM卡号', name: 'simNo'},
                    {id: 2, type: 'select-tree', label: '*组织机构', name: 'deptId', treeType: 'departmentTree'},
                    {id: 3, type: 'input', label: '*ICCID', name: 'iccId'},
                    {id: 4, type: 'input', label: '*流量', name: 'dataFlow', dicType: 2},
                    {id: 5, type: 'radio', label: '启用状态', name: 'enableValue', children: [{value: 1,label:'启用'}, {value: 2,label:'禁用'}]}
                ],

                editModal: {
                    "dataFlow": null,
                    "deptId": null,
                    "enableValue": 1,
                    "enable":null,
                    "iccId": null,
                    "simNo": null
                },

                errorTip: null
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
                if(self.editModal.dataFlow){
                    self.editModal.dataFlow = parseInt(self.editModal.dataFlow)
                }
                self.editModal.enable = self.editModal.enableValue == 1 ? true : false
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
                    "dataFlow": null,
                    "deptId": null,
                    "enableValue": 1,
                    "enable":null,
                    "iccId": null,
                    "simNo": null
                }
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