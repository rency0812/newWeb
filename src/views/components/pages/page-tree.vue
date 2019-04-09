<template>
    <div class="layout-table">
        <h2>
            <Icon type="ios-home"></Icon>
            <a href="/"> 首页 </a> > {{this.$route.meta.title}}
        </h2>
        <Split v-model="panelSplit">
            <div slot="left" class="layout-tree">
                <exTree/>
            </div>
            <div slot="right" class="layout-table-content">
                <advSearch :deleteIds="deleteIds"/>
                <div class="layout-table">
                    <tableGrid @updateDeleteModel="updateDeleteModel"/>
                </div>
            </div>
        </Split>


    </div>
</template>

<script>/* eslint-disable linebreak-style,complexity,no-var,brace-style,no-console,comma-spacing,indent,no-cond-assign,quotes,init-declarations */

import Util from '../../../libs/util'
//调用vuex状态管理
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'

//页面使用组件
import exTree from '../tree/tree-component'
import advSearch from '../table/adv-search'
import tableGrid from '../table/table-new'

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

            deleteIds: null

        }
    },
    components: {
        exTree,
        advSearch,
        tableGrid
    },
    mounted() {
        let self = this
        self.$nextTick(function () {
            /*==================初始化页面==================*/
            //获取页面配置
            let roleId = 0
            let menuId = self.menuId
            self.initPageCfg({menuId: menuId, roleId: roleId})
        })
    },
    methods: {
        //删除数组数值修改变化
        updateDeleteModel(e) {
            let self = this
            self.deleteIds = e
            console.log(self.deleteIds)
        },
        ...mapMutations('tableState', [
            'initPageCfg', //初始化页面
            'searchGrid'
        ])
    },
    computed: {
        menuId() {
            return this.$route.meta.menuId
        }
    }
}
</script>
