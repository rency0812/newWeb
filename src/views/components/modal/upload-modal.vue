<template>
    <Modal v-model="uploadModal.showModal" :draggable="false" :mask-closable="true" width="450"
           class="layou-modal-input" @on-cancel="handleCancel">
        <div slot="header">
            <Icon type="information-circled"></Icon>
            <span>{{this.$route.meta.title}} - 导入</span>
        </div>
        <div class="layout-modal-content" style="height: 200px">
            <!--"-->
            <Upload
                    ref="upload"
                    :headers="postHeader"
                    :multiple="uploadModal.multiple"
                    type="drag"
                    :accept="fileAccept"
                    :show-upload-list="false"
                    :before-upload="handleBeforUpload"
                    :on-progress="handleUploadProgress"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :action="ActionUploadUrl">
                <div style="padding: 50px 0; height: 150px">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击上传或将Excel文件拖拽在这里</p>
                </div>
            </Upload>
            <div v-if="file !== null" style="padding: 0 15px">已选择的文件: {{ file.name }}</div>
        </div>
        <div slot="footer">
            <div class="layout-modal-button">
                <Button type="success" icon="md-checkmark-circle" :loading="loadingStatus"
                        @click="handleUpload()">
                    {{saveBtnText}}
                </Button>
                <Button @click="handleCancel"> 取 消 </Button>
            </div>
        </div>
    </Modal>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase */



//接口地址
const ActionUploadUrl = require('../../../libs/api').ActionUploadUrl   //文件上传接口


export default {
    props: ['modalCfg'],
    data() {
        return {
            file: null,
            uploadModal: this.$props.modalCfg,
            ActionUploadUrl: ActionUploadUrl,
            fileAccept: '.xls, .xlsx',
            fileFormat: ['.xls', '.xlsx'],
            saveBtnText: '上传',
            postHeader: {
                token: JSON.parse(localStorage.getItem('$token')).access_token
            },
            postData: {
                menuId: this.$route.meta.id
            },
            loadingStatus: false
        }
    },
    methods: {
        handleBeforUpload(file) {
            // 保存需要上传的文件
            this.file = file;
            return false;
        },
        delectFile(event, file, fileList) { // 删除文件
            console.log(event)
            this.saveBtnText = '上传'
            this.file = null
            this.loadingStatus = false;
        },
        handleUpload() {
            if (!this.file) {
                this.$Notice.error({title: '未选择上传文件'})
                this.loadingStatus = false;
                return false
            }
            let item = this.file
            this.$refs.upload.post(item);
        },
        handleUploadProgress(event, file, fileList) {
            console.log(event)
            this.loadingStatus = true;
            this.saveBtnText = '请稍候，文件正在上传'
        },
        handleUploadSuccess(response, file, fileList) {
            console.log(response)
            console.log(file)
            console.log(fileList)
            this.delectFile()
            this.$Notice.success('Success')
            this.uploadModal.showModal = false
            this.$emit('handleModal', {buttonId: 1})
        },
        handleUploadError(event, file, fileList) {
            console.log(event)
            this.loadingStatus = false;
            this.saveBtnText = '上传失败，是否继续上传？'

        },
        handleCancel() {
            this.uploadModal.showModal = false
            this.delectFile()
            this.$emit('handleModal', {buttonId: 1, value: {}})
        }
    },
    watch: {
        modalCfg: {
            handler(n) {
                console.warn('upload-modal-cfg')
                console.log(n)
                if (n) {
                    this.uploadModal = n
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>