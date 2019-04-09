<template>
    <!--新增部门弹窗-->
    <div class="extra-button-container">
        <Button type="default" size="small" icon="ios-create-outline" class="adv-search-btn"
                @click="handleSaveDepartment"> 编辑
        </Button>
        <Modal v-model="modalShow" width="700" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>编辑车辆</span>
            </p>
            <div>
                <Collapse v-model="colValue" accordion>
                    <Panel name="1">
                        基本信息
                        <form-ext slot="content" :formCfg="saveBasicCfg" :formModal="editModal" :isShow="modalShow" @updateFormData="updateFormData"></form-ext>
                    </Panel>
                    <Panel name="2">
                        其他信息
                        <form-ext slot="content" :formCfg="saveExtraCfg" :formModal="editModal" :isShow="modalShow" @updateFormData="updateFormData"></form-ext>
                    </Panel>
                </Collapse>
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
        props: ['api', 'rowData', 'rowIndex'],
        data() {
            return {
                colValue: '1',
                modalShow: false,
                buttonLoading: false,
                saveBasicCfg: [
                    {id: 1, type: 'input', label: '*车牌号', name: 'vehNo'},
                    {id: 2, type: 'select-remote', label: '车辆颜色', name: 'color', dicType: 7},
                    {id: 3, type: 'select-tree', label: '*组织机构', name: 'deptId', treeType: 'departmentTree'},
                    {id: 4, type: 'input', label: '联系人', name: 'contact'},
                    {id: 5, type: 'select-remote', label: '*车牌颜色', name: 'licensePlateColor', dicType: 8},
                    {id: 6, type: 'input', label: '联系电话', name: 'contactPhone'},
                    {id: 7, type: 'select-remote', label: '*使用状态', name: 'userState', dicType: 12},
                    {id: 8, type: 'input', label: '发动机号', name: 'engineNo'},
                    {id: 9, type: 'select-remote', label: '*车辆类型', name: 'vehicleType', dicType: 9},
                    {id: 10, type: 'input', label: '行驶证号', name: 'license'},
                    {id: 11, type: 'select-remote', label: '车辆用途', name: 'transportBusiness', dicType: 10},
                    {id: 12, type: 'select-remote', label: '监管类型', name: 'superviseType', dicType: 11},
                    {id: 13, type: 'select-remote', label: '车辆品牌', name: 'vehicleBrand', dicType: 13},
                    {id: 14, type: 'readonly-input', label: '创建人', name: 'createUserName'},
                    {id: 15, type: 'readonly-input', label: '修改人', name: 'modifyUserName'},
                    {id: 16, type: 'readonly-input', label: '创建时间', name: 'createTime'},
                    {id: 17, type: 'readonly-input', label: '修改时间', name: 'modifyTime'}
                ],
                saveExtraCfg:[
                    {id: 1, type: 'date', label: '安装日期', name: 'installTime'},
                    {id: 2, type: 'date', label: '车辆出厂日期', name: 'vehicleManuDate'},
                    {id: 3, type: 'select-remote', label: '车辆等级', name: 'vehicleLevel', dicType: 14},
                    {id: 4, type: 'date', label: '车辆购买日期', name: 'vehiclePurchaseDate'},
                    {id: 5, type: 'input', label: '核定载人数', name: 'loadNum'},
                    {id: 6, type: 'date', label: '年检日期', name: 'checkDate'},
                    {id: 7, type: 'input', label: '核定载重(吨)', name: 'tonnage'},
                    {id: 8, type: 'input', label: '车籍地', name: 'vehicleSite'}
                ],

                editModal: {},
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
                this.editModal = this.rowData
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
                this.editModal = {
                    "checkDate": null,
                    "color": 1,
                    "contact": null,
                    "contactPhone": null,
                    "deptId": null,
                    "engineNo": null,
                    "installTime": null,
                    "license": null,
                    "licensePlateColor": 1,
                    "loadNum": 100,
                    "superviseType": 1,
                    "tonnage": 1,
                    "transportBusiness": null,
                    "userState": 1,
                    "vehicleBrand": 1,
                    "vehicleLevel": 1,
                    "vehicleManuDate": null,
                    "vehNo": null,
                    "vehiclePurchaseDate": null,
                    "vehicleSite": null,
                    "vehicleType": 1
                }
                this.colValue = '1'
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