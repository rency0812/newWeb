<template>
    <div>
        <Modal v-model="inputModal.showModal" :draggable="false" :mask-closable="false" width="800"
               class="layou-modal-input" @on-cancel="handleCancel">
            <div slot="header">
                <Icon type="information-circled"></Icon>
                <span>{{inputModal.title}}</span>
            </div>
            <div class="layout-modal-content" style="height: auto">
                <Form ref="tableModal" autocomplete="on" :model="postValue.editModel" style="padding: 0 15px 10px"
                      :rules="inputModal.rule" inline
                      label-position="right"
                      :label-width="140">

                    <fieldset v-for="item in inputModal.cfg" :key="item.text" v-show="item.opened">
                        <legend>{{item.text}}</legend>
                        <FormItem :label="i.data.label" v-for="i in item.children" :key="i.id"
                                  :prop="i.data.name">

                            <!--只读输入框-->
                            <Input size="small" v-model="postValue.editModel[i.data.name]"
                                   :name="i.data.name"
                                   v-if="i.data.type == 'noput'"
                                   :disabled="true"/>

                            <!--输入框-->
                            <Input :placeholder="'请输入'+i.data.label+'...'"
                                   size="small" clearable
                                   v-model="postValue.editModel[i.data.name]"
                                   v-if="i.data.type == 'input'"
                                   :name="i.data.name"
                                   :disabled="pageState == 7"/>

                            <!--数字输入框-->
                            <InputNumber v-model="postValue.editModel[i.data.name]" :min="0" size="small"
                                         :placeholder="'请选择'+i.data.label+'...'"
                                         v-if="i.data.type == 'input-num'"
                                         :name="i.data.name"
                                         style="width: 100%"
                                         :disabled="pageState == 7"></InputNumber>

                            <!--时间日期选择器-->
                            <DatePicker type="datetime" size="small"
                                        v-model="postValue.editModel[i.data.name]"
                                        :placeholder="'请输入'+i.data.label+'...'"
                                        :name="i.data.name"
                                        v-if="i.data.type == 'datepicker'"
                                        :disabled="pageState == 7"></DatePicker>

                            <!--下拉树-->
                            <sTree v-model="postValue.editModel[i.data.name]" v-on:toTree="hanldeSelectTree"
                                   :placeholder="'请选择'+i.data.label+'...'" :name="i.data.name"
                                   :data="inputData[i.data.name]" :show="inputModal.showModal" :option="i.data.option"
                                   v-if="i.data.type == 'select-tree'" style="width: 100%"
                                   :disabled="pageState == 7" />
                            <!--选择下拉-->

                            <Select v-model="postValue.editModel[i.data.name]" clearable filterable
                                    v-if="i.data.type == 'select'"
                                    size="small"
                                    :disabled="pageState ==7 ">
                                <Option :value="v.value" v-for="v in i.data.option" :key="v.label"
                                        :label="v.label" />
                            </Select>

                            <!--有按钮的input-->
                            <Input type="text" :placeholder="'请输入'+ i.data.label +'...'"
                                   v-model="postValue.editModel[i.data.name]"
                                   size="small"
                                   readonly
                                   @on-focus="showSecondModal"
                                   :name="i.data.name"
                                   v-if="i.data.type == 'input-button-modal'" />

                        </FormItem>
                    </fieldset>
                </Form>
            </div>
            <div slot="footer">
                <div class="layout-modal-button" v-if="pageState !==7 ">
                    <Button type="success" icon="md-checkmark-circle" :loading="inputModal.mLoading"
                            @click="handleSave('tableModal')">
                        {{saveBtnText}}
                    </Button>
                    <Button @click="handleCancel"> 取 消 </Button>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase,no-dupe-keys */
//调用的库文件
import Util from '../../../libs/util'
import * as types from '../../../libs/types'

/**********调用的组件*************/
import sTree from '../form/select-tree.vue'
import mapContainer from '../mapObj/bak/map-container.vue'

//接口地址
const PostDataUrl = require('../../../libs/api').PostDataUrl   //页面数据交换接口

export default {
    components: {
        sTree,
        mapContainer
    },
    props: ['modalCfg', 'inputData', 'gridCfg', 'tableData', 'postMapData'],
    data() {
        return {
            Split: 0.6,
            edit: false,
            inputModal: this.$props.modalCfg, //传递进来的配置文件
            sGridCfg: this.$props.gridCfg,
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
            showMapModal:false
        }
    },
    mounted() {
        this.$refs["tableModal"].resetFields()
    },
    methods: {
        //保存按钮操作
        handleSave(name) {
            let self = this
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

        //关闭组件，复原数据
        handleCancel() {
            var self = this
            self.inputModal.showModal = false
            self.$emit('handleModal', {buttonId: 1})
        },
        reloadPage(){
            setTimeout(function(){
                window.location.reload()
            }, 200)
        },

        //点击table组件，数据发生变化
        handleRowData(res) {
            var self = this
            console.log(self.pageState)
            if (self.pageState !== 7) {
                self.$Modal.confirm({
                    title: '编辑',
                    content: '是否修改该条目？',
                    onOk: () => {
                        self.postValue.editModel = res
                        self.inputModal.title = self.$route.meta.title + ' - 编辑' + res.name
                    }
                });
            } else {
                self.postValue.editModel = res
                self.inputModal.title = self.$route.meta.title + ' - 查看:' + res.name
            }
        },

        /*临时*/
        hanldeSelectTree(v) {
            this.postValue.editModel[v.name] = v.value
            //this.$emit('handleModal', this.inputData)
        },
        handleTableData(v) {
        },

        //弹出地图编辑弹窗
        showSecondModal(){
            this.$emit('showSecondModal', {showModal: true})
        },
        setAddr(v){
            this.postValue.editModel.mapJson = JSON.stringify(v.aoLatLng)
            this.postValue.editModel.addr = v.addr
            let a = document.getElementsByName('addr')[0]
            a.value = v.addr
        }
    },
    watch: {
        modalCfg: {
            handler(n) {
                if (n) {
                    this.inputModal = n
                    this.postValue.buttonId = parseInt(n.buttonId)
                    this.pageState = this.postValue.buttonId
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
        gridCfg: {
            handler(n) {
                console.warn('gridCfg-modal-cfg')
                console.log(n)
                if (n) {
                    this.sGridCfg = n
                    this.postValue.pageIndex = this.sGridCfg.pageIndex
                    this.postValue.pageSize = this.sGridCfg.pageSize
                    this.postValue.pageTotal = this.sGridCfg.pageTotal
                }
            },
            immediate: true,
            deep: true
        },
        tableData: {
            handler(n) {
                console.warn('tableData-modal-cfg')
                console.log(n)
                if (n) {
                    this.sTableData = n
                }
            },
            immediate: true,
            deep: true
        },
        postMapData: {
            handler(v) {
                if(v){
                    this.setAddr(v)
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style>

</style>