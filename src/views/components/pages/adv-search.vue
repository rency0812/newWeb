<style>
    .ivu-date-picker .ivu-select-dropdown {
        background-color: #fff;
    }

    .ivu-date-picker-header-label, span.ivu-date-picker-cells-cell, .ivu-time-picker-cells-list ul li, .ivu-input-icon, .ivu-select-selection .ivu-icon {
        color: #333;
    }

    .ivu-date-picker-cells-cell-next-month em, .ivu-date-picker-cells-cell-prev-month em {
        color: #dfdfdf;
    }

    .ivu-date-picker-rel {
        margin-top: 4px;
    }

    .layout-adv-search {
        position: relative;
        transition: height 0.5s ease;
        margin-bottom: 15px;
    }

    .layout-adv-search .ivu-select-dropdown, .layout-modal-content .ivu-select-dropdown {
        background-color: #f8f8f8;
        overflow: auto;
    }

    .layout-adv-search .ivu-select-item, .layout-modal-content .ivu-select-item {
        padding: 7px 16px;
    }

    .ivu-select-not-found {
        line-height: 2.4;
    }

    .btn_show_more {
        position: absolute;
        right: 15px;
        top: 5px;
        width: 24px !important;
        height: 24px !important;
    }

    .show_more {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
        width: 100%;
        max-height: 120px;
        overflow-y: auto;
        overflow-x: hidden;
    }

</style>
<template>
    <div class="layout-adv-search" :class="showMoreSearch">
        <Form ref="formInline" inline label-position="right" :label-width="100">
            <FormItem :label="item.label+':'" v-for="item in sCfg.cfg" :key="item.id">
                <!--输入框-->
                <Input type="text" v-model="searchModel[item.name]" :placeholder="'请输入'+item.label+'...'" size="small"
                       v-if="item.type == 'input'"></Input>
                <!--时间日期选择器-->
                <select-datepicker v-model="searchModel[item.name]"
                                   v-if="item.type == 'date' || item.type == 'datetime' || item.type == 'datetimerange' || item.type == 'daterange'"
                                   v-on:changeDateFormat="changeDateFormat"
                                   :dateValue="item.value"
                                   :name="item.name"
                                   :sName="item.name"
                                   :sType="item.type"></select-datepicker>
                <!--时间选择器-->
                <select-timepicker v-model="searchModel[item.name]"
                                   v-if="item.type == 'time' || item.type == 'timerange'"
                                   v-on:changeTimeFormat="changeTimeFormat"
                                   :name="item.name"
                                   :sName="item.name"
                                   :sType="item.type"></select-timepicker>

                <!--多选组合框-->
                <CheckboxGroup v-model="searchModel[item.name]" v-if="item.type == 'checkbox-group'" size="small">
                    <Checkbox :label="option.value" v-for="(option, key) in item.option" :key="key">
                        <Icon :type="option.icon" v-if="option.icon"></Icon>
                        <span>{{option.label}}</span>
                    </Checkbox>
                </CheckboxGroup>

                <!--<DatePicker type="datetime" size="small"-->
                            <!--v-model="searchModel[item.name]"-->
                            <!--:placeholder="'请输入'+item.label+'...'"-->
                            <!--@on-change="changeDateFormat"-->
                            <!--format="yyyy-MM-dd HH:mm:ss"-->
                            <!--v-if="item.type == 'datepicker'"></DatePicker>-->
                <!--单选框-->
                <RadioGroup v-model="searchModel[item.name]" v-if="item.type == 'radio'">
                    <Radio :label="i.label" v-for="i in item.children" :key="i.label"></Radio>
                </RadioGroup>
                <!--复选框-->
                <CheckboxGroup v-model="searchModel[item.name]" v-if="item.type == 'checkbox'" >
                    <Checkbox :label="i.label" v-for="i in item.children" :key="i.label"></Checkbox>
                </CheckboxGroup>
                <!--选择下拉-->
                <Select v-model="searchModel[item.name]" clearable filterable v-if="item.type == 'select'"
                        size="small">
                    <Option :value="i.value" v-for="i in item.option" :key="i.value" :label="i.label"></Option>
                </Select>
                <!--动态渲染下拉-->
                <select-remote v-model="searchModel[item.name]"
                              v-if="item.type == 'select-remote'"
                              :name="item.name"
                              :option="item.option"
                              size="small"
                              v-on:toTreeModal="hanldeSelectRemote"
                              :selectOptionValue="searchModel[item.name]">
                </select-remote>

                <!--自动完成-->
                <select-remote-auto-complete
                        v-model="searchModel[item.name]"
                        v-on:autoCompleteData="autoCompleteData"
                        :option="item.option"
                        :name="item.name"
                        :sName="item.name"
                        v-if="item.type == 'auto-complete'"></select-remote-auto-complete>

            </FormItem>
            <FormItem>
                <Button type="info" size="small" buttonId="1" icon="md-search" class="adv-search-btn" @click="handleSearch('1')">
                    查询
                </Button>
                <Button type="success" size="small" buttonId="2" icon="md-add" class="adv-search-btn"
                        @click="handleControl('2')" v-if="sCfg.button.indexOf('2') >-1">
                    新增
                </Button>
                <Button type="error" size="small" buttonId="8" icon="md-close" class="adv-search-btn"
                        @click="handleControl('8')" v-if="sCfg.button.indexOf('8') >-1">
                    批量删除
                </Button>
                <Button type="default" size="small" buttonId="5" icon="md-cloud-download" class="adv-search-btn"
                        @click="handleControl('5')"  v-if="sCfg.button.indexOf('5') >-1">
                    导入
                </Button>
                <Button type="default" size="small" buttonId="6" icon="md-cloud-upload" class="adv-search-btn"
                        @click="handleSearch('6')"  v-if="sCfg.button.indexOf('6') >-1">
                    导出
                </Button>
                <!--<Button type="warning" size="small" buttonId="104" icon="md-car" class="adv-search-btn"-->
                        <!--@click="handleControl('104')"  v-if="Array.indexOf(sCfg.button, '104') >-1">-->
                    <!--绑定车辆/设备-->
                <!--</Button>-->
                <Button type="warning" size="small" buttonId="105" icon="md-car" class="adv-search-btn"
                        @click="handleControl('105')"  v-if="sCfg.button.indexOf('105') >-1">
                    同步
                </Button>
                <Button type="warning" size="small" buttonId="9" icon="md-car" class="adv-search-btn"
                    @click="handleSearch('9')"  v-if="Array.indexOf(sCfg.button, '9') >-1">
                    批量导出
                </Button>
            </FormItem>

        </Form>
        <Button type="default" shape="circle" size="small" icon="md-chevron-down" class="btn_show_  more"
                @click="handleShowMore" v-if="searchCfg.length > 4"></Button>
        <Button type="default" shape="circle" size="small" icon="md-chevron-up" class="btn_show_more"
                @click="handleShowMore" v-if="showMoreSearch !==''"></Button>
    </div>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,init-declarations,no-unused-vars */

import Util from '../../../libs/util'
import selectRemote from  '../form/select-remote'
import selectRemoteAutoComplete from  '../form/select-remote-auto-complete'
import selectDatepicker from '../form/select-datepicker'
import selectTimepicker from "../form/select-timepicker"

const PostDataUrl = require('../../../libs/api').PostDataUrl   //页面数据交换接口

export default {
    props: ['searchCfg'],
    components: {
        selectRemote,
        selectRemoteAutoComplete,
        selectDatepicker,
        selectTimepicker,
    },
    data() {
        return {

            sCfg: this.$props.searchCfg,
            searchModel:{},

            //页面辅助数据池
            showMoreSearch: '',
        }
    },
    methods: {
        handleControl(e) {
            this.$emit('handleModal', {buttonId: e, value: this.row, index: this.index})
        },
        handleSearch(e) {
            this.$emit('handleModal', {buttonId: e, value: this.searchModel})
        },

        //还未修改
        handleShowMore() {
            var self = this
            if (!self.showMoreSearch) {
                self.showMoreSearch = 'show_more'
            } else {
                self.showMoreSearch = ''
            }
            console.log(self.showMoreSearch)
        },
        handleTongbu(){},
        hanldeSelectRemote(v) {
            this.searchModel[v.name] = v.value
        },
        autoCompleteData(v){
            let self = this
            self.searchModel[v.name] = v.value
        },
        changeDateFormat(v){
            if(v.value == " | "){
                this.searchModel[v.name] = null
            }else{
                this.searchModel[v.name] = v.value
            }
        },
        changeTimeFormat(v){
            this.searchModel[v.name] = v.value
        }
    },
    mounted() {
        console.log(this.sCfg.cfg)
    },
    computed: {
        searchParams: function () {
            let searchCfg = this.searchCfg.Cfg
            let searchParams = new Object()
            for (var i in searchCfg) {
                searchParams[searchCfg[i].name] = ''
            }
            return searchParams
        }
    },
    watch: {
        searchCfg: {
            handler(n, o) {
                this.sCfg = n
            },
            immediate: true,
            deep: true
        }
    }
}
</script>