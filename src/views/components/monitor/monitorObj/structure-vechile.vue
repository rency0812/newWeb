<template>
    <div class="layout-map-tab-group" :class="{active:active}" style="height: 100%;">
        <div class="tab-li" @click="switchTab">
            <Tooltip :content="tabLabel" placement="left">
                <Icon :type="tabIcon"/>
            </Tooltip>
        </div>
        <div class="tab-componet" v-show="active" :style="{top: tableIndex * (-32) + 'px'}">
            <h2>组织架构 &nbsp;&nbsp; </h2>
            <div class="group-box layout-tree">
                <div class="layout-tree-content" style="height: 100%">
                    <div class="search-box" style="white-space: nowrap;position: relative;">
                        <Input v-model="searchValue" size="small" search autofocus enter-button
                               placeholder="搜索企业或车牌号"
                               class="fl" style="max-width: 80%;"
                               @on-change="searchTreeData" @on-click="searchTreeData" @on-enter="searchTreeData"/>
                        <Tooltip content="刷新列表" style="margin: 6px 0 0 7px">
                            <Button icon="md-refresh" size="small" @click="refreshTree"/>
                        </Tooltip>
                    </div>
                    <div class="layout-tree-mask" style="padding: 5px;">
                        <VJstree :data='treeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
                                 ref="tree" :allow-batch="true"
                                 :show-checkbox="true" :multiple="true"
                                 v-if="treeData" @item-click="treeNodeClick"/>
                        <Spin size="large" fix v-if="spinShow">
                            <Icon type="ios-loading" size=18 class="componet-loading"></Icon>
                            <div>Loading</div>
                        </Spin>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //调用依赖库
    import Util from '../../../../libs/util'

    //固定的树的查询接口
    const mapMonitorUrl = require('../../../../libs/api').mapMonitor

    //页面使用组件
    import VJstree from 'vue-jstree'
    import pLoading from '../../common/pageLoading'

    export default {
        props: ['api',   'tableIndex', 'tabLabel', 'tabIcon', 'tabType','page'],
        data() {
            return {
                active:false,
                searchValue: null,
                treeData: null,
                storeTree: null,
                treeIndex: 0,
                spinShow: false
            }
        },
        components: {
            VJstree,
            pLoading
        },
        mounted() {
            this.initTree();
            let self =this;

            this.page.$on('switchTab',function (e) {
                if(e.uid !== self._uid){
                    self.active = false;
                }
                else {
                    self.active =true;
                }
            });
        },
        computed: {


        },

        methods: {
            //映射父组件的tab切换
            switchTab() {

                this.page.$emit('switchTab',{uid: this._uid, tabFlag: 'map'});

            },

            
            initTree() {
                let self = this
                let treeType = 'departmentTree'
                self.spinShow = true
                Util.ojax.post(mapMonitorUrl.vehTreeUrl, {}).then(function (res) {
                    console.log(res)
                    self.treeData = res.data.detail
                    self.storeTree = res.data.detail
                    self.spinShow = false
                }).catch(function (error) {
                    // console.log(error)
                    self.spinShow = false
                })
            },

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
            }
        }
    }
</script>

<style scoped>

</style>
