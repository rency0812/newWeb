<template>
    <div>
        <Form ref="formInline" inline label-position="right" :label-width="100">
            <FormItem :label="item.label+':'" v-for="item in formCfg" :key="item.id" :prop="item.name">

                <!--表单控件-->
                <!--只读输入框-->
                <Input size="small" v-model="formModal[item.name]"
                       v-if="item.type == 'readonly-input'"
                       :name="item.name"
                       :disabled="true"/>


                <!--输入框-->
                <Input type="text" v-model="formModal[item.name]" :placeholder="'请输入'+item.label.replace('*', '')+'...'"
                       size="small"
                       v-if="item.type == 'input'"/>

                <!--文本框-->
                <Input type="textarea" v-model="formModal[item.name]" :placeholder="'请输入'+item.label.replace('*', '')+'...'"
                       size="small" :rows="4"
                       v-if="item.type == 'textarea'"/>


                <!--时间日期选择器-->
                <selectDatepicker v-model="formModal[item.name]"
                                  v-if="item.type == 'datetime' || item.type == 'datetimerange' || item.type == 'daterange'"
                                  v-on:changeDateFormat="changeDateTimeFormat"
                                  :dateValue="item.value"
                                  :name="item.name"
                                  :sName="item.name"
                                  :sType="item.type"/>

                <selectDatepicker v-model="formModal[item.name]"
                                  v-if="item.type == 'date'"
                                  v-on:changeDateFormat="changeDateFormat"
                                  :dateValue="formModal[item.name]"
                                  :name="item.name"
                                  :sName="item.name"
                                  :sType="item.type"/>


                <!--时间选择器-->
                <selectTimepicker v-model="formModal[item.name]"
                                  v-if="item.type == 'time' || item.type == 'timerange'"
                                  v-on:changeTimeFormat="changeTimeFormat"
                                  :name="item.name"
                                  :sName="item.name"
                                  :sType="item.type"/>


                <!--下拉树-->
                <sTree v-model="formModal[item.name]" v-on:toTree="hanldeSelectTree"
                       :show="isShow"
                       :placeholder="'请选择'+item.label.replace('*', '')+'...'" :name="item.name"
                       :data="formModal[item.name]" :option="item.option" :iptValue="formModal[item.name]"
                       :treeType="item.treeType" v-if="item.type == 'select-tree'" style="width: 100%"/>


                <!--多选组合框-->
                <CheckboxGroup v-model="formModal[item.name]" v-if="item.type == 'checkbox-group'"
                               size="small">
                    <Checkbox :label="option.value" v-for="(option, key) in item.option" :key="key">
                        <Icon :type="option.icon" v-if="option.icon"></Icon>
                        <span>{{option.label}}</span>
                    </Checkbox>
                </CheckboxGroup>


                <!--单选框-->
                <RadioGroup v-model="formModal[item.name]" v-if="item.type == 'radio'">
                    <Radio :label="i.value" v-for="i in item.children" :key="i.value">
                        <span>{{i.label}}</span>
                    </Radio>
                </RadioGroup>


                <!--复选框-->
                <CheckboxGroup v-model="formModal[item.name]" v-if="item.type == 'checkbox'">
                    <Checkbox :label="i.label" v-for="i in item.children" :key="i.label"></Checkbox>
                </CheckboxGroup>


                <!--选择下拉-->
                <Select v-model="formModal[item.name]" clearable filterable v-if="item.type == 'select'" :transfer="true"
                        size="small">
                    <Option :value="i.value" v-for="i in item.option" :key="i.value" :label="i.label"></Option>
                </Select>

                <Select v-model="formModal[item.name]" clearable filterable v-if="item.type == 'select-number'" :transfer="true"
                        size="small">
                    <Option :value="i" v-for="i in item.option" :key="i" :label="i"></Option>
                </Select>


                <!--动态渲染下拉-->
                <selectRemote v-model="formModal[item.name]"
                              v-if="item.type == 'select-remote'"
                              :name="item.name"
                              :option="item.dicType"
                              size="small"
                              :isShow="isShow"
                              v-on:toTreeModal="hanldeSelectRemote"
                              :selectOptionValue="formModal[item.name]"/>

                <!--选择SIM卡下拉-->
                <select-sim v-model="formModal[item.name]"
                              v-if="item.type == 'select-sim'"
                              :name="item.name"
                              :option="item.dicType"
                              size="small"
                              :isShow="isShow"
                              v-on:toTreeModal="hanldeSelectDeviceRemote"
                              :selectOptionValue="formModal[item.name]"/>

                <!--选择设备下拉-->
                <select-device-remote v-model="formModal[item.name]"
                              v-if="item.type == 'select-device-type'"
                              :name="item.name"
                              :option="item.dicType"
                              size="small"
                              :isShow="isShow"
                              v-on:toTreeModal="hanldeSelectDeviceRemote"
                              :selectOptionValue="formModal[item.name]"/>



                <!--自动完成-->
                <selectRemoteAutoComplete
                        v-model="formModal[item.name]"
                        v-on:autoCompleteData="autoCompleteData"
                        :option="item.option"
                        :name="item.name"
                        :sName="item.name"
                        v-if="item.type == 'auto-complete'"/>

                <!--上传图片-->
                <upload-file
                        v-model="formModal[item.name]"
                        :name="item.name"
                        v-if="item.type == 'upload-file'"
                        v-on:uploadFile="uploadFile">
                </upload-file>


                <!--图片容器-->
                <img :src="formModal[item.name]" alt="" v-if="item.type == 'img'">

            </FormItem>
        </Form>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,init-declarations,no-unused-vars */


import {mapState, mapActions} from 'vuex'
import sTree from '../form/select-tree.vue'
import selectRemote from '../form/select-remote'
import selectRemoteAutoComplete from '../form/select-remote-auto-complete'
import selectDatepicker from '../form/select-datepicker'
import selectTimepicker from "../form/select-timepicker"
import selectDeviceRemote from '../form/select-device-remote'
import selectSim from '../form/select-sim'
import uploadFile from '../form/upload-file'


export default {
    props: ['formCfg', 'formModal', 'isShow'],
    components: {
        sTree,
        selectRemote,
        selectRemoteAutoComplete,
        selectDatepicker,
        selectTimepicker,
        selectDeviceRemote,
        selectSim,
        uploadFile
    },
    data() {
        return {
            formData: []
        }
    },
    methods: {
        // 上传文件
        uploadFile(v){
            this.formModal[v.name] = v.fileData
        },
        // 动态加载下拉选项选择
        hanldeSelectRemote(v) {
            this.formModal[v.name] = v.value
        },
        hanldeSelectDeviceRemote(v) {
            this.formModal[v.name] = v.value
        },
        // 选择下拉日期
        changeDateFormat(v){
            this.formModal[v.name] = v.value.substr(0, 10)
        },
        // 选择时间日期下拉
        changeDateTimeFormat(){
            this.formModal[v.name] = v.value
        },
        // 下拉树选择
        hanldeSelectTree(v) {
            console.log(v)
            this.formModal[v.name] = v.value
        },
        ...mapActions('tableState', [
            'clearFormData',
        ])
    },
    computed: {},
    watch: {
        formModal: {
            handler(data) {
                if (data) {
                    this.$emit('updateFormData', data)
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style scoped>

</style>