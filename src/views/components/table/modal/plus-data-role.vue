<style lang="less">
  .add-modal .border-none{
    .ivu-input{
      border: 0;
      outline: 0;
      cursor: default;
    }
  }
  .add-modal{
    h3{
      padding-left:30px;
      line-height: 3.6;
    }
    .sec-box{
      padding-left: 30px;
    }
  }
  .vertical-center-modal{
    bottom: 100px;
  }
</style>

<template>
  <div class="plus-func-role">
    <!-- <Button :type="buttonType" size="small" :icon="iconClass" class="adv-search-btn"
      @click="add">{{buttonText}}
    </Button> -->
   
    <Modal v-model="show" class-name="vertical-center-modal" width="610" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>{{modalTit}}</span>
      </p>
      <div class="add-modal">
        <h3>基本信息</h3>
        <Form ref="addForm" :model="formData" label-position="right" :label-width="90" :rules="rules" inline>
          <FormItem label="角色名称" prop="name">
            <Input :size="inputSize" type="text" v-model="formData.roleDataName" :placeholder="placeholder"></Input>
          </FormItem>
          <FormItem v-show="isShow" label="创建用户">
            <Input type="text" readonly disabled class="border-none" v-model="formData.createUserName" placeholder=""></Input>
          </FormItem>
          <FormItem label="组织机构" prop="deptId">
            <sTree ref="sTree" v-model="formData.deptId" v-on:toTree="hanldeSelectTree"
              :name="deptName"
              treeType="departmentTree"
              :data="formData.deptId" :option="sTreeOption"
              style="width: 100%"/>
          </FormItem>
          <FormItem v-show="isShow" label="创建时间">
            <Input type="text" readonly disabled class="border-none" v-model="formData.createTime" placeholder=""></Input>
          </FormItem>
          <FormItem label="描述" prop="description">
            <Input type="textarea" v-model="formData.description" :placeholder="placeholder"></Input>
          </FormItem>
          <FormItem v-show="isShow" label="修改时间">
            <Input type="text" readonly disabled class="border-none" v-model="formData.modifyTime" placeholder=""></Input>
          </FormItem>
          <FormItem v-show="isShow" style="width:calc(110% - 90px)" label="应用账号数">
            <Input type="text" readonly disabled class="border-none" v-model="formData.applyAccountNum" placeholder=""></Input>
          </FormItem>
          <FormItem v-show="isShow" style="width:calc(110% - 90px)" label="应用账号">
            <Input type="text" readonly disabled class="border-none" v-model="formData.applyAccountName" placeholder=""></Input>
          </FormItem>
        </Form>
        <div class="sec">
          <h3>权限分配</h3>
          <div class="sec-box">
            <Checkbox v-model="inherit">默认勾选已有权限下新增子节点</Checkbox>
            <sec-tree ref="role" type="departmentTree"/>
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
const pageUrl = require('../../../../libs/api')

export default {
  name:'plus-data-role',
  props: ['modalType'],
  data () {
    return {
      show: false,
      inputSize: 'small',
      modaLoading: false,
      btnTxt: '',
      rules: {},
      placeholder: '请输入...',
      formData:{
        id: '',
        deptIds: '',
        modifyTime: '',
        applyAccountName: '',
        applyAccountNum:'',
        description: '',
        deptId: '',
        createUserName:'',
        createTime: '',
        roleDataName: ''
      },
      inherit: false, //默认是否勾选
      sTreeOption:[{label: "menuTree", value: "menuTree"}],
      isShow: false,
      modalTit: '新增',
      deptName:'',
      pageApi: '',
      queryApi: ''
    }
  },
  components: {
    sTree,
    secTree
  },
  mounted () {
    window.addEventListener('message', (e) => {
      if(e.data&&e.data.id){
        this.$refs.role.initTree()
        return
      }
      if(!e.data){

      }
      let roleData = this.$refs.role.treeData
      let aoData = e.data.ids
      function arrFun(arr){
        if(!arr||!arr.length){
          return
        }
        arr.forEach(v => {
          v.selected=false
          if(aoData.indexOf(v.id)>-1){
            v.selected = true
          }
          arrFun(v.children)
        })
      }//
      arrFun(roleData)
    })
  },
  methods: {
    hanldeSelectTree(v){
      //this.formData.pname = v.text
      this.formData.deptId = v.value.toString()
    },
    save () {
      const url = this.formData.id?this.pageApi.updateDataRole:this.pageApi.insertDataRole
      if(!this.formData.roleDataName){
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
      this.formData.deptIds = this.$refs.role.roleData.toString()
      util.ojax.post(url, {
        id: this.formData.id,
        roleDataName: this.formData.roleDataName,
        description: this.formData.description,
        deptId: this.formData.deptId,
        deptIds: this.formData.deptIds,
        inherit: this.inherit?'1':'0'
      }).then((res) => {
        if(res.data.code === '0'){
          this.$Notice.success({
            title: '提示',
            desc: '保存成功!',
            duration: 3
          })
          this.show=false
          this.queryGridData({menuId:this.$route.meta.menuId,pamars: {}, queryApi: this.queryApi})
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
          if(data.id){
            this.show = true
            this.isShow = true
            this.modalTit = data.modalTit
            this.deptName = data.deptName
            this.$refs.sTree.iptValue = data.deptName
            this.pageApi = data.pageApi
            this.queryApi = data.queryApi
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
