<template>
    <div class="extra-button-container">
        <Button :type="buttonType" size="small" :icon="iconClass" class="adv-search-btn"
                @click="handlePlus">{{buttonText}}
        </Button>
        <Modal v-model="modalShow" :draggable="false" :mask-closable="false" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>{{buttonText}}</span>
            </p>
            <div class="modal-form">
                <Form ref="menuForm" inline label-position="left" :label-width="100">
                    <FormItem label="菜单名称" prop="menuName">
                        <Input size="small" v-model="editModal.menuName" placeholder="请输入菜单名称..." :readonly="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="上级节点" prop="pMenuId">
                        <Input size="small" v-model="editModal.pMenuName" :readonly="isReadonly" v-if="isReadonly"></Input>
                        <!--下拉树-->
                        <sTree v-model="editModal.pMenuId" v-on:toTree="hanldeSelectTree"
                               :name="editModal.pMenuId"
                               :data="editModal.pMenuId" :option="sTreeOption"
                               :show="modalShow"
                               style="width: 100%"  v-if="!isReadonly"/>
                    </FormItem>
                    <FormItem label="菜单路径" prop="menuUrl">
                        <Input size="small" v-model="editModal.menuUrl" placeholder="请输入菜单路径..." :readonly="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="类型" prop="menuType">
                        <Input size="small" v-model="editModal.menuType" :readonly="isReadonly" v-if="isReadonly"></Input>
                        <Select size="small" v-model="editModal.menuType"  v-if="!isReadonly">
                            <Option v-for="item in optionArr" :value="item.id" :key="item.id">{{item.dicValue}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="页面显示" prop="menuName">
                        <Input size="small" v-model="editModal.menuName" placeholder="请输入页面显示名称..." :readonly="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="排序" prop="menuSort">
                        <Input size="small" v-model="editModal.menuSort" placeholder="请输入排序数字..." :readonly="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="修改人" prop="modifyUser" v-if="editModal.modifyUser">
                        <Input size="small" v-model="editModal.modifyUser" :readonly="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="修改时间" prop="modifyTime" v-if="editModal.modifyTime">
                        <Input size="small" v-model="editModal.modifyTime" :readonly="isReadonly"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" class="layout-modal-button" v-if="modalType != 'queryPage'">
                <Button @click="handleCancel"> 取 消</Button>
                <Button type="success" icon="checkmark-round" :loading="modaLoading" @click="handleSave">
                    保 存
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Util from '../../../../libs/util'
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import sTree from '../../form/select-tree.vue'
    const api = require('../../../../libs/api')

    export default {
        components: {
            sTree
        },
        props: ['row', 'modalType'],
        data() {
            return {
                modalShow: false,
                modaLoading: false,
                editFormItem: [
                    {id: 1, label: '菜单名称', name: 'menuName', option:'', value: ''},
                    {id: 2, label: '上级节点', name: 'pId'},
                    {id: 3, label: '菜单路径', name: 'menuUrl'},
                    {id: 4, label: '类型', name: 'menuType'},
                    {id: 5, label: '*页面显示', name: 'pageName'},
                    {id: 6, label: '排序', name: 'sort'},
                    {id: 7, label: '修改人', name: 'editUser'},
                    {id: 8, label: '修改时间', name: 'editTime'}
                ],
                editModal: {
                    menuName: '',
                    menuType: 1,
                    menuSort: '',
                    pMenuName: '',
                    menuUrl: '',
                    createUser: '',
                    createTime: '',
                    modifyUser: '',
                    modifyTime: '',
                },
                isReadonly: false,
                sTreeOption:[{label: "menuTree", value: "menuTree"}],
                iconClass: 'md-add',
                buttonText: '新增',
                buttonType: 'success',
                postType: '',
                optionArr: ''
            }
        },
        methods: {
            // 按钮显示的class及名称
            initButtonClass(data){
                let self = this
                if(data == 'queryPage'){
                    self.isReadonly = true
                    self.iconClass = 'ios-book'
                    self.buttonText = '详情'
                    self.buttonType = 'default'
                    self.postType = api.dataMenu.query
                }else if(data == 'update'){
                    self.isReadonly = false
                    self.iconClass = 'md-create'
                    self.buttonText = '编辑'
                    self.buttonType = 'primary'
                    self.postType = api.dataMenu.update
                }else{
                    self.isReadonly = false
                    self.iconClass = 'md-add'
                    self.buttonText = '新增'
                    self.buttonType = 'success'
                    self.postType = api.dataMenu.add
                }
            },

            // 点击按钮事件 若有行数据 则赋值
            handlePlus(e) {
                this.modalShow = true
                if(this.row){
                    for(let k in this.editModal){
                        this.editModal[k] = this.row[k]
                    }
                    this.editModal.id = this.row.id
                }
            },

            // 保存
            handleSave() {
                let self = this
                let path = this.$route.path + self.postType
                // self.handlePost({
                //     menuId: self.menuId,
                //     path: path,
                //     postData: self.editModal
                // })
                Util.ojax.post(self.postType, self.editModal).then(function (res) {
                    if(res.data.code == 0){
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!',
                            duration: 3
                        })
                        self.modalShow = false
                        self.searchGrid({menuId: self.$route.meta.menuId, path: api.dataMenu.query})
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

            // 取消
            handleCancel() {
                var self = this
                self.modalShow = false
            },

            // 选择下拉树
            hanldeSelectTree(v){
                this.editModal.pname = v.text
                this.editModal.pid = v.value.toString()
            },

            // 动态渲染下拉选项
            initOption(){
                let self = this
                Util.ojax.post(api.GetDicType, {type: 1}).then(function (res) {
                    if(res.data.code == 0){
                        self.optionArr = res.data.detail
                    }else{
                        self.$Message.error(res.data.msg)
                    }
                })
            },

            ...mapMutations('tableState', [
                'searchGrid', //初始化页面
                'handleModalPost', // 增删改
            ]),
            ...mapActions('tableState', [
                'handlePost', // 增删改
            ]),

        },
        computed: {
            menuId() {
                return this.$route.meta.menuId
            },
            ...mapGetters('tableState', [
                'pageCfg',
            ]),
            editParmas(){}
        },
        watch: {
            modalShow: {
                handler(data) {
                    if(!data && this.$refs['menuForm']){
                        for(let i in this.editModal){
                            if(i == 'menuType'){
                                this.editModal[i] = 0
                            }else if(i == 'id'){
                                delete this.editModal[i]
                            }else{
                                this.editModal[i] = ''
                            }
                        }
                    }
                    if(data){
                        this.initOption()
                    }
                },
                immediate: true,
                deep: true
            },
            // 弹窗类型 决定按钮显示
            modalType:{
                handler(data) {
                    if(data){
                        this.initButtonClass(data)
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