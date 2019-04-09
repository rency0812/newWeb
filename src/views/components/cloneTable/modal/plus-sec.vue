<template>
  <div class="plus-sec">
    <Modal v-model="show" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>用户权限设置</span>
      </p>
      <Row ref="treeBox" class="plus-sec-main">
        <Col span="12">
          <h3>功能角色</h3>
          <sec-tree ref="menu" type="funcRole"/>
        </Col>
        <Col span="12">
          <h3>数据角色</h3>
          <sec-tree ref="role" type="dataRole"/>
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
  name: 'plus-sec',
  components: { secTree },
  data() {
    return {
      show: false,
      modaLoading:false,
      pageApi: '',
      rowId: '',
      queryApi: '',
      ids: null
    }
  },
  methods: {
    save(){
      let menuIds = this.$refs.menu.funcData
      let roleIds = this.$refs.role.roleData
      if(!menuIds.length){
        menuIds = this.ids.funcIds||[]
      }
      if(!roleIds.length){
        roleIds = this.ids.dataIds||[]
      }
      util.ojax.post(this.pageApi.permissionUser, {
        userId: this.rowId,
        roleDataIds: roleIds.toString(),
        roleIds: menuIds.toString()
      }).then(res => {
        if(res.data.code === '0'){
          this.$Notice.success({
            title: '提示',
            desc: res.data.msg,
            duration: 3
          })
          this.show = false
          this.queryGridData({menuId: this.$route.meta.menuId, pamars: {}, queryApi: this.queryApi})
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
  computed: {
  },
  mounted () {
    if(this.$route.meta.menuId === 13){
      window.addEventListener('message', (e) => {
        this.$refs.menu.funcData = []
        this.$refs.role.roleData = []
        let menuData = this.$refs.menu.treeData
        let roleData = this.$refs.role.treeData
        let dataIds = e.data.dataIds||[]
        let funcIds = e.data.funcIds||[]
        this.ids = e.data
        util.setNodeSelected(menuData, funcIds)
        util.setNodeSelected(roleData, dataIds)
      })
    }
  }
}
</script>

<style lang="less">
@import './temp.less';
</style>