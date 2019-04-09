<template>
    <div>
        <Form ref="loginValue" size="large" :model="loginData" :rules="ruleInline"
              class="layout-login-input-group" action="javascript:;">
            <Avatar src="" icon="md-person" size="large" class="layout-login-avatar"/>
            <div style="margin-top: 48px;">
                <FormItem prop="userAccount">
                    <Input type="text" v-model="loginData.userAccount" :placeholder="$t('loginTxt.userAccount')">
                        <Icon type="md-person" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="userPassword">
                    <Input type="password" size="large" v-model="loginData.userPassword"
                           :placeholder="$t('loginTxt.userPassword')">
                        <Icon type="md-lock" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <div class="ivu-form-item-error-tip text-center">{{errorTip}}</div>
            </div>
            <FormItem>
                <Button type="success" :loading="loginLoading" html-type="submit" size="large" long
                        @click="handleSubmit('loginValue')">
                    <span v-if="!loginLoading">{{$t('loginTxt.loginBtn')}}</span>
                    <span v-else> {{$t('loginTxt.loadingBtn')}}</span>
                </Button>
            </FormItem>
            <Row>
                <Col span="12">
                    <FormItem>
                        <strong>{{$t('loginTxt.rememberTxt')}}:</strong>
                        <i-switch v-model="loginSetting.RemberName">
                            <Icon type="android-done" slot="open"></Icon>
                            <Icon type="android-close" slot="close"></Icon>
                        </i-switch>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem style="text-align: right;">
                        <strong>{{$t('loginTxt.autoTxt')}}:</strong>
                        <i-switch v-model="loginSetting.AutoLogin">
                            <Icon type="android-done" slot="open"></Icon>
                            <Icon type="android-close" slot="close"></Icon>
                        </i-switch>
                    </FormItem>
                </Col>
            </Row>
            <div style="text-align:center">({{$t('loginTxt.loginTip')}})</div>
        </Form>
        <reset-pass-madal :passShow='showPass'/>
    </div>


</template>
<script>/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */
//调用依赖文件
import Util from '../../../libs/util'
import ResetPassMadal from '../table/modal/set-password' // 第一次登录需要重新设置密码
//API接口地址
const GetLoginUrl = require('../../../libs/api').GetLoginUrl
const GetMenuUrl = require('../../../libs/api').GetMenuUrl

//管理数据状态
import {mapState, mapActions, mapMutations} from 'vuex'

export default {
    components: {ResetPassMadal},
    data() {
        return {
            //登录表单验证
            ruleInline: {
                userAccount: [
                    {required: true, message: this.$t("errorTip.nameEmpty"), trigger: 'blur'},
                ],
                userPassword: [
                    {required: true, message: this.$t("errorTip.passEmpty"), trigger: 'blur'},
                    {type: 'string', min: 4, message: this.$t("errorTip.passShort"), trigger: 'blur'}
                ]
            },
            //错误提示
            errorTip: null,
            //默认程序池
            //数据接口传输参数
            loginData: {
                userAccount: null,
                userPassword: null
            },
            //用户设置
            loginSetting: {
                RemberName: false,
                AutoLogin: false
            },
            showPass: false
        }
    },

    beforeMount() {
        this.readUserInfo()  //初始化信息
    },

    mounted() {
        //初始化登录框数据
        this.loginSetting = {
            RemberName: this.userInfo.RemberName,
            AutoLogin: this.userInfo.AutoLogin
        }
        if (this.userInfo.RemberName) {
            this.loginData.userAccount = this.userInfo.account
        }
    },

    methods: {
        //表单验证
        handleSubmit(name) {
            var self = this
            self.addPostValue(self.loginData)
            //表单验证
            self.$refs[name].validate(function (valid) {
                if (valid) {
                    // 服务器请求接口
                    self.handleLogin()
                }
            })
        },
        //登录过程，并保存相关信息
        handleLogin() {
            var self = this
            self.changeLoading(true) //更改登录状态 -- loading
            // let postLoginParams = Util.toParams()
            Util.ojax.post(GetLoginUrl, self.loginPost).then(function (response) {
                // Util.ojax.post(GetLoginUrl, self.loginPost).then(function (response) {
                console.log(response)
                if (response.data.code == 0) {
                    let userState = response.data.detail
                    userState['tokenDate'] = new Date().getTime()               //保存token时间
                    userState['AutoLogin'] = self.loginSetting.AutoLogin        //是否自动登录
                    if (userState['AutoLogin']) {
                        userState['RemberName'] = true
                    } else {
                        userState['RemberName'] = self.loginSetting.RemberName  //是否记录账号
                    }
                    self.recodeUserInfo(userState)                              //记录用户信息到缓存
                    self.changeLoading(false)                                  //更改登录状态 -- loading

                    // 判断是否为第一次登陆 修改密码
                    if (userState.reset) {
                        self.showPass = true
                    } else {
                        //开始加载读取菜单
                        self.getMenu()
                    }
                } else {
                    self.changeLoading(false)  //更改登录状态 -- loading
                    self.$Message.error(response.data.msg)
                    self.errorTip = response.data.msg
                }
            }).catch(function (error) {
                console.log(error)
                self.changeLoading(false)
                self.$Notice.warning({
                    title: self.$t("serviceTip.commonTitle"),
                    desc: self.$t("serviceTip.commonContent"),
                    duration: 10
                })
            })
        },
        //加载菜单
        getMenu() {
            let self = this
            Util.ojax.post(GetMenuUrl, {treeName: 'menuTree'}).then(function (response) {
                if (response.data.code == 0) {
                    console.log(response)
                    let menuData = response.data.detail
                    if (self.loginAddMenu(menuData)) self.$router.push('/index')
                    self.$Notice.success({title: self.$t("loginTxt.loginSuccess")})
                } else {
                    self.$Message.error(response.data.msg)
                    self.errorTip = response.data.msg
                }

            }).catch(function (error) {
                self.$Notice.warning({
                    title: self.$t("serviceTip.commonTitle"),
                    desc: self.$t("serviceTip.commonContent"),
                    duration: 10
                })
            })
        },
        ...mapMutations('userState', [
                'changeLoading',
                'addPostValue',
                'recodeUserInfo',
                'readUserInfo'
            ]
        ),
        ...mapActions('platformState', [
            'loginAddMenu']
        ),
    },
    computed: {
        ...mapState('userState', {
            userInfo: (state) => state.userInfo,
            loginPost: (state) => state.loginPost,
            loginLoading: (state) => state.loginLoading
        })
    }
}
</script>
