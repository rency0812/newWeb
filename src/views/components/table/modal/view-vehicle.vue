<template>
    <div>
        <Button type="default" size="small" icon="ios-book" class="adv-search-btn"
                @click="handleSaveDepartment"> 查看
        </Button>
        <Modal v-model="modalShow" width="700" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>查看车辆</span>
            </p>
            <div>
                <Collapse v-model="colValue" accordion>
                    <Panel name="1">
                        基本信息
                        <form-ext slot="content" :formCfg="saveBasicCfg" :formModal="editModal"></form-ext>
                    </Panel>
                    <Panel name="2">
                        其他信息
                        <form-ext slot="content" :formCfg="saveExtraCfg" :formModal="editModal"></form-ext>
                    </Panel>
                </Collapse>
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
    import formExt from '../formExt'

    export default {
        components: {formExt},
        props: ['api', 'rowData', 'rowIndex'],
        data() {
            return {
                colValue: '1',
                modalShow: false,
                saveBasicCfg: [
                    {id: 1, type: 'readonly-input', label: '车牌号', name: 'vehNo'},
                    {id: 2, type: 'readonly-input', label: '车辆颜色', name: 'color', dicType: 2},
                    {id: 3, type: 'readonly-input', label: '组织机构', name: 'deptName', treeType: 'departmentTree'},
                    {id: 4, type: 'readonly-input', label: '联系人', name: 'contact'},
                    {id: 5, type: 'readonly-input', label: '车牌颜色', name: 'licensePlateColor', dicType: 2},
                    {id: 6, type: 'readonly-input', label: '联系电话', name: 'contactPhone'},
                    {id: 7, type: 'readonly-input', label: '使用状态', name: 'userState', dicType: 2},
                    {id: 8, type: 'readonly-input', label: '发动机号', name: 'engineNo'},
                    {id: 9, type: 'readonly-input', label: '车辆类型', name: 'vehicleType', dicType: 2},
                    {id: 10, type: 'readonly-input', label: '行驶证号', name: 'license'},
                    {id: 11, type: 'readonly-input', label: '车辆用途', name: 'transportBusiness', dicType: 2},
                    {id: 12, type: 'readonly-input', label: '监管类型', name: 'superviseType', dicType: 2},
                    {id: 13, type: 'readonly-input', label: '车辆品牌', name: 'vehicleBrand', dicType: 2}
                ],
                saveExtraCfg:[
                    {id: 1, type: 'readonly-input', label: '安装日期', name: 'installTime'},
                    {id: 2, type: 'readonly-input', label: '车辆出厂日期', name: 'vehicleManuDate'},
                    {id: 3, type: 'readonly-input', label: '车辆等级', name: 'vehicleLevel', dicType: 2},
                    {id: 4, type: 'readonly-input', label: '车辆购买日期', name: 'vehiclePurchaseDate'},
                    {id: 5, type: 'readonly-input', label: '核定载人数', name: 'loadNum'},
                    {id: 6, type: 'readonly-input', label: '年检日期', name: 'checkDate'},
                    {id: 7, type: 'readonly-input', label: '核定载重(吨)', name: 'tonnage'},
                    {id: 8, type: 'readonly-input', label: '车籍地', name: 'vehicleSite'}
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
                self.colValue = '1'
            }
        },
        computed: {},
        watch: {}
    }
</script>