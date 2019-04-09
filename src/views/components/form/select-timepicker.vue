<template>
    <div style="position: relative">
        <!--时间选择-->
        <TimePicker :type="sType"
                    size="small"
                    v-model="datepickerData"
                    placeholder="请选择时间..."
                    :clearable="false"
                    :disabled="disabled"
                    @on-change="changeTimeFormat"></TimePicker>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase */

import Util from '../../../libs/util'

export default {
    props: ['sName', 'sType', 'disabled', 'dateValue'],
    data() {
        return {
            datepickerData:''
        }
    },
    methods: {
        changeTimeFormat(v) {
            let self = this
            if(typeof v == 'object') {
                // let sArr = []
                // for(let key in v){
                //     sArr.push(Util.changeDate(v[key]))
                // }
                self.$emit('changeTimeFormat', {value: v.join(' | '), name:self.sName})
            }else{
                self.$emit('changeTimeFormat', {value: Util.changeDate(v), name:self.sName})
            }
        }
    },
    watch: {
        dateValue: {
            handler(n) {
                if(n){
                    if(this.sType == 'timerange'){
                        this.datepickerData = this.dateValue.split('|')
                    }else{
                        this.datepickerData = n
                    }
                }else{
                    this.datepickerData = null
                }
            },
            immediate: true,
            deep: true
        },
    }
}
</script>