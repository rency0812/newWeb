<template>
    <div class="layout-map-tab-group" :class="{active:active}" style="height: 100%;">
        <div class="tab-li" @click="switchTab">
            <Tooltip :content="tabLabel" placement="left">
                <Icon :type="tabIcon"/>
            </Tooltip>
        </div>
        <div class="tab-componet" v-show="active" :style="{top: tableIndex * (-32) + 'px'}">
            <h2>车辆视频 &nbsp;&nbsp;<span>在线：80辆</span></h2>
            <div class="group-box layout-tree">
                <div class="layout-tree-content" style="height:99%">
                    <div class="search-box">
                        <el-input size="mini" class="filterInput"
                                  placeholder="输入关键字进行过滤"
                                  v-model="filterText">
                        </el-input>
                    </div>
                    <div class="layout-tree-mask" style="overflow-x: auto;width: 100%">
                        <!--                        <VJstree :data='treeData' :whole-row="true" :loading-text="'loading....'" :collapse="true"-->
                        <!--                                 ref="tree" :allow-batch="true"-->
                        <!--                                 :show-checkbox="true" :multiple="true"-->
                        <!--                                 v-if="treeData" @item-click="treeNodeClick"/>-->
                        <!--                        <Spin size="large" fix v-if="spinShow">-->
                        <!--                            <Icon type="ios-loading" size=18 class="componet-loading"></Icon>-->
                        <!--                            <div>Loading</div>-->
                        <!--                        </Spin>-->
<!--                        <Tree :data="treeData" show-checkbox ref='videoTree' @on-check-change="getCheckedNode"></Tree>-->
                            <el-tree :data="treeData" :props="defaultProps"
                                     style="height: 100%;padding-bottom: 20px;overflow-x: auto"
                                     node-key="id"
                                     empty-text="暂无数据"
                                     highlight-current
                                     show-checkbox
                                     ref="vechileVideoTree"
                                     @check="getCheckedNode"
                                     :filter-node-method="filterNode"
                                     :expand-on-click-node="true">
<!--                              <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>
                                  <img v-if="Number(data.type)===1" style="width: 12px;height: 12px;margin-top: 4px"
                                       src="~sysStatic/images/default/department.png" alt="">
                                  <img v-if="Number(data.type)===2" style="width: 12px;height: 12px;margin-top: 4px"
                                       src="~sysStatic/images/default/person.png" alt="">
                                  {{ node.label }}
                                </span>
                              </span>-->
                            </el-tree>
                    </div>
                </div>
                <!--<h2>云台控制</h2>-->
                <!--<div class="layout-monitor-cloud">-->
                <!--&lt;!&ndash; 这里放云台控制面板组件  后面记得加上  并加上显示/隐藏控制 &ndash;&gt;-->
                <!--<div>云台控制面板组件</div>-->
                <!--</div>-->
            </div>
        </div>
    </div>
</template>

<script>
    import {Tree,Input} from 'element-ui';
    import Vue from 'vue'
    //调用依赖库
    import Util from '../../../../libs/util'
    import {mapState, mapMutations, mapGetters} from 'vuex'
    //固定的树的查询接口
    const GetBaseTreeUrl = require('../../../../libs/api').GetBasechannelTreeUrl
    //页面使用组件
    // import VJstree from 'vue-jstree'
    // import pLoading from '../../common/pageLoading'

    export default {
        props: ['api', 'active', 'tableIndex', 'tabLabel', 'tabIcon', 'tabType'],
        data() {
            return {
                filterText: '',
                treeData: [],
                storeTree: [],
                treeIndex: 0,
                spinShow: false,
                defaultProps: {
                    children: 'children',
                    label: 'title'
                }
            }

        },
        components: {
            'el-tree': Tree,
            'el-input': Input,
        },
        created(){

        },
        mounted() {
            this.initTree()
        },
        watch: {
            filterText(val) {
                this.$refs.vechileVideoTree.filter(val)
            },

            getRetTree: function(newValue, oldValue) {
                    if(newValue.length === 0){
                        this.setCheckedKeys()
                    }
                }

        },
        computed: {
            ...mapGetters('monitorState', [
                'getRetTree'
            ]),
        },
        methods: {
            //映射父组件的tab切换
            switchTab() {
                this.$emit('switchTabMain', {index: this.tableIndex, type: this.tabType})
            },
            initTree() {
                let self = this
                let treeType = 'departmentTree'
                self.spinShow = true
                Util.ojax.post(GetBaseTreeUrl).then(function (res) {
                    self.treeData = self.dealTreeData(res.data.detail)
                    self.storeTree = res.data.detail
                    self.spinShow = false
                }).catch(function (error) {
                    // console.log(error)
                    self.spinShow = false
                })
            },
            setCheckedKeys() {
                this.$refs.vechileVideoTree.setCheckedKeys([])
            },
            // 过滤节点
            filterNode(value, data) {
                if (!value) return true;
                if(!data.title) return false
                return data.title.indexOf(value) !== -1;
            },
/*
            //切换树
            switchTree(e) {
                let self = this
                let index = parseInt(e)
                let treeType = 'departmentTree'
                self.treeIndex = index
                self.treeData = []
                self.spinShow = true
                Util.ojax.post(GetBaseTreeUrl, {treeName: treeType}).then(function (res) {
                    console.log(res)
                    self.treeData = res.data.detail
                    self.storeTree = res.data.detail
                    self.spinShow = false
                }).catch(function (error) {
                    // console.log(error)
                    self.spinShow = false
                })
            },
            //恢复树
            refreshTree() {
                let self = this
                self.treeData = self.storeTree
                self.searchValue = null
            },
            //搜索树节点
            searchTreeData() {
                let self = this
                clearTimeout(self.searchTreeFunc)
                self.searchTreeFunc = setTimeout(function () {
                    self.inputKeyUpFunc(self.searchValue)
                }, 250)
            },
            inputKeyUpFunc(text) {
                let self = this
                let newTreeData = []
                if (text == '' || !text) {
                    self.treeData = self.storeTree
                    return false
                }
                const patt = new RegExp(text);
                this.$refs.tree.handleRecursionNodeChilds(this.$refs.tree, function (node) {
                    if (text !== '' && node.model !== undefined) {
                        const str = node.model.text
                        if (patt.test(str)) {
                            // 如果有父级节点 找到上一层的父级节点 拼新树
                            if (node.model.pid) {
                                console.log(node.$el)
                                if (newTreeData.length > 0) {
                                    // 如果查询的新的树的数据集合有数据 进行比对 将这个节点加到对应的父节点里面去
                                    let oParams = self.addNewChild(newTreeData, node.model)

                                    if (oParams.checkNodeValue) {
                                        newTreeData = oParams.oldData
                                        // newTreeData.push(oParams.oldData)
                                    } else {
                                        newTreeData.push(node.$parent.model)
                                        newTreeData[newTreeData.length - 1].opened = true
                                        newTreeData[newTreeData.length - 1].children = []
                                        newTreeData[newTreeData.length - 1].children.push(node.model)
                                    }
                                } else {
                                    newTreeData.push(node.$parent.model)
                                    newTreeData[newTreeData.length - 1].opened = true
                                    newTreeData[newTreeData.length - 1].children = []
                                    // newTreeData[newTreeData.length - 1].addChild(node.model)
                                    newTreeData[newTreeData.length - 1].children.push(node.model)
                                }
                            } else {
                                newTreeData.push(node.$parent.model)
                            }
                        }
                    }
                })
                self.treeData = newTreeData
            },
            //组建搜索结果
            addNewChild(oldData, addData) {
                let self = this
                let checkNodeValue = false
                for (let i = 0; i < oldData.length; i++) {
                    if (oldData[i].id == addData.pid) {
                        oldData[i].opened = true
                        // oldData[i].addChild(addData)
                        oldData[i].children.push(addData)
                        oldData[i].children = Util.uniqueArrayId(oldData[i].children)
                        checkNodeValue = true
                        break
                    }
                }
                if (!checkNodeValue) {
                    for (let j = 0; j < oldData.length; j++) {
                        if (oldData[j].children) {
                            self.addNewChild(oldData[j].children, addData)
                        }
                    }
                }
                let oParam = {
                    oldData: oldData,
                    checkNodeValue: checkNodeValue
                }
                return oParam
            },
            //点击树
            treeNodeClick(n, i) {
                console.log(i)
                let self = this
                let treeType = 'departmentTree'
                let cIds = []
                if (i.children) {
                    cIds = Util.getTreeNodesChildren(i.children, cIds)
                }
                cIds.push(i.id)
                let searchPamars = {
                    menuId: self.menuId,
                    treeType: treeType,
                    treeNodes: cIds
                }
                // self.searchTreeNode(searchPamars)
            },
*/

            // 处理后台返回的treeData数据
            dealTreeData(tree) {
                let arr = []
                let self = this
                if (tree && tree.length !== 0) {
                    tree.forEach(item => {
                        let obj = {}
                        obj.title = item.text
                        obj.expand = item.opened
                        obj.data = item.data
                        obj.type = item.type
                        obj.pid = item.pid
                        obj.id = item.id
                        obj.children = self.dealTreeData(item.children)// 递归调用
                        arr.push(obj)
                    });
                }
                return arr
            },
            ...mapMutations('monitorState', [
                'vechileVideoData'
            ]),
            // 选中节点的处理事件
            getCheckedNode(allNodes,checkedNodes){
                // 存储选中节点的数据
                this.vechileVideoData(checkedNodes.checkedNodes)
            }
        }
    }
</script>
<style>
    .el-tree>.el-tree-node{
        min-width:100%;
        display: inline-block;
    }
</style>