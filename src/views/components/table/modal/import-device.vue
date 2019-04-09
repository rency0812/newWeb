<template>
    <div class="extra-button-container">
        <Button size="small" icon="ios-cloud-upload-outline" class="adv-search-btn"
                @click="handleSaveDepartment"> 导入
        </Button>
        <Modal v-model="showModal" :draggable="true" :mask-closable="false" width="450"
               class="layou-modal-input" @on-cancel="handleCancel">
            <div slot="header">
                <Icon type="information-circled"></Icon>
                <span>导入设备</span>
            </div>
            <div class="layout-modal-content" style="height:inherit">
                <Form ref="formInline" inline label-position="right" :label-width="100">
                    <FormItem label="模版">
                        <a href="#" @click="downloadExcel">模板下载.xlsx</a>
                    </FormItem>
                    <FormItem label="导入设置" style="width: 100%">
                        <Checkbox v-model="importCfg">允许导入重复数据</Checkbox>
                        <p>请确认数据信息并谨慎选择，建议正常不勾选</p>
                    </FormItem>
                </Form>
                <Upload
                        ref="upload"
                        :headers="postHeader"
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
                    <Button @click="handleCancel"> 取 消 </Button>
                    <Button type="success" icon="md-checkmark-circle" :loading="loadingStatus"
                            @click="handleUpload()">
                        {{saveBtnText}}
                    </Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Util from '../../../../libs/util'
    import {mapGetters, mapMutations} from 'vuex'
    import formExt from '../formExt'

    export default {
        props: ['api'],
        data() {
            return {
                file: null,
                showModal: false,
                ActionUploadUrl: Util.ojaxUrl + 'table/deviceManage/importVehicle',
                fileAccept: '.xls, .xlsx',
                fileFormat: ['.xls', '.xlsx'],
                saveBtnText: '上传',
                postHeader: {
                    token: JSON.parse(localStorage.getItem('$userState')).userGuid
                },
                postData: {
                    menuId: this.$route.meta.id
                },
                loadingStatus: false,
                importCfg: false
            }
        },
        methods: {
            // 下载模板
            downloadExcel(){
                window.open(Util.ojaxUrl + 'table/deviceManage/exportModel', '_blank')
            },
            handleSaveDepartment(){
                this.showModal = true
            },
            handleBeforUpload(file) {
                // 保存需要上传的文件
                this.file = file;
                return false;
            },
            delectFile(event, file, fileList) { // 删除文件
                this.saveBtnText = '上传'
                this.file = null
                this.loadingStatus = false;
            },
            handleUpload() {
                if (!this.file) {
                    this.$Notice.error({
                        title: '提示',
                        desc: '未选择上传文件!',
                        duration: 3
                    })
                    this.loadingStatus = false;
                    return false
                }
                let item = this.file
                this.$refs.upload.post(item);
            },
            handleUploadProgress(event, file, fileList) {
                this.loadingStatus = true;
                this.saveBtnText = '请稍候，文件正在上传'
            },
            handleUploadSuccess(response, file, fileList) {
                this.delectFile()
                this.$Notice.success({
                    title: '提示',
                    desc: '未选择上传文件!',
                    duration: 3
                })
                this.showModal = false
                this.$emit('handleSearch')
            },
            handleUploadError(event, file, fileList) {
                console.log(event)
                this.loadingStatus = false;
                this.saveBtnText = '上传失败，是否继续上传？'

            },
            handleCancel() {
                this.showModal = false
                this.delectFile()
            }
        },
        watch: {
            modalCfg: {
                handler(n) {},
                immediate: true,
                deep: true
            }
        }
    }
</script>

<style>
    .modal-form{padding: 10px 40px 0 40px;}
    .modal-form .ivu-form-item{width: 100%;}
    .extra-button-container{float: right;margin-left: 4px}
    .panel-title{text-align: center;background: #f1f1f1;margin: 10px 30px 10px 0;}
</style>