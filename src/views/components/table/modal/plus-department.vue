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
                <Form ref="menuForm" inline label-position="left" :model="editModal" :rules="ruleValidate" :label-width="100">
                    <FormItem label="组织机构" prop="deptName">
                        <Input size="small" v-model="editModal.deptName" :readonly="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="机构类型" prop="deptType">
                        <Select size="small" v-model="editModal.deptType" v-if="!isReadonly">
                            <Option v-for="item in optionArr" :value="item.id" :key="item.id">{{item.dicValue}}</Option>
                        </Select>
                        <Input size="small" v-model="editModal.deptType" readonly v-if="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="上级机构" prop="pDept">
                        <Input size="small" v-model="editModal.pDept" readonly v-if="isReadonly"></Input>
                        <!--下拉树-->
                        <sTree v-model="editModal.pDept" v-on:toTree="hanldeSelectTree"
                               :name="editModal.pDept"
                               :data="editModal.pDept" :option="sTreeOption"
                               style="width: 100%" v-if="!isReadonly"/>
                    </FormItem>
                    <FormItem label="负责人" prop="contacts">
                        <Input size="small" v-model="editModal.contacts" :readonly="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="负责人电话" prop="contactsTel">
                        <Input size="small" v-model="editModal.contactsTel" :readonly="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="负责人邮箱" prop="email">
                        <Input size="small" v-model="editModal.email" :readonly="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="创建人" prop="createTime" v-if="editModal.createUserName">
                        <Input size="small" v-model="editModal.createUserName" :readonly="isReadonly"></Input>
                    </FormItem>
                    <FormItem label="创建时间" prop="createUserName" v-if="editModal.createTime">
                        <Input size="small" v-model="editModal.createTime" :readonly="isReadonly"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" class="layout-modal-button" v-if="!isReadonly">
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
    import {mapGetters, mapMutations} from 'vuex'
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
                editModal: {
                    deptName: '',
                    pDept: '',
                    contacts: '',
                    contactsTel: '',
                    deptType: 0,
                    createTime: null,
                    createUserName: null,
                    email:''
                },
                isReadonly: false,
                sTreeOption:[{label: "deptTree", value: "deptTree"}],
                iconClass: 'md-add',
                buttonText: '新增',
                buttonType: 'success',
                postType: '/create',
                ruleValidate: {
                    deptName: [
                        { required: true, message: '请输入组织机构', trigger: 'change' }
                    ],
                    // deptType: [
                    //     { required: true, message: '请选择类型', trigger: 'change' }
                    // ],
                    // pDept: [
                    //     { required: true, message: '请选择上级机构', trigger: 'change' }
                    // ]
                },
                optionArr: []
            }
        },
        methods: {
            // 按钮显示的class及名称 请求类型
            initButtonClass(data){
                let self = this
                if(data == 'queryPage'){
                    self.isReadonly = true
                    self.iconClass = 'ios-book'
                    self.buttonText = '详情'
                    self.buttonType = 'default'
                    self.postType = api.dataDepartment.query
                }else if(data == 'update'){
                    self.isReadonly = false
                    self.iconClass = 'md-create'
                    self.buttonText = '编辑'
                    self.buttonType = 'primary'
                    self.postType = api.dataDepartment.update
                }else{
                    self.isReadonly = false
                    self.iconClass = 'md-add'
                    self.buttonText = '新增'
                    self.buttonType = 'success'
                    self.postType = api.dataDepartment.add
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
                Util.ojax.post(self.postType, self.editModal).then(function (res) {
                    if(res.data.code == 0){
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!',
                            duration: 3
                        })
                        self.modalShow = false
                        self.searchGrid({menuId: self.$route.meta.menuId, path: api.dataDepartment.query})
                    }else{
                        self.$Message.error(res.data.msg)
                    }
                })
            },

            // 取消事件
            handleCancel() {
                var self = this
                self.modalShow = false
            },

            // 选择下拉树
            hanldeSelectTree(v){
                this.editModal.pDept = v.value.toString()
            },

            // 动态渲染下拉选项
            initOption(){
                let self = this
                Util.ojax.post(api.GetDicType, {type: 2}).then(function (res) {
                    if(res.data.code == 0){
                        self.optionArr = res.data.detail
                    }else{
                        self.$Message.error(res.data.msg)
                    }
                })
            },

            ...mapMutations('tableState', [
                'searchGrid', //初始化页面
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