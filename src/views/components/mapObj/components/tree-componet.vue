<template>
    <div>

        <Tabs @on-click="switchTree" v-if="pageTree">
            <TabPane :label="item.treeTitle" :item.title="item.treeTitle" v-for="item,index in pageTree"
                     :key="index"/>
        </Tabs>

        <div class="layout-tree-content">
            <div class="search-box" style="white-space: nowrap">
                <Input v-model="searchValue" size="small" search autofocus enter-button
                       :placeholder="$t('formText.searchTip')"
                       class="fl" style="max-width: 80%;"
                       @on-change="searchTreeData" @on-click="searchTreeData" @on-enter="searchTreeData"/>
                <Button icon="md-refresh" size="small" style="margin: 1px 0 0 7px" @click="refreshTree">
                    {{$t('formText.fresh')}}
                </Button>
            </div>

            <VJstree :data='treeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
                     ref="tree" :allow-batch="pageTree[treeIndex].checkBox"
                     :show-checkbox="pageTree[treeIndex].checkBox" :multiple="pageTree[treeIndex].multiple"
                     v-if="treeData" @item-click="treeNodeClick"/>

        </div>

        <Spin size="large" fix v-if="spinShow">
            <Icon type="ios-loading" size=18 class="componet-loading"></Icon>
            <div>Loading</div>
        </Spin>

    </div>
</template>
<script>/* eslint-disable linebreak-style,complexity,no-var,brace-style,no-console,comma-spacing,indent,no-cond-assign,quotes,init-declarations */
//调用依赖库
import Util from '../../../../libs/util'

//调用vuex状态管理
import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'

//页面使用组件
import VJstree from 'vue-jstree'
import pLoading from '../../common/pageLoading'

//调用的接口
const GetPageTreeCfgUrl1 = require('../../../libs/api').GetPageTreeCfgUrl1
const GetPageTreeCfgUrl2 = require('../../../libs/api').GetPageTreeCfgUrl2

export default {
    components: {
        VJstree,
        pLoading
    },
    data() {
        return {
            pageTree: null,
            treeData: null,
            storeTree: null,
            spinShow: false,
            searchValue: null,
            searchTreeFunc: false,
            noTreeDataText: '',
            treeIndex: 0
        }
    },
    methods: {
        // 初始化左侧树(单个)
        initLeftTree() {
            let self = this
            let treeType = this.pageTree.tree
            self.spinShow = true
            Util.ajax.get(GetPageTreeCfgUrl1, {tree: treeType}).then(function (res) {
                self.treeData = res.data
                self.storeTree = res.data
                self.initPageTree({
                    index: index,
                    treeData: res.data
                })
                self.spinShow = false
            }).catch(function (error) {
                self.spinShow = false
            })
        },
        //切换树
        switchTree(e) {
            let self = this
            let index = parseInt(e)
            let treeType = self.pageTree[index].tree
            let treeData = self.pageTree[index].treeData
            self.treeIndex = index
            //这里注意要修改成正式的树接口哦.....也不需要做判断了。。。。。。。。。
            let GetPageTreeCfgUrl = GetPageTreeCfgUrl1
            switch (e) {
                case 0:
                    GetPageTreeCfgUrl = GetPageTreeCfgUrl1
                    break
                case 1:
                    GetPageTreeCfgUrl = GetPageTreeCfgUrl2
                    break
            }
            self.treeData = []
            self.spinShow = true
            if (treeData == undefined || treeData == null || treeData.length <= 0) {
                Util.ajax.get(GetPageTreeCfgUrl, {tree: treeType}).then(function (res) {
                    // console.log(res)
                    self.treeData = res.data
                    self.storeTree = res.data
                    self.initPageTree({
                        index: index,
                        treeData: res.data
                    })
                    self.spinShow = false
                }).catch(function (error) {
                    // console.log(error)
                    self.spinShow = false
                })
            } else {
                self.treeData = this.pageTree[e].treeData
                self.storeTree = this.pageTree[e].treeData
                self.spinShow = false
            }
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
            // console.log(self.pageTree[self.treeIndex].tree)
            let treeType = self.pageTree[self.treeIndex].tree
            let cIds = []
            if (i.children) {
                cIds = Util.getTreeNodesChildren(i.children, cIds)
            }
            cIds.push(i.id)
            let searchPamars = {
                menuId: self.menuId,
                treeType: treeType,
                treeId: cIds
            }
            self.searchTreeNode(searchPamars)
        },

        ...mapMutations('mapState', [
            'initPageTree'
        ]),

        ...mapActions('mapState', [
            'searchTreeNode'
        ])

    },

    computed: {
        menuId() {
            return this.$route.meta.menuId
        },
        ...mapGetters('mapState', [
            'pageCfg'
        ])
    },

    watch: {
        pageCfg: {
            handler(data) {
                let self = this
                let menuId = self.menuId
                for (var i in data) {
                    if (menuId == data[i].menuId) {
                        self.pageTree = data[i].pageCfg.pageTree
                        self.switchTree(self.treeIndex)
                    }
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>