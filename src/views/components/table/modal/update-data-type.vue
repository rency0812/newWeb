<template>
    <div class="extra-button-container">
        <!--编辑数据类型弹窗-->
        <Button type="default" size="small" icon="ios-create-outline" class="adv-search-btn"
                @click="handlePlus">编辑
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>编辑数据类型</span>
            </p>
            <div class="modal-form">
                <form-ext :formCfg="saveModalCfg" :formModal="saveModal" :isShow="modalShow" @updateSaveMenuModel="updateSaveModel"/>
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
                    {id: 1, label: '*数据类型', name: 'dataType', type: 'select-remote'},
                    {id: 2, label: '*数据名称', name: 'dataName', type: 'input'},
                    {id: 3, label: '*排序', name: 'sortId', type: 'input'},
                    {id: 3, label: '创建人', name: 'createName', type: 'no-input'},
                    {id: 3, label: '创建时间', name: 'createTime', type: 'no-input'},
                ],

                //新增菜单提交参数
                saveModal: {
                    'dicType': '',
                    'dataName': '',
                    'sortId': '',
                    'createName': '',
                    'createTime': ''
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
                self.updateDataType(self.saveModal)
            },

            // 取消
            handleCancel() {
                var self = this
                self.modalShow = false
            },

            ...mapMutations('tableState', [
                'updateDataType' //增加菜单
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