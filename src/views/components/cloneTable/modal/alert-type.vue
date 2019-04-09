<template>
  <div class="alert-type">
    <Modal v-model="show" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>报警类型设置</span>
      </p>
      <div class="alert-type-main">
        <h3>车辆行驶</h3>
        <CheckboxGroup v-model="run">
          <Checkbox v-for="val in runLabel" :label="val.alarmTypeName" :key="val.id"></Checkbox>
       </CheckboxGroup>
       <h3>设备状态</h3>
        <CheckboxGroup v-model="devState">
          <Checkbox v-for="val in devStateLabel" :label="val.alarmTypeName" :key="val.id"></Checkbox>
       </CheckboxGroup>
       <h3>驾驶行为</h3>
        <CheckboxGroup v-model="runAction">
          <Checkbox v-for="val in runActionLabel" :label="val.alarmTypeName" :key="val.id"></Checkbox>
       </CheckboxGroup>
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
import {mapMutations} from 'vuex'
import util from '../../../../libs/util' 
const getAlertType = require('../../../../libs/api').getAlertType
const getAlertTypeIds = require('../../../../libs/api').getAlertTypeIds

export default {
  name: 'alert-type',
  data () {
    return {
      show: false,
      modaLoading: false,
      runLabel: [],
      devStateLabel: [],
      runActionLabel: [],
      run: [
        // '驶入区域',
        // '驶出区域',
        // '驶入驶出',
        // '线路偏移',
        // '超速报警',
        // '区域超速',
        // '非法点火',
        // '非法位移',
        // '非法开关门',
        // '停车超时',
        // '超重报警',
        // '趟间超时'
      ],
      devState:[
        // '终端电源断开',
        // '终端故障',
        // '摄像头故障',
      ],
      runAction: [
        // '防碰撞报警',
        // '碰撞报警',
        // '车距过近',
        // '急加速',
        // '急刹车',
        // '急转弯',
        // '超员报警',
        // '抽烟',
        // '打电话',
        // '未系安全带',
        // '轻度疲劳',
        // '重度疲劳',
        // '摄像头遮挡'
      ],
      viewIds: []
    }
  },
  methods: {
    view(viewIds){
      if(viewIds.length&&viewIds[0] === 'client'){
        util.ojax.post(getAlertTypeIds, {ids: this.rowId}).then(res => {
          this.run = util.getAlertTypeId(this.runLabel, res.data.detail)
          this.devState = util.getAlertTypeId(this.devStateLabel, res.data.detail)
          this.runAction = util.getAlertTypeId(this.runActionLabel, res.data.detail)
        })
        return
      }
      this.run = util.getAlertTypeId(this.runLabel, viewIds)
      this.devState = util.getAlertTypeId(this.devStateLabel, viewIds)
      this.runAction = util.getAlertTypeId(this.runActionLabel, viewIds)
    },
    save () {
      const runIds = util.getAlertTypeId(this.runLabel, this.run)
      const devIds = util.getAlertTypeId(this.devStateLabel, this.devState)
      const actionIds = util.getAlertTypeId(this.runActionLabel, this.runAction)
      util.ojax.post(this.alertApi, {
        alarmTypeIds:[...runIds,...devIds,...actionIds].toString(),
        roleId:this.roleId,
        tenantId: this.rowId
        }).then(res => {
        if(res.data.code === '0'){
          this.$Notice.success({
            title: '提示',
            desc: res.data.msg,
            duration: 3
          })
          this.show = false
          this.queryGridData({menuId:this.$route.meta.menuId,pamars: {}, queryApi: this.queryApi})
        }else{
          this.$Message.error(res.data.msg)
        }
      })
    },
    cancel () {
      this.show = false
    },
    ...mapMutations('tableState', [
      'queryGridData'
    ])
  },
  mounted () {
    util.ojax.post(getAlertType,{}).then(res => {
      let data = res.data.detail
      this.runLabel = data['0']
      this.devStateLabel = data['1']
      this.runActionLabel = data['2']
    })
  }
}
</script>

<style lang="less">
  @import './temp.less';
</style>
