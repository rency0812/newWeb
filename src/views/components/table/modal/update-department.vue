<template>
    <div class="extra-button-container">
        <!--编辑部门弹窗-->
        <Button type="default" size="small" icon="ios-create-outline" class="adv-search-btn"
                @click="handleSaveDepartment"> 编辑
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>编辑部门</span>
            </p>
            <div class="modal-form">
                <form-component :formCfg="updateDeptCfg" :isShow="modalShow" :formModal="editModal"></form-component>
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
    import formComponent from '../formExt'

    export default {
        components: {formComponent},
        props: ['api', 'rowData', 'rowIndex'],
        data() {
            return {
                modalShow: false,
                buttonLoading: false,
                updateDeptCfg: [
                    {id: 1, type: 'input', label: '组织机构', name: 'deptName', option:''},
                    {id: 2, type: 'select-remote', label: '机构类型', name: 'deptType',dicType: 2},
                    {id: 3, type: 'select-tree', label: '*上级机构', name: 'pid', treeType: 'departmentTree'},
                    {id: 4, type: 'input', label: '负责人', name: 'contacts'},
                    {id: 5, type: 'input', label: '负责人电话', name: 'contactsTel'},
                    {id: 6, type: 'input', label: '负责人邮箱', name: 'email'}
                ],

                editModal: {},
                errorTip: null,
            }
        },
        methods: {

            // 添加部门按钮 点击出现弹窗
            handleSaveDepartment(e) {
                this.modalShow = true
                console.log(this.api)
                console.log(this.rowData)
                this.editModal = this.rowData
            },

            // 保存
            handleSave() {
                const self = this
                let postValue = self.editModal
                this.buttonLoading = true
                console.log(postValue)
                Util.ojax.post(self.api, postValue).then(function (res) {
                    if (res.data.code == 0) {
                        self.resetFormData()
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
                self.resetFormData()
                self.buttonLoading = false
                self.modalShow = false
            },

            // 清空表单数据
            resetFormData(){
                this.editModal = {
                    "deptName": null,
                    "deptType": '',
                    "pid": null,
                    "contacts": null,
                    "contactsTel": null,
                    "email": null
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