<template>
    <Modal v-model="inputModal.showModal" :draggable="false" :mask-closable="true" width="1200"
           class="layou-modal-input" @on-cancel="handleCancel">
        <div slot="header">
            <Icon type="information-circled"></Icon>
            <span>{{inputModal.title}}</span>
        </div>
        <div class="layout-modal-content">
            <Split v-model="Split">
                <div slot="left">
                    <Form ref="tableModal" autocomplete="on" :model="postValue.editModel"
                          :rules="inputModal.rule" inline
                          label-position="right"
                          :label-width="140">

                        <fieldset v-for="item in inputModal.cfg" :key="item.text" v-show="item.opened">
                            <legend>{{item.text}}</legend>
                            <FormItem :label="i.data.label+':'" v-for="i in item.children" :key="i.id"
                                      :prop="i.data.name">


                                <!--只读输入框-->
                                <Input size="small" v-model="postValue.editModel[i.data.name]"
                                       v-if="i.data.type == 'noput'"
                                       :name="i.data.name"
                                       :disabled="true"/>

                                <!--输入框-->
                                <Input size="small"
                                       v-model="postValue.editModel[i.data.name]"
                                       v-if="i.data.type == 'input'"
                                       :name="i.data.name"
                                       :disabled="pageState ==7"/>

                                <!--数字输入框-->
                                <InputNumber v-model="postValue.editModel[i.data.name]" :min="0" size="small"
                                             v-if="i.data.type == 'input-num'"
                                             :name="i.data.name"
                                             style="width: 100%"
                                             :disabled="pageState ==7 "></InputNumber>

                                <!--时间日期选择器-->
                                <DatePicker type="datetime" size="small"
                                            v-model="postValue.editModel[i.data.name]"
                                            :name="i.data.name"
                                            v-if="i.data.type == 'datepicker'"
                                            :disabled="pageState ==7 "></DatePicker>

                                <!--下拉树-->
                                <sTree v-model="postValue.editModel[i.data.name]" v-on:toTree="hanldeSelectTree"
                                       :name="i.data.name"
                                       :data="sInputData[i.data.name]" :show="inputModal.showModal" :option="i.data.option"
                                       v-if="i.data.type == 'select-tree'" style="width: 100%"
                                       :disabled="pageState ==7"/>
                                <!--选择下拉-->

                                <Select v-model="postValue.editModel[i.data.name]" clearable
                                        v-if="i.data.type == 'select'"
                                        size="small"
                                        :disabled="pageState ==7 "
                                        :name="i.data.name">
                                    <Option :value="v.value" v-for="v in i.data.option" :key="v.value" :label="v.label"/>
                                </Select>

                                <!--选择下拉-->
                                <Select v-model="postValue.editModel[i.data.name]"
                                        clearable
                                        filterable
                                        multiple
                                        v-if="i.data.type == 'select-multiple'"
                                        size="small">
                                    <Option :value="option.value" v-for="(option, key) in i.data.option" :key="key" :label="option.label"></Option>
                                </Select>

                                <!--多选组合框-->
                                <CheckboxGroup v-model="postValue.editModel[i.data.name]" v-if="i.data.type == 'checkbox-group'" size="small">
                                    <Checkbox :label="option.value" v-for="(option, key) in i.data.option" :key="key">
                                        <Icon :type="option.icon" v-if="option.icon"></Icon>
                                        <span>{{option.label}}</span>
                                    </Checkbox>
                                </CheckboxGroup>

                                <!--选择下拉-->
                                <selectRemote v-model="postValue.editModel[i.data.name]"
                                              v-if="i.data.type == 'select-remote'"
                                              :name="i.data.name"
                                              :option="i.data.option"
                                              size="small"
                                              v-on:toTreeModal="hanldeSelectTree"
                                              :selectOptionValue="postValue.editModel[i.data.name]"></selectRemote>
                            </FormItem>
                        </fieldset>
                    </Form>
                </div>
                <div slot="right">
                    <Table height="490" :columns="sGridCfg.cfg.slice(0, 3)" :data="sTableData" highlight-row border
                           @on-row-click="handleRowData" keep-alive></Table>
                    <Page :style="{height:'40px','margin-top':'10px'}" :current="sGridCfg.pageIndex"
                          :total="sGridCfg.pageTotal"
                          size="small" show-total
                          :page-size="sGridCfg.pageSize"
                          class="fr"
                          @on-change="handleTableData"></Page>
                </div>
            </Split>
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
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase,no-dupe-keys */
//调用的库文件
import Util from '../../../libs/util'
import * as types from '../../../libs/types'

/**********调用的组件*************/
import sTree from '../form/select-tree.vue'
import selectRemote from '../form/select-remote'

//接口地址
const PostDataUrl = require('../../../libs/api').PostDataUrl   //页面数据交换接口

export default {
    components: {
        sTree,
        selectRemote
    },
    props: ['modalCfg', 'inputData', 'gridCfg', 'tableData'],
    data() {
        return {
            Split: 0.6,
            edit: false,
            inputModal: this.$props.modalCfg, //传递进来的配置文件
            sGridCfg: this.$props.gridCfg,
            sTableData: this.$props.tableData,
            sInputData: this.$props.inputData,

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
            }
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
            self.inputModal.mLoading = true
            self.$refs[name].validate((valid) => {
                self.ruleOver = valid
                if (valid) {
                    self.postValue.buttonId = self.modalCfg.buttonId
                    Util.ojax.post(PostDataUrl + '/' + self.$route.meta.id, self.postValue).then(function (res) {
                        console.log(res)
                        if (res.data.code == 1) {
                            switch (self.pageState) {
                                case 2:
                                    self.$Modal.confirm({
                                        title: '新增信息',
                                        content: '是否继续新增信息？',
                                        onOk: () => {
                                            self.saveBtnText = '继续新增'
                                            self.postValue.editModel = {}
                                            self.sInputData = {}
                                            self.$refs["tableModal"].resetFields()
                                            // self.inputModal.title = self.$route.meta.title + ' - 编辑' + res.name
                                            self.$emit('handleModal', {buttonId: 1})
                                        },
                                        onCancel: () => {
                                            self.saveBtnText = '保存'
                                            self.inputModal.showModal = false
                                            self.$emit('handleModal', {buttonId: 1})
                                        }
                                    });
                                    break
                                case 3:
                                    self.$Notice.success({
                                        title: '温馨提示！',
                                        desc: '操作成功！',
                                        duration: 10
                                    })
                                    self.saveBtnText = '保存'
                                    self.inputModal.showModal = false
                                    self.$emit('handleModal', {buttonId: 1, value: {}})
                                    break
                            }

                        } else {
                            self.$Notice.error({
                                title: '错误提示！',
                                desc: res.data.msg,
                                duration: 10
                            })
                            self.saveBtnText = '保存'
                        }
                    }).catch(function (error) {
                        console.log(error)
                        self.$Notice.error({
                            title: types.SEARVICE_ERROR_TITLE,
                            desc: types.SEARVICE_ERROR,
                            duration: 10
                        })
                    })
                } else {
                    self.saveBtnText = '保存'
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: '必填项未填完成',
                        duration: 10
                    })
                }
                self.inputModal.mLoading = false
            })
        },

        //关闭组件，复原数据
        handleCancel() {
            var self = this
            self.inputModal.showModal = false
            self.$emit('handleModal', {buttonId: 1})
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
                        self.inputModal.title = self.$route.meta.title + ' - 编辑'
                    }
                });
            } else {
                self.postValue.editModel = res
                self.inputModal.title = self.$route.meta.title + ' - 查看详情'
            }
        },

        /*临时*/
        hanldeSelectTree(v) {
            console.log(v)
            this.postValue.editModel[v.name] = v.value
            //this.$emit('handleModal', this.inputData)
        },
        handleTableData(v) {
            this.postValue.pageIndex = v
            this.handleData()
        },
        //数据交换操作
        handleData() {
            console.warn('开始处理数据交换==================================')
            let self = this
            self.postValue.buttonId = 1
            let postValue = self.postValue
            Util.ojax.post(PostDataUrl + '/' + self.$route.meta.id, postValue).then(function (res) {
                console.log(res)
                if (res.data.code == 1) {
                    self.sTableData = res.data.detail.list == null ? [] : res.data.detail.list
                    self.sGridCfg.pageIndex = res.data.detail.pageNum
                    self.sGridCfg.pageSize = res.data.detail.pageSize
                    self.sGridCfg.pageTotal = res.data.detail.total
                } else {
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: res.data.msg,
                        duration: 10
                    })
                }
            }).catch(function (error) {
                self.pageCfg.gridCfg.tableData['nodata'] = types.SEARVICE_ERROR
                self.$Notice.error({
                    title: types.SEARVICE_ERROR_TITLE,
                    desc: types.SEARVICE_ERROR,
                    duration: 10
                })
            })
        }
    },
    watch: {
        modalCfg: {
            handler(n) {
                console.warn('table-modal-cfg')
                console.log(n)
                if (n) {
                    this.inputModal = n
                    this.postValue.buttonId = parseInt(n.buttonId)
                    this.pageState = this.postValue.buttonId
                    let ac = document.getElementsByName('account');
                    if(this.$route.id == 1866){
                        if(ac && this.pageState == 3){
                            ac[0].readOnly = true
                        }else{
                            if(ac && ac.length >0){
                                ac[0].readOnly = false
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
                console.warn('inputData-modal-cfg')
                console.log(n)
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
        'postValue.editModel': {
            handler(n) {
                let self = this
                if(n){
                   self.sInputData = n
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style>
    .ivu-select-multiple .ivu-select-selection{min-height:24px;overflow: hidden;max-height:30px}
    .ivu-select-item.ivu-select-item-selected.ivu-select-item-focus:after, .ivu-select-item.ivu-select-item-selected:after{content: "\f3ff"}
</style>