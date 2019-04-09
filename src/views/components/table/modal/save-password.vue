<template>
    <div class="extra-button-container">
        <!--第一次登陆需要提示用户设置密码-->
        <Modal v-model="modalShow" :draggable="true" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>设置密码</span>
            </p>
            <div class="modal-form">
                <form-ext :formCfg="saveModalCfg" :formModal="saveModal" @updateSaveMenuModel="updateSaveModel"/>
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
    import Util from '../../../../libs/util'
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

    //调用组件
    import formExt from '../formExt'

    export default {
        components: {
            formExt
        },
        data() {
            return {
                modalShow: false,
                buttonLoading: false,

                //弹窗配置
                saveModalCfg: [
                    {id: 1, label: '', name: 'title', type: 'no-input'},
                    {id: 2, label: '新密码', name: 'npwd', type: 'input'},
                    {id: 3, label: '确认密码', name: 'pwd', type: 'input'},
                ],

                //设置密码提交
                saveModal: {
                    "npwd": "",
                    "pwd": ""
                }
            }
        },
        methods: {
            //表单数值修改变化
            updateSaveMenuModel(e) {
                let self = this
                self.saveModal = e
            },
            // 保存
            handleSave() {
                let self = this
                let saveModal = self.saveModal
                self.updatePassword(saveModal)
            },

            // 取消
            handleCancel() {
                var self = this
                self.saveModal.npwd = ""
                self.saveModal.pwd = ""
                self.modalShow = false
            },

            ...mapMutations('tableState', [
                'updatePassword' // 设置并更新用户密码
            ])
        }
    }
</script>