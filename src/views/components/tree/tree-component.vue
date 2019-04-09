<template>
    <div style="height: 100%;width: 100%">
        <Tabs @on-click="switchTree">
            <TabPane :label="item.treeName" :item.title="item.treeName" v-for="item,index in pageTree"
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

            <!--<VJstree :data='treeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"-->
                     <!--ref="tree" :allow-batch="true"-->
                     <!--:show-checkbox="true" :multiple="true"-->
                     <!--v-if="treeData" @item-click="treeNodeClick"/>-->

            <VJstree :data='treeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
                     ref="tree" :allow-batch="pageTree[treeIndex].checkbox"
                     :show-checkbox="pageTree[treeIndex].checkbox" :multiple="pageTree[treeIndex].multiple"
                     v-if="treeData&&pageTree" @item-click="treeNodeClick"/>

        </div>
        <Spin size="large" fix v-if="spinShow">
            <Icon type="ios-loading" size=18 class="componet-loading"></Icon>
            <div>Loading</div>
        </Spin>

    </div>
</template>
<script>/* eslint-disable linebreak-style,complexity,no-var,brace-style,no-console,comma-spacing,indent,no-cond-assign,quotes,init-declarations */
//调用依赖库
import Util from '../../../libs/util'

//调用vuex状态管理
import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'

//页面使用组件
import VJstree from 'vue-jstree'
import pLoading from '../common/pageLoading'

//固定的树的查询接口
const GetBaseTreeUrl = require('../../../libs/api').GetBaseTreeUrl

export default {
    components: {
        VJstree,
        pLoading
    },
    data() {
        return {
            treeData: null,
            storeTree: null,
            spinShow: false,
            searchValue: null,
            searchTreeFunc: false,
            noTreeDataText: '',
            treeIndex: 0
        }
    },
    mounted() {

    },
    methods: {
        //切换树的tab，第一次使用为树的初始化
        switchTree(e) {
            let self = this
            let index = parseInt(e)
            if (!self.pageTree) {
                return
            }
            self.treeIndex = index
            self.treeData = []
            self.spinShow = true
            Util.ojax.post(GetBaseTreeUrl, {treeName: self.treeValue}).then(function (res) {
                if (res.data.code == 0) {
                    self.treeData = res.data.detail
                    self.storeTree = res.data.detail  //缓存一份原始的树的数据
                }
                self.spinShow = false
            }).catch(function (error) {
                self.spinShow = false
            })


        },
        //恢复树
        refreshTree() {
            let self = this
            self.treeData = self.storeTree
            self.searchValue = null
            // self.switchTree()
        },
        //搜索树节点
        searchTreeData() {
            let self = this
            clearTimeout(self.searchTreeFunc)
            self.searchTreeFunc = setTimeout(function () {
                self.treeData = self.storeTree
                self.inputKeyUpFunc(self.searchValue)
            }, 250)
        },
        inputKeyUpFunc(text) {
            let self = this
            let newTreeData = []

            console.log(text)
            if (text == '' || !text) {
                self.treeData = self.storeTree
                return false
            }
            // ``
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
                self.treeData = newTreeData
            })

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
            let treeType = self.pageTree[self.treeIndex].treeValue
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
            if(self.searchParmas){
                for(let i in self.searchParmas){
                    searchPamars[i] = self.searchParmas[i]
                }
            }
            self.queryGridData({
                menuId: self.menuId,
                pamars: searchPamars,
                queryApi: self.queryApi,
            })
        },

        ...mapMutations('tableState', [
            'initPageTree',  // 初始化树
            'queryGridData', // 查询表格数据
            'setSearchParams', //设置查询条件
        ])

    },
    computed: {
        menuId() {
            return this.$route.meta.menuId
        },
        queryApi() {
            console.log('处理api地址')
            const self = this
            const {pageCfg} = self
            let queryApi
            for (const i in pageCfg) {
                if (pageCfg[i].menuId === self.menuId) {
                    queryApi = pageCfg[i].queryApi
                }
            }
            console.log(queryApi)
            return queryApi
        },
        treeValue() {
            let self = this
            return self.pageTree[self.treeIndex].treeValue
        },
        pageTree() {
            const self = this
            const menuId = self.menuId
            const pageCfg = this.pageCfg
            self.treeData = []
            self.spinShow = true
            if(!pageCfg){
                return
            }
            for (var i in pageCfg) {
                if (pageCfg[i].menuId == self.menuId) {
                    Util.ojax.post(GetBaseTreeUrl, {treeName: pageCfg[i].cfg.pageTree[self.treeIndex].treeValue}).then(function (res) {
                        console.log(res)
                        if (res.data.code == 0) {
                            self.treeData = res.data.detail
                            self.storeTree = res.data.detail
                        }
                        self.spinShow = false
                    }).catch(function (error) {
                        self.spinShow = false
                    })
                    return pageCfg[i].cfg.pageTree
                }
            }
        },
        ...mapGetters('tableState', [
            'pageCfg',
            'searchParmas'
        ])
    },
    watch: {}
}
</script>
