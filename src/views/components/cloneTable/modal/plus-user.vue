<template>
  <div class="plus-user">
    <Modal v-model="show" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>{{modalTit}}</span>
      </p>
      <div class="add-user-from temp-wrap-padding">
        <Form :model="formData" label-position="right" :label-width="90" :rules="rules">
          <FormItem label="登录名" porp="">
            <Input type="text" :size="inputSize" v-model="formData.account" :placeholder="placeholder"></Input>
          </FormItem>
          <FormItem label="用户名" porp="">
            <Input type="text" :size="inputSize" v-model="formData.userName" :placeholder="placeholder"></Input>
          </FormItem>
          <FormItem label="账号类型" porp="">
            <Select :size="inputSize" v-model="formData.userType" @on-change="change" placeholder="请选择...">
              <Option value="0">普通人员</Option>
              <Option value="1">安装人员</Option>
            </Select>
          </FormItem>
          <FormItem :label="orgTxt" prop="deptId">
            <Input :size="inputSize" type="text" v-show="orgTxt=='安装机构'" v-model="formData.deptId" :placeholder="placeholder"></Input>
            <sTree ref="sTree" v-show="orgTxt=='组织机构'" v-model="formData.deptId" v-on:toTree="hanldeSelectTree"
              :name="deptName"
              treeType="departmentTree"
              :option="sTreeOption"
              style="width: 100%"/>
          </FormItem>
          <FormItem label="账号状态" prop="">
            <RadioGroup v-model="status">
                <Radio label="启用"></Radio>
                <Radio label="禁用"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="联系电话" porp="">
            <Input :size="inputSize" type="text" v-model="formData.phone" :placeholder="placeholder"></Input>
          </FormItem>
          <FormItem label="邮箱" porp="">
            <Input :size="inputSize" type="text" v-model="formData.email" :placeholder="placeholder"></Input>
          </FormItem>
          <FormItem label="说明" porp="">
            <Input type="textarea" v-model="formData.remark" :placeholder="placeholder"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" class="layout-modal-button">
        <div v-if="modalTit!='查看'">
          <Button style="float:left" @click="initPass" type="success" v-if="modalTit == '编辑'">恢复初始密码</Button>
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
import {mapGetters, mapMutations} from 'vuex'
import util from '../../../../libs/util.js'
const initPass = require('../../../../libs/api').initPass

export default {
  name: 'plus-user',
  components: {sTree},
  data() {
    return {
      show: false,
      inputSize: 'small',
      rules: {},
      formData: {
        id: '',
        account: '',
        deptId:'',
        email:'',
        enable:'',
        phone:'',
        remark:'',
        userName:'',
        userType:''
      },
      placeholder: '请输入...',
      status: '启用',
      modaLoading: false,
      sTreeOption:[{label: "menuTree", value: "menuTree"}],
      modalTit: '新增',
      orgTxt: '组织机构',
      deptName: '',
      queryApi: '',
      pageApi: ''
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
    initPass(){
      util.ojax.post(initPass, {id: this.formData.id}).then(res => {
        if(res.data.code==='0'){
          this.$Notice.success({
            title: '提示',
            desc: res.data.msg,
            duration: 3
          })
        }else{
          this.$Message.error(res.data.msg)
        }
      })
    },
    save () {
      const url = this.formData.id?this.pageApi.updateUser:this.pageApi.insertUser
      if(!this.formData.account){
        this.$Message.info('请输入登录名')
        return
      }
      if(!this.formData.userName){
        this.$Message.info('请输入用户名')
        return
      }
      if(this.formData.userType === ''||this.formData.userType === null){
        this.$Message.info('请选择账号类型')
        return
      }
      if(!this.formData.deptId){
        this.$Message.info('请输入机构')
        return
      }
      if(this.formData.enable===''){
        this.formData.enable = this.status =='启用'?0:1
      }
      util.ojax.post(url, this.formData).then(res => {
        if(res.data.code === '0'){
          this.$Notice.success({
            title: '提示',
            desc: '保存成功',
            duration: 3
          })
          this.show = false
          this.queryGridData({menuId:this.$route.meta.menuId,pamars: {}, queryApi: this.queryApi})
        }else{
          this.$Message.error(res.data.msg||'未知异常')
        }
      })
    },
    cancel () {
      this.show = false
    },
    change (val) {
      this.orgTxt = Number(val)?'安装机构':'组织机构'
    },
    ...mapMutations('tableState', [
      'tranData',
      'queryGridData'
    ])
  },
  mounted () {
    
  },
  computed: {
    ...mapGetters('tableState', [
      'popData'
    ])
  },
  watch: {
    popData:{
        handler(data) {
          if(data.id&&data.mId ===3){
            this.show = true
            this.isShow = true
            this.modalTit = data.modalTit
            this.status = Number(data.enable)?'禁用':'启用'
            this.$refs.sTree.iptValue=data.deptName
            this.pageApi = data.pageApi
            this.queryApi = data.queryApi
            Object.keys(this.formData).forEach(key => {
              this.formData[key] = data[key]
            })
            this.formData.userType = this.formData.userType.toString()
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
