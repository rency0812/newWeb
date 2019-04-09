<style>
    .img-container{margin-left: 30px}
    .img-container li{float: left; margin-right: 30px}
</style>
<template>
    <div>
        <Button type="default" size="small" icon="ios-book" class="adv-search-btn"
                @click="handleSaveDepartment"> 查看
        </Button>
        <Modal v-model="modalShow" width="700" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>查看驾驶员</span>
            </p>
            <div>
                <form-component :formCfg="updateDeptCfg" :formModal="editModal" class="form-col-2"></form-component>
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
                    {id: 1, type: 'readonly-input', label: '*姓名', name: 'driverName'},
                    {id: 2, type: 'readonly-input', label: '*组织机构', name: 'deptName', treeType: 'departmentTree'},
                    {id: 3, type: 'readonly-input', label: '工号', name: 'jobNumber'},
                    {id: 4, type: 'readonly-input', label: '*性别', name: 'sex', option: [{value:0,label:'男'}, {value:1,label:'女'}]},
                    {id: 5, type: 'readonly-input', label: '*电话', name: 'phone'},
                    {id: 6, type: 'readonly-input', label: '联系地址', name: 'contactAddress'},
                    {id: 7, type: 'readonly-input', label: '*身份证号', name: 'icCard', dicType: 2},
                    {id: 8, type: 'readonly-input', label: '*驾驶证号', name: 'license', dicType: 2},
                    {id: 9, type: 'readonly-input', label: '*驾照类型', name: 'licenseType', dicType: 5},
                    {id: 10, type: 'readonly-input', label: '*准驾车型', name: 'allowVehicleType', dicType: 6},
                    {id: 11, type: 'readonly-input', label: '*驾驶证办证日期', name: 'licenseTime', dicType: 2},
                    {id: 12, type: 'readonly-input', label: '*有效起始日期', name: 'licenseStartTime', dicType: 2},
                    {id: 13, type: 'readonly-input', label: '*有效截至日期', name: 'licenseEndTime', dicType: 2},
                    {id: 14, type: 'readonly-input', label: '*发证机关', name: 'licenseUrl', dicType: 2},
                    {id: 15, type: 'readonly-input', label: '从业资格证号', name: 'qualificationCertificate'},
                    {id: 16, type: 'img', label: '证件照', name: 'licensePicUrl', dicType: 2},
                    {id: 17, type: 'img', label: '*照片', name: 'picUrl', dicType: 2},
                ],

                editModal: this.$props.rowData,
            }
        },
        methods: {

            // 添加部门按钮 点击出现弹窗
            handleSaveDepartment(e) {
                this.modalShow = true
                this.editModal.licensePicUrl = this.rowData.licensePicUrl ? Util.picUrl + this.rowData.licensePicUrl : ''
                this.editModal.picUrl = this.rowData.picUrl ? Util.picUrl + this.rowData.picUrl  : ''
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