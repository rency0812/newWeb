<template>
  <div>
    <div class="modal-tree-container">
      <VJstree :data='treeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
        ref="functionTree" :allow-batch="true"
        :show-checkbox="true" :multiple="true" @item-click="functionTreeNodeClick"/>
    </div>
  </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style */
import VJstree from 'vue-jstree'
import Util from '../../../../libs/util.js'
const api = require('../../../../libs/api')
let treeUrl = api.GetBaseTreeUrl

export default {
  name: 'pop-tree',
  props: ['type'],
  data () {
    return {
      treeData: [],
      funcData: [],
      roleData: [],
      errIds: [],
      spinShow: false,
      appIds: []
    }
  },
  components: {
    VJstree
  },
  methods: {
    arrFun(arr,newArr){
      //console.log(newArr)
      if(!arr||!arr.length){
        return
      }
      arr.forEach(v => {
        if(v.selected){
          newArr.push(v.id)
        }
        if(v.children){
          this.arrFun(v.children, newArr)
        }
      })
    },
    // 功能权限树点击
    functionTreeNodeClick(node, item){
      // console.log(node,item)
      let self = this
      if(this.type === 'menuTree'||this.type === 'funcRole'){
        this.funcData = []
        this.arrFun(this.treeData,this.funcData)
        //console.log(this.funcData)
      }
      if(this.type === 'departmentTree' || this.type === 'dataRole'){
        self.roleData = []
        this.arrFun(this.treeData,this.roleData)
      }
      if(this.type === 'menuTreeApp'){
        self.appIds = []
        this.arrFun(this.treeData, this.appIds)
      }

    },
    // 客户配置功能设置//
    setTree(){
      let setTreeUrl = ''
      if(this.type === 'menuTreeApp'){
        setTreeUrl = api.getAppIds
      }
      if(this.type === 'menuTree'){
        setTreeUrl =api.getMenuIds
      }
      Util.ojax.post(setTreeUrl, {ids: this.tenantId}).then(res => {
        this.treeData = res.data.detail
      })
    },
    setFuncTree(){
      let setTreeApi = ''
      if(this.type === 'menuTreeApp'){
        setTreeApi = api.getFuncApp
      }
      if(this.type === 'menuTree'){
        setTreeApi = api.getFuncMenu
      }
      Util.ojax.post(setTreeApi, {ids: this.rowId}).then(res => {
        this.treeData = res.data.detail
      })
    },
    initTree () {
      const menuId = this.$route.meta.menuId
      if(menuId !== 13 || menuId !== 15 || menuId !== 14){
        return
      }
      if(this.type === 'funcRole'){
        treeUrl = api.getFuncRole
      }
      if(this.type === 'dataRole'){
        treeUrl = api.getDataRole
      }
      Util.ojax.post(treeUrl,{treeName: this.type}).then((res) => {
        this.treeData = res.data.detail
      })
    }
  },
  mounted () {
    this.initTree()
  }
}
</script>

<style>

</style>
