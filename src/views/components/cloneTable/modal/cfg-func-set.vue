<template>
  <div class="func-set">
    <Modal v-model="show" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>用户权限设置</span>
      </p>
      <Row ref="treeBox" class="func-set-main add-modal">
        <Col span="12">
          <h3>平台权限</h3>
          <sec-tree ref="menu" type="menuTree"/>
        </Col>
        <Col span="12">
          <h3>APP权限</h3>
          <sec-tree ref="app" type="menuTreeApp"/>
        </Col>
      </Row>
      <div slot="footer" class="layout-modal-button">
        <Button @click="cancel"> 取 消</Button>
        <Button type="success" icon="checkmark-round" :loading="modaLoading" @click="save">
          保 存
        </Button>
      </div>
    </Modal>  
  </div>
</template>

<script>
import secTree from './pop-tree'
import {mapGetters,mapMutations} from 'vuex'
import util from '../../../../libs/util.js'

export default {
  name: 'func-set',
  components: {
    secTree
  },
  data() {
    return {
      show:false,
      modaLoading: false
    }
  },
  methods: {
    setNodeSelected(){
      this.$refs.app.tenantId = this.rowId
      this.$refs.menu.tenantId = this.rowId
      this.$refs.menu.setTree()
      this.$refs.app.setTree()
    },
    save(){
      let menuIds = []
      let appIds = []
      this.$refs.menu.arrFun(this.$refs.menu.treeData, menuIds)
      this.$refs.app.arrFun(this.$refs.app.treeData, appIds)
      util.ojax.post(this.pageApi.clientFuncSet, {
        tenantId: this.rowId,
        menuIds: menuIds.concat(appIds).toString()
      }).then(res => {
        if(res.data.code === '0'){
          this.$Notice.success({
            title: '提示',
            desc: res.data.msg,
            duration: 3
          })
          this.show = false
          this.queryGridData({
            menuId: this.$route.meta.menuId,
            pamars: {},
            queryApi: this.queryApi
          })
        }else{
          this.$Message.error(res.data.msg||'未知异常')
        }
      })
    },
    cancel(){
      this.show = false
    },
    ...mapMutations('tableState', [
      'queryGridData'
    ])
  },
}
</script>

<style lang="less">
  @import './temp.less';
</style>
