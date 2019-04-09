<template>
    <div>
        <Button type="success" size="small" buttonId="2" icon="md-add" class="adv-search-btn"
                @click="handlePlus">新增
        </Button>
        <Modal v-model="modalShow" :draggable="false" :mask-closable="true" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>新增用户</span>
            </p>
            <formComponent :formCfg="modalFormCfg"/>
            <div slot="footer" class="layout-modal-button">
                <Button @click="handleResetPass" class="fl">
                    恢复初始密码
                </Button>
                <Button @click="handleCancel"> 取 消</Button>
                <Button type="success" icon="checkmark-round" :loading="modaLoading" @click="handleSave">
                    保 存
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import formComponent from '../form'


    const componentName = 'plusUser'


    export default {
        components: {
            formComponent
        },
        data() {
            return {
                modalShow: false,
                modalFormCfg: [],
                modaLoading: false
            }
        },
        methods: {
            handlePlus(e) {
                this.modalShow = true
                console.log(this)
            },
            handleSave() {
                console.log(this.modalFormCfg)
            },
            handleCancel() {
                var self = this
                self.modalShow = false
            },
            handleResetPass() {}
        },
        computed: {
            menuId() {
                return this.$route.meta.menuId
            },
            ...mapGetters('tableState', [
                'pageCfg'
            ])
        },
        watch: {
            pageCfg: {
                handler(data) {
                    let self = this
                    let menuId = self.menuId
                    for (var i in data) {
                        if (menuId == data[i].menuId) {
                            self.modalFormCfg = data[i].pageCfg.componentCfg[componentName].modalCfg[0].children
                        }
                    }
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>