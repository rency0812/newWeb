<style lang="less">
  @import '../components/cloneTable/modal/temp.less';
  .alert-push-wrap{
    width: 520px;
  }
</style>

<template>
  <div class="alert-push-wrap">
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
    <div class="layout-modal-button">
      <Button @click="cancel"> 取 消</Button>
      <Button type="success" icon="checkmark-round" :loading="modaLoading" @click="save">
        保 存
      </Button>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
import util from '../../libs/util' 
const getAlertType = require('../../libs/api').getAlertType

export default {
  name: 'alert-push',
  data() {
    return {
      modaLoading:false,
      runLabel: [],
      devStateLabel: [],
      runActionLabel: [],
      run: [],
      devState:[],
      runAction: []
    }
  },
  methods: {
    save(){},
    cancel(){}
  },
  mounted () {
    util.ojax.post(getAlertType,{}).then(res => {
      let data = res.data.detail
      this.runLabel = data['0']
      this.devStateLabel = data['1']
      this.runActionLabel = data['2']
    })
  },
  computed: {
    
  }
}
</script>
