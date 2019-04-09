<template>
    <!--新增部门弹窗-->
    <div class="extra-button-container">
        <Button size="small" icon="md-add" class="adv-search-btn"
                @click="handleSaveDepartment"> 绑定
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" :scrollable="true" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>绑定设备</span>
            </p>
            <div class="modal-form">
                <Form ref="formInline" inline label-position="right" :label-width="100">
                    <FormItem label="*设备号">
                        <Select v-model="editModal.deviceNo" label-in-value clearable filterable remote :remote-method="handleSearchDevNo" size="small" v-on:on-change="changeSelectOption">
                            <Option v-for="item in devDataList" :value="item.id" :key="item.id">{{item.devNo}}</Option>
                        </Select>
                    </FormItem>
                </Form>
                <Alert type="error" show-icon v-show="errorTip !== null">
                    <p v-html="errorTip"></p>
                </Alert>
            </div>
            <div slot="footer" class="layout-modal-button">
                <Button @click="handleCancel"> 取 消</Button>
                <Button type="success" icon="checkmark-round" :loading="buttonLoading" @click="handleSave"> 绑 定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Util from '../../../../libs/util'
    import {mapGetters, mapMutations} from 'vuex'
    import formExt from '../formExt'
    import selectRemote from '../../form/select-remote'


    export default {
        components: {formExt,selectRemote},
        props: ['api', 'rowData', 'rowIndex'],
        data() {
            return {
                modalShow: false,
                buttonLoading: false,
                errorTip: null,
                devDataList: [],
                editModal: {
                    deviceNo: null,
                    id: this.$props.rowData.id
                }
            }
        },
        methods: {
            // 搜索设备号
            handleSearchDevNo(v){
                let self = this
                let roleId = JSON.parse(localStorage.getItem('$userState')).roleId || 0
                let oParams = {
                    roleId: roleId,
                    pageIndex: 1,
                    pageSize: 20,
                    devNo: v
                }
                Util.ojax.post('/table/device/queryPage', oParams).then(function (res) {
                    if (res.data.code == 0) {
                        self.devDataList = res.data.detail.list
                    }
                })
            },

            // 设置提交的对象
            changeSelectOption(v){
                this.editModal.deviceNo = v.label
                // this.editModal.id = v.value.toString()
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
                    deviceNo: null,
                    id: null
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