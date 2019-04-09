<template>
    <div class="layout-administroter">
        <span style="margin-right: 20px;cursor: pointer" @click="handleInspectPost">查岗 ({{inspectPostNum}})</span>
        <Avatar icon="md-person" size="small" style="margin-top:6px;"/>
        <Dropdown class="drop" placement="bottom-end" @on-click="handleDrop">
            <a href="javascript:void(0);">{{userInfo.name}} - {{userInfo.roleName}}
                <Icon type="ios-arrow-down" size="8" style="margin:0 .5rem;"/>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem name="modify_password">
                    <Icon type="md-lock" size="11"/>&nbsp;&nbsp;&nbsp;&nbsp;修改密码
                </DropdownItem>
                <DropdownItem name="modify_individuation">
                    <Icon type="md-aperture" 　size="11"/>&nbsp;&nbsp;&nbsp;&nbsp;个 性 化
                </DropdownItem>
                <DropdownItem name="user_exit">
                    <Icon type="md-exit" size="11"/>&nbsp;&nbsp;&nbsp;&nbsp;退　　出
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <PassMadal :passShow='showPass' @setClose="setClose"/>
        <!---->
        <!--<Dropdown class="drop" placement="bottom-end" @on-click="switchLang">-->
            <!--{{lang}}-->
            <!--<Icon type="ios-arrow-down" size="8" style="margin:0 .5rem;"/>-->
            <!--<DropdownMenu slot="list">-->
                <!--<DropdownItem name="CN">-->
                    <!--<Icon type="md-lock" size="11"/>-->
                    <!--中文-->
                <!--</DropdownItem>-->
                <!--<DropdownItem name="EN">-->
                    <!--<Icon type="md-aperture" 　size="11"/>-->
                    <!--EN-->
                <!--</DropdownItem>-->
            <!--</DropdownMenu>-->
        <!--</Dropdown>-->


    </div>
</template>
<script>/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */

//调用vuex
import {mapState, mapMutations} from 'vuex'

//调用依赖的组件
import PassMadal from '../modal/password-modal'


export default {
    components: {
        PassMadal,
    },
    data() {
        return {
            showPass: false,
            inspectPost:false,
            inspectPostNum: 1
        }
    },
    mounted() {
        if (this.userInfo.name == '') {
            this.readUserInfo()
        }
    },
    methods: {
        switchLang(name) {
            var self = this
            console.log(name)
            this.$i18n.locale = name
            switch (name) {
                case 'CN':
                    this.switchLangTxt('中文')
                    break
                default:
                    this.switchLangTxt(name)
            }
        },
        //调用vuex的方法
        ...mapMutations('userState', [
            'readUserInfo',//读取已存用户信息
            'userLogOut'
        ]),
        ...mapMutations('platformState', [
            'switchLangTxt'
        ]),
        //用户操作
        handleDrop(name) {
            var self = this
            console.log(name)
            switch (name) {
                case 'user_exit' :
                    self.userLogOut()
                    self.$router.push('/login')
                    break
                case 'modify_individuation' :
                    self.showTheme = true
                    break
                case 'modify_password' :
                    self.modifyPass()
                    break
                default:
                    break
            }
        },
        //修改密码
        modifyPass() {
            let self = this
            self.showPass = true
        },
        //退出设置
        setClose(e) {
            let self = this
            self.showPass = false
        },
        // 查岗应答
        handleInspectPost(){
            this.$router.push('/table/inspectPost')
        }
    },
    computed: {
        ...mapState('userState', {
            userInfo: (state) => state.userInfo,  //获取用户信息,
        }),
        ...mapState('platformState', {
            lang: (state) => state.pageState.lang,  //获取用户信息,
        })
    }
}
</script>