<template>
    <div style="position: relative">
        <Input v-model="iptValue" suffix="ios-arrow-down" :placeholder="placeholder" readonly size="small"
               @on-click="showTreeLayout" @on-focus="showTreeLayout"
               @on-change="hideTreeLayout" :disabled="disabled" :name="name"/>
        <!--<Input style="display:none;" v-model="iptId"/>-->
        <div class="select-tree" v-show="treeShow">
            <Input @on-change="inputKeyUp" size="small" placeholder="请输入关键字" v-model="searchText"/>
            <v-jstree :data='treeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
                      ref="modalSelectTree"
                      :allow-batch="false" :show-checkbox="false" :multiple="false"
                      @item-click="treeNodeClick"></v-jstree>
        </div>
    </div>
</template>


<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase */

/**
 * 下拉树选择
 * **/

import VJstree from 'vue-jstree'
import Util from '../../../libs/util'

const GetBaseTreeUrl = require('../../../libs/api').GetBaseTreeUrl

export default {
    components: {
        VJstree
    },
    props: ['data', 'show', 'name', 'placeholder', 'disabled', 'option', 'treeType'],
    data() {
        return {
            treeData: [],
            treeShow: false,
            iptValue: null,
            iptId: null,
            searchTreeFunc: null,
            searchText: '',
            selectTreeFunc: null
        }
    },
    mounted() {
        this.$nextTick(function () {})
    },
    methods: {
        // 点击输入框 出现下拉树
        showTreeLayout() {
            const self = this
            self.treeShow = true

            Util.ojax.post(GetBaseTreeUrl, {treeName: self.treeType}).then(function (res) {
                console.log(self.treeType)
                console.log(res.data)
                if (res.data.code == 0) {
                    console.log(res.data.detail)
                    self.treeData = res.data.detail
                }

            }).catch(function (error) {
                console.log(error)
            })
        },
        // 隐藏树
        hideTreeLayout() {
            this.treeShow = false
        },

        initTree() {
            let self = this
            let treeName = '$tree_' + self.treeType
            let localTree = localStorage.getItem(treeName)
            //判断本地是否有树的缓存
            if (localTree) {
                self.treeData = JSON.parse(localTree)
            } else {
                Util.ojax.post(GetBaseTreeUrl, {treeName: self.treeType}).then(function (res) {
                    console.log(res)
                    self.treeData = res.data.detail
                    localStorage.setItem(treeName, JSON.stringify(res.data.detail))
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
        treeNodeClick(e) {
            let self = this
            console.log(e)
            self.iptValue = e.data.text
            self.iptId = e.data.id
            self.treeShow = false
            self.$emit('toTree', {name: self.name, value: e.data.id, text: e.data.text, node: e})
        },
        getAllJson(jsons, name) {
            let self = this
            let id = self.$props.data
            for (var key in jsons) {
                if (!(jsons[key] instanceof Object)) {
                    if (jsons[key] == id && key == name && jsons['text']) {
                        self.iptValue = jsons['text']
                        self.iptId = jsons['id']
                    }
                } else {
                    self.getAllJson(jsons[key], name); //如果是Object则递归
                }
            }
        },
        inputKeyUp: function () {
            let self = this
            if (self.selectTreeFunc) {
                clearTimeout(self.selectTreeFunc)
                self.initTree()
            }
            self.selectTreeFunc = setTimeout(function () {
                self.inputKeyUpFunc()
            }, 250)
        },
        inputKeyUpFunc() {
            let self = this
            let text = this.searchText
            if (text == '' || !text) {
                return
            }
            let newTreeData = []
            const patt = new RegExp(text);
            this.$refs.modalSelectTree.handleRecursionNodeChilds(this.$refs.modalSelectTree, function (node) {
                if (text !== '' && node.model !== undefined) {
                    const str = node.model.text
                    if (patt.test(str)) {
                        // 如果有父级节点 找到上一层的父级节点 拼新树
                        if (node.model.pid) {
                            if (newTreeData.length > 0) {
                                // 如果查询的新的树的数据集合有数据 进行比对 将这个节点加到对应的父节点里面去
                                let oParams = self.addNewChild(newTreeData, node.model)
                                if (oParams.checkNodeValue) {
                                    newTreeData = oParams.oldData
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
        }
    },
    computed: {
        Type() {
            console.log(this.treeType)
            return this.treeType
        }
    },
    watch:{
        data: {
            handler(data) {
                if(data == null || !this.show){
                    this.iptValue = null
                    this.treeData = null
                    this.treeShow = false
                }else{
                    this.initTree()
                    this.treeShow = false
                    this.getAllJson(this.treeData, 'id')
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style>
    .select-tree {
        position: absolute;
        left: 0;
        top: 32px;
        z-index: 2;
        width: 100%;
        max-height: 400px;
        overflow: scroll;
        border: 1px solid #c0c1d8;
        min-height: 100px;
        background-color: #fff;
        border-radius: 0 0 3px 3px;
        box-shadow: 3px 3px 3px rgba(0, 0, 0, .15);
    }
</style>