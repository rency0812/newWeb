<template>
    <div class="layout-table">
        <h2>
            <Icon type="ios-home"></Icon>
            <a href="/"> 首页 </a> >
            {{pageSet.pTitle}} > {{pageSet.cTitle}}
        </h2>
        <Split v-model="panelSplit">
            <div slot="left" class="layout-tree">
                <exTree />
            </div>
            <div slot="right" class="layout-table-content">
                <veh-state-top />
                <advSearch/>
                <div class="layout-table">
                    <tableGrid/>
                </div>
            </div>
        </Split>
    </div>
</template>

<script>/* eslint-disable linebreak-style,complexity,no-var,brace-style,no-console,comma-spacing,indent,no-cond-assign,quotes,init-declarations */

import Util from '../../../libs/util.js'

//调用vuex状态管理
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'

//页面使用组件
import exTree from '../tree/tree-component'
import advSearch from '../cloneTable/adv-search'
import tableGrid from '../cloneTable/table'
import vehStateTop from '../cloneTable/vehStateCountTop'

//使用的接口
const GetPageCfgUrl = require('../../../libs/api').GetPageCfgUrl


export default {
    data() {
        return {
            panelSplit: 0.17,
            treeCfg: null,
            pageSet: {
                pTitle: '',
                cTitle: null,
                pageTree: null
            },
            searchValue:{}
        }
    },
    components: {
        exTree,
        advSearch,
        tableGrid,
        vehStateTop
    },
    mounted() {
        let self = this
        self.$nextTick(function () {
            /*==================初始化页面==================*/
            //获取页面配置
            let roleId = 0
            let menuId = self.$route.meta.menuId
            self.initPageCfgClone({menuId: menuId, roleId: roleId})
        })
    },
    methods: {
        ...mapMutations('tableState', [
            'initPageCfgClone' //初始化页面
        ])
    }
}
</script>