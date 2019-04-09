<template>
  <div class="rule-set layout-table">
    <h2>
        <Icon type="ios-home"></Icon>
        <a href="/"> 首页 </a> >
        {{pageSet.pTitle}} > {{pageSet.cTitle}}
    </h2>
    <Split v-model="panelSplit">
        <div slot="left" class="layout-tree">
          <Menu @on-select="selected" width="216px" active-name="172">
            <MenuItem v-for="v in menuLab" :name="v.id" :key="v.id">{{v.label}}</MenuItem>
          </Menu>
        </div>
        <div slot="right" class="layout-table-content">
            <adv-search ref="aSearch" />
            <div class="layout-table">
                <table-grid ref="tableObj" v-on:get-tab-menu="tabMenu"/>
            </div>
        </div>
    </Split>
  </div>
</template>

<script>
//调用vuex状态管理
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
import advSearch from '../components/cloneTable/adv-search'
import tableGrid from '../components/cloneTable/table'

export default {
  name:'rule-set',
  components: {
    advSearch,
    tableGrid
  },
  data() {
    return {
      panelSplit: 0.17,
      pageSet: {
        pTitle: '',
        cTitle: null
      },
      menuLab:[
        // {txt: '进出区域', name: 1},
        // {txt: '线路偏移', name: 2},
        // {txt: '超速报警', name: 3},
        // {txt: '非法开关门', name: 4},
        // {txt: '非法点火', name: 5},
        // {txt: '非法位移', name: 6},
        // {txt: '停车超时', name: 7},
        // {txt: '疲劳驾驶', name: 8}
      ]
    }
  },
  mounted() {
      let self = this
      self.$nextTick(function () {
          /*==================初始化页面==================*/
          //获取页面配置
          let roleId = 0
          let menuId = self.$route.meta.menuId
          self.initPageCfgClone({menuId: menuId, roleId: roleId})
          //报警规则
          //this.menuLab = this.$refs.tableRule.ruleSideMenu
      })
  },
  computed: {
  },
  methods: {
    selected(name){
      this.$refs.aSearch.ruleTypeId = name
      this.$refs.aSearch.RuleData()
      this.$refs.tableObj.ruleTypeId = name
    },
    tabMenu(data){
      this.menuLab = data
    },
    ...mapMutations('tableState', [
        'initPageCfgClone' //初始化页面
    ])
  }
}
</script>

<style lang="less">
  .layout-tree{
    .ivu-menu{
      color: #333;
      line-height: 36px;
      background: none;
    }
    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
      background-color: #ccc;
    }
  }
</style>
