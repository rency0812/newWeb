<template>
    <Modal v-model="passShow" width="360" :closable="false" :mask-closable="false" class-name="vertical-center-modal"
           @on-visible-change="modalState">
        <p slot="header" style="color:#20b36a;text-align:center">
            <Icon type="aperture"></Icon>
            <span>设置密码</span>
        </p>
        <Form label-position="top" style="padding: 15px" :rules="ruleInline" :model="editModel" ref="tableModal">
            <p style="text-align: center;margin-bottom: 20px">您的帐号为初始密码,为了帐号安全请先设置密码</p>
            <FormItem label="新密码:" prop="password">
                <Input type="password" :placeholder="'请输入新密码...'" size="small"
                       v-model="editModel.password"></Input>
            </FormItem>
            <FormItem label="确认密码:" prop="confirmPassword">
                <Input type="password" :placeholder="'请输入新密码...'" size="small"
                       v-model="editModel.confirmPassword"></Input>
            </FormItem>
            <span style="color:#f77858">{{text}}</span>
        </Form>
        <div slot="footer">
            <Button type="success" size="large" long @click="changePass">设置新密码</Button>
        </div>
    </Modal>
</template>

<script>/* eslint-disable linebreak-style,complexity,no-var,brace-style,no-console,comma-spacing,indent,no-cond-assign,quotes,init-declarations */

//调用依赖库
import Util from '../../../../libs/util'
const Base64 = require('../../../../libs/util').Base64

//调用API接口
const resetPassword = require('../../../../libs/api').resetPassword   // 修改密码接口


//调用vuex状态管理
import {mapState, mapMutations} from 'vuex'



export default {
    props: ['passShow'],
    data() {
        return {
            editModel: {
                password: '',
                confirmPassword: ''
            },
            text:'',
            ruleInline: {
                password: [
                    { required: true, message: '请填写新密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请确认密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        changePass() {
            var self = this
            self.text = ''
            var sysConfig = {
                showPass: false
            }
            if(self.editModel.password !== self.editModel.confirmPassword){
                self.text = '两次密码输入不一致'
                return
            }else{
                let postValue = self.editModel
                // 新密码和确认的密码
                postValue.password = self.editModel.password
                postValue.confirmPassword = postValue.password

                // 帐号名和旧密码
                postValue.account = self.userInfo.account
                postValue.oldPassword = '000000'
                console.log(postValue)

                Util.ojax.post(resetPassword, postValue).then(function(res){
                    if (res.data.code == 0) {
                        self.$Notice.success({
                            title: '成功提示',
                            desc: '修改成功！',
                            duration: 3
                        })
                        self.passShow = false
                        setTimeout(function(){
                            window.location.reload()
                        }, 1000)
                    } else {
                        self.$Notice.error({
                            title: '错误提示',
                            desc: '修改失败！',
                            duration: 3
                        })
                        self.editModel = {
                            password: '',
                            confirmPassword: ''
                        }
                        return
                    }
                }).catch(function (error) {
                    self.$Notice.error({
                        title: '请求失败',
                        desc: error.data.msg,
                        duration: 3
                    })
                })
            }
        },
        modalState(e) {
            if(!e){
                for(let k in this.editModel){
                    this.editModel[k] = ''
                }
                this.text = ''
            }
            var self = this
            if(!e){
                var sysConfig = {
                    showPass: e
                }
                self.$emit('setClose', sysConfig)
            }
        },
        //调用vuex的方法
        ...mapMutations('userState', [
            'userLogOut'
        ]),
    },
    computed: {
        ...mapState('userState', {
            userInfo: (state) => state.userInfo,  //获取用户信息,
        })
    }
}
</script>

<style lang="less">
    .theme-title {
        padding: 3px 15px;
        font-weight: normal;
        font-size: 13px;
        line-height: 2.2;
    }
    .theme-padding {
        padding: 10px 15px;
    }
    .theme-default, .theme-dark {
        display: block;
        width: 16px;
        height: 16px;
        background-color: #83c756;
        float: left;
        margin: 2px 10px !important;
        border-radius: 3px;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, .15);
    }
    .theme-dark {
        background-color: #162259;
    }
</style>