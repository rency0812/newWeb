<template>
    <Modal  v-model="checkboxModal.showModal"
            class-name="vertical-center-modal">
        <Row justify="center">
            <Col span="8" v-for="item in checkboxList" :xs="{ span: 5, offset: 1 }" :key="item.value" class-name="line-height-3">
            <CheckboxGroup v-model="checkboxListValue">
                <Checkbox :label="item.label" :value="item.value">
                    <span>{{item.label}}</span>
                </Checkbox>
            </CheckboxGroup>
            </Col>
        </Row>
        <div slot="footer">
            <div class="layout-modal-button">
                <Button type="success" icon="md-checkmark-circle" :loading="false"
                        @click="handleSave('tableModal')">
                    {{saveBtn}}
                </Button>
                <Button @click="handleCancel('tableModal')"> 取 消 </Button>
            </div>
        </div>
    </Modal>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase,no-dupe-keys */

import Util from '../../../libs/util'

const PostDeptTreeUrl = require('../../../libs/api').PostDeptTreeUrl
const PostSettingPermisionUrl = require('../../../libs/api').PostSettingPermisionUrl

export default {
    props: ['checkboxModal'],
    data() {
        return {
            saveBtn: '保存',
            checkboxListValue:[],
            checkboxList:[],
            treeModalCfg: {},
            modal_loading: false
        }
    },
    mounted(){    },
    methods: {
        handleSave() {
            this.$emit('handleModal', {action: 3, inputData: self.checkboxListValue})
            // let self = this
            // let postValue ={
            //     roleId:self.modelTree.roleId,
            //     data: self.treeModalData
            // }
            // Util.ojax.post(PostSettingPermisionUrl, postValue).then(function (response) {
            //     if (response.data.code == 0) {
            //         self.checkboxModal.show = false
            //         self.$Notice.success({
            //             title: '提交成功！',
            //             desc: '提交成功！',
            //             duration: 10
            //         })
            //     }else{
            //         self.$Notice.error({
            //             title: '错误提示！',
            //             desc: response.data.msg,
            //             duration: 10
            //         })
            //     }
            // }).catch(function (error) {
            //     console.log(error)
            // })
        },
        handleCancel() {
            var self = this
            self.checkboxModal.showModal = false
            self.checkboxListValue = []
            self.checkboxModalCfg = {}
        },
        //获取多选框的列表和值
        getCheckboxList(){
            let self = this
            Util.ojax.post(PostDeptTreeUrl, {tree: ''}).then(function (response) {
                console.log(response)
                if (response.data.code == 0) {
                    self.checkboxList = response.data.checkboxList
                    self.checkboxListValue = response.data.checkboxListValue
                }else{
                    self.$Notice.error({
                        title: '错误提示！',
                        desc: response.data.msg,
                        duration: 10
                    })
                }
            }).catch(function (error) {
                self.$Notice.error({
                    title: '错误提示！',
                    desc: error.data.msg,
                    duration: 10
                })
            })
        }
    },
    watch:{
        treeModal: {
            handler(newValue, oldName) {
                console.log(newValue);
                let self = this
                if(newValue.showModal) {
                    self.getCheckboxList()
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