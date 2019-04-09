<template>
    <Modal v-model="mapModal.showModal" :draggable="true" :mask-closable="false" width="1200"
           class="layou-modal-input" @on-cancel="handleCancel">
        <div slot="header">
            <Icon type="information-circled"></Icon>
            <span>地图</span>
        </div>
        <div class="layout-modal-content">
            <Row>
                <Col span="5">
                    <v-jstree :data='treeModalData' :whole-row="true" :loading-text="'loading....'" :collapse="false"
                              :allow-batch="true" :show-checkbox="true" :multiple="true"
                              @item-click="treeNodeClick" class="modal-tree"></v-jstree>
                </Col>
                <Col span="14">
                    <map-rule-container ref="mapContainer"
                                        v-bind:isShow="isShow"
                                        v-on:postMapData="postMapData"
                                        :editMapJson="editMapJson" style="overflow: hidden"></map-rule-container>
                </Col>
                <Col span="5">
                    <fieldset class="ex-box-title">
                        <legend>已选道路</legend>
                    </fieldset>
                    <div class="tag-container">
                        <Tag v-for="item in selectTagList" :name="item.cloudName" :key="item.id" class="tag-item">{{item.cloudName}}</Tag>
                        <!--<Tag type="dot" :closable="item.closable" v-for="item in tagList" :name="item.name" :key="item.id">{{item.name}}</Tag>-->
                    </div>
                </Col>
            </Row>


        </div>
        <div slot="footer">
            <div class="layout-modal-button" v-if="pageState !==7 ">
                <Button type="success" icon="md-checkmark-circle" :loading="mapModal.mLoading"
                        @click="handleSave">
                    <!--@click="handleSave('tableModal')">-->
                    {{saveBtnText}}
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
import mapRuleContainer from '../mapObj/bak/map-rule-container'

//接口地址
const PostDataUrl = require('../../../libs/api').PostDataUrl   //页面数据交换接口
const PostTreeUrl = require('../../../libs/api').PostTreeUrl
const PostCfgUrl = require('../../../libs/api').PostCfgUrl

export default {
    components: {
        sTree,
        VJstree,
        mapRuleContainer
    },
    props: ['modalCfg', 'inputData', 'gridCfg', 'tableData', 'mapDataList', 'tagList', 'modalMapCfg'],
    data() {
        return {
            Split: 0.75,
            edit: false,
            mapModal: this.$props.modalCfg, //传递进来的配置文件
            sGridCfg: this.$props.gridCfg,
            sTableData: this.$props.tableData,

            //数据交换池
            postValue: {
                pageIndex: 1,
                pageSize: 20,
                pageTotal: 0,
                buttonId: 0,
                menuId: this.$route.meta.id,
                searchModel: {},
                editModel: {} //传递进来或初始化的输入框
            },


            //辅助数据池
            pageState: 0, //页面状态，根据传进来的bId来判断
            saveBtnText: '保存',
            ruleOver: true,
            iptId: {
                'dept': {
                    iptValue: '',
                    iptId: null
                }
            },

            //下拉树的数据
            treeModalData: [],
            //地图的点线面数据
            mapData: {
                mapMarkerList: [],
                mapPolygonList: [],
                mapPolylineList: []
            },
            //弹窗的配置 单独请求的
            mapModalCfg:{},
            sRuleType: null,
            isShow: false,
            editMapJson: [],
            selectTagList: []
        }
    },
    mounted() {
        // this.$refs["tableModal"].resetFields()
    },
    methods: {
        //设置数组不选择
        unSelectChildren(arr){
            for(let key in arr){
                arr[key].selected = false
                if(arr[key].children){
                    this.unSelectChildren(arr[key].children)
                }
            }
        },
        //点击树节点请求地图数据进行渲染
        treeNodeClick(e, i){
            let self = this
            let sV = true
            let treeValue = {}
            // let treeNodes = []
            if(!e.data.selected) {
                sV = false
            }
            // if(e.data.data.type == 'cloudMap'){
            //     treeNodes.push(e.data.id)
            // }else{
            //     if(e.data.children){
            //         if(e.data.children[0].data.type == 'cloudMap'){
            //             let dChildren = e.data.children
            //             for(let key in dChildren){
            //                 treeNodes.push(dChildren[key].id)
            //             }
            //         } else {
            //             let cNode = e.data.children
            //             if(cNode.children) {
            //                 let dDChildren = cNode.children
            //                 for(let key in dDChildren){
            //                     treeNodes.push(dDChildren[key].id)
            //                 }
            //             }
            //         }
            //         // treeValue = {searchModel: {deptIds: [e.data.id]}}
            //     }
            // }
            let cIds = []
            if(i.data.type == 'cloudMap'){
                cIds.push(i.id)
            } else {
                if (i.children){
                    cIds = Util.getTreeNodesByName(i.children, cIds, 'cloudMap')
                }
            }


            if(cIds.length <= 0){
                // i.selected = false
                if(i.children){
                    this.unSelectChildren(i.children)
                }
                self.$Notice.error({
                    title: '温馨提示！',
                    desc: '无云图类型！请重新选择',
                    duration: 5
                })
                return
            }


            treeValue = {
                searchModel: {ids: cIds},
                menuId: 1884
            }
            Util.ojax.post(PostDataUrl + '/1884', treeValue).then(function (response) {
                if (response.data.code == 0) {
                    self.initTagList(response.data.detail.list, sV)
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
        //保存按钮操作
        handleSave(name) {
            this.mapModal.showModal = false
            this.$emit('mapModalData', this.editMapJson)
        },
        //关闭组件，复原数据
        handleCancel() {
            var self = this
            if(self.sRuleType){
                self.$emit('selectMapModal', {showModal: false, tagList: self.tagList, ruleType: self.sRuleType})
            }
            self.mapModal.showModal = false
            self.selectTagList = []
            self.editMapJson = []
        },
        //初始化树结构
        initTree(){
            let self = this
            if(self.sRuleType){
                Util.ojax.post(PostTreeUrl, {ruleType: self.sRuleType, tree: 'alarmRule'}).then(function (response) {
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
        reloadPage(){
            setTimeout(function(){
                window.location.reload()
            }, 200)
        },
        //渲染右侧的路线列表
        initRightList(){

        },
        postMapData(){},

        initTagList(v, sV){
            let self = this
            if(sV){
                if(self.editMapJson.length == 0){
                    self.editMapJson = v
                }else{
                    // self.editMapJson = self.editMapJson.concat(v)
                    self.editMapJson = self.uniqueArray(self.editMapJson.concat(v))
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

        /*临时*/
        // hanldeSelectTree(v) {
        //     this.postValue.editModel[v.name] = v.value
        // },
        // handleTableData(v) {
        // }
    },
    watch: {
        modalCfg: {
            handler(n) {
                if (n) {
                    this.mapModal = n
                    this.postValue.buttonId = parseInt(n.buttonId)
                    this.pageState = this.postValue.buttonId
                    if(!n.showModal) {
                        this.handleCancel()
                    }
                    this.$emit('mapModalCfg', n)
                }
            },
            immediate: true,
            deep: true
        },
        inputData: {
            handler(n) {
                console.warn('inputData-modal-cfg')
                console.log(n)
                if (n) {
                    this.postValue.editModel = n
                    if (!this.ruleOver) {
                        this.$refs["tableModal"].resetFields()
                    }
                }
            },
            immediate: true,
            deep: true
        },
        gridCfg: {
            handler(n) {
                console.warn('gridCfg-modal-cfg')
                console.log(n)
                if (n) {
                    this.sGridCfg = n
                    this.postValue.pageIndex = this.sGridCfg.pageIndex
                    this.postValue.pageSize = this.sGridCfg.pageSize
                    this.postValue.pageTotal = this.sGridCfg.pageTotal
                }
            },
            immediate: true,
            deep: true
        },
        tableData: {
            handler(n) {
                console.warn('tableData-modal-cfg')
                console.log(n)
                if (n) {
                    this.sTableData = n
                }
            },
            immediate: true,
            deep: true
        },
        //清空数据
        mapModal: {
            handler(n) {
                if (!n.showModal) {
                    for(let key in this.mapData) {
                        this.mapData[key] = []
                    }
                }
            },
            immediate: true,
            deep: true
        },
        modalMapCfg: {
            handler(n) {
                if(n){
                    this.sRuleType = n.ruleType
                    this.initTree()
                    this.isShow = n.showModal
                    this.selectTagList = n.tagList
                }
            },
            immediate: true,
            deep: true
        },
        tagList: {
            handler(n) {
                this.selectTagList = n
                if(n){
                    this.editMapJson = n
                }else{
                    this.editMapJson = []
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