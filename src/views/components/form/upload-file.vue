<template>
    <!--表单内上传文件组件-->
    <div style="position: relative">
        <a href="javascript:;" class="upload-file-input">上传
            <input type="file" :name="name" @change="changeFile" :ref="name">
        </a>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase */

export default {
    props: ['name'],
    data() {
        return {}
    },
    methods: {
        changeFile(v){
            let file = v.target.files[0];
            let fileData =  new FormData();
            fileData.append('file',file);
            let config = {
                headers:{'Content-Type':'multipart/form-data'}
            }
            this.$emit('uploadFile', {fileData: fileData, name:this.name})
        }
    },
    watch: {
        option: {},
        selectOptionValue: {}
    }
}
</script>
<style scoped>
    .upload-file-input {
        position: relative;
        display: inline-block;
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        padding: 4px 12px;
        overflow: hidden;
        color: #666666;
        text-decoration: none;
        text-indent: 0;
        line-height: 20px;
    }
    .upload-file-input input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        opacity: 0;
    }
    .upload-file-input:hover {
        background: #7C7C7C;
        /*border-color: #78C3F3;*/
        /*color: #000000;*/
        text-decoration: none;
    }
</style>