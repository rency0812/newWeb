<template>
  <div class="client-cfg-box">
    <Modal v-model="show" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span>{{modalTit}}</span>
      </p>
      <div class="add-client temp-wrap-padding">
        <Form :model="formData" label-position="right" :label-width="90">
          <FormItem v-for="v in formItem" :key="v.lab" :label="v.lab">
            <Input :size="inputSize" type="text" v-model="formData[v.val]" :placeholder="tip" v-if="v.type==1"></Input>
            <RadioGroup v-model="statu" v-if="v.type==3">
                <Radio label="启用"></Radio>
                <Radio label="禁用"></Radio>
            </RadioGroup>
            <div class="location-set" v-if="v.type==9">
              <Input :size="inputSize" type="text" :placeholder="tip"></Input>
              <Button @click="set">设置</Button>
            </div>
            <Input :size="inputSize" type="textarea" v-model="formData[v.val]" :placeholder="tip" v-if="v.type==4"></Input>
          </FormItem>
        </Form>
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
import util from '../../../../libs/util.js'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'client-cfg',
  data () {
    return {
      modaLoading:false,
      modalTit: '新增',
      formData: {
        id: null,
        lat: 30.458884746408,
        lng: 114.41621159918
      },
      show: false,
      inputSize: 'small',
      tip: '请输入...',
      statu: '启用',
      formItem: [
        {lab: '客户名称',val: 'tenantName',type: 1},
        {lab: '显示标题',val: 'platformTitle',type: 1},
        {lab: '平台URL',val: 'platformUrl',type: 1},
        {lab: 'APP URL',val: 'appUrl',type: 1},
        {lab: '状态',val: 'enable',type: 3},
        {lab: '默认定位',val: 'q',type: 9},
        {lab: '说明',val: 'remark',type: 4}
      ],
      pageApi: {},
      queryApi: ''
    }
  },
  methods: {
    save(){
      const url = this.formData.id?this.pageApi.updateClient:this.pageApi.insertClient
      if(!this.formData.tenantName){
        this.$Message.info('请输入客户名称')
        return
      }
      if(!this.formData.platformTitle){
        this.$Message.info('请输入显示标题')
        return
      }
      if(!this.formData.platformUrl){
        this.$Message.info('请输入平台url')
        return
      }
      if(!this.formData.appUrl){
        this.$Message.info('请输入app url')
        return
      }
      this.formData.lat = this.formData.lat?this.formData.lat:30.458884746408
      this.formData.lng = this.formData.lng?this.formData.lng:114.41621159918
      this.formData.enable = this.statu == '启用'?true:false
      util.ojax.post(url, this.formData).then(res => {
        if(res.data.code === '0'){
          this.$Notice.success({
            title: '提示',
            desc: res.data.msg,
            duration: 3
          })
          this.show = false
          this.queryGridData({menuId:this.$route.meta.menuId,pamars: {}, queryApi: this.queryApi})
        }else{
          this.$Message.error(res.data.msg||'未知异常')
        }
      })
    },
    set(){},
    cancel(){
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
  mounted () {
    this.formItem.forEach(val => {
      if(val.val !== 'p'){
        this.formData[val.val] = ""
      }
    })
  },
  watch: {
    popData:{
        handler(data) {
          if(data.id&&data.mId===4){
            this.show = true
            this.modalTit = data.modalTit
            this.pageApi = data.pageApi
            this.queryApi = data.queryApi
            this.statu = data.enable?'启用':'禁用'
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