<template>
    <div style="position: relative">
        <!--日期选择-->
        <DatePicker :type="sType"
                    size="small"
                    v-model="datepickerData"
                    placeholder="请选择日期..."
                    :clearable="false"
                    :disabled="disabled"
                    @on-change="changeDateFormat"
                    :format="dateFormat" :style="{width:width}"></DatePicker>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase */

import Util from '../../../libs/util'

export default {
    props: ['sName', 'sType', 'disabled', 'dateValue'],
    data() {
        return {
            datepickerData:'',
            dateFormat:'',
            width:'100%'
        }
    },
    mounted(){
        // let nD = new Date()
        // let month = nD.getMonth() + 1
        // let year = nD.getFullYear()
        // let day = nD.getDay()
        // if(month<10){
        //     month = '0' + month
        // }
        // let firstDay = year + '-' + month + '-01 00:00:00'
        // let today = year + '-' + month + day + ' 23:59:59'
        // if(this.$route.meta.id == 1896){
        //     // let today = Util.formatTime(nD)
        //     let aa = new Array()
        //     aa[0] = firstDay
        //     aa[1] = today
        //     this.datepickerData = aa
        // }else if(this.$route.meta.id == 1889 && this.sName == "startTime"){
        //     // let nD = new Date()
        //     // let month = nD.getMonth() + 1
        //     // let year = nD.getFullYear()
        //     // let day = nD.getDay()
        //     // if(month<10){
        //     //     month = '0' + month
        //     // }
        //     // let firstDay = year + '-' + month + '-01 00:00:00'
        //     // let today = year + '-' + month + day + ' 23:59:59'
        //     // // let today = Util.formatTime(nD)
        //     // let aa = new Array()
        //     // aa[0] = firstDay
        //     // aa[1] = today
        //     // debugger
        //     // this.datepickerData = aa
        // }
    },
    methods: {
        changeDateFormat(v) {
            let self = this
            if(typeof v == 'object') {
                self.$emit('changeDateFormat', {value: v.join(' | '), name:self.sName})
                self.changeWidth(220)
            }else{
                self.$emit('changeDateFormat', {value: Util.changeDate(v), name:self.sName})
                self.changeWidth()
            }
        },
        changeWidth(v){
            let self = this
            if(v){
                self.width = v + 'px'
            }else{
                self.width = '100%'
            }
        },
    },
    watch: {
        sType: {
            handler(n) {
                if(n){
                    if(n == 'datetime' || n == 'datetimerange'){
                        this.dateFormat = 'yyyy-MM-dd HH:mm:ss'
                    }else{
                        this.dateFormat = 'yyyy-MM-dd'
                    }
                }
            },
            immediate: true,
            deep: true
        },
        dateValue: {
            handler(n) {
                if(n){
                    if(this.sType == 'daterange' || this.sType == 'datetimerange'){
                        this.datepickerData = this.dateValue.split('|')
                        if(this.sType == 'daterange'){
                            this.changeWidth()
                        }else if(this.sType == 'datetimerange'){
                            this.changeWidth(220)
                        }
                    }else{
                        this.datepickerData = n
                        this.changeWidth()
                    }
                }else{
                    this.datepickerData = null
                    this.changeWidth()
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>