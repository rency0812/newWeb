<style>
    .showAll {
        width: 100% !important;
        transition: width .3s ease-in-out;
    }
    .layout-modal-content-vehicle .ivu-transfer .ivu-transfer-list{width: 35%;height: 100%;}
</style>
<style scoped>

</style>
<template>
    <Modal v-model="commandModal.showModal" :mask-closable="false" width="60%" class="layout-modal-band">
        <p slot="header">
            <Icon type="md-car"></Icon>
            <span>绑定车辆</span>
        </p>
        <div class="layout-modal-content">
            <div class="layout-modal-content-tree" v-if="tabsName === 'Transfer'">
                <h4 style="line-height: 32px;background-color: #d7dde4;margin: -5px -15px 10px;padding: 0 15px;">
                    <Icon type="ios-bookmarks"></Icon>
                    企业选择
                </h4>
                <v-jstree :data='treeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
                          :allow-batch="false" :show-checkbox="false" :multiple="false"
                          @item-click="treeNodeClick"></v-jstree>
            </div>
            <div class="layout-modal-content-vehicle" :class="{showAll:tabsName !== 'Transfer'}">
                <Tabs value="CfgInfo" type="card" @on-click="handleTabs">
                    <TabPane label="配置信息" name="CfgInfo" icon="md-cloud-download">
                        <div class="layout-modal-content-input">
                            <Form ref="tableModal" autocomplete="on" :model="postValue.editModel" style="padding: 0 15px 10px"
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
                                               :disabled="true"/>

                                        <!--输入框-->
                                        <Input :placeholder="'请输入'+i.data.label+'...'" size="small" clearable
                                               v-model="postValue.editModel[i.data.name]" v-if="i.data.type == 'input'"
                                               :disabled="pageState == 7"/>

                                        <!--数字输入框-->
                                        <InputNumber v-model="postValue.editModel[i.data.name]" :min="0" size="small"
                                                     :placeholder="'请选择'+i.data.label+'...'"
                                                     v-if="i.data.type == 'input-num'"
                                                     style="width: 100%"
                                                     :disabled="pageState == 7"></InputNumber>

                                        <!--时间日期选择器-->
                                        <DatePicker type="datetime" size="small"
                                                    v-model="postValue.editModel[i.data.name]"
                                                    :placeholder="'请输入'+i.data.label+'...'"
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
                    </TabPane>
                    <TabPane label="选择车辆" name="Transfer" icon="md-cart">
                        <Transfer
                                style="height: 400px; text-align:center; margin:10px 0 20px 0"
                                :data="source"
                                :titles="['未绑定车辆', '已选车辆']"
                                :operations="['解绑车辆','绑定车辆']"
                                :target-keys="target"
                                filterable
                                :filter-method="filterMethod"
                                @on-change="handleChange"></Transfer>
                        <div class="layout-modal-transfre-page ">
                            <Page :total="totalSource.length" :page-size="pageSize" :current="pageCurrent"
                                  size="small"
                                  @on-change="handlePage" show-total
                                  class="fl">
                                <Icon type="ios-information"></Icon>
                                共 {{totalSource.length}} 辆未绑定车辆
                            </Page>
                            <Page :total="totalSource.length" :page-size="pageSize" :current="pageCurrent"
                                  size="small"
                                  @on-change="handlePage"
                                  class="fr"></Page>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
        <div slot="footer">
            <div class="layout-modal-button">
                <Button type="success" icon="md-checkmark-circle" :loading="modal_loading">
                    确定绑定
                </Button>
                <Button @click="handleCancel('tableModal')"> 取 消 </Button>
            </div>
        </div>
    </Modal>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase,no-unused-vars,no-dupe-keys,no-redeclare,no-case-declarations */


import VJstree from 'vue-jstree'
import Util from '../../../libs/util'
import * as types from '../../../libs/types'
import selectRemote from  '../form/select-remote'
import selectRemoteAutoComplete from  '../form/select-remote-auto-complete'
import selectDatepicker from '../form/select-datepicker'
import selectTimepicker from "../form/select-timepicker"


const GetVehicleListUrl = require('../../../libs/api').PostDataUrl
const PostDeptTreeUrl = require('../../../libs/api').PostTreeUrl


export default {
    components: {
        VJstree,
        selectRemote,
        selectRemoteAutoComplete,
        selectDatepicker,
        selectTimepicker
    },
    props: ['bandCfg', 'modal_loading', 'modalCfg', 'inputData'],
    data() {
        return {
            commandModal: this.$props.modalCfg, //传递进来的配置文件
            band_loading: false,
            source: [],
            target: [],
            showTransfer: true,
            totalSource: [],
            pageCurrent: 1,
            pageSize: 100,
            loaded: false,
            importData: null,
            importShow: [],
            showVechileNum: false,
            tabsName: 'CfgInfo',
            treeData: [],
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
        }
    },
    methods: {
        handleBandSave() {
            var self = this
            self.band_loading = true
            setTimeout(() => {
                self.bandCfg.show = false
                self.band_loading = false
            }, 2000)
        },
        handleCancel() {
            var self = this
            self.bandCfg.show = false
        },
        handleTransfer() {
            this.showTransfer = true
        },
        handleTree(v) {
            let self = this
            self.pageCurrent = 1
            self.target = []
            self.getVehicleData()
        },
        handleData() {
            let self = this
            let pageCurrent = self.pageCurrent
            let pageSize = self.pageSize
            let totalSource = self.totalSource
            if (self.loaded) {
                self.source = totalSource.slice((pageCurrent - 1) * pageSize, pageCurrent * pageSize)
            }
        },
        handlePage(e) {
            let self = this
            self.pageCurrent = e
            self.handleData()
        },
        getVehicleData() {
            let self = this
            let mockData = [];
            self.loaded = false
            Util.ajax.post(GetVehicleListUrl, {listType: "truckList"}).then(function (response) {
                for (var i in response.data.DataList) {
                    mockData.push({
                        key: (response.data.DataList[i].ListData).toString(),
                        label: response.data.DataList[i].ListData
                    })
                }
                self.totalSource = mockData;
                self.loaded = true
                self.handleData()
            }).catch(function (error) {
                self.loaded = false
                console.log(error)
            })
        },
        handleChange(newTargetKeys, direction, moveKeys) {
            let self = this
            let targetStore = self.targetStore
            self.target = newTargetKeys
            self.target = self.uniqueArray(self.target);
        },
        filterMethod(data, query) {
            return data.label.indexOf(query) > -1;
        },
        handleTabs(name) {
            console.log(name)
            this.tabsName = name
        },
        uniqueArray(array) {
            var newArr = [array[0]]
            for (var i = 1; i < array.length; i++) {
                var Item = array[i]
                var repeat = false
                for (var j = 0; j < newArr.length; j++) {
                    if (Item == newArr[j]) {
                        repeat = true
                        break
                    }
                }
                if (!repeat) {
                    newArr.push(Item)
                }
            }
            return newArr
        },
        initTree() {
            let self = this
            Util.ojax.post(PostDeptTreeUrl, {tree: 'dept'}).then(function (response) {
                console.log(response)
                self.treeData = response.data.detail
            }).catch(function (error) {
                console.log(error)
            })
        },
        // 点击节点
        treeNodeClick: function (n, i) {
            console.log(n)
        }
    },
    mounted() {
        this.initTree()
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
        // showModal(curVal, oldVal) {
        //     let self = this
        //     if (curVal) {
        //         self.pageCurrent = 1
        //         self.source = []
        //         self.target = []
        //         self.totalSource = []
        //     }
        // }
    },
    // computed: {
    //     show() {
    //         return this.$props.commandModal.showModal
    //     }
    // }
}
</script>