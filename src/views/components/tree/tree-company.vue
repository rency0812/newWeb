<style>

</style>
<template>
    <div style="height: 100%;">
        <Input v-model="searchKey" size="small" icon="search" placeholder="请输入搜索关键字..."
               style="margin:7px auto;box-shadow: 0 0 15px rgba(0,0,0,.1)"
               @on-keypress="handleSearchTree"></Input>
        <div class="layout-tree-content">
            <Tree :data="treeData" v-model="treeData" ref="Tree" :show-checkbox="treeCheck"
                  @on-select-change="handleSelectTree"></Tree>
        </div>
    </div>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase,no-unreachable */
import Util from '../../../libs/util'

const GetTreeCompanyUrl = require('../../../libs/api').GetTreeCompanyUrl

export default {
    data() {
        return {
            treeCheck: false,
            treeData: [],
            treeStore: [],
            treeParams: [],
            searchKey: null,
            searchTemp: []
        }
    },
    methods: {
        handleSelectTree() {
            let self = this
            let selectData = this.$refs.Tree.getSelectedNodes()
            let newArr = new Array()
            for (var i in selectData) {
                newArr.push(selectData[i].name)
                if (selectData[i].name === 'wuhan') {
                    self.treeParams = ['wuhan']
                    console.log(JSON.stringify(self.treeParams))
                    return
                }
                if (selectData[i].children && selectData[i].children.length > 0) {
                    for (var j in selectData[i].children) {
                        newArr.push(selectData[i].children[j].name)
                        if (selectData[i].children[j].children && selectData[i].children[j].children.length > 0) {
                            for (var k in selectData[i].children[j]) {
                                newArr.push(selectData[i].children[j].children[k].name)
                            }
                        }
                    }
                }
                self.treeParams = newArr
            }
            self.treeParams = self.uniqueArray(self.treeParams)
            this.$emit('refreshtable', self.treeParams)
        },
        getQuery(obj, sKey) {
            var self = this
            obj = obj.filter((item) => {
                if (item.title.indexOf(sKey) > -1) {
                    item.expand = true
                    self.searchTemp.push(item)
                    return item
                }
                if (item.hasOwnProperty('children') && item.children.length > 0) {
                    self.getQuery(item.children, sKey)
                }
            })
            return self.searchTemp
        },
        handleSearchTree() {
            let searchKey = this.searchKey
            let treeStore = this.treeStore
            let self = this
            self.searchTemp = []
            self.treeData = self.getQuery(treeStore, searchKey)
        },
        uniqueArray(array) {
            var newArr = [array[0]]
            for (var i = 1; i < array.length; i++) {
                var Item = array[i]
                var repeat = false
                for (var j = 0; j < newArr.length; j++) {
                    if (Item == newArr[j]) {
                        repeat = true
                        break
                    }
                }
                if (!repeat) {
                    newArr.push(Item)
                }
            }
            return newArr
        }
    },
    mounted() {
        let self = this
        if (localStorage.$tree_company) {
            self.treeStore = JSON.parse(localStorage.$tree_company)
            self.treeData = self.treeStore
        } else {
            Util.ajax.get(GetTreeCompanyUrl, {params: {Account:JSON.parse( localStorage.getItem('$userstatus')).Account}}).then(function (response) {
                console.log(response.data.treeData)
                self.treeStore = response.data.treeData
                self.treeData = self.treeStore
                localStorage.$tree_company = JSON.stringify(response.data.ReturnValue.treeData)
            }).catch(function (error) {
                console.log(error)
            })
        }
    },
    computed: {}
}


</script>