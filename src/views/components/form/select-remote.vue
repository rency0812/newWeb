<template>
    <div style="position: relative">
        <!--选择下拉动态渲染option-->
        <Select v-model="inData" clearable filterable size="small" :name="name" :option="option" v-on:on-change="changeSelectOption" :disabled="disabled" :transfer="true">
            <Option v-for="item in optionList" :value="item.dicKey" :key="item.id">{{item.dicValue}}</Option>
        </Select>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase */

import Util from '../../../libs/util'

// const PostTreeUrl = require('../../../libs/api').PostTreeUrl


const PostTreeUrl = require('../../../libs/api').GetPageTreeCfgUrl1
const GetDicTypeUrl = require('../../../libs/api').GetDicType

export default {
    props: ['name', 'option', 'selectOptionValue', 'disabled', 'isShow'],
    data() {
        return {
            // selectValue: null,
            optionList: [],
            inData:this.$props.selectOptionValue,
            tempData:this.$props.selectOptionValue
        }
    },
    methods: {
        changeSelectOption(v){
            console.log(v)
            this.$emit('toTreeModal', {value: v, name:this.name})
        },
        initOptions(){
            let self = this
            let dicName = '$dicName_' + self.option
            let storeDic = localStorage.getItem(dicName)
            if(storeDic){
                self.optionList = JSON.parse(storeDic)
                self.setOptionSelected()
            }else{
                Util.ojax.get(GetDicTypeUrl + '?dicType='+ self.option).then(function (response) {
                    self.optionList = response.data.detail
                    if(response.data.detail.length > 0){
                        localStorage.setItem(dicName, JSON.stringify(response.data.detail))
                        self.setOptionSelected()
                    }
                })
            }
        },
        setOptionSelected(){
            let self = this
            // self.inData = self.tempData
        }
    },
    watch: {
        selectOptionValue: {
            handler(n, o){
                if(n){
                    this.inData = n.toString()
                }else{
                    this.inData = ''
                }
            },
            immediate: true,
            deep: true
        },

        // 如果是弹窗 则当弹窗显示的时候去请求接口渲染option
        isShow: {
            handler(n, o){
                if(n){
                    this.initOptions()
                }
            },
            immediate: true,
            deep: true
        },
    }
}
</script>