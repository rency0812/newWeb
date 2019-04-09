<template>
  <div class="cfg-page-set">
    <Modal v-model="show" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>页面设置</span>
      </p>
      <div class="page-set-main temp-wrap-padding">
        <Form :model="formData" label-position="right" :label-width="90">
          <FormItem label="LOGO(大)">
            <Upload 
              ref="up1"
              :max-size="512"
              :data="data1"
              :before-upload="beforeUpload"
              :action="pageSetApi">
              <div style="padding: 20px 0">
                  <Icon size="26" type="md-add" />
              </div>
            </Upload>
            <div class="file-name">{{name1}}</div>
          </FormItem>
          <FormItem label="LOGO(小)">
            <Upload
              ref="up2"
              :data="data2"
              :max-size="512"
              :before-upload="beforeUpload2"
              :action="pageSetApi">
              <div style="padding: 20px 0">
                  <Icon size="26" type="md-add" />
              </div>
            </Upload>
            <div class="file-name">{{name2}}</div>
          </FormItem>
          <FormItem label="背景图片">
            <Upload
              ref="up3"
              :data="data3"
              :max-size="512"
              :before-upload="beforeUpload3"
              :action="pageSetApi">
              <div style="padding: 20px 0">
                  <Icon size="26" type="md-add" />
              </div>
            </Upload>
            <div class="file-name">{{name3}}</div>
          </FormItem>
          <FormItem label="版权说明">
            <Input style="width:160px" :rows="4" type="textarea" v-model="formData.description" placeholder="请输入..."></Input>
          </FormItem>
        </Form>
      </div>
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
export default {
  name:'cfg-page-set',
  data() {
    return {
      show: false,
      formData: {},
      modaLoading: false,
      fileList: [],
      pageSetApi: '',
      data1: {name:'masterLogo', i: 1},
      data2: {name: 'secondLogo', i: 2},
      data3: {name: 'platformSplash', i: 1},
      name1: '',
      name2: '',
      name3: ''
    }
  },
  mounted () {
    
  },
  methods: {
    save(){
      let url = ''
      url = '/jt808web' + this.pageSetApi
      if(!this.fileList.length){
        this.$Message.info('请选择要上传的图片')
        return
      }
      const form = new FormData()
      form.append('tenantId', this.rowId)
      form.append('copyright', this.formData.description)
      this.fileList.forEach(v => {
        form.append(v.fKey, v)
      })
      const xhr = new XMLHttpRequest()
      xhr.open('post', url, true)
      xhr.send(form)
      xhr.onreadystatechange = () => {
        if(xhr.readyState !== 4||xhr.status!==200){
          return
        }
        let data = JSON.parse(xhr.response)
        if(data.code === '0'){
          this.$Notice.success({
            title: '提示',
            desc: data.msg,
            duration: 3
          })
          this.show = false
        }else{
          this.$Message.error(data.msg)
        }
      }
    },
    cancel(){
      this.show = false
    },
    beforeUpload(file){
      if(this.maxSize(file.size)){
        this.$Message.info('图片大小不能超过512k')
        return
      }
      this.clearRekey('masterLogo')
      this.name1 = file.name
      file.fKey = 'masterLogo'
      this.fileList.push(file)
      return false
    },
    beforeUpload2(file){
      if(this.maxSize(file.size)){
        this.$Message.info('图片大小不能超过512k')
        return
      }
      this.clearRekey('secondLogo')
      this.name2 = file.name
      file.fKey = 'secondLogo'
      this.fileList.push(file)
      return false
    },
    beforeUpload3(file){
      if(this.maxSize(file.size)){
        this.$Message.info('图片大小不能超过512k')
        return
      }
      this.clearRekey('platformSplash')
      this.name3 = file.name
      file.fKey = 'platformSplash'
      this.fileList.push(file)
      return false
    },
    maxSize(size){
      let maxSize = (size/1024).toFixed(0)
      if(maxSize>512){
        return true
      }else{
        return false
      }
    },
    clearRekey(key){
      this.fileList.forEach((v, i) => {
        if(v.fKey === key){
          this.fileList.splice(i, 1)
        }
      })
    }
  }
}
</script>

<style lang="less">
  @import './temp.less';
  .page-set-main{
    .ivu-upload-select{
      border: 1px solid #ccc;
      text-align: center;
      width: 160px;
      cursor: pointer;
    }
  }
  .file-name{
    position: absolute;
    left: 160px;
    top: 50%;
  }
</style>
