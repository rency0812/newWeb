<template>
  <div class="view-media">
    <Modal v-model="show" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span>{{vehNo}}多媒体文件查看</span>
      </p>
      <ul class="media-wrap">
        <li v-for="v in 6" :key="v">
          <Icon size="20" type="ios-search" />
          <img @click="viewPic" :src="imgSrc" />
          <div class="pic-down">
            <p>通道{{v}}(拍照)</p>
            <Button type="default" class="down-btn" @click="downPic">下 载</Button>
          </div>
        </li>
      </ul>
      <div slot="footer" class="layout-modal-button">
        <p></p>
      </div>
    </Modal>
    <Modal class-name="view-pic-pop" fullscreen v-model="picShow" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <div style="text-align: center;">
        <img :src="imgSrc"/>
      </div>
      <div slot="footer" class="layout-modal-button">
        <p></p>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'view-media',
  data () {
    return {
      picShow: false,
      show: false,
      vehNo: '',
      imgSrc: 'http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg',
    }
  },
  methods: {
    downPic(){},
    viewPic(){
      this.picShow = true
    }
  },
  mounted(){}
}
</script>

<style>
.view-pic-pop>div{
  width: 100% !important;
}
</style>

<style lang="less" scoped>
  .media-wrap{
    overflow: auto; 
    zoom: 1;
    padding: 20px 40px;
    .pic-down{
      p{
        display: inline-block;
      }
      .down-btn{
        text-align: right;
        padding: 2px 8px;
      }
    }
    li{
      position: relative;
      float: left;
      width: 204px;
      border-radius: 2px;
      cursor: pointer;
      &:nth-child(even){
        margin-left: 30px;
      }
      &:nth-child(3), &:nth-child(4){
        margin-bottom: 20px;
        margin-top: 20px;
      }
      img{
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
      }
      i{
        position: absolute;
        right: 3px;
        bottom: 38px;
      }
    }
  }
</style>
