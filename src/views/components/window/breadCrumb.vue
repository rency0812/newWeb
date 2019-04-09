<template>
    <div class="layout-breadcrumb">
        <Tag>
            <Icon type="ios-home" @click.native="toRouter('/')"/>
            首页
        </Tag>
        <Tag closable @click.native="toRouter(item.url)" :class="{active:item.active}" :name="item.url"
             v-for="item in menuTag"
             @on-close="miusMenuTag">{{item.title}}
        </Tag>
        <Tag v-show="menuTag.length>2">
            <Icon type="md-trash" @click.native="removeAllTag"/>
        </Tag>
    </div>
</template>

<script>/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */

//调用vuex
import {mapState, mapMutations} from 'vuex'


export default {
    methods: {
        toRouter(url) {
            this.$router.push(url)
            this.storeMenuActive(url)
        },
        miusMenuTag(e, url) {
            let menuTag = this.menuTag
            for (var i in menuTag) {
                if (url == menuTag[i].url) {
                    this.removeMenuTag(url)
                    let fIndex = i - 1
                    if (fIndex >= 0) {
                        this.$router.push(menuTag[(fIndex)].url)
                    } else {
                        this.$router.push('/')
                    }
                }
            }
        },
        removeAllTag() {
            this.removeAllMenuTag()
            this.$router.push('/')
        },
        ...mapMutations('platformState', [
            'storeMenuActive',  //暂存当前主菜单
            'removeMenuTag',
            'removeAllMenuTag'
        ])
    },
    computed: {
        ...mapState('platformState', {
            menuTag: (state) => state.menuState.menuTag,  //获取菜单标签栏信息
        })
    }
}
</script>

<style>
    .layout-breadcrumb .active {

    }


</style>