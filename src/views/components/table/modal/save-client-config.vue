<template>
    <div class="extra-button-container">
        <!--新增 客户配置 弹窗-->
        <Button type="success" size="small" icon="md-add" class="adv-search-btn"
                @click="handlePlus">新增
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>新增客户配置</span>
            </p>
            <div class="modal-form">
                <form-ext :formCfg="saveModalCfg" :formModal="saveModal" @updateSaveMenuModel="updateSaveModel"/>
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
        data() {
            return {
                modalShow: false,
                buttonLoading: false,

                //弹窗配置
                saveModalCfg: [
                    {id: 1, label: '*客户名称', name: 'clientName', type: 'input'},
                    {id: 2, label: '*显示标题', name: 'pageName', type: 'input'},
                    {id: 3, label: '*平台URL', name: 'flatUrl', type: 'input'},
                    {id: 4, label: '*APP URL', name: 'appUrl', type: 'input'},
                    {id: 5, label: '*状态', name: 'status', type: 'input'},
                    {id: 6, label: '*默认定位', name: 'defaultPosition', type: 'input'},
                    {id: 7, label: '*说明', name: 'remark', type: 'textarea'}
                ],

                //提交参数
                saveModal: {
                    'clientName': '',
                    'pageName': '',
                    'flatUrl': '',
                    'appUrl': '',
                    'status': 1,
                    'defaultPosition': '',
                    'remark': ''
                }
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
            },

            // 保存
            handleSave() {
                let self = this
                self.saveClientConfig(self.saveModal)
            },

            // 取消
            handleCancel() {
                var self = this
                self.modalShow = false
            },

            ...mapMutations('tableState', [
                'saveClientConfig' //新增客户配置
            ])
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

<style>
    .modal-form {padding: 10px 40px 0 40px;}
    .modal-form .ivu-form-item {width: 100%;}
    .extra-button-container {float: right;margin-left: 4px}
</style>