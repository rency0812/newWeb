<template>
    <div style="position: relative">
        <!--自动完成-->
        <AutoComplete
                size="small"
                v-model="autoCompleteData"
                @on-search="handleSearchAutoComplete"
                @on-select="handleSelect"
                @on-change="handleSearchAutoComplete"
                :name="sName"
                :data="autoCompleteDataList"></AutoComplete>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase */

import Util from '../../../libs/util'

const PostTreeUrl = require('../../../libs/api').PostTreeUrl

export default {
    props: ['option', 'sName'],
    data() {
        return {
            autoCompleteData:'',
            autoCompleteDataList: []
        }
    },
    methods: {
        handleSearchAutoComplete(v){
            let self = this
            self.$emit('autoCompleteData', {value: v, name:self.sName})
            if(v){
                let postValue = {tree: self.option[0].value}
                postValue[self.sName] = v
                Util.ojax.post(PostTreeUrl, postValue).then(function (response) {
                    let arr = []
                    for(let key in response.data.detail.list){
                        arr.push(response.data.detail.list[key].vehNo)
                    }
                    self.autoCompleteDataList = arr
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
        handleSelect(v){
            let self = this
            self.$emit('autoCompleteData', {value: v, name:self.sName})
        }
    },
    watch: {}
}
</script>