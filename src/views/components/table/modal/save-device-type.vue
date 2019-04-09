<template>
    <!--新增部门弹窗-->
    <div class="extra-button-container">
        <Button type="success" size="small" icon="md-add" class="adv-search-btn"
                @click="handleSaveDepartment"> 新增
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>新增设备类型</span>
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
                    {id: 1, type: 'input', label: '*设备类型名称', name: 'devName'},
                    {id: 2, type: 'select-remote', label: '*设备型号', name: 'model', dicType: 16},
                    {id: 3, type: 'input', label: '*工厂代码', name: 'manufacturer'},
                    {id: 4, type: 'select-remote', label: '设备协议', name: 'protocol', dicType: 17},
                    {id: 5, type: 'select-remote', label: '音频编码格式', name: 'radioFormat', dicType: 18},
                    {id: 6, type: 'input', label: '产品品牌', name: 'brand'},
                    {id: 7, type: 'input', label: '软件版本', name: 'softVersion'},
                    {id: 8, type: 'input', label: '硬件版本', name: 'hardVersion'},
                    {id: 9, type: 'input', label: '制造商', name: 'maker'}
                ],

                editModal: {
                    "brand": "",
                    "devName": "",
                    "hardVersion": "",
                    "maker": "",
                    "manufacturer": "",
                    "model": 1,  //型号
                    "protocol": 1, //协议
                    "radioFormat": 1,
                    "softVersion": ''
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
                    "deptName": null,
                    "deptType": 0,
                    "pId": 0,
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