<template>
    <div class="layout-login">
        <!--全屏按钮-->
        <handleScreen/>
        <div class="layout-login-box">
            <Row>
                <Col span="24">
                    <img :src="platformState.masterLogo" class="layout-login-logo"/>
                    <h1>{{platformState.tenantName}}</h1>
                    <!--登录窗口-->
                    <loginBox/>
                </Col>
            </Row>
        </div>
        <div class="layout-login-bg" :style="{'background-image':'url('+platformState.platformSplash+')'}"/>
        <div class="layout-copyrights" v-html="platformState.copyright"/>
    </div>
</template>
<script>/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */


//调用依赖文件
import Util from '../../libs/util'
import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'

//API接口地址
const GetPlatUrl = require('../../libs/api').GetPlatUrl


//调用组件库
import handleScreen from '../components/common/handleScreen'
import loginBox from '../components/window/loginBox'


var idBg;
export default {
    components: {
        handleScreen,
        loginBox
    },
    beforeMount() {
        let self = this
        if (!localStorage.$platformState) {
            // 获取平台配置
            self.getPlat()
        } else {
            // 读取平台配置
            self.loadPlatFormState()
        }
    },
    mounted(){},
    methods: {
        ...mapMutations('platformState', [
            'loadPlatFormState'
        ]),
        ...mapActions('platformState', [
            'storePlatSet'
        ]),
        //获取平台配置
        getPlat(){
            let self = this
            // let localHost = self.localHost
            let localHost = '180.101.255.219:38009'  //临时
            // console.log(localHost)
            Util.ojax.post(GetPlatUrl + '?url=' + localHost).then(function (response) {
                console.log(response)
                if (response.data.code == 0) {
                    let platformState = response.data.detail
                    self.storePlatSet(platformState)
                } else {
                    self.$Message.error(response.data.error)
                }
            }).catch(function (error) {
                self.$Message.error(response.data.error)
            })
        }
    },
    computed: {
        ...mapState('platformState', {
            platformState: (state) => state.platformState,
            localHost: (state) => state.pageState.localHost
        }),
        ...mapGetters('platformState',[
            'platformState'
        ]),
    }
}
</script>

<style>
    .layout {
        background: #f8f8f8;
        transition: opacity .3s;
        opacity: 1;
        height: 100%
    }

    .layout-login {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: inline-block;
        position: relative;
    }

    .layout-login .ivu-form-item {
        margin-top: 28px;
    }


    .layout-login-logo {
        min-width: 120px;
        margin: 10px auto;
        display: block;
    }


    .layout-copyrights {
        width: 100%;
        color: #fff;
        opacity: .75;
        text-align: center;
        position: fixed;
        left: 0;
        bottom: 60px;
        z-index: 20;
        text-shadow: 0 2px 2px rgba(0, 0, 0, .65)
    }

    .layout-login-box {
        width: 750px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -375px;
        margin-top: -300px;
        z-index: 100
    }

    .layout-login-box h1 {
        font-size: 32px;
        white-space: nowrap;
        color: #fff;
        text-shadow: 0 5px 5px rgba(0, 0, 0, .45);
        margin-bottom: 50px;
        text-align: center;

    }

    .layout-login-input-group {
        position: relative;
        background-color: hsla(0, 0%, 100%, .95);
        width: 370px;
        height: 100%;
        padding: 12px;
        border-radius: 4px;
        box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, .75), 0 0 2px rgba(0, 0, 0, .15);
        margin: 0 auto
    }

    .layout-login-input-group .ivu-switch-inner {
        font-size: 12px;
        line-height: 26px
    }

    .layout-btn-screen {
        width: 47px;
        height: 42px;
        position: absolute;
        right: 0;
        top: 15px;
        z-index: 19;
        display: block
    }

    .layout-btn-screen .ivu-btn-text {
        color: #fff;
        padding: 0
    }

    .layout-btn-screen .ivu-icon {
        font-size: 24px
    }

    .layout-login-bg {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        background-color: #f8f8f8;
        background-color: -moz-radial-gradient(center, ellipse cover, #f8f8f8 0, #e1e8ea 100%);
        background-color: -webkit-radial-gradient(center, ellipse cover, #f8f8f8 0, #e1e8ea 100%);
        background-color: radial-gradient(ellipse at center, #f8f8f8 0, #e1e8ea 100%);
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: cover;
        width: 100%;
        height: 100%;
        -webkit-animation: puff-in-center 5s cubic-bezier(.25, .46, .45, .94) infinite alternate-reverse both;
        animation: puff-in-center 5s cubic-bezier(.25, .46, .45, .94) infinite alternate-reverse both
    }

    .login-bg-01 {
        background-image: url(/assets/img/login_bg_06.jpg)
    }

    .login-bg-02 {
        background-image: url(/assets/img/login_bg_06.jpg)
    }

    .login-bg-03 {
        background-image: url(/assets/img/login_bg_06.jpg)
    }

    .login-bg-04 {
        background-image: url(/assets/img/login_bg_06.jpg)
    }

    .login-bg-05 {
        background-image: url(/assets/img/login_bg_06.jpg)
    }

    .layout-login-avatar {
        position: absolute;
        top: -32px;
        left: 50%;
        margin-left: -32px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
        background-color: #f8f8f8;
        width: 64px;
        height: 64px;
        text-align: center;

        border-radius: 50%;
    }

    .layout-login-avatar > * {
        font-size: 32px !important;
        line-height: 64px !important;
    }

    .puff-in-center {
        -webkit-animation: puff-in-center .7s cubic-bezier(.47, 0.000, .745, .715) both;
        animation: puff-in-center .7s cubic-bezier(.47, 0.000, .745, .715) both
    }

    @-webkit-keyframes puff-in-center {
        0% {
            -webkit-transform: scale(1.1);
            transform: scale(1.1);
            -webkit-filter: blur(2px);
            filter: blur(2px);
            opacity: 0.6
        }
        100% {
            -webkit-transform: scale(1);
            transform: scale(1);
            -webkit-filter: blur(0);
            filter: blur(0);
            opacity: 1
        }
    }

    @keyframes puff-in-center {
        0% {
            -webkit-transform: scale(1.1);
            transform: scale(1.1);
            -webkit-filter: blur(2px);
            filter: blur(2px);
            opacity: 0.6
        }
        100% {
            -webkit-transform: scale(1);
            transform: scale(1);
            -webkit-filter: blur(0);
            filter: blur(0);
            opacity: 1
        }
    }

    .layout-login-box .ivu-form-item-error-tip {
        line-height: 2;
    }

</style>
