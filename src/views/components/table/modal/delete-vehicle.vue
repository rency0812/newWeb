<template>
    <div>
        <Button type="error" size="small" icon="md-trash"
                @click="handlePlus">{{name}}
        </Button>


    </div>
</template>

<script>
    //调用依赖库
    import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    import Util from '../../../../libs/util'

    export default {
        props: ['api', 'rowData', 'rowIndex', 'name'],
        components: {},
        data() {
            return {
                modalShow: false,
                buttonLoading: false,
                ids: [],
            }
        },
        methods: {
            // 点击按钮事件,弹出窗体
            handlePlus(e) {
                const self = this
                self.modalShow = true
                self.ids = this.rowData
                console.log(self.ids)
                if (self.ids) {
                    self.$Modal.confirm({
                        title: '确认' + this.name + '选中的内容？',
                        content: "删除车辆",
                        onOk: () => {
                            self.handleDelete()
                        },
                        onCancel: () => {
                            self.handleCancel()
                        },
                    });
                } else {
                    self.$Modal.error({
                        title: '未选中任何选项',
                        content: "请选择相关选项后，再次操作",
                    });
                }
            },
            // 删除动作
            handleDelete() {
                const self = this
                const ids = self.ids
                self.buttonLoading = true
                Util.ojax.post(self.api, {ids: ids}).then(function (res) {
                    if (res.data.code == 0) {
                        self.errorTip = null
                        self.modalShow = false
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!'
                        });
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
                self.ids = null
                self.buttonLoading = false
                self.modalShow = false
            },
            ...mapMutations('tableState', [
                // 'saveMenu' //增加菜单
            ])
        }


    }
</script>

<style scoped>

</style>