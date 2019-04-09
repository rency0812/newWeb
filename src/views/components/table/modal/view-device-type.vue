<template>
    <div>
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
                    {id: 1, type: 'readonly-input', label: '设备类型名称', name: 'devName'},
                    {id: 2, type: 'readonly-input', label: '设备型号', name: 'model', dicType: 2},
                    {id: 3, type: 'readonly-input', label: '工厂代码', name: 'manufacturer', dicType: 2},
                    {id: 4, type: 'readonly-input', label: '设备协议', name: 'protocol', dicType: 2},
                    {id: 5, type: 'readonly-input', label: '音频编码格式', name: 'radioFormat', option: [{value:'1',label:'1'}, {value:'2',label:'2'}]},
                    {id: 6, type: 'readonly-input', label: '产品品牌', name: 'brand'},
                    {id: 7, type: 'readonly-input', label: '软件版本', name: 'softVersion', dicType: 2},
                    {id: 8, type: 'readonly-input', label: '硬件版本', name: 'hardVersion', dicType: 2},
                    {id: 9, type: 'readonly-input', label: '制造商', name: 'maker', dicType: 2}
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