<template>
    <div style="position: relative">
        <Table :columns="gridCfg" ref="table" :data="tableData" :height="tableHeight"
        highlight-row
        border stripe></Table>





        <!--@on-selection-change="handleSelection"-->
        <Page v-if="tablePage['table'+menuId]" :current="tablePage['table'+menuId].pageNum"
              :total="tablePage['table'+menuId].total"
              :page-size="tablePage['table'+menuId].pageSize" size="small" show-elevator show-sizer show-total
              class="table-page"/>

        <Spin size="large" fix v-if="gridCfg.gridLoading">
            <Icon type="ios-loading" size=18 class="componet-loading"></Icon>
            <div>Loading</div>
        </Spin>


    </div>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style */

//调用vuex状态管理
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'


export default {
    data() {
        return {
            tableData: null,
            gridData: null,
            offHeight: 200,
        }
    },
    mounted() {
        // this.searchGrid({menuId: this.menuId, path: this.$route.meta.api.query})
        console.log(this.gridCfg)
    },
    methods: {
        //
        handleSelection(e) {
            let ids = []
            for (var i in e) {
                ids.push(e[i].id)
            }
            this.deleteGridData({ids: ids})
        },

        ...mapActions('tableState', [
            'initComponentCfg',
            'searchPamas',
        ]),

        ...mapMutations('tableState', [
            'initGridData',
            'searchGrid',
            'changeLoading',
            'deleteGridData'
        ])
    },
    computed: {
        menuId() {
            return this.$route.meta.menuId
        },
        gridCfg() {
            let iData = this.pageCfg
            for (var i in iData) {
                if (iData[i].menuId == this.menuId) {
                    console.log(iData[i])
                    return iData[i].cfg.grid
                }
            }
        },
        ...mapGetters('tableState', [
            'pageCfg',
            // 'tableData',
            // 'tablePage',

            // 'gridCfg'
        ])
    }
}
</script>