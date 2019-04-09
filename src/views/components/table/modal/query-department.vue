<template>
    <div class="extra-button-container">
        <Button type="default" size="small" icon="ios-book" class="adv-search-btn"
                @click="handleSaveDepartment"> 查看
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>查看</span>
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
                    {id: 1, type: 'readonly-input', label: '组织机构', name: 'deptName'},
                    {id: 2, type: 'readonly-input', label: '机构类型', name: 'deptTypeName'},
                    {id: 3, type: 'readonly-input', label: '上级机构', name: 'pName'},
                    {id: 4, type: 'readonly-input', label: '负责人', name: 'contacts'},
                    {id: 5, type: 'readonly-input', label: '负责人电话', name: 'contactsTel'},
                    {id: 6, type: 'readonly-input', label: '负责人邮箱', name: 'email'},
                    {id: 7, type: 'readonly-input', label: '创建人', name: 'createUserId'},
                    {id: 8, type: 'readonly-input', label: '创建时间', name: 'createTime'}
                ],

                editModal: this.$props.rowData
            }
        },
        methods: {

            // 添加部门按钮 点击出现弹窗
            handleSaveDepartment(e) {
                this.modalShow = true
            },

            // 取消事件
            handleCancel() {
                var self = this
                self.modalShow = false
            }
        },
        computed: {},
        watch: {}
    }
</script>

<style>
    .modal-form{padding: 10px 40px 0 40px;}
    .modal-form .ivu-form-item{width: 100%;}
    .extra-button-container{float: right;margin-left: 4px}
</style>