<template>
    <div class="header-screen-fixed">
        <Divider type="vertical" class="fl" style="margin-top: 9px"/>
        <Tooltip :content="$t('voice.on')" placement="left" :delay="1000">
            <Button type="text" @click="switchVoice" icon="md-volume-up"
                    :style="{color:!headerControl?'#000':''}" v-show="voiceControl">
            </Button>
        </Tooltip>
        <Tooltip :content="$t('voice.off')" placement="left" :delay="1000">
            <Button type="text" @click="switchVoice" icon="md-volume-off"
                    :style="{color:!headerControl?'#000':''}" v-show="!voiceControl">
            </Button>
        </Tooltip>
        <Tooltip :content="$t('fullScreen.up')" placement="left" :delay="1000">
            <Button type="text" @click="ctrlHeader" icon="ios-arrow-up" v-show="headerControl">
            </Button>
        </Tooltip>
        <Tooltip :content="$t('fullScreen.down')" placement="left" :delay="1000">
            <Button type="text" @click="ctrlHeader" icon="ios-arrow-down" v-show="!headerControl"
                    :style="{color:!headerControl?'#000':''}">
            </Button>
        </Tooltip>
        <handleScreen class="fr" style="font-size: 14px !important;"
                      :style="{color:!headerControl?'#000 !important':''}"/>
    </div>
</template>
<script>/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */

//依赖的组件
import handleScreen from '../common/handleScreen'


//依赖的vuex状态

import {mapState, mapMutations} from 'vuex'


export default {
    components: {
        handleScreen
    },
    data() {
        return {}
    },
    methods: {
        switchLang(){

        },
        //调用vuex的方法
        ...mapMutations('platformState', [
            'ctrlHeader',//改变头部
            'switchVoice'
        ])
    },
    computed: {
        ...mapState('platformState', {
            pageScreen: (state) => state.pageState.pageScreen, //获取屏幕全屏状态属性
            headerControl: (state) => state.pageState.headerControl,  //获取屏幕全屏状态属性
            voiceControl: (state) => state.pageState.voiceControl, //获取屏幕全屏状态属性
            lang: (state) => state.pageState.lang
        })
    }
}
</script>