<template>
    <!--新增部门弹窗-->
    <div class="extra-button-container">
        <Button size="small" icon="ios-book" class="adv-search-btn"
                @click="handleSaveDepartment"> 查看
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>消息查看</span>
            </p>
            <div class="modal-form">
                <form-ext :formCfg="saveModalCfg" :formModal="editModal" :isShow="modalShow"></form-ext>
                <Alert type="error" show-icon v-show="errorTip !== null">
                    <p v-html="errorTip"></p>
                </Alert>
            </div>
            <div slot="footer" class="layout-modal-button">
                <Button type="success" icon="checkmark-round" :loading="buttonLoading" style="display: none"> 保 存</Button>
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
                modalShow: false,
                buttonLoading: false,
                saveModalCfg: [
                    {id: 1, type: 'readonly-input', label: '消息来源', name: 'simNo'},
                    {id: 2, type: 'readonly-input', label: '接收时间', name: 'deptId'},
                    {id: 3, type: 'readonly-input', label: '消息内容', name: 'iccId'},
                    {id: 4, type: 'readonly-input', label: '回复人', name: 'iccId'},
                    {id: 5, type: 'readonly-input', label: '回复时间', name: 'iccId'},
                    {id: 6, type: 'readonly-input', label: '回复内容', name: 'iccId'}
                ],

                editModal: {},

                errorTip: null
            }
        },
        methods: {
            // 添加部门按钮 点击出现弹窗
            handleSaveDepartment(e) {
                this.modalShow = true
                this.editModal = this.rowData
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