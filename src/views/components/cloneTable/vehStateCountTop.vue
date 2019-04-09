<template>
  <div>
    <section v-show="show" class="veh-state-top">
      <div class="div-item" v-for="(v,k) in lab" :key="v">{{v}}{{vehData[k]}}辆</div>
    </section>
    <section v-show="show1" class="veh-state-top">
      <div class="div-item" v-for="(v,k) in lab1" :key="v">{{v}}{{outlineData[k]}}辆</div>
    </section>
  </div>
  
</template>

<script>
import util from '../../../libs/util.js'
const sUrl = require('../../../libs/api')

export default {
  name: 'veh-state-top',
  data() {
    return {
      vehData: {
        total: '',
        onlineCount: '',
        outlineCount: '',
        runCount: '',
        stopCount: '',
        xiHuoCount: ''
      },
      lab: {
        total: '入网车辆',
        onlineCount: '在线车辆',
        outlineCount: '离线车辆',
        runCount: '行驶',
        stopCount: '停车',
        xiHuoCount: '熄火'
      },
      show: false,
      show1: false,
      outlineData: {
        total: '',
        count1: '',
        count3: '',
        count7: '',
        count30: '',
        count90: ''
      },
      lab1: {
        total: '入网车辆',
        count1: '1天未上线',
        count3: '3天未上线',
        count7: '7天未上线',
        count30: '30天未上线',
        count90: '90天未上线'
      }
    }
  },
  beforeMount() {
    if(this.$route.meta.menuId === 159){
      util.ojax.post(sUrl.getVehCountData,{}).then(res => {
        this.vehData = res.data.detail
      })
      this.show = true
      this.show1 = false
      return
    }
    if(this.$route.meta.menuId === 162){
      util.ojax.post(sUrl.getVehOutlineCount,{}).then(res => {
        this.outlineData = res.data.detail
      })
      this.show1 = true
      this.show = false
      return
    }
    this.show = false
    this.show1 = false
  },
  mounted(){

  },
  methods:{}
}
</script>

<style lang="less" scoped>
  .veh-state-top{
    display: flex;
    margin-bottom: 15px;
    .div-item{
      flex: 1;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 12px 0;
      margin-right: 18px;
      &:nth-child(6){
        margin-right: 0px;
      }
    }
  }
</style>