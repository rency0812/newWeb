<template>
    <div class="extra-button-container">
        <!--编辑数据类型弹窗-->
        <Button type="default" size="small" icon="ios-create-outline" class="adv-search-btn"
                @click="handlePlus">编辑
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>编辑数据字典</span>
            </p>
            <div class="modal-form">
                <form-ext :formCfg="saveModalCfg" :formModal="editModal" :isShow="modalShow" @updateSaveMenuModel="updateSaveModel"/>
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
                    {id: 1, type: 'select-remote', label: '*数据类型', name: 'dicType', dicType: 0},
                    {id: 2, type: 'input', label: '*数据名称', name: 'dicValue'},
                    {id: 3, type: 'input', label: '*排序', name: 'sortId'},
                    {id: 4, type: 'readonly-input', label: '创建人', name: 'createUserName'},
                    {id: 5, type: 'readonly-input', label: '创建时间', name: 'createTime'}
                ],

                editModal: {}
            }
        },
        methods: {
            //表单数值修改变化
            updateSaveModel(e) {
                console.log(e)
                let self = this
                self.editModal = e
            },

            // 点击按钮事件,弹出窗体
            handlePlus(e) {
                this.modalShow = true
                this.editModal = this.rowData
                this.editModel.dicType = parseInt(this.editModel.dicType)
            },

            // 保存
            handleSave() {
                const self = this
                self.buttonLoading = true
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