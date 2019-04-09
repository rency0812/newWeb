<template>
    <div class="extra-button-container">
        <Button size="small" icon="md-trash" class="adv-search-btn"
                @click="handlePlus"> 解绑
        </Button>
    </div>
</template>

<script>
    //调用依赖库
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    import Util from '../../../../libs/util'

    export default {
        props: ['api', 'rowData', 'rowIndex'],
        components: {},
        data() {
            return {
                modalShow: false,
                buttonLoading: false,
                editModal: {
                    // deviceNo: this.$props.rowData.devNo,
                    id:  this.$props.rowData.id.toString()
                }
            }
        },
        methods: {
            // 点击按钮事件,弹出窗体
            handlePlus(e) {
                const self = this
                self.modalShow = true
                self.$Modal.confirm({
                    title: '解除绑定',
                    loading: true,
                    content: "确定解除 " + self.rowData.vehNo + ' 与设备 ' + self.rowData.devNo + ' 绑定关系?' ,
                    onOk: () => {
                        self.handleDelete()
                    },
                    onCancel: () => {
                        self.handleCancel()
                    },
                });
            },
            // 删除动作
            handleDelete() {
                const self = this
                self.buttonLoading = true
                Util.ojax.post(self.api, self.editModal).then(function (res) {
                    if (res.data.code == 0) {
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!',
                            duration: 3
                        })
                        self.errorTip = null
                        self.modalShow = false
                        self.$emit('updateTable')
                    }
                    self.buttonLoading = false
                }).catch(function(error){
                    self.$Notice.error({
                        title: '提示',
                        desc: '请求失败,请重试!',
                        duration: 3
                    })
                    self.buttonLoading = false
                })
            },
            // 取消
            handleCancel() {
                var self = this
                self.buttonLoading = false
                self.modalShow = false
            }
        }
    }
</script>