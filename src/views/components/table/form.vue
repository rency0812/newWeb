<template>
    <div>
        <Form ref="formInline" inline label-position="right" :label-width="100">
            <FormItem :label="item.label+':'" v-for="item in formModel" :key="item.id" :prop="item.name">
                <!--表单控件-->
                <!--输入框-->
                <Input type="text" v-model="formModel[item.name]" :placeholder="'请输入'+item.label+'...'"
                       size="small"
                       v-if="item.type == 'input'"/>

                <!--下拉树-->
                <selectTree v-model="formModel[item.name]" :treeType="item.treeType"
                            :placeholder="'请选择'+item.label+'...'" v-if="item.type == 'select-tree'"/>


                <!---->
                <!--&lt;!&ndash;时间日期选择器&ndash;&gt;-->
                <!--<selectDatepicker v-model="formModel[item.data.name]"-->
                <!--v-if="item.data.type == 'date' || item.data.type == 'datetime' || item.data.type == 'datetimerange' || item.data.type == 'daterange'"-->
                <!--v-on:changeDateFormat="changeDateFormat"-->
                <!--:dateValue="item.data.value"-->
                <!--:name="item.data.name"-->
                <!--:sName="item.data.name"-->
                <!--:sType="item.data.type"/>-->


                <!--时间日期选择器-->
                <selectDatepicker v-model="formModel[item.data.name]"
                                  v-if="item.data.type == 'date' || item.data.type == 'datetime' || item.data.type == 'datetimerange' || item.data.type == 'daterange'"
                                  v-on:changeDateFormat="changeDateFormat"
                                  :dateValue="item.data.value"
                                  :name="item.data.name"
                                  :sName="item.data.name"
                                  :sType="item.data.type"/>

                <!--时间选择器-->
                <selectTimepicker v-model="formModel[item.data.name]"
                                  v-if="item.data.type == 'time' || item.data.type == 'timerange'"
                                  v-on:changeTimeFormat="changeTimeFormat"
                                  :name="item.data.name"
                                  :sName="item.data.name"
                                  :sType="item.data.type"/>


                <!--多选组合框-->
                <CheckboxGroup v-model="formModel[item.data.name]" v-if="item.data.type == 'checkbox-group'"
                               size="small">
                    <Checkbox :label="option.value" v-for="(option, key) in item.data.option" :key="key">
                        <Icon :type="option.icon" v-if="option.icon"></Icon>
                        <span>{{option.label}}</span>
                    </Checkbox>
                </CheckboxGroup>


                <!--单选框-->
                <RadioGroup v-model="formModel[item.data.name]" v-if="item.data.type == 'radio'">
                    <Radio :label="i.label" v-for="i in item.children" :key="i.label"></Radio>
                </RadioGroup>


                <!--复选框-->
                <CheckboxGroup v-model="formModel[item.data.name]" v-if="item.data.type == 'checkbox'">
                    <Checkbox :label="i.label" v-for="i in item.children" :key="i.label"></Checkbox>
                </CheckboxGroup>


                <!--选择下拉-->
                <Select v-model="formModel[item.data.name]" clearable filterable v-if="item.data.type == 'select'"
                        size="small">
                    <Option :value="i.value" v-for="i in item.data.option" :key="i.value" :label="i.label"></Option>
                </Select>

                <!--动态渲染下拉-->
                <selectRemote v-model="formModel[item.data.name]"
                              v-if="item.data.type == 'select-remote'"
                              :name="item.data.name"
                              :option="item.data.option"
                              size="small"
                              v-on:toTreeModal="hanldeSelectRemote"
                              :selectOptionValue="formModel[item.data.name]"/>


                <!--自动完成-->
                <selectRemoteAutoComplete
                        v-model="formModel[item.data.name]"
                        v-on:autoCompleteData="autoCompleteData"
                        :option="item.data.option"
                        :name="item.data.name"
                        :sName="item.data.name"
                        v-if="item.data.type == 'auto-complete'"/>


            </FormItem>
        </Form>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,init-declarations,no-unused-vars */


import {mapState, mapActions} from 'vuex'
import selectRemote from '../form/select-remote'
import selectRemoteAutoComplete from '../form/select-remote-auto-complete'
import selectDatepicker from '../form/select-datepicker'
import selectTimepicker from "../form/select-timepicker"
import selectTree from '../form/select-tree.vue'


export default {
    props: ['formCfg', 'formModel'],
    components: {
        selectRemote,
        selectRemoteAutoComplete,
        selectDatepicker,
        selectTimepicker,
        selectTree
    },
    data() {
        return {
            // formModel: {},
        }
    },
    methods: {},
    computed: {
        menuId() {
            return this.$route.meta.menuId
        },
        // formModel(){
        //     console.log(this.formCfg)
        //     return this.formCfg
        // }
    }
}
</script>

<style scoped>

</style>