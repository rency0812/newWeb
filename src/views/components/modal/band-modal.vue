<template>
    <Modal v-model="bandCfg.show" :draggable="false" :mask-closable="false" width="1200"
           class="layou-modal-input" @on-cancel="handleCancel">
        <div slot="header">
            <Icon type="information-circled"></Icon>
            <span>绑定车辆</span>
        </div>
        <div class="layout-modal-content">
            <Row>
                <Col span="6">
                <v-jstree :data='treeModalData' :whole-row="true" :loading-text="'loading....'" :collapse="false"
                          :allow-batch="true" :show-checkbox="false" :multiple="false"
                          @item-click="treeNodeClick" class="modal-tree"></v-jstree>
                </Col>
                <Col span="12">
                <div style="width:100%;padding: 10px">
                    <Input size="small" style="width: 30%" v-model="postValue.searchModel.vehNo" placeholder="输入车牌号..."></Input>
                    <Button type="info" size="small" buttonId="1" icon="md-search" class="adv-search-btn" @click="handleTableData">查询</Button>

                </div>
                <div style="width:100%;height:100%;overflow-y: auto;overflow-x: hidden">
                    <Table height="500"
                           border
                           :data="gridCfg.tableData"
                           :columns="gridCfg.cfg"
                           @on-select="handleSelect"
                           @on-select-cancel="handleSelectCancel"
                           @on-select-all="handleSelect"
                           @on-select-all-cancel="handleSelectCancelAll"></Table>
                </div>
                </Col>
                <Col span="6">
                <fieldset class="ex-box-title">
                    <legend>已选车辆({{selectTotal}})</legend>
                </fieldset>
                <div class="tag-container" style="height:95%">
                    <Tag v-for="item in selectTagList" :name="item.vehNo" :key="item.id" class="tag-item">{{item.vehNo}}</Tag>
                </div>
                </Col>
            </Row>
        </div>
        <div slot="footer">
            <div class="layout-modal-button">
                <Button type="success" icon="md-checkmark-circle" :loading="band_loading"
                        @click="handleSave">{{saveBtnText}}
                </Button>
                <Button @click="handleCancel"> 取 消 </Button>
            </div>
        </div>
    </Modal>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase,no-dupe-keys */
//调用的库文件
import Util from '../../../libs/util'
import * as types from '../../../libs/types'
import VJstree from 'vue-jstree'

/**********调用的组件*************/
import sTree from '../form/select-tree.vue'
import tableGrid from '../table/table'

//接口地址
const PostDataUrl = require('../../../libs/api').PostDataUrl   //页面数据交换接口
const PostTreeUrl = require('../../../libs/api').PostTreeUrl

export default {
    components: {
        sTree,
        VJstree,
        tableGrid
    },
    props: ['bandCfg', 'vehicleList'],
    data() {
        return {
            edit: false,
            //数据交换池
            postValue: {
                pageIndex: 1,
                pageSize: 9999,
                pageTotal: 9999,
                buttonId: 1,
                menuId: this.$route.meta.id,
                searchModel: {
                    deptIds: null,
                    vehNo: null
                },
                editModel: {} //传递进来或初始化的输入框
            },
            saveBtnText: '保存',
            gridCfg:{
                tableData: [],
                cfg: [
                    {
                        type:'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '车牌号',
                        key: 'vehNo',
                        align: 'center'
                    },
                    {
                        title: '所属机构',
                        key: 'deptName',
                        align: 'center'
                    }
                ],
                spinShow: false
            },
            selectTagList:[],
            oSelectList: [],
            selectTotal: 0,
            treeModalData:[],
            band_loading: false
        }
    },
    mounted() {},
    methods: {
        //点击树节点请求车辆表格数据
        treeNodeClick(e, i){
            let self = this
            let cIds = []
            if(i.children){
                cIds = Util.getTreeNodesChildren(i.children, cIds)
            }
            cIds.push(i.id)
            self.postValue.menuId = 1871
            self.postValue.searchModel.deptIds = cIds
            self.handleTableData()

        },
        handleTableData(){
            let self = this
            self.gridCfg.spinShow = true
            Util.ojax.post('/bb/curd/1871', self.postValue).then(function (response) {
                if(response.data.code == 0){
                    self.gridCfg.tableData = response.data.detail.list
                    self.setSelected()
                }else{
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: response.data.msg,
                        duration: 10
                    })
                }
                self.gridCfg.spinShow = false
            }).catch(function (error) {
                self.$Notice.error({
                    title: '错误提示！',
                    desc: '请求失败',
                    duration: 3
                })
                self.gridCfg.spinShow = false
            })
        },
        handleSave() {
            var self = this
            self.band_loading = true
            self.postValue.editModel.vehicleList = self.selectTagList
            self.postValue.editModel.id = self.bandCfg.id
            self.postValue.buttonId = self.bandCfg.btnIds
            Util.ojax.post(PostDataUrl + '/' + self.$route.meta.id, self.postValue).then(function (response) {
                if (response.data.code == 0) {
                    self.$Notice.success({
                        title: '提示！',
                        desc: response.data.msg,
                        duration: 3
                    })
                    self.$emit('handleModal', {buttonId: 1})
                    self.handleCancel()
                }else{
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: response.data.msg,
                        duration: 3
                    })
                }
                self.band_loading = false
            }).catch(function (error) {
                self.$Notice.error({
                    title: '错误提示！',
                    desc: error.data.msg,
                    duration: 3
                })
            })
        },
        handleCancel() {
            var self = this
            self.bandCfg.show = false
        },
        //初始化树结构
        initTree(){
            let self = this
            Util.ojax.post(PostTreeUrl, {tree: 'dept'}).then(function (response) {
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
        },
        //渲染右侧的路线列表
        initRightList(){},
        initTagList(v, sV){
            let self = this
            if(sV){
                if(self.editMapJson.length == 0){
                    self.editMapJson = v
                }else{
                    self.editMapJson = self.editMapJson.concat(v)
                }
            }else{
                for(let i in self.editMapJson){
                    for(let j in v){
                        if(v[j].id == self.editMapJson[i].id){
                            self.editMapJson.splice(i, 1)
                        }
                    }
                }
            }
            self.selectTagList = self.editMapJson
        },
        uniqueArray(array) {
            var newArr = [array[0]]
            for (var i = 1; i < array.length; i++) {
                var Item = array[i]
                var repeat = false
                for (var j = 0; j < newArr.length; j++) {
                    if (Item.id == newArr[j].id) {
                        repeat = true
                        break
                    }
                }
                if (!repeat) {
                    newArr.push(Item)
                }
            }
            return newArr
        },
        // 多选
        handleSelect(selection, row){
            let self = this
            self.selectTagList = self.uniqueArray(self.selectTagList.concat(selection))
            self.selectTotal = self.selectTagList.length
        },
        // 取消多选
        handleSelectCancel(selection, row){
            let self = this
            if(self.selectTagList.length > 0){
                for(let i = 0; i<self.selectTagList.length; i++){
                    if(self.selectTagList[i].id == row.id){
                        self.selectTagList.splice(i, 1)
                    }
                }
            }
            self.selectTotal = self.selectTagList.length
        },
        handleSelectCancelAll(selection){
            let self = this
            self.selectTagList = selection
            self.selectTotal = self.selectTagList.length
        },
        // 设置默认选中
        setSelected(){
            let self = this
            if(self.selectTagList.length>0 && self.gridCfg.tableData.length >0){
                let sgt = self.gridCfg.tableData
                let ss = self.selectTagList
                for(let i = 0; i<sgt.length;i++){
                    for(let j = 0; j<ss.length; j++){
                        if(sgt[i].id == ss[j].id){
                            sgt[i]._checked = true
                        }
                    }
                }
            }
        }
    },
    watch: {
        show:{
            handler(n) {
                if(n){
                    this.initTree()
                    this.selectTagList =  this.vehicleList
                }else{
                    this.selectTagList = []
                    this.treeModalData = []
                    this.gridCfg.tableData = []
                    this.postValue.searchModel.deptIds = null
                    this.postValue.searchModel.vehNo = null
                    this.selectTotal = 0
                }
            },
            immediate: true,
            deep: true
        },
        // vehicleList: {
        //     handler(n) {
        //         if(n){
        //             this.selectTagList = n
        //             this.selectTotal = this.selectTagList.length
        //         }else{
        //             this.selectTagList = []
        //         }
        //     },
        //     immediate: true,
        //     deep: true
        // }
    },
    computed: {
        show() {
            return this.$props.bandCfg.show
        }
    }
}
</script>