<template>
  <div class="plus-rule-set">
    <Modal v-model="show" width="800" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>{{modalTit}}</span>
      </p>
      <Form :model="formData" class="top-form" label-position="right" :label-width="90">
        <h4 @click="isSpread(1)">{{ruleName[formData.ruleTypeId]}}<Icon style="float: right" size="30" :type="iType" /></h4>
        <Row v-show="topShow" class="top-box">
          <Col span="10" style="margin-right:120px;">
            <FormItem label="规则名称" prop="">
              <Input :size="inputSize" type="text" v-model="formData.ruleName" :placeholder="placeholder"></Input>
            </FormItem>
            <FormItem label="组织机构" prop="">
              <sTree ref="sTree" v-model="formData.deptId" v-on:toTree="hanldeSelectTree"
                :name="deptName"
                treeType="departmentTree"
                :option="sTreeOption"
                style="width: 100%"/>
            </FormItem>

            <section class="area-rule" v-show="formData.ruleTypeId ==172">
              <FormItem label="区域规则" prop="">
                <Select :size="inputSize" v-model="formData.rule" placeholder="请选择...">
                  <Option value="0">驶入区域</Option>
                  <Option value="1">驶出区域</Option>
                  <Option value="2">驶入驶出</Option>
                </Select>
              </FormItem>
              <FormItem label="区域选择">
                <Button> 选 择</Button>
                <p class="area-selected">1</p>
              </FormItem>
            </section>
            <section class="route-move" v-show="formData.ruleTypeId ==173">
              <FormItem label="线路选择">
                <Button> 选 择</Button>
                <p class="area-selected">1</p>
              </FormItem>
              <FormItem label="偏移范围" prop="">
                <div class="m-box">
                  <p>m</p>
                  <p>(50~1000m)</p>
                </div>
                <Input :size="inputSize" type="text" v-model="formData.thresholdOne" :placeholder="placeholder"></Input>
              </FormItem>
            </section>
            <section class="over-speed" v-show="formData.ruleTypeId ==174">
              <FormItem label="最高速度" prop="">
                <div class="m-box s-box">
                  <p class="s1">km/h</p>
                  <p class="s2">0表示无限制</p>
                </div>
                <Input :size="inputSize" type="text" v-model="formData.thresholdOne" :placeholder="placeholder"></Input>
              </FormItem>
              <FormItem label="最低速度" prop="">
                <div class="m-box s-box">
                  <p class="s1">km/h</p>
                  <p class="s2">0表示无限制</p>
                </div>
                <Input :size="inputSize" type="text" v-model="formData.thresholdTwo" :placeholder="placeholder"></Input>
              </FormItem>
              <FormItem label="持续时长" prop="">
                <div class="m-box" style="right:-18px;">
                  <p class="s1">s</p>
                  <p class="s2"></p>
                </div>
                <Input :size="inputSize" type="text" v-model="formData.thresholdThree" :placeholder="placeholder"></Input>
              </FormItem>
              <FormItem label="区域选择">
                <Button> 选 择</Button>
                <p class="area-selected">1</p>
              </FormItem>
            </section>
            <section class="move-rule" v-show="formData.ruleTypeId ==177">
              <FormItem label="位移距离" prop="">
                <div class="m-box">
                  <p>m</p>
                  <p>(50~1000m)</p>
                </div>
                <Input :size="inputSize" type="text" v-model="formData.thresholdOne" :placeholder="placeholder"></Input>
              </FormItem>
            </section>
            <section class="over-time" v-show="formData.ruleTypeId ==178">
              <FormItem label="停车时长" prop="">
                <div class="m-box" style="right:-33px;">
                  <p>min</p>
                  <p></p>
                </div>
                <Input :size="inputSize" type="text" v-model="formData.thresholdOne" :placeholder="placeholder"></Input>
              </FormItem>
              <FormItem label="ACC状态" prop="">
                <CheckboxGroup v-model="acc">
                  <Checkbox label="开启"></Checkbox>
                  <Checkbox label="关闭"></Checkbox>
              </CheckboxGroup>
              </FormItem>
            </section>
            <section class="tired-driver" v-show="formData.ruleTypeId ==179">
              <FormItem label="行驶时间" prop="">
                <div class="m-box" style="right:-33px;">
                  <p>min</p>
                  <p></p>
                </div>
                <Input :size="inputSize" type="text" v-model="formData.thresholdOne" :placeholder="placeholder"></Input>
              </FormItem>
              <FormItem label="休息时间" prop="">
                <div class="m-box" style="right:-33px;">
                  <p>min</p>
                  <p></p>
                </div>
                <Input :size="inputSize" type="text" v-model="formData.thresholdTwo" :placeholder="placeholder"></Input>
              </FormItem>
            </section>
            
            <FormItem label="生效时间">
              <RadioGroup @on-change="change" v-model="time">
                <Radio label="永久"></Radio>
                <Radio label="有效期"></Radio>
                <Radio label="固定时段"></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-show="null" class="time-limit" label="有效期">
              <Row>
                <Col span="11">
                  <DatePicker @on-change="getVal" :size="inputSize" type="date" placeholder="请选择..."></DatePicker>
                </Col>
                <Col span="2" style="text-align: center">~</Col>
                <Col span="11">
                  <DatePicker @on-change="getVal2" :size="inputSize" type="date" placeholder="请选择..."></DatePicker>
                </Col>
              </Row>
            </FormItem>
            <FormItem :class=" 'time-'+i " v-show="null" v-for="(v, i) in fixTime" :key="i" :label="v.lab">
              <div class="add-remove">
                <p class="p1" @click="remove(i)" v-if="i!=0">-</p>
                <p class="p2" @click="add(i)">+</p>
              </div>
              <Row>
                <Col span="11">
                  <TimePicker :size="inputSize" type="time" placeholder="请选择..." v-model="fixTimeData[v.val1]"></TimePicker>
                </Col>
                <Col span="2" style="text-align: center">~</Col>
                <Col span="11">
                  <TimePicker :size="inputSize" type="time" placeholder="请选择..." v-model="fixTimeData[v.val2]"></TimePicker>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="说明" prop="">
              <Input type="textarea" v-model="formData.description" :placeholder="placeholder"></Input>
            </FormItem>
            <div class="is-show" v-show="isShow">
              <FormItem label="创建人" prop="">
                <p>{{viewData.createUserName}}</p>
              </FormItem>
              <FormItem label="创建时间" prop="">
                <p>{{viewData.createTime}}</p>
              </FormItem>
              <FormItem label="修改人" prop="">
                <p>{{viewData.modifyUserName}}</p>
              </FormItem>
              <FormItem label="修改时间" prop="">
                <p>{{viewData.modifyTime}}</p>
              </FormItem>
            </div>
          </Col>
        </Row>
        <h4 @click="isSpread(2)" style="margin:0;">报警设置<Icon style="float: right" size="30" :type="iType1" /></h4>
        <Row v-show="botShow" class="bot-box">
          <Col span="10" style="margin-right:120px;">
            <FormItem label="报警下发">
              <CheckboxGroup @on-change="checkBoxChange" v-model="send">
                <Checkbox label="报警语音"></Checkbox>
                <Checkbox label="拍照"></Checkbox>
                <Checkbox label="录像"></Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem v-show="null" class="alert-desc" label="报警语音">
              <Input type="textarea" v-model="formData.voiceText" :placeholder="placeholder"></Input>
            </FormItem>
            <section v-show="null" class="pic-box">
              <FormItem label="拍照张数" prop="">
                <Input :size="inputSize" type="text" v-model="formData.photoNum" :placeholder="placeholder"></Input>
              </FormItem>
              <FormItem label="拍照间隔" prop="">
                <div class="m-box" style="right:-18px;">
                  <p class="s1">s</p>
                  <p class="s2"></p>
                </div>
                <Input :size="inputSize" type="text" v-model="formData.photoInterval" :placeholder="placeholder"></Input>
              </FormItem>
              <FormItem label="拍照摄像头" prop="">
                <Checkbox ref="all" @on-change="selectedAll($refs.all)" v-model="all">全部</Checkbox>
                <CheckboxGroup v-model="channel">
                  <Checkbox v-for="v in 16" :key="v" :label="'通道'+v"></Checkbox>
                </CheckboxGroup>
              </FormItem>
            </section>
          </Col>
          <Col span="10">
            <section class="video-box" v-show="null">
              <FormItem label="录像时长" prop="">
                <div class="m-box" style="right:-18px;">
                  <p class="s1">s</p>
                  <p class="s2"></p>
                </div>
                <Input :size="inputSize" type="text" v-model="formData.videoTime" :placeholder="placeholder"></Input>
              </FormItem>
              <FormItem label="录像摄像头" prop="">
                <Checkbox ref="all1" @on-change="selectedAll($refs.all1)" v-model="all1">全部</Checkbox>
                <CheckboxGroup v-model="video">
                  <Checkbox v-for="v in 16" :key="v" :label="'通道'+v"></Checkbox>
                </CheckboxGroup>
              </FormItem>
            </section>
          </Col>
        </Row>
      </Form>
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
import util from '../../../../libs/util.js'
import {mapMutations,mapGetters} from 'vuex'
import api from '../../../../libs/api.js'

export default {
  name: 'plus-rule',
  components: {
    sTree
  },
  data() {
    return {
      areaShow: true,
      video:[],
      channel:[],
      all:false,
      all1: false,
      send: [],
      ruleName: {
        172: '进出区域规则设置',
        173: '线路偏移规则设置',
        174: '超速报警规则设置',
        175: '非法开关门规则设置',
        176: '非法点火规则设置',
        177: '非法位移规则设置',
        178: '停车超时规则设置',
        179: '疲劳驾驶规则设置'
      },
      acc:[],
      inputSize: 'small',
      placeholder: '请输入...',
      show:false,
      modaLoading: false,
      modalTit: '新增',
      formData: {
        cloudMapId: "",
        deptId: null,
        effectiveDate: "",
        id: null,
        photo: false,
        photoCamera: "",
        photoInterval: 0,
        photoNum: 0,
        ruleName: "",
        ruleTypeId: 0,
        thresholdOne: "",
        thresholdThree: "",
        thresholdTwo: "",
        timeSlot: "",
        video: false,
        videoCamera: "",
        videoTime: 0,
        voice: false,
        voiceText: ""
      },
      limit: {
        begin: '',
        end: ''
      },
      sTreeOption:[{label: "menuTree", value: "menuTree"}],
      deptName: '',
      time:'永久',
      fixTime: [
        {lab: '固定时段1',val1: 'time1', val2: 'time2'},
        {lab: '固定时段2',val1: 'time3', val2: 'time4'},
        {lab: '固定时段3',val1: 'time5', val2: 'time6'},
        {lab: '固定时段4',val1: 'time7', val2: 'time8'}
      ],
      fixTimeData:{},
      timeBox: false,
      isShow: true,
      topShow: true,
      botShow: false,
      iType: 'ios-arrow-up',
      iType1: 'ios-arrow-down',
      viewData: {
        createUserName: '',
        createTime:'',
        modifyUserName: '',
        modifyTime: ''
      }
    }
  },
  methods:{
    clearCheckBox(){//点击按钮清空checkbox
      this.video = []
      this.channel = []
      this.send = []
      this.acc = []
      this.all = false
      this.all1 = false
    },
    selectedAll(type){
      let i = 1
      //console.log(type)
      if(type._uid === 517&&!type.value){
        while(i<17){
         this.channel.push('通道'+i)
         i++
        }
      }else{
        this.channel=[]
      }
      if(type._uid === 542&&!type.value){
        while(i<17){
         this.video.push('通道'+i)
         i++
        }
      }else{
        this.video = []
      }
    },
    clearRuleData(){
      this.formData.thresholdOne = ''
      this.formData.thresholdTwo = ''
      this.formData.thresholdThree = ''
    },
    fixTimeToStr(str1, str2){
      let str = ''
      if(str1&&str2){
        str = `${str1},${str2}`
      }
      return str
    },
    getVal(val){
      this.limit.begin = val
    },
    getVal2(val){
      this.limit.end = val
    },
    getChannel(isAll,channelArr){
      let arr = []
      let i = 0
      if(isAll){
        while(i<17){
          ++i
          arr.push(i)
        }
      }else{
        channelArr.forEach(v => {
          arr.push(v.substring(2))
        })
      }
      return arr
    },
    alertSet(){ //报警规则
      if(this.send.indexOf('报警语音')>-1){
        this.formData.voice = true
        if(!this.formData.voiceText){
          this.$Message.info('请输入报警语音')
          return 1
        }
      }else{
        this.formData.voice = false
        this.formData.voiceText = ''
      }
      if(this.send.indexOf('拍照')>-1){
        this.formData.photo = true
        if(!this.formData.photoNum||!this.formData.photoInterval||!this.formData.photoCamera){
          this.$Message.info('请输入拍照相关参数')
          return 2
        }
      }else{
        this.formData.photo = false
        this.formData.photoNum = ''
        this.formData.photoCamera = ''
        this.formData.photoInterval = ''
      }
      if(this.send.indexOf('录像')>-1){
        this.formData.video = true
        if(!this.formData.videoTime||!this.formData.videoCamera){
          this.$Message.info('请输入摄像相关参数')
          return 3
        }
      }else{
        this.formData.video = false
        this.formData.videoCamera = ''
        this.formData.videoTime = ''
      }
      return false
    },
    save(){
      const url = this.formData.id?this.pageApi.updateRule:this.pageApi.insertRule
      if(!this.formData.ruleName||!this.formData.deptId){
        this.$Message.info('请输入规则名和组织机构')
        return
      }
      if(this.time === '永久'){
        this.formData.effectiveDate = '2099-01-01'
      }
      if(this.time === '有效期'){
        if(!this.limit.begin||!this.limit.end){
          this.$Message.info('请选择有效期日期')
          return
        }
        this.formData.effectiveDate = this.limit.begin+','+this.limit.end
      }
      if(this.time === '固定时段'){
        if(!this.fixTimeData.time1||!this.fixTimeData.time2){
          this.$Message.info('请选择固定时段')
          return
        }
        let aTime = [
          this.fixTimeToStr(this.fixTimeData.time1,this.fixTimeData.time2),
          this.fixTimeToStr(this.fixTimeData.time3,this.fixTimeData.time4),
          this.fixTimeToStr(this.fixTimeData.time5,this.fixTimeData.time6),
          this.fixTimeToStr(this.fixTimeData.time7,this.fixTimeData.time8)
        ]
        aTime = aTime.filter(v => { return v&&v.trim() })
        if(aTime.length){
          this.formData.timeSlot = aTime.join(';')
        }
      }
      // about alarm set
      this.formData.photoCamera = this.getChannel(this.all, this.channel).toString()
      this.formData.videoCamera = this.getChannel(this.all1, this.video).toString()
      const num = this.alertSet()
      if(num){
        return
      }
      //console.log(this.formData)
      util.ojax.post(url, this.formData).then(res => {
        if(res.data.code === '0'){
          this.$Notice.success({
            title: '提示',
            desc: res.data.msg,
            duration: 3
          })
          this.show = false
          this.queryGridData({
            menuId: this.$route.meta.menuId,
            pamars: {},
            queryApi: this.queryApi
          })
        }else{
          this.$Message.error(res.data.msg)
        }
      })
    },
    clearInput(){
      this.$refs.sTree.iptValue = ""
    },
    isSpread(index){//展开收起
      let $ref = this.$refs
      if(index === 1){
        this.topShow = !this.topShow
        this.iType = this.iType==='ios-arrow-down'?'ios-arrow-up':'ios-arrow-down'
      }
      if(index === 2){
        this.botShow = !this.botShow
        this.iType1 = this.iType1==='ios-arrow-down'?'ios-arrow-up':'ios-arrow-down'
      }
    },
    change(val){//时间类别选择
      if(val === '永久'){
        this.getClass('.time-limit').style.display = 'none'
        for(let i=0;i<4;i++){
          this.getClass('.time-'+i).style.display = 'none'
        }
        this.limit.begin = ''
        this.limit.end = ''
        Object.keys(this.fixTimeData).forEach(k => {
          this.fixTimeData[k] = ''
        })
        this.formData.timeSlot = ''
      }
      if(val === '有效期'){
        this.getClass('.time-limit').style.display = 'block'
        for(let i=0;i<4;i++){
          this.getClass('.time-'+i).style.display = 'none'
        }
        Object.keys(this.fixTimeData).forEach(k => {
          this.fixTimeData[k] = ''
        })
        this.formData.timeSlot = ''
      }
      if(val === '固定时段'){
        this.getClass('.time-limit').style.display = 'none'
        this.getClass('.time-0').style.display = 'block'
        this.limit.begin = ''
        this.limit.end = ''
        this.formData.effectiveDate = ''
      }
    },
    checkBoxChange(arrVal){
      if(arrVal.indexOf('报警语音')>-1){
        this.getClass('.alert-desc').style.display = 'block'
      }else{
        this.getClass('.alert-desc').style.display = 'none'
      }
      if(arrVal.indexOf('拍照')>-1){
        this.getClass('.pic-box').style.display = 'block'
      }else{
        this.getClass('.pic-box').style.display = 'none'
      }
      if(arrVal.indexOf('录像')>-1){
        this.getClass('.video-box').style.display = 'block'
      }else{
        this.getClass('.video-box').style.display = 'none'
      }
    },
    cancel(){
      this.show = false
    },
    hanldeSelectTree(v){
      this.formData.deptId = v.value.toString()
    },
    getClass(el){
      return document.querySelector(el)
    },
    add(i){//添加固定时间
      // console.log(i)
      if(i===3){
        return
      }
      const class1 = `.time-${i+1}`
      const class2 = `.time-${i} .add-remove`
      //if(i === 0){
        this.getClass(class1).style.display = 'block'
        this.getClass(class2).style.display = 'none'
      //}
      if(i === 2){
        this.getClass('.time-3 .add-remove .p2').style.display = 'none'
      }
    },
    remove(i){
      const class1 = `.time-${i}`
      const class2 = `.time-${i-1} .add-remove`
      this.getClass(class1).style.display = 'none'
      this.getClass(class2).style.display = 'flex'
      if(i === 1){
        this.fixTimeData.time3 = ''
        this.fixTimeData.time4 = ''
      }
      if(i === 2){
        this.fixTimeData.time5 = ''
        this.fixTimeData.time6 = ''
      }
      if(i === 3){
        this.fixTimeData.time7 = ''
        this.fixTimeData.time8 = ''
      }
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
    this.formData.ruleTypeId = 172
  },
  watch: {
    popData:{
      handler(data){
        if(data.id&&data.mId===5&&this.formData.ruleTypeId!==180){
          this.clearCheckBox()
          this.show = true
          this.isShow = true
          this.modalTit = data.modalTit
          this.pageApi = data.pageApi
          this.queryApi = data.queryApi
          this.deptName = data.deptName
          this.$refs.sTree.iptValue = data.deptName
          Object.keys(this.formData).forEach(key => {
            if(key !== 'ruleTypeId'){
              this.formData[key] = data[key]
            }
          })
          Object.keys(this.viewData).forEach(k => {
            this.viewData[k] = data[k]
          })
          this.formData.cloudMapId = data.cloudMapIds
          util.ojax.post(api.getViewData, {ids: data.id}).then(res => {
            this.formData = {
              ...this.formData,
              ...res.data.detail
            }
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
  .top-form{
    .ivu-form-item{
      position: relative;
    }
    .top-box{
      margin-top: 15px;
    }
    h4{
      margin: 15px 0 0;
      padding: 5px 18px;
      background: #ccc;
      line-height: 32px;
      cursor: pointer;
      border-bottom: 1px solid #fff;
    }
    .area-selected{
      display: inline-block;
    }
  }
  .add-remove{
    position: absolute;
    top: 2px;
    right: -78px;
    display: flex;
    text-align: center;
    line-height: 30px;
    font-size: 19px;
    p{
      flex: 1;
      width: 30px;
      height: 30px;
      border: 1px solid #ccc;
      border-radius: 100%;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .is-show{
    .ivu-form-item{
      margin-bottom: 0;
    }
  }
  .m-box{
    display: flex;
    position: absolute;
    top: 0;
    right: -98px;
    p{
      flex: 1;
      &:nth-child(1){
        margin-right: 8px;
      }
    }
    .s2{
      flex-grow: 3;
    }
  }
  .s-box{
    right: -118px;
  }
</style>
