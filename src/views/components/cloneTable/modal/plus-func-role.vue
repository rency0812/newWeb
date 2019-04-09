<template>
  <div class="plus-data-role">
    <!-- <Button :type="buttonType" size="small" :icon="iconClass" class="adv-search-btn"
      @click="add">{{buttonText}}
    </Button> -->
    <Modal v-model="show" :styles="{top: '2px'}" width="610" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>{{modalTit}}</span>
      </p>
      <div class="add-modal">
        <h3>基本信息</h3>
        <Form ref="addForm" :model="formData" label-position="right" :label-width="90" :rules="rules" inline>
          <FormItem label="角色名称" prop="name">
            <Input :size="inputSize" type="text" v-model="formData.roleInfoName" :placeholder="placeholder"></Input>
          </FormItem>
          <FormItem v-show="isShow" label="创建用户">
            <Input :size="inputSize" type="text" readonly disabled class="border-none" v-model="formData.createUserName" placeholder=""></Input>
          </FormItem>
          <FormItem label="组织机构" prop="deptId">
            <sTree ref="sTree" v-model="formData.deptId" v-on:toTree="hanldeSelectTree"
              :name="deptName"
              treeType="departmentTree"
              :option="sTreeOption"
              style="width: 100%"/>
          </FormItem>
          <FormItem v-show="isShow" label="创建时间">
            <Input :size="inputSize" type="text" readonly disabled class="border-none" v-model="formData.createTime" placeholder=""></Input>
          </FormItem>
          <FormItem label="描述" prop="description">
            <Input type="textarea" v-model="formData.description" :placeholder="placeholder"></Input>
          </FormItem>
          <FormItem v-show="isShow" label="修改时间">
            <Input :size="inputSize" type="text" readonly disabled class="border-none" v-model="formData.modifyTime" placeholder=""></Input>
          </FormItem>
          <FormItem v-show="isShow" style="width:calc(110% - 90px)" label="应用账号数">
            <Input :size="inputSize" type="text" readonly disabled class="border-none" v-model="formData.applyAccountNum" placeholder=""></Input>
          </FormItem>
          <FormItem v-show="isShow" style="width:calc(110% - 90px)" label="应用账号">
            <Input :size="inputSize" type="text" readonly disabled class="border-none" v-model="formData.applyAccount" placeholder=""></Input>
          </FormItem>
        </Form>
        <div class="sec">
          <h3>权限分配</h3>
          <div class="sec-box">
            <Checkbox v-model="inherit">默认勾选已有权限下新增子节点</Checkbox>
            <Row>
              <Col span="12"><h3>平台权限</h3><sec-tree type="menuTree" ref="menu"/></Col>
              <Col span="12"><h3>APP权限</h3><sec-tree type="menuTreeApp" ref="app"/></Col>
            </Row>
          </div>
        </div>
      </div>
      <div slot="footer" class="layout-modal-button">
        <div v-if="modalTit!='查看'">
          <Button @click="cancel"> 取 消</Button>
          <Button type="success" icon="checkmark-round" :loading="modaLoading" @click="save">
            保 存
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import sTree from '../../form/select-tree.vue'
import secTree from './pop-tree'
import util from '../../../../libs/util.js'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name:'plus-func-role',
  props: ['modalType'],
  data () {
    return {
      inputSize: 'small',
      show: false,
      modaLoading: false,
      btnTxt: '',
      rules: {},
      placeholder: '请输入...',
      formData:{
        id: '',
        menuIds: '',
        modifyTime: '',
        applyAccount: '',
        applyAccountNum:'',
        description: '',
        deptId: '',
        createUserName:'',
        createTime: '',
        roleInfoName: ''
      },
      inherit: true, //默认是否勾选
      sTreeOption:[{label: "menuTree", value: "menuTree"}],
      isShow: false,
      modalTit: '新增',
      deptName: '',
      pageApi: '',
      queryApi: ''
    }
  },
  components: {
    sTree,
    secTree
  },
  mounted () {
   if(this.$route.meta.menuId === 15){
      window.addEventListener('message', (e) => {
        this.$refs.menu.funcData = []
        this.$refs.app.appIds = []
        this.$refs.menu.rowId = this.formData.id||'-1'
        this.$refs.app.rowId = this.formData.id||'-1'
        if(e.data){
          this.$refs.menu.setFuncTree()
          this.$refs.app.setFuncTree()
        }
    })
   }
  },
  methods: {
    clearInput(){
      this.$refs.sTree.iptValue = ""
    },
    hanldeSelectTree(v){
      //this.formData.pname = v.text
      this.formData.deptId = v.value.toString()
    },
    save () {
      const pageUrl = this.pageApi
      const url = this.formData.id?pageUrl.updateRoleInfo:pageUrl.insertRoleInfo
      if(!this.formData.roleInfoName){
        this.$Message.info('请输入角色名称')
        return
      }
      if (!this.formData.deptId) {
        this.$Message.info('请选择组织')
        return
      }
      // if(!this.formData.description){
      //   this.$Message.warning()
      // }
      let nodeIds = []
      let appIds = []
      this.$refs.menu.arrFun(this.$refs.menu.treeData, nodeIds)
      this.$refs.app.arrFun(this.$refs.app.treeData, appIds)
      
      util.ojax.post(url, {
        id: this.formData.id,
        roleInfoName: this.formData.roleInfoName,
        description: this.formData.description,
        deptId: this.formData.deptId,
        menuIds: nodeIds.concat(appIds).toString(),
        inherit: this.inherit?0:1
      }).then((res) => {
        if(res.data.code === '0'){
          this.$Notice.success({
            title: '提示',
            desc: '保存成功!',
            duration: 3
          })
          this.show=false
          this.queryGridData({menuId: this.$route.meta.menuId, pamars: {}, queryApi: this.queryApi})
        }else{
          this.$Message.error(res.data.msg||'未知异常')
        }
      })
    },
    cancel () {
      this.show = false
    },
    ...mapMutations('tableState', [
      'tranData',
      'queryGridData'
    ])
  },
  computed: {
    ...mapGetters('tableState', [
      'popData'
    ])
  },
  watch: {
    popData:{
        handler(data) {
          if(data.id&&data.mId===2){
            this.show = true
            this.isShow = true
            this.modalTit = data.modalTit
            this.deptName = data.deptName
            this.$refs.sTree.iptValue = data.deptName
            this.pageApi = data.pageApi
            this.queryApi = data.queryApi
            this.inherit = data.inherit?false:true
            Object.keys(this.formData).forEach(key => {
              this.formData[key] = data[key]
            })
            this.tranData([])
          }
        },
        immediate: true,
        deep: true
    }
  }
}
</script>

<style lang="less">
  @import './temp.less';
</style>
