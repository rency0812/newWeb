<template>
    <!--新增菜单弹窗-->
    <div class="extra-button-container">

        <Button type="success" size="small" icon="md-add" class="adv-search-btn"
                @click="handlePlus">新增
        </Button>


        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>新增菜单</span>
            </p>
            <div class="modal-form">
                <form-ext :formCfg="saveMenuCfg" :formModal="saveMenuModel" :isShow="modalShow"
                          @updateSaveMenuModel="updateSaveMenuModel"></form-ext>
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
    //调用依赖库
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    import Util from '../../../../libs/util'

    //调用组件
    import formExt from '../formExt'

    export default {
        props: ['api'],

        components: {
            formExt
        },

        data() {
            return {
                modalShow: false,
                buttonLoading: false,
                //弹窗配置
                saveMenuCfg: [
                    {id: 1, label: '*菜单名称', name: 'menuName', type: 'input'},
                    {id: 2, label: '*上级节点', name: 'pid', type: 'select-tree', treeType: 'menuTree'},
                    {id: 3, label: '*菜单路径', name: 'menuUrl', type: 'input'},
                    {id: 4, label: '*类型', name: 'menuType', type: 'select-remote', "dicType": 1, value: null},
                    {id: 5, label: '说明', name: 'remark', type: 'textarea'},
                    {id: 6, label: '排序', name: 'sortId', type: 'input'},
                ],
                //新增菜单提交参数  例子
                saveMenuModel: {
                    "id": 0,
                    "menuName": null,
                    "menuType": 0,
                    "menuUrl": null,
                    "pid": 0,
                    "remark": null,
                    "sortId": 0
                },

                errorTip: null

            }
        },
        methods: {
            //表单数值修改变化
            updateSaveMenuModel(e) {
                let self = this
                self.saveMenuModel = e
            },

            // 点击按钮事件,弹出窗体
            handlePlus(e) {
                this.modalShow = true
            },

            // 保存
            handleSave() {
                const self = this
                const saveMenuModel = self.saveMenuModel
                this.buttonLoading = true

                Util.ojax.post(self.api, saveMenuModel).then(function (res) {
                    if (res.data.code == 0) {
                        //初始化
                        self.saveMenuModel = {
                            "menuName": null,
                            "menuType": 0,
                            "menuUrl": null,
                            "pid": 0,
                            "remark": null,
                            "sortId": 0
                        }
                        self.errorTip = null
                        self.modalShow = false
                        self.$emit('handleSearch')
                    } else {
                        self.errorTip = res.data.msg
                    }
                    self.buttonLoading = false
                }).catch(function (error) {
                    console.log(error)
                })


            },

            // 取消
            handleCancel() {
                var self = this
                self.saveMenuModel = {
                    "menuName": null,
                    "menuType": 0,
                    "menuUrl": null,
                    "pid": 0,
                    "remark": null,
                    "sortId": 0
                }
                self.buttonLoading = false
                self.modalShow = false
                this.errorTip = null
            },

            ...mapMutations('tableState', [
                'saveMenu' //增加菜单
            ])


        }
    }
</script>