<template>
  <div class="query-bind-veh">
    <Modal width="600" v-model="show" :draggable="false" :mask-closable="true" class="layou-modal-input">
      <p slot="header">
          <Icon type="information-circled"></Icon>
          <span>{{modalTit[ruleTypeId]}}-车辆设置</span>
      </p>
      <Form inline :model="formData" class="form-box" label-position="right" :label-width="80">
        <FormItem label="车牌号" prop="">
          <Input size="small" type="text" v-model="formData.vehNo" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="info" size="small" icon="md-search" class="adv-search-btn"
            @click="search">查询
          </Button>
          <Button type="success" size="small" icon="md-add" class="adv-search-btn"
            @click="add">新增
          </Button>
          <Button type="default" size="small" icon="md-close" class="adv-search-btn"
            @click="del">删除
          </Button>
        </FormItem>
      </Form>
      <Table height="372" @on-selection-change="selection1" :columns="colData" :data="tableData"></Table>
      <p class="veh-tatol">共计{{queryTatol}}条</p>
      <div slot="footer" class="layout-modal-button">
        <Button @click="cancel(1)"> 取 消</Button>
        <Button type="success" icon="checkmark-round" :loading="modaLoading" @click="save">
          保 存
        </Button>
      </div>
    </Modal>
    <Modal width="900" :draggable="false" :mask-closable="true" class="layou-modal-input" v-model="showVeh">
      <p slot="header">
        <Icon type="information-circled"></Icon>
        <span>车辆选择</span>
      </p>
      <div class="veh-tree veh-box">
        <div class="tree-top">
          <p class="text">可选择车辆</p>
          <Form inline :model="formData" class="form-box" label-position="right" :label-width="10">
            <FormItem label="" prop="">
              <Input size="small" type="text" v-model="formData.str" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem>
              <Button > 搜 索</Button>
            </FormItem>
          </Form>
        </div>
        <VJstree :data='treeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
        ref="vehTree" :allow-batch="true"
        :show-checkbox="true" :multiple="true" @item-click="nodeClick"/>
      </div>
      <div class="add-del-btn ec-fl">
        <Button @click="addVeh"> 添 加 &gt; </Button>
        <Button class="c-btn" :disabled="isAble" @click="delVeh(tableData1)"> &lt; 撤 销</Button>
      </div>
      <div class="table-box veh-box">
        <p class="text">已选择车辆</p>
        <Form inline :model="formData" class="form-box" label-position="right" :label-width="10">
          <FormItem label="" prop="">
            <Input size="small" type="text" v-model="formData.str1" placeholder="请输入..."></Input>
          </FormItem>
          <FormItem>
            <Button @click="searchVehNo"> 搜 索</Button>
          </FormItem>
        </Form>
        <Table height="352" @on-selection-change="selection" :columns="colData" :data="tableData1"></Table>
        <p class="veh-tatol">共计{{tatol}}条</p>
      </div>
      <div slot="footer" style="margin-top:10px;" class="layout-modal-button veh-btn">
        <Button @click="cancel(2)"> 取 消</Button>
        <Button type="success" icon="checkmark-round" :loading="modaLoading" @click="saveCar">
          保 存
        </Button>
      </div>
    </Modal>
    <Modal v-model="modalShow" title="提示" :loading="modaLoading">
      <p><Icon size="24" type="ios-alert" />确认保存该规则车辆设置？</p>
      <div slot="footer">
          <Button @click="cancel(3)"> 取 消</Button>
          <Button type="success" icon="checkmark-round" @click="finalSave">
              保 存
          </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import util from '../../../../libs/util.js'
import api from '../../../../libs/api.js'
import VJstree from 'vue-jstree'
import {mapMutations} from 'vuex'

export default {
  name: 'query-veh',
  components: {
    VJstree
  },
  data () {
    return {
      modalShow: false,
      treeData:[],
      tatol: 0,
      queryTatol: 0,
      showVeh: false,
      show: false,
      modaLoading: false,
      colData: [
        {type: 'selection', width: 42, align: 'center'},
        {title: '车牌号', key: 'vehNo'},
        {title: '组织机构', key: 'deptName'},
        {title: '设备号', key: 'devNo'}
      ],
      tableData: [
        // {vehNo: '123',orgName: '456', devNo: '789'},
        // {vehNo: 'r123',orgName: 'r456', devNo: 'r789'},
        // {vehNo: 'df123',orgName: 'sd456', devNo: 'xc789'}
      ],
      tableData1:[],
      querySourceData: [],
      ruleTypeId: '',
      formData: {
        vehNo: '',
        str: '',
        str1: ''
      },
      modalTit: {
        172: '进出区域',
        173: '线路偏移',
        174: '超速报警',
        175: '非法开关门',
        176: '非法点火',
        177: '非法位移',
        178: '停车超时',
        179: '疲劳驾驶'
      },
      oDept: {},
      bindApi: '',
      delCar: [],
      isAble: false,
      sign: 1,  // 删除标识从接口还是缓存
      selectedData: [] // 已选择数据源
    }
  },
  methods: {
    nodeClick(){},
    queryData(id){
      util.ojax.post(api.queryBindVeh, {ids: id.toString()}).then(res => {
        this.querySourceData = [].concat(res.data.detail)
        this.tableData = [].concat(this.querySourceData)
        this.queryTatol = this.tableData.length
      })
    },
    arrFun(arr,newArr, dept){
      //console.log(newArr)//遍历选中节点
      if(!arr||!arr.length){
        return
      }
      arr.forEach(v => {
        // if(v.selected&&v.type!=='car'){
        //   dept[v.id]=v.text
        // }
        //console.log(dept)
        if(v.selected&&v.type==='car'){
          newArr.push({vehNo: v.text, deptName: v.data.deptName, devNo: v.data.devNo})
        }
        if(v.children){
          this.arrFun(v.children, newArr, dept)
        }
      })
    },
    searchVehNo(){
      let len = this.selectedData.length
      let newArr = []
      if(!this.formData.str1){
        this.tableData1 = [].concat(this.selectedData)
        this.tatol = len
        return
      }
      for(let i=0;i<len;i++){
        if(this.selectedData[i].vehNo.indexOf(this.formData.str1)>-1){
          newArr.push(this.selectedData[i])
        }
      }
      this.tableData1 = [].concat(newArr)
      this.tatol = this.tableData1.length
    },
    search(){
      let len = this.querySourceData.length
      let newArr = []
      if(!this.formData.vehNo){
        this.tableData = [].concat(this.querySourceData)
        this.queryTatol = len
        return
      }
      for(let i=0;i<len;i++){
        if(this.querySourceData[i].vehNo.indexOf(this.formData.vehNo)>-1){
          newArr.push(this.querySourceData[i])
        }
      }
      this.tableData = [].concat(newArr)
      this.queryTatol = this.tableData.length
    },
    addVeh(){
      this.arrFun(this.treeData, this.tableData1, this.oDept)
      this.selectedData = [].concat(this.tableData1)
      this.tatol = this.selectedData.length
    },
    selection(rowObj){
      let devNo = []
      rowObj.forEach(v => {
        devNo.push(v.devNo)
      })
      this.delCar = [...devNo]
      if(this.delCar.length){this.isAble = false}
    },
    selection1(rowObj){
      let devNo = []
      rowObj.forEach(v => {
        devNo.push(v.devNo)
      })
      this.delCar = [...devNo]
    },
    delVeh(type){
      if(!this.delCar.length){
        this.$Message.info('请先选择车')
        return
      }
      let devNo = []
      let tableData = null
      if(type === 1){
        tableData = this.tableData
      }else{
        tableData = this.tableData1
      }
      tableData.forEach((v, i) => {
        if(this.delCar.indexOf(v.devNo)==-1){
          devNo.push(tableData[i])
        }
      })
      if(type === 1){
        this.tableData = []
        this.tableData = devNo
        this.queryTatol = devNo.length
      }else{
        this.tableData1 = []
        this.tableData1 = devNo
        this.tatol = devNo.length
        this.isAble = true
      }
      this.delCar = []
    },
    add(){
      this.showVeh = true
      this.tableData1 = []
      //this.isAble = false
      this.isAble = true
      this.delCar = []
    },
    del(){
      if(!this.delCar.length){
        this.$Message.info('请先选择车')
        return
      }
      if(this.sign===1){
        this.finalSave('del')
      }else{
        this.delVeh(1)
      }
    },
    save(){
      this.modalShow = true
    },
    finalSave(type){
      let devNoArr = []
      let url = ''
      this.tableData.forEach(v => {
        devNoArr.push(v.devNo)
      })
      if(type === 'del'){
        url = api.delBindVeh
        devNoArr = [].concat(this.delCar)
      }else{
        url = this.bindApi
      }
      util.ojax.post(url, {all: false, devNo:devNoArr.toString(),ruleId: this.rowId}).then(res => {
        if(res.data.code === '0'){
          this.$Notice.success({
            title: '提示',
            desc: res.data.msg,
            duration: 3
          })
          if(type ==='del'){
            this.queryData(this.rowId)
          }else{
            this.modalShow = false
          }
          this.queryGridData({
            menuId: this.$route.meta.menuId,
            pamars: {},
            queryApi: this.queryApi
          })
        }else{
          this.$Message.error(res.data.msg||'未知错误')
        }
      })
    },
    saveCar(){
      this.showVeh = false
      this.tableData = []
      this.tableData = [].concat(this.tableData1)
      this.delCar = []
      this.sign = 2
      this.queryTatol = this.tableData.length
    },
    cancel(index){
      if(index === 1){
        this.show = false
      }else if(index === 2){
        this.showVeh = false
      }else{
        this.modalShow = false
      }
    },
    ...mapMutations('tableState', [
      'queryGridData'
    ])
  },
  created(){
    util.ojax.post(api.vehTree,{}).then(res => {
      this.treeData = res.data.detail
    })
  },
  mounted(){
    // for(let i=0;i<6;i++){
    //   for(let j=0;j<6;j++){
    //     console.log(i,j)
    //   }
    // }
  }
}
</script>

<style lang="less">
  .veh-box{
    position: relative;
    width: 400px;
    height: 460px;
    border: 1px solid #ccc;
    &:extend(.ec-fl);
    .tree{
      height: 360px;
      max-height: 360px;
      overflow: auto;
    }
  }
  .ec-fl{
    float: left;
  }
  .add-del-btn{
    width: 100px;
    text-align: center;
    padding-top: 20%;
    button:nth-child(1){
      margin-bottom: 10px;
    }
  }
  .text{
    padding: 12px;
  }
  .veh-btn{
    clear: both;
    position: relative;
    top:10px;
  }
  .veh-tatol{
    padding-left: 15px;
  }
</style>
