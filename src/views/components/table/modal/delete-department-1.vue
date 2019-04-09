<template>
    <div class="extra-button-container">
        <Button type="default" size="small" icon="md-close" class="adv-search-btn"
                @click="handleShowModal">删除
        </Button>
        <Modal v-model="modalShow" :draggable="false" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>删除</span>
            </p>
            <div class="modal-form">
                <p>确认 删除该组织机构?</p>
            </div>
            <div slot="footer" class="layout-modal-button">
                <Button @click="handleCancel"> 取 消</Button>
                <Button type="success" icon="checkmark-round" :loading="modaLoading" @click="handleDelete">
                    保 存
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Util from '../../../../libs/util'
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        props: ['row'],
        data() {
            return {
                modalShow: false,
                modaLoading: false,
                editModal: {},
                buttonText: '删除'
            }
        },
        methods: {
            // 点击按钮事件 若有行数据 则赋值
            handleShowModal(e) {
                this.modalShow = true
            },
            // 删除操作
            handleDelete() {
                let self = this
                let path = this.$route.path + '/delete'
                self.editModal = self.row
                // self.handleModalPost({ path: path, postData: self.editModal})
                Util.ojax.post(path, self.editModal).then(function (res) {
                    if(res.data.code == 0){
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!',
                            duration: 3
                        })
                        self.modalShow = false
                        self.searchGrid()
                    }else{
                        self.$Message.error(res.data.msg)
                    }
                }).catch(function (error) {
                    self.$Notice.error({
                        title: '提示',
                        desc: '操作失败!',
                        duration: 3
                    })
                })
            },
            handleCancel() {
                var self = this
                self.modalShow = false
            },
            ...mapMutations('tableState', [
                'searchGrid', //初始化页面
                // 'handleModalPost' // 增删改
            ]),
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
            modalShow: {
                handler(data) {
                    if(!data){
                        this.editModal = {}
                    }
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>

<style>
    .modal-form{padding: 10px 40px 0 40px;}
    .modal-form .ivu-form-item{width: 100%;}
    .extra-button-container{float: right;margin-left: 4px}
</style>