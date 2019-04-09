<template>
    <div>
        <Button type="default" size="small" icon="ios-book" class="adv-search-btn"
                @click="handleSaveDepartment"> 查看
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>查看sim</span>
            </p>
            <div class="modal-form">
                <form-component :formCfg="updateDeptCfg" :formModal="editModal"></form-component>
            </div>
            <div slot="footer" class="layout-modal-button">
                <Button type="success" icon="checkmark-round" @click="handleCancel" style="display: none">
                    确 定
                </Button>
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
                modaLoading: false,
                updateDeptCfg: [
                    {id: 1, type: 'readonly-input', label: '*SIM卡号', name: 'simNo'},
                    {id: 2, type: 'readonly-input', label: '*组织机构', name: 'deptName'},
                    {id: 3, type: 'readonly-input', label: '*ICCID', name: 'iccId'},
                    {id: 4, type: 'readonly-input', label: '*流量', name: 'dataFlow'},
                    {id: 5, type: 'readonly-input', label: '启用状态', name: 'enableValue'}
                ],

                editModal: {}
            }
        },
        methods: {

            // 添加部门按钮 点击出现弹窗
            handleSaveDepartment(e) {
                this.modalShow = true
                this.editModal = this.rowData
                this.editModal.enableValue = this.rowData.enable == true ? "启用" : "禁用"
            },

            // 取消事件
            handleCancel() {
                var self = this
                self.modalShow = false
                self.editModal = {}
            }
        },
        computed: {},
        watch: {}
    }
</script>