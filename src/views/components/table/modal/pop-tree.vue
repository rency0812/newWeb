<style>

</style>

<template>
  <div>
    <div class="modal-tree-container">
      <VJstree :data='functionTreeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
        ref="functionTree" :allow-batch="true"
        :show-checkbox="true" :multiple="true" @item-click="functionTreeNodeClick"/>
    </div>
  </div>
</template>

<script>
import VJstree from 'vue-jstree'
import Util from '../../../../libs/util.js'
const treeUrl = require('../../../../libs/api').GetBaseTreeUrl

export default {
  name: 'pop-tree',
  data () {
    return {
      functionTreeData: []
    }
  },
  components: {
    VJstree
  },
  methods: {
    // 功能权限树点击
    functionTreeNodeClick(n, i){

    },
    initTree () {
      Util.ojax.post(treeUrl,{treeName: 'menuTree'}).then((res) => {
        this.functionTreeData = res.data.detail
      })
    }
  },
  mounted () {
    this.initTree()
  }
}
</script>
