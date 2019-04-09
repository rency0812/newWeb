<template>
    <Modal v-model="modalShow" width="360" :closable="false" class-name="vertical-center-modal">
        <p slot="header" style="color:#20b36a;text-align:center">
            <Icon type="aperture"></Icon>
            <span>个性化设置</span>
        </p>
        <h3 class="theme-title">选择主题色：</h3>
        <RadioGroup v-model="Theme" class="theme-padding">
            <Radio label="default"><span class="theme-default"></span> 默认</Radio>
            <Radio label="dark"><span class="theme-dark"></span>紫色炫影</Radio>
        </RadioGroup>
        <div slot="footer">
            <Button type="success" size="large" long @click="setup">设置</Button>
        </div>
    </Modal>
</template>

<script>/* eslint-disable linebreak-style,complexity,no-var,brace-style,no-console,comma-spacing,indent,no-cond-assign,quotes,init-declarations */

export default {
    props: ['modalShow'],
    data() {
        return {
            Theme:''
        }
    },
    beforeMount(){
        var self = this
        var userState = JSON.parse(localStorage.$userstatus)

        self.Theme = userState.Theme



    },
    methods: {
        setup() {
            var self = this
            var sysConfig = {
                showMadal :false,
                Theme:self.Theme
            }
            self.$emit('setClose',sysConfig)
                //this.$Message.success('Successfully delete')
        }
    }
}
</script>

<style lang="less">


.theme-title{
    padding: 3px 15px;
    font-weight: normal;
    font-size: 13px;
    line-height: 2.2;
}
    .theme-padding{
        padding: 10px 15px;
    }


    .theme-default,.theme-dark{
        display: block;
        width: 16px;
        height: 16px;
        background-color: #83c756;
        float: left;
        margin: 2px 10px !important;
        border-radius: 3px;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, .15);
    }

    .theme-dark{
        background-color: #162259;
    }

</style>