<template>
    <div class="extra-button-container">
        <!--编辑数据类型弹窗-->
        <Button type="default" size="small" icon="ios-create-outline" class="adv-search-btn"
                @click="handlePlus">编辑
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>编辑SIM</span>
            </p>
            <div class="modal-form">
                <form-ext :formCfg="saveModalCfg" :formModal="editModal" :isShow="modalShow" @updateSaveMenuModel="updateSaveModel"/>
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
                    {id: 1, type: 'input', label: '*SIM卡号', name: 'simNo'},
                    {id: 2, type: 'select-tree', label: '*组织机构', name: 'deptId', treeType: 'departmentTree'},
                    {id: 3, type: 'input', label: '*ICCID', name: 'iccId'},
                    {id: 4, type: 'input', label: '*流量', name: 'dataFlow', dicType: 2},
                    {id: 5, type: 'radio', label: '启用状态', name: 'enableValue', children: [{value: 1,label:'启用'}, {value: 2,label:'禁用'}]}
                ],

                editModal: {},
                errorTip: null
            }
        },
        methods: {
            //表单数值修改变化
            updateSaveModel(e) {
                console.log(e)
                let self = this
                self.saveModal = e
            },

            // 点击按钮事件,弹出窗体
            handlePlus(e) {
                this.modalShow = true
                this.editModal = this.rowData
                this.editModal.enableValue = this.rowData.enable == true ? 1 : 2
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
                this.editModal = {}
                this.errorTip = null
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