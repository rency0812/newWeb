<template>
    <Modal v-model="alarmRuleModal.showModal" :draggable="false" :mask-closable="false" width="1200"
           class="layou-modal-input" @on-cancel="handleCancel">
        <div slot="header">
            <Icon type="information-circled"></Icon>
            <span>{{alarmRuleModal.title}}</span>
        </div>
        <div class="layout-modal-content">
            <Split v-model="Split">
                <div slot="left">
                    <Form ref="tableModal" autocomplete="on" :model="postValue.editModel"
                          :rules="alarmRuleModal.rule" inline
                          label-position="right"
                          :label-width="140">

                        <fieldset v-for="item in alarmRuleModal.cfg" :key="item.text" v-show="item.opened">
                            <legend>{{item.text}}</legend>
                            <FormItem :label="i.data.label+':'" v-for="i in item.children" :key="i.id"
                                      :prop="i.data.name">


                                <!--只读输入框-->
                                <Input size="small" v-model="postValue.editModel[i.data.name]"
                                       v-if="i.data.type == 'noput'"
                                       :name="i.data.name"
                                       :disabled="true"/>

                                <!--输入框-->
                                <Input :placeholder="'请输入'+i.data.label+'...'" size="small"
                                       v-model="postValue.editModel[i.data.name]" v-if="i.data.type == 'input'"
                                       :name="i.data.name"
                                       :disabled="pageState ==7"/>

                                <!--数字输入框-->
                                <InputNumber v-model="postValue.editModel[i.data.name]" :min="0" size="small"
                                             :placeholder="'请选择'+i.data.label+'...'"
                                             v-if="i.data.type == 'input-num'"
                                             style="width: 100%"
                                             :name="i.data.name"
                                             :disabled="pageState ==7 "></InputNumber>

                                <!--时间日期选择器-->
                                <DatePicker type="datetime" size="small"
                                            v-model="postValue.editModel[i.data.name]"
                                            :placeholder="'请输入'+i.data.label+'...'"
                                            :name="i.data.name"
                                            v-if="i.data.type == 'datepicker'"
                                            :disabled="pageState ==7 "></DatePicker>

                                <!--下拉树-->
                                <sTree v-model="postValue.editModel[i.data.name]" v-on:toTree="hanldeSelectTree"
                                       :placeholder="'请选择'+i.data.label+'...'" :name="i.data.name"
                                       :data="inputData[i.data.name]" :show="alarmRuleModal.showModal" :option="i.data.option"
                                       v-if="i.data.type == 'select-tree'" style="width: 100%"
                                       :disabled="pageState ==7"/>
                                <!--选择下拉-->

                                <Select v-model="postValue.editModel[i.data.name]" clearable filterable
                                        v-if="i.data.type == 'select'"
                                        size="small"
                                        :name="i.data.name"
                                        :disabled="pageState ==7 ">
                                    <Option :value="v.value" v-for="v in i.data.option" :key="v.label"
                                            :label="v.label"/>
                                </Select>

                                <!--动态渲染option下拉-->
                                <selectRemote v-model="postValue.editModel[i.data.name]"
                                              v-if="i.data.type == 'select-remote'"
                                              :name="i.data.name"
                                              :option="i.data.option"
                                              size="small"
                                              v-on:toTreeModal="hanldeSelectTree"
                                              :disabled="pageState ==7"
                                              :selectOptionValue="postValue.editModel[i.data.name]">
                                </selectRemote>

                                <!--时间日期选择器-->
                                <select-datepicker v-model="postValue.editModel[i.data.name]"
                                                   v-if="i.data.type == 'date' || i.data.type == 'datetime' || i.data.type == 'datetimerange' || i.data.type == 'daterange'"
                                                   v-on:changeDateFormat="hanldeSelectTree"
                                                   :name="i.data.name"
                                                   :sName="i.data.name"
                                                   :disabled="pageState ==7"
                                                   :dateValue="postValue.editModel[i.data.name]"
                                                   :sType="i.data.type"></select-datepicker>
                                <!--时间选择器-->
                                <select-timepicker v-model="postValue.editModel[i.data.name]"
                                                   v-if="i.data.type == 'time'|| i.data.type == 'timerange'"
                                                   v-on:changeTimeFormat="changeTimeFormat"
                                                   :name="i.data.name"
                                                   :sName="i.data.name"
                                                   :disabled="pageState ==7"
                                                   :dateValue="postValue.editModel[i.data.name]"
                                                   :sType="i.data.type"></select-timepicker>
                            </FormItem>
                        </fieldset>
                        <div style="color: #f77858;line-height: 3">提示：阈值速度单位为km/h，偏移距离单位为km</div>
                    </Form>
                </div>
                <div slot="right" v-if="">
                    <fieldset class="ex-box-title">
                        <legend><Button type="info" @click="selectMapModal">选择空间对象</Button></legend>
                    </fieldset>
                    <div class="tag-container">
                        <Tag v-for="item in aTagList" :name="item.cloudName" :key="item.id" class="tag-item">{{item.cloudName}}</Tag>
                    </div>
                </div>
            </Split>
        </div>
        <div slot="footer">
            <div class="layout-modal-button" v-if="pageState !==7 ">
                <Button type="success" icon="md-checkmark-circle" :loading="alarmRuleModal.mLoading"
                        @click="handleSave('tableModal')">
                    {{saveBtnText}}
                </Button>
                <Button @click="handleCancel"> 取 消 </Button>
            </div>
        </div>
    </Modal>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase,no-dupe-keys */
//调用的库文件
import Util from '../../../libs/util'
import * as types from '../../../libs/types'

/**********调用的组件*************/
import sTree from '../form/select-tree.vue'
import selectRemote from '../form/select-remote.vue'
import selectDatepicker from '../form/select-datepicker'
import selectTimepicker from '../form/select-timepicker'

//接口地址
const PostDataUrl = require('../../../libs/api').PostDataUrl   //页面数据交换接口

export default {
    components: {
        sTree,
        selectRemote,
        selectDatepicker,
        selectTimepicker
    },
    props: ['modalCfg', 'inputData', 'tableData', 'tagList'],
    data() {
        return {
            Split: 0.7,
            edit: false,
            alarmRuleModal: this.$props.modalCfg, //传递进来的配置文件
            // sGridCfg: this.$props.gridCfg,
            sTableData: this.$props.tableData,

            //数据交换池
            postValue: {
                pageIndex: 1,
                pageSize: 20,
                pageTotal: 0,
                buttonId: 0,
                menuId: this.$route.meta.id,
                searchModel: {},
                editModel: {} //传递进来或初始化的输入框
            },


            //辅助数据池
            pageState: 0, //页面状态，根据传进来的bId来判断
            saveBtnText: '保存',
            ruleOver: true,
            iptId: {
                'dept': {
                    iptValue: '',
                    iptId: null
                }
            },
            aTagList: []
        }
    },
    mounted() {
        this.$refs["tableModal"].resetFields()
    },
    methods: {
        //保存按钮操作
        handleSave(name) {
            console.warn('======开始保存数据======')
            let self = this
            self.postValue.editModel.cloudMapList = self.aTagList
            if(self.postValue.editModel.cloudMapList.length <=0){
                self.$Notice.error({
                    title: '错误提示！',
                    desc: '请选择空间对象！',
                    duration: 5
                })
                return
            }
            self.postValue.buttonId = self.alarmRuleModal.buttonId //当前请求接口的按钮的Id
            Util.ojax.post(PostDataUrl + '/' + self.$route.meta.id, self.postValue).then(function (response) {
                if (response.data.code == 0) {
                    self.$Notice.success({
                        title: '提交成功！',
                        desc: '提交成功！',
                        duration: 5
                    })
                    self.handleCancel()
                    self.reloadPage()
                }else{
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: response.data.msg,
                        duration: 5
                    })
                }
            }).catch(function (error) {
                console.log(error)
            })
        },
        reloadPage(){
            setTimeout(function(){
                window.location.reload()
            }, 200)
        },

        //关闭组件，复原数据
        handleCancel() {
            var self = this
            self.alarmRuleModal.showModal = false
            self.$emit('handleModal', {buttonId: 1})
        },
        changeDateFormat(v){
            this.postValue.editModel[v.name] = v.value
        },
        changeTimeFormat(v){
            this.postValue.editModel[v.name] = v.value
        },

        /*临时*/
        hanldeSelectTree(v) {
            this.postValue.editModel[v.name] = v.value
        },
        handleTableData(v) {
        },

        /*弹出选择空间对象弹窗*/
        selectMapModal(){
            if(this.postValue.editModel.ruleType) {
                this.$emit('selectMapModal', {showModal: true, tagList: this.aTagList, ruleType: this.postValue.editModel.ruleType})
            } else {
                this.$Notice.error({
                    title: '错误提示！',
                    desc: '请先选择规则类型',
                    duration: 5
                })
            }
        }
    },
    watch: {
        modalCfg: {
            handler(n) {
                if (n) {
                    this.alarmRuleModal = n
                    this.postValue.buttonId = parseInt(n.buttonId)
                    this.pageState = this.postValue.buttonId
                    if(!n.showModal) {
                        this.aTagList = []
                        for(let k in this.inputData){
                            if(k){
                                this.inputData[k] = null
                            }
                        }
                        for(let k in this.postValue.editModel){
                            if(k){
                                this.postValue.editModel[k] = null
                            }
                        }
                    }
                }
            },
            immediate: true,
            deep: true
        },
        inputData: {
            handler(n) {
                if (n) {
                    this.postValue.editModel = n
                    if (!this.ruleOver) {
                        this.$refs["tableModal"].resetFields()
                    }
                }
            },
            immediate: true,
            deep: true
        },
        tableData: {
            handler(n) {
                if (n) {
                    this.sTableData = n
                }
            },
            immediate: true,
            deep: true
        },
        tagList: {
            handler(n) {
                if(n){
                    this.aTagList = n
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style>
    fieldset.ex-box-title{padding: 0;border: none;border-top: 1px solid #e0e0e0;margin: 0 !important;}
    fieldset.ex-box-title > legend {font-size: 14px;margin: 0 auto;text-align: center;padding: 0 1rem;color: #149FD7;}
    .tag-container{float: left;height: 100%;border-right: 1px solid #ddd;overflow-x: hidden;overflow-y: auto;text-align: center; width:100%}
    .tag-item.ivu-tag{width:70%;margin: 8px auto;float: none;border: 1px solid #ddd;text-align: center;display: block;padding: .35rem .5rem;border-radius: .35rem;height:30px;line-height: 1; font-size: 15px;background-color: #5eb95e; color:#fff}
</style>