<template>
    <div class="layout-adv-search">
        <Form ref="formInline" inline label-position="right" :label-width="100">
            <FormItem v-if="item" :label="item.label+':'" v-for="item in searchCfg" :key="item.id">

                <!--表单控件-->
                <!--输入框-->
                <Input type="text" v-model="searchModel[item.name]" :placeholder="'请输入'+item.label+'...'" size="small"
                       v-if="item.type == 'input'"/>

                <!--时间日期选择器-->
                <selectDatepicker v-model="searchModel[item.name]"
                                  v-if="item.type == 'date' || item.type == 'datetime' || item.type == 'datetimerange' || item.type == 'daterange'"
                                  v-on:changeDateFormat="changeDateFormat"
                                  :dateValue="item.value"
                                  :name="item.name"
                                  :sName="item.name"
                                  :sType="item.type"/>

                <!--时间选择器-->
                <selectTimepicker v-model="searchModel[item.name]"
                                  v-if="item.type == 'time' || item.type == 'timerange'"
                                  v-on:changeTimeFormat="changeTimeFormat"
                                  :name="item.name"
                                  :sName="item.name"
                                  :sType="item.type"/>


                <!--多选组合框-->
                <CheckboxGroup v-model="searchModel[item.name]" v-if="item.type == 'checkbox-group'" size="small">
                    <Checkbox :label="option.value" v-for="(option, key) in item.option" :key="key">
                        <Icon :type="option.icon" v-if="option.icon"></Icon>
                        <span>{{option.label}}</span>
                    </Checkbox>
                </CheckboxGroup>


                <!--单选框-->
                <RadioGroup v-model="searchModel[item.name]" v-if="item.type == 'radio'">
                    <Radio :label="i.label" v-for="i in item.children" :key="i.label"></Radio>
                </RadioGroup>


                <!--复选框-->
                <CheckboxGroup v-model="searchModel[item.name]" v-if="item.type == 'checkbox'">
                    <Checkbox :label="i.label" v-for="i in item.children" :key="i.label"></Checkbox>
                </CheckboxGroup>


                <!--选择下拉-->
                <Select v-model="searchModel[item.name]" clearable filterable v-if="item.type == 'select'"
                        size="small">
                    <Option :value="i.value" v-for="i in item.option" :key="i.value" :label="i.label"></Option>
                </Select>

                <!--动态渲染下拉-->
                <selectRemote v-model="searchModel[item.name]"
                              v-if="item.type == 'select-remote'"
                              :name="item.name"
                              :option="item.dicType"
                              size="small"
                              v-on:toTreeModal="hanldeSelectRemote"
                              :selectOptionValue="searchModel[item.name]"/>

                <!--自动完成-->
                <selectRemoteAutoComplete
                        v-model="searchModel[item.name]"
                        v-on:autoCompleteData="autoCompleteData"
                        :option="item.option"
                        :name="item.name"
                        :sName="item.name"
                        v-if="item.type == 'auto-complete'"/>
                <!-- 组织机构树选择 -->
                <searchTree v-if="item.type == 'select-tree'" ref="searchTree" v-model="searchModel[item.name]" v-on:toTree="hanldeSelectTree"
                :name="deptName"
                treeType="departmentTree"
                :option="sTreeOption"
                style="width: 100%"/>
            </FormItem>
            <FormItem>
                <Button type="info" size="small" buttonId="1" icon="md-search" class="adv-search-btn"
                        @click="handleSearch">
                    查询
                </Button>
                <Button @click="reset" size="small" buttonId="200" class="adv-search-btn">
                    重置
                </Button>
                <!--导出菜单-->
                <Button type="primary" size="small"  icon="md-cloud" class="adv-search-btn" @click="handleExportMenu" v-if="searchBtnCfg.indexOf('exportMenu')>-1"> 导出</Button>
                <!--导出部门-->
                <Button type="primary" size="small"  icon="md-cloud" class="adv-search-btn" @click="handleExportDepartment" v-if="searchBtnCfg.indexOf('exportDepartment')>-1"> 导出</Button>
                <!--添加用户按钮-->
                <!-- <plus-user v-if="searchBtnCfg.indexOf('plusUser') >-1" modalType="create" /> -->
                <!--添加部门按钮-->
                <plus-department v-if="searchBtnCfg.indexOf('insertDepartment') >-1" modalType="create" />
                <!--添加菜单按钮-->
                <plus-menu v-if="searchBtnCfg.indexOf('insertMenu')>-1" modalType="create" />
                <!--删除部门-->
                <Button type="primary" size="small"  icon="md-trash" class="adv-search-btn" @click="handleDeleteDepartment" v-if="searchBtnCfg.indexOf('deleteDepartment')>-1"> 删除</Button>
                
                <!--<Button type="error" size="small" buttonId="8" icon="md-close" class="adv-search-btn"-->
                        <!--@click="handleControl('8')" v-if="searchBtnCfg.indexOf('8') >-1">-->
                    <!--批量删除-->
                <!--</Button>-->
                <!--<Button type="default" size="small" buttonId="5" icon="md-cloud-download" class="adv-search-btn"-->
                        <!--@click="handleControl('5')" v-if="searchBtnCfg.indexOf('5') >-1">-->
                    <!--导入-->
                <!--</Button>-->
                <!--<Button type="default" size="small" buttonId="6" icon="md-cloud-upload" class="adv-search-btn"-->
                        <!--@click="handleSearch('6')" v-if="searchCfg.button.indexOf('6') >-1">-->
                    <!--导出-->
                <!--</Button>-->
                <!--<Button type="warning" size="small" buttonId="104" icon="md-car" class="adv-search-btn"-->
                <!--@click="handleControl('104')"  v-if="Array.indexOf(searchCfg.button, '104') >-1">-->
                <!--绑定车辆/设备-->
                <!--</Button>-->
                <!--<Button type="warning" size="small" buttonId="105" icon="md-car" class="adv-search-btn"-->
                        <!--@click="handleControl('105')" v-if="searchCfg.button.indexOf('105') >-1">-->
                    <!--同步-->
                <!--</Button>-->
                <!--<Button type="warning" size="small" buttonId="9" icon="md-car" class="adv-search-btn"-->
                        <!--@click="handleSearch('9')" v-if="Array.indexOf(searchCfg.button, '9') >-1">-->
                    <!--批量导出-->
                <!--</Button>-->
            </FormItem>
            <FormItem style="float:right">
                <div class="data-role">
                    <Button type="success" v-if="searchBtnCfg.indexOf('insertDataRole')>-1" size="small" icon="md-add" class="adv-search-btn"
                        @click="add($refs.addData)">新增
                    </Button>
                <!-- <div class="func-role"> -->
                    <Button type="success" v-if="searchBtnCfg.indexOf('insertRoleInfo')>-1" size="small" icon="md-add" class="adv-search-btn"
                        @click="add($refs.addFunc)">新增
                    </Button>
                <!-- <div class="user-manage"> -->
                    <Button type="success" v-if="searchBtnCfg.indexOf('insertUser')>-1" size="small" icon="md-add" class="adv-search-btn"
                        @click="add($refs.addUser)">新增
                    </Button>
                <!-- <div class="client-config"> -->
                    <Button type="success" v-if="searchBtnCfg.indexOf('insertClient')>-1" size="small" icon="md-add" class="adv-search-btn"
                        @click="add($refs.addClient)">新增
                    </Button>
                <!-- <div class="plus-rule"> -->
                    <Button type="success" v-if="searchBtnCfg.indexOf('insertRule')>-1" size="small" icon="md-add" class="adv-search-btn"
                        @click="add($refs.addRule)">新增
                    </Button>
                    <Button type="default" v-if="searchBtnCfg.indexOf('delete')>-1" size="small" icon="md-close" class="adv-search-btn"
                        @click="del">删除
                    </Button>
                </div>
                <!-- export btn wrap -->
                <div class="count-export">
                    <Button type="default" v-if="searchBtnCfg.indexOf('export')>-1" size="small" icon="ios-cloud-download-outline" class="adv-search-btn"
                        @click="exportExcl">导出
                    </Button>
                </div>
            </FormItem>
        </Form>
        <Button type="default" shape="circle" size="small" icon="md-chevron-down" class="btn_show_more"
                @click="handleShowMore" v-if="searchCfg&&searchCfg.length > 6"></Button>
        <Button type="default" shape="circle" size="small" icon="md-chevron-up" class="btn_show_more"
                @click="handleShowMore" v-if="showMoreSearch !==''"></Button>

        <!--公用删除弹窗-->
        <Modal v-model="modalShow" title="操作 - 删除" :loading="modaLoading">
            <p>确认 删除 勾选的信息吗?</p>
            <div slot="footer">
                <Button @click="cancel"> 取 消</Button>
                <Button type="success" icon="checkmark-round" @click="okDel">
                    保 存
                </Button>
            </div>
        </Modal>
        <plus-func-role ref="addFunc"/>
        <plus-data-role ref="addData"/>
        <plus-user ref="addUser"/>
        <plus-client-cfg ref="addClient"/>
        <plus-rule ref="addRule"/>
        <set-photo-video ref="setMedia" />
    </div>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,init-declarations,no-unused-vars */

import Util from '../../../libs/util'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import selectRemote from '../form/select-remote'
import selectRemoteAutoComplete from '../form/select-remote-auto-complete'
import selectDatepicker from '../form/select-datepicker'
import selectTimepicker from "../form/select-timepicker"
// import plusUser from '../table/modal/plus-user'
import plusDepartment from '../table/modal/plus-department'
import editTreePermisson from '../table/modal/edit-tree-permission'
import plusMenu from '../table/modal/plus-menu'
import plusDataRole from '../cloneTable/modal/plus-data-role'
import plusFuncRole from '../cloneTable/modal/plus-func-role'
import plusUser from '../cloneTable/modal/plus-user'
import plusClientCfg from '../cloneTable/modal/plus-client-cfg'
import plusRule from '../cloneTable/modal/plus-rule-set'
import setPhotoVideo from '../cloneTable/modal/photo-video-rule'
import searchTree from '../form/select-tree'

const api = require('../../../libs/api')   //页面数据交换接口

export default {
    components: {
        selectRemote,
        selectRemoteAutoComplete,
        selectDatepicker,
        selectTimepicker,
        searchTree,

        plusUser,
        plusDepartment,
        editTreePermisson,
        plusMenu,
        plusDataRole,
        plusFuncRole,
        plusClientCfg,
        plusRule,
        setPhotoVideo
    },
    data() {
        return {
            // searchCfg: {cfg: null, button: []},
            searchModel: {},
            //页面辅助数据池
            showMoreSearch: '',
            //searchBtnCfg: [],
            deleteUrl: '',
            queryUrl: '',
            modaLoading: false,
            modalShow: false,
            pageApi: {},
            deptName: '',
            sTreeOption:[{label: "menuTree", value: "menuTree"}]
        }
    },
    methods: {
        hanldeSelectTree(v){
            this.searchModel.deptId = v.value.toString()
        },
        exportExcl(){
            let type = 'get'
            if(this.menuId === 162
                ||this.menuId === 188
                ||this.menuId === 191
                ||this.menuId === 206
                ||this.menuId === 209
                ||this.menuId === 214
            ){
                type = 'post'
            }
            Object.keys(this.pageApi).forEach(k => {
                let str = this.pageApi[k]
                if(str&&str.indexOf('export')>-1){
                    this.pageApi.exportApi = this.pageApi[k]
                }
            })
            const fileName = this.$route.meta.title
            Util.exportExel(fileName,this.pageApi.exportApi, this.searchModel, type)
        },
        okDel(){
            Object.keys(this.pageApi).forEach(k => {
                let str = this.pageApi[k]
                if(str&&str.indexOf('delete')>-1){
                    this.pageApi.del = this.pageApi[k] //处理接口key
                }
            })
            Util.ojax.post(this.pageApi.del, {ids:this.delIds.toString()}).then(res => {
                if(res.data.code==='0'){
                    this.$Notice.success({
                        title: '提示',
                        desc: res.data.msg,
                        duration: 3
                    })
                    this.modalShow = false
                    this.queryGridData({menuId: this.menuId,pamars: {},queryApi: this.queryApi})
                    this.tranDelData([])//清空ids
                }else{
                    this.$Message.error(res.data.msg||'未知异常')
                }
            })
        },
        cancel(){
            this.modalShow = false
        },
        RuleData(){
            this.$refs.addRule.clearRuleData()
            this.$refs.addRule.formData.ruleTypeId = this.ruleTypeId || 172
            this.$refs.setMedia.formData.ruleTypeId = this.ruleTypeId
        },
        add ($ref) {
            //console.log(this.$refs)
            let $addModal = $ref
            if(this.menuId === 165&&this.ruleTypeId === 180){
                $addModal = this.$refs.setMedia
            }
            Object.keys($addModal.formData).forEach(key => {
                $addModal.formData[key] = ''
            })
            $addModal.show = true
            $addModal.isShow = false
            $addModal.modalTit = '新增'
            $addModal.pageApi = this.pageApi
            $addModal.queryApi = this.queryApi
            $addModal.clearInput&&$addModal.clearInput()
            $addModal.clearCheckBox&&$addModal.clearCheckBox()
            if(this.menuId === 165){
                $addModal.formData.ruleTypeId = this.ruleTypeId||172
            }
            // 刷新树
            if(this.searchBtnCfg.indexOf('insertDataRole')>-1||this.searchBtnCfg.indexOf('insertRoleInfo')>-1){
                let data = {id:1}
                top.postMessage(data, '*')
            }
        },
        del () {
            if(!this.delIds.length){
                this.$Message.info('请先选择一行数据')
                return
            }
            this.modalShow = true
        },
        handleSearch(e) {
            let self = this
            let searchModel = self.searchModel
            self.queryGridData({menuId: self.menuId, pamars: searchModel, queryApi: self.queryApi})
        },
        //重置
        reset() {
            let self = this
            // this.deptName = ''
            Object.keys(this.searchModel).forEach(key => {
                this.searchModel[key] = ''
            })
            if(this.$refs.searchTree.length){
                this.$refs.searchTree[0].iptValue = ""
            }
            // self.queryMenuGridData({menuId: self.menuId, pamars: {}, queryApi: self.queryApi})
        },
        // 导出菜单按钮
        handleExportMenu(){
            let self = this
            let searchValue = self.searchModel
            self.exportGrid({
                menuId: self.menuId,
                parmas: searchValue,
                path: api.dataMenu.export
            })
        },
        handleExportDepartment(){
            let self = this
            let searchValue = self.searchModel
            self.exportGrid({
                menuId: self.menuId,
                parmas: searchValue,
                path: api.dataDepartment.export
            })
        },

        // 删除部门操作
        handleDeleteDepartment(){
            let ids = this.deleteModel.ids
            if(!ids)return

            if(ids){
                if(ids.length == 0)return
            }
            this.deleteUrl = api.dataDepartment.del
            this.queryUrl = api.dataDepartment.query
            this.modalShow = true
        },
        // 取消
        handleCancel(){
            this.modalShow = false
        },
        handleDelete(){
            let self = this
            let ids = this.deleteModel.ids
            self.modaLoading = true
            Util.ojax.post(self.deleteUrl + '?ids=' + ids.join(',')).then(function (res) {
                if(res.data.code == 0){
                    self.$Notice.success({
                        title: '提示',
                        desc: '删除成功!',
                        duration: 3
                    })
                    self.modalShow = false
                    self.modaLoading = false
                    self.searchGrid({menuId: self.$route.meta.menuId, path: self.queryUrl})
                }else{
                    self.modaLoading = false
                    self.$Message.error(res.data.msg)
                }
            })
        },

        // //初始化功能权限按钮
        // initSearchBtnCfg(data) {
        //     let self = this
        //     let componentCfg = data
        //     let searchBtnCfg = new Set()
        //     for (var key in componentCfg) {
        //         searchBtnCfg.add(key)
        //     }
        //     self.searchBtnCfg = Array.from(searchBtnCfg)
        // },

        //还未修改
        handleShowMore() {
            var self = this
            if (!self.showMoreSearch) {
                self.showMoreSearch = 'show_more'
            } else {
                self.showMoreSearch = ''
            }
            console.log(self.showMoreSearch)
        },
        handleTongbu(){},

        // 获取数据字典 动态渲染下拉菜单
        hanldeSelectRemote(v) {
            this.searchModel[v.name] = v.value
        },
        autoCompleteData(v){
            let self = this
            self.searchModel[v.name] = v.value
        },
        changeDateFormat(v){
            if(v.value == " | "){
                this.searchModel[v.name] = null
            }else{
                this.searchModel[v.name] = v.value
            }
        },
        changeTimeFormat(v){
            this.searchModel[v.name] = v.value
        },
        ...mapMutations('tableState', [
            'queryGridData', //初始化页面
            'exportGrid',
            'tranDelData'
        ])
    },
    computed: {
        menuId() {
            return this.$route.meta.menuId
        },
        queryApi() {
            let self = this
            let pageCfg = self.pageCfg
            let queryApi
            for (var i in pageCfg) {
                if (pageCfg[i].menuId == self.menuId) {
                    queryApi = pageCfg[i].queryApi
                }
            }
            return queryApi
        },
        searchBtnCfg() {
            let self = this
            let searchBtnData = self.pageCfg&&self.pageCfg[0].searchButton
            let searchBtnCfg = new Array()
            for (var i in searchBtnData) {
                this.pageApi[searchBtnData[i].name] = searchBtnData[i].api
                searchBtnCfg.push(searchBtnData[i].name)
                if(searchBtnData[i].name.indexOf('export')>-1){
                    searchBtnCfg.push('export')
                }
                if(searchBtnData[i].name.indexOf('delete')>-1){
                    searchBtnCfg.push('delete')
                }
            }
            return searchBtnCfg
        },
        searchCfg() {
            let pageCfg = this.pageCfg
            for (var i in pageCfg) {
                if (pageCfg[i].menuId == this.menuId) {
                    return pageCfg[i].cfg.searchPanel
                } else {
                    return []
                }
            }
        },
        ...mapGetters('tableState', [
            'pageCfg',
            'tableData',
            'delIds'
        ])
    }
}
</script>