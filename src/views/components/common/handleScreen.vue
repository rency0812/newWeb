<template>
    <div class="layout-btn-screen">
        <Tooltip :content="$t('fullScreen.out')" placement="left" :delay="300">
            <Button type="text" shape="circle" @click="changeScreen" v-show="pageScreen" icon="md-contract"
                    :style="{color:!headerControl?'#000 !important':''}">
            </Button>
        </Tooltip>
        <Tooltip :content="$t('fullScreen.in')" placement="left" :delay="300">
            <Button type="text" shape="circle" @click="changeScreen" v-show="!pageScreen" icon="md-expand"
                    :style="{color:!headerControl?'#000 !important':''}">
            </Button>
        </Tooltip>
    </div>
</template>
<script>/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */

//调用vuex
import {mapState, mapMutations} from 'vuex'

export default {
    methods: {
        //调用vuex的方法
        ...mapMutations('platformState', [
            'changeScreen' //改变全屏
        ])
    },
    computed: {
        ...mapState('platformState', {
            pageScreen: (state) => state.pageState.pageScreen,  //获取屏幕全屏状态属性,
            headerControl: (state) => state.pageState.headerControl  //获取屏幕全屏状态属性
        })
    }
}
</script>