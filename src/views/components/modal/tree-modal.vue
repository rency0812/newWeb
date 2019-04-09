<style scoped>
    .modal-tree{max-height:400px; overflow-y: scroll}
</style>
<template>
    <Modal v-model="treeModal.showModal"
           :draggable="true"
           :mask-closable="false">
        <p slot="header">
            <Icon type="information-circled"></Icon>
            <span>{{treeModal.title}}</span>
        </p>
        <Row justify="center">
            <!--<Col span="12" >-->
            <Form ref="tableModal" autocomplete="on" :model="postValue.editModel" inline v-if="inputCfg"
                  label-position="right"
                  :label-width="100">
                <FormItem :label="i.label+':'" v-for="i in inputCfg.cfg" :key="i.id"
                          :prop="i.name" style="width: 45%">
                    <!--输入框-->
                    <Input :placeholder="'请输入'+i.label+'...'" size="small" clearable
                           v-model="postValue.editModel[i.name]" v-if="i.type == 'input'"/>

                    <!--数字输入框-->
                    <InputNumber v-model="postValue.editModel[i.name]" :min="0" size="small"
                                 :placeholder="'请选择'+i.label+'...'"
                                 v-if="i.type == 'input-num'"
                                 style="width: 100%"></InputNumber>

                    <!--时间日期选择器-->
                    <DatePicker type="datetime" size="small"
                                v-model="postValue.editModel[i.name]"
                                :placeholder="'请输入'+i.label+'...'"
                                v-if="i.type == 'datepicker'"></DatePicker>

                    <!--选择下拉-->
                    <Select v-model="postValue.editModel[i.name]"
                            clearable
                            filterable
                            multiple
                            v-if="i.type == 'select-multiple'"
                            size="small">
                        <Option :value="option.value" v-for="(option, key) in i.option" :key="key" :label="option.label"></Option>
                    </Select>

                    <!--多选组合框-->
                    <CheckboxGroup v-model="postValue.editModel[i.name]" v-if="i.type == 'checkbox-group'" size="small">
                        <Checkbox :label="option.value" v-for="(option, key) in i.option" :key="key">
                            <Icon :type="option.icon" v-if="option.icon"></Icon>
                            <span>{{option.label}}</span>
                        </Checkbox>
                    </CheckboxGroup>


                    <!--下拉树-->
                    <sTree v-model="postValue.editModel[i.name]" v-on:toTree="hanldeSelectTree"
                           :placeholder="'请选择'+i.label+'...'" :name="i.name"
                           :data="dataFromGrid[i.name]" :option="i.option" :iptValue="postValue.editModel[i.name]"
                           :show="treeModal.showModal"
                           v-if="i.type == 'select-tree'" style="width: 100%"/>
                    <!--选择下拉-->
                    <selectRemote v-model="postValue.editModel[i.name]"
                                  v-if="i.type == 'select-remote'"
                                  :name="i.name"
                                  :option="i.option"
                                  size="small"
                                  v-on:toTreeModal="hanldeSelectTree"
                                  :selectOptionValue="postValue.editModel[i.name]">
                    </selectRemote>
                </FormItem>
            </Form>
        </Row>
        <Row justify="center">
            <Col span="22" :xs="{ offset: 1 }" style="margin-top: 5px"  v-if="treeModal">
            <v-jstree :data='treeModalData' :whole-row="true" :loading-text="'loading....'" :collapse="false"
                      :allow-batch="true" :show-checkbox="true" :multiple="true"
                      @item-click="treeNodeClick" class="modal-tree"></v-jstree>
            </Col>
        </Row>
        <div slot="footer">
            <div class="layout-modal-button">
                <Button type="success" icon="md-checkmark-circle" :loading="modal_loading"
                        @click="handleSave('tableModal')">
                    {{saveBtn}}
                </Button>
                <Button @click="handleCancel('tableModal')"> 取 消 </Button>
            </div>
        </div>
    </Modal>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase,no-dupe-keys */

import VJstree from 'vue-jstree'
import sTree from '../form/select-tree.vue'
import selectRemote from '../form/select-remote.vue'
import Util from '../../../libs/util'

const PostTreeUrl = require('../../../libs/api').PostTreeUrl
const PostDataUrl = require('../../../libs/api').PostDataUrl
const PostCfgUrl = require('../../../libs/api').PostCfgUrl

export default {
    components: {
        VJstree,
        sTree,
        selectRemote
    },
    props: ['modalCfg', 'gridCfg', 'dataFromGrid', 'inputData'],
    data() {
        return {
            saveBtn: '保存',
            treeModalData:[],
            treeModal: this.$props.modalCfg,
            modal_loading: false,
            modalData: {},
            inputCfg:{},
            //数据交换池
            postValue: {
                pageIndex: 1,
                pageSize: 20,
                pageTotal: 0,
                buttonId: 2,
                menuId: this.$route.meta.id,
                searchModel: {},
                editModel: {}//传递进来或初始化的输入框
            }
        }
    },
    mounted(){
        // this.$refs["tableModal"].resetFields()
    },
    methods: {
        handleSave() {
            let self = this
            self.postValue.editModel.data = self.treeModalData //树的数据
            self.postValue.buttonId = self.treeModal.btnIds //当前请求接口的按钮的Id
            self.postValue.editModel.id = self.treeModal.id == 'undefined'?null :self.treeModal.id  // 当前行的Id
            // if(self.treeModal.id){
            //     self.postValue.buttonId = 3
            // }else{
            //     self.postValue.buttonId = 2
            // }
            if(self.postValue.menuId == 1870){
                if(self.postValue.editModel.deptId == "" || !self.postValue.editModel.deptId || self.postValue.editModel.roleId == "" || !self.postValue.editModel.roleId){
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: '请填写完整信息！',
                        duration: 5
                    })
                    return
                }
            }
            Util.ojax.post(PostDataUrl + '/' + self.$route.meta.id, self.postValue).then(function (response) {
                if (response.data.code == 0) {
                    self.$Notice.success({
                        title: '提交成功！',
                        desc: '提交成功！',
                        duration: 5
                    })
                    self.handleCancel()
                    self.$emit('handleModal', {buttonId: 1, value: {}})
                }else{
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: response.data.msg,
                        duration: 5
                    })
                }
            }).catch(function (error) {
                console.log(error)
            })
        },
        //取消事件
        handleCancel() {
            var self = this
            self.treeModal.showModal = false
            self.treeModalData = []
            for(let k in self.postValue.editModel){
                self.postValue.editModel[k] = null
            }
            // window.setTimeout(function(){
            //     window.location.reload()
            // }, 100)
            // self.$emit('handleModal', {buttonId: 1})
        },
        //初始化弹窗配置
        initCfg(){
            let self = this
            Util.ojax.post(PostCfgUrl, {menuId: self.treeModal.btnIds}).then(function (response) {
                if (response.data.code == 0) {
                    if(response.data.detail.pageCfg){
                        self.treeModalCfg = response.data.detail.pageCfg
                        self.initTree()
                    }
                    if(response.data.detail.searchCfg){
                        self.inputCfg = response.data.detail.searchCfg
                    }
                }else{
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: response.data.msg,
                        duration: 5
                    })
                    self.treeModal.showModal = false
                }
            }).catch(function (error) {
                console.log(error)
            })
        },
        //初始化弹窗树
        initTree(){
            let self = this
            let oParams = {}
            if(self.treeModalCfg.pageTree.tree){
                if(self.postValue.editModel.id){
                    oParams = {
                        tree: self.treeModalCfg.pageTree.tree,
                        roleId: self.postValue.editModel.roleId,
                        deptId:self.postValue.editModel.deptId
                    }
                }else{
                    oParams = {
                        tree: self.treeModalCfg.pageTree.tree,
                        roleId: self.treeModal.id
                    }
                }
                Util.ojax.post(PostTreeUrl, oParams).then(function (response) {
                    if (response.data.code == 0) {
                        self.treeModalData = response.data.detail
                    }else{
                        self.$Notice.error({
                            title: '错误提示！',
                            desc: response.data.msg,
                            duration: 5
                        })
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
        //设置父节点选中
        selectParentNode(node){
            if(node.data){
                node.data.selected = true
                if(node.$parent.data){
                    this.selectParentNode(node.$parent)
                }
            }
        },
        //树的节点点击 给父和子节点添加selected属性
        treeNodeClick (data, node){
            let self = this
            if(this.$route.meta.id != 1870){
                if(data.$parent.data){
                    self.selectParentNode(data.$parent)
                }
            }
            // if(node.selected){
            //     node.data.selected = true
            //     if(node.pid){
            //         data.$parent.data.selected = true
            //     }
            //     if(node.children){
            //         $.each(node.children, function(v, i){
            //             i.selected = true
            //         })
            //     }
            // }else{
            //     node.data.selected = false
            //     if(node.children){
            //         $.each(node.children, function(v, i){
            //             i.selected = false
            //         })
            //     }
            //     let cIds = data.$parent.data.children
            //     let cV = []
            //     let pValue = false
            //     if(cIds && cIds.length > 0){
            //         $.each(cIds, function(v, i){
            //             cV.push(i.selected)
            //         })
            //         for(let j = 0; j<cV.length; j++){
            //             if(cV[j] == true){
            //                 pValue = true
            //             }
            //         }
            //     }
            //     if(!pValue){
            //         data.$parent.data.selected = false
            //     }
            // }
            // console.log(this.treeModalData)
        },
        //下拉树节点点击
        hanldeSelectTree(v) {
            this.postValue.editModel[v.name] = v.value
        },
        //设置从表格传过来的数据
        setInputData(){
            let self = this
            setTimeout(function(){
                for(let key in self.dataFromGrid){
                    self.postValue.editModel[key] = self.dataFromGrid[key]
                }
            },200)
        }
    },
    watch:{
        modalCfg: {
            handler(n) {
                let self = this
                if (n.showModal) {
                    self.treeModal.showModal = true
                    window.setTimeout(function(){
                        self.initCfg()
                    }, 500)
                }else {
                    self.treeModal.id = null
                    self.treeModal.title = null
                    for(let k in self.postValue.editModel){
                        self.postValue.editModel[k] = null
                    }
                    if(!n.showModal){
                        self.treeModalData = []
                    }
                }
            },
            immediate: true,
            deep: true
        },
        dataFromGrid: {
            handler(n) {
                if (n) {
                    let self = this
                    self.setInputData()
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style>

</style>