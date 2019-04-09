<template>
    <div class="layout-main" :class="platformState.theme">
        <Row>
            <Col :span="pageColNum">
                <handleHeader/>
                <Header class="layout-main-top" id="pageHeader" v-if="headerControl">
                    <div class="layout-main-top-bg">
                        <div class="layout-main-logo-div">
                            <div class="layout-main-logo">
                                <a href="/" class="layout-logo-text"><img class="layout-logo-img"
                                                                          :src="platformState.masterLogo"/>{{platformState.tenantName}}</a>
                            </div>
                        </div>
                        <menuComponent/>
                        <userHeader/>
                    </div>
                </Header>
                <Content class="layout-main-content" id="pageContent"
                         :style="{height:!headerControl?'100%':'calc(100% - 64px)'}">
                    <!-- 这里是需要keepalive的 -->
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive"></router-view>
                    </keep-alive>
                    <!-- 这里不会被keepalive -->
                    <router-view v-if="!$route.meta.keepAlive"></router-view>
                </Content>
                <Footer class="layout-main-footer" id="pageFooter" v-if="headerControl">
                    <Row>
                        <Col :span="20">
                            <breadCrumb/>
                        </Col>
                        <!--<entryAlerm :alermData="alermData" v-on:popAlerm="handleLayout"></entryAlerm>-->
                        <!--<Col :span="4" ref="alermBox" :class="{ 'layout-fixed-alerm':floatType,'layout-relative-alerm':!floatType}"-->
                             <!--v-if="showAlermBox">-->
                        <!--<alerm-box :infoData="infoData" :float="floatType" v-on:handleFloat="handleFloat"-->
                                  <!--v-on:handleClose="handleClose"></alerm-box>-->
                        <!--</Col>-->
                        <Col :span="4">
                        <ul class="layout-entry-alerm">
                            <li data-type="1" @click="showRightAlarmBox">
                                <Icon type="alert-circled"></Icon>
                                <Badge dot :count="0" overflow-count="999">
                                    <a href="javascript:void(0);" class="layout-footer-link"> 告警消息</a>
                                </Badge>
                            </li>
                        </ul>
                        </Col>
                    </Row>
                </Footer>
            </Col>
            <Col :span="24 - pageColNum" v-if="24 - pageColNum > 0" ref="alermBox" :class="{ 'layout-fixed-alerm':floatType,'layout-relative-alerm':!floatType}">

            <alerm-box :infoData="infoData" :float="floatType" v-on:handleFloat="handleFloat"
                       v-on:handleClose="showRightAlarmBox"></alerm-box>
            </Col>
        </Row>
    </div>
</template>

<script>/* eslint-disable linebreak-style,complexity,no-var,brace-style,no-console,comma-spacing,indent,no-cond-assign,quotes,init-declarations */


//依赖的组件
import handleHeader from './components/window/handleHeader'  //头部全屏组件，可控制全屏和上下展开收缩
import breadCrumb from './components/window/breadCrumb'  //底部状态栏，标签选项卡组件
import userHeader from './components/window/userHeader'  //用户操作中心组件
import menuComponent from './components/window/menuComponent'  //用户操作中心组件
import entryAlerm from './components/float/entryAlerm'
import alermBox from './components/float/alermBox'


//依赖的状态
import {mapState, mapMutations, mapGetters} from 'vuex'

export default {
    components: {
        handleHeader,
        userHeader,
        breadCrumb,
        menuComponent,
        entryAlerm,
        alermBox
    },
    data() {
        return {
            alermData: [],
            infoData: [],
            alertData: [],
            floatType: false,
            showAlermBox: false,
            pageColNum:24
        }
    },
    mounted() {
        this.loadPlatFormState()
        // console.log(this.platformState)
        this.switchAlerm()
    },
    methods: {
        ...mapMutations('platformState', [
            'loadPlatFormState', //加载平台配置
            'switchAlerm'  //切换报警侧边栏
        ]),
        handleFloat() {
            this.floatType = !this.floatType
        },
        handleClose() {
            this.showAlermBox = false
        },
        showRightAlarmBox(){
            var self = this
            if(self.showAlermBox){
                self.showAlermBox = false
                self.pageColNum = 24
            }else {
                self.showAlermBox = true
                self.pageColNum = 21
            }
        }
    },
    computed: {
        ...mapState('platformState', {
            pageContentHeight: (state) => state.pageState.pageContentHeight,
            pageContentWidth: (state) => state.pageState.pageContentWidth,
            platformState: (state) => state.platformState,
            pageContentH: (state) => state.pageState.pageContentH,
            pageColCoum: (state) => state.pageState.pageColCoum,
            headerControl: (state) => state.pageState.headerControl  //获取屏幕全屏状态属性
        })

    }
}
</script>