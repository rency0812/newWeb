<template>
    <!--新增部门弹窗-->
    <div class="extra-button-container">
        <Button size="small" icon="ios-book" class="adv-search-btn"
                @click="handleSaveDepartment"> 处理查看
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>{{editModal.vho}} - 处理查看</span>
            </p>
            <div class="modal-form">
                <Form ref="formInline" inline label-position="right" :label-width="100">
                    <FormItem label="操作人">
                        <Input size="small" v-model="editModal.oprName" disabled />
                    </FormItem>
                    <FormItem label="操作时间">
                        <Input size="small" v-model="editModal.oprTime" disabled />
                    </FormItem>
                    <FormItem label="操作方式">
                        <CheckboxGroup v-model="methods">
                            <Checkbox label="1">发送短信</Checkbox>
                            <Checkbox label="2">监听</Checkbox>
                            <Checkbox label="3">拍照</Checkbox>
                            <Checkbox label="4">人工处理</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem label="监听号码" v-if="editModal.methods.indexOf('2')>-1">
                        <Input size="small" v-model="editModal.listenNo" disabled />
                    </FormItem>
                    <FormItem label="拍照通道" v-if="editModal.methods.indexOf('3')>-1">
                        <Input size="small" v-model="editModal.cameraChannel" disabled />
                    </FormItem>
                    <FormItem label="拍照张数" v-if="editModal.methods.indexOf('3')>-1">
                        <Input size="small" v-model="editModal.cameraNum" disabled />
                    </FormItem>
                    <FormItem label="拍照间隔(s)" v-if="editModal.methods.indexOf('3')>-1">
                        <Input size="small" v-model="editModal.cameraSpace" disabled />
                    </FormItem>
                    <FormItem label="短信内容" v-if="editModal.methods.indexOf('1')>-1">
                        <Input size="small" v-model="editModal.message" disabled />
                    </FormItem>
                    <FormItem label="备注">
                        <Input size="small" v-model="editModal.text" disabled />
                    </FormItem>
                </Form>
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
                editModal: {
                    "devNo":"",
                    "vho":"",
                    "cameraNum":"",
                    "cameraChannel":"",
                    "listenNo":"",
                    "cameraSpace":"",
                    "message":"",
                    "solved":"",
                    "oprName":"",
                    "oprTime":"",
                    "solvedMode":""
                },
                methods: [],

                errorTip: null
            }
        },
        methods: {
            // 添加部门按钮 点击出现弹窗
            handleSaveDepartment(e) {
                this.modalShow = true
                this.editModal = this.rowData
                this.methods = this.rowData.solvedMode.split(',')
            }
        },
        computed: {
            menuId() {
                return this.$route.meta.menuId
            }
        },
        watch: {}
    }
</script>