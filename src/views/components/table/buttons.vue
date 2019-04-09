<template>
    <div>
        <ButtonGroup size="small">
            <!--编辑菜单-->
            <plus-menu v-if="gridBtnCfg.indexOf('updateMenu')>-1" modalType="update" :row="row" />
            <!--查看菜单详情-->
            <plus-menu v-if="gridBtnCfg.indexOf('queryMenu')>-1" modalType="queryPage" :row="row"/>
            <!--删除菜单-->
            <!--<delete-menu v-if="gridBtnCfg.indexOf('deleteMenu')>-1" :row="row" />-->

            <!--编辑部门-->
            <update-department v-if="gridBtnCfg.indexOf('updateDepartment')>-1" :row="row" />
            <!--查看部门-->
            <query-department v-if="gridBtnCfg.indexOf('queryOneDepartment')>-1" :row="row" />
            <!--删除部门-->
            <!--<delete-department v-if="gridBtnCfg.indexOf('deleteDepartment')>-1" :row="row" />-->

            <plus-func-role v-if="gridBtnCfg.indexOf('updateDataRole')>-1" modalType="edit" :row="row"/>
            <plus-func-role v-if="gridBtnCfg.indexOf('viewDataRole')>-1" modalType="view" :row="row"/>

            <!--<Button icon="md-car" buttonId="104" v-if="gridBtnCfg.indexOf('104')>-1" @click="handleControl('104')">-->
                <!--绑定车辆-->
            <!--</Button>-->
            <!--<Button icon="md-close" type="error" buttonId="4" v-if="gridBtnCfg.indexOf('4')>-1"-->
                    <!--@click="handleControl('4')"> 删除-->
            <!--</Button>-->
            <!--<Button type="info" icon="md-lock" buttonId="100" v-if="gridBtnCfg.indexOf('100')>-1"-->
                    <!--@click="handleControl('100')">初始化密码-->
            <!--</Button>-->
            <!--<Button type="info" icon="md-medal" buttonId="101" v-if="gridBtnCfg.indexOf('101')>-1"-->
                    <!--@click="handleControl('101')">设置权限-->
            <!--</Button>-->
            <!--<Button type="info" icon="md-medal" buttonId="102" v-if="gridBtnCfg.indexOf('102')>-1"-->
                    <!--@click="handleControl('102')">设置角色-->
            <!--</Button>-->
            <!--<Button type="info" icon="md-medal" buttonId="103" v-if="gridBtnCfg.indexOf('103')>-1"-->
                    <!--@click="handleControl('103')">数据权限-->
            <!--</Button>-->
            <!--<Button type="info" icon="md-medal" buttonId="106" v-if="gridBtnCfg.indexOf('106')>-1"-->
                    <!--@click="handleControl('106')">下发指令-->
            <!--</Button>-->
            <!--<Button type="info" icon="md-medal" buttonId="108" v-if="gridBtnCfg.indexOf('108')>-1"-->
                    <!--@click="handleControl('108')">查看资源-->
            <!--</Button>-->
            <!--<Button type="info" icon="md-medal" buttonId="10" v-if="gridBtnCfg.indexOf('10')>-1"-->
                    <!--@click="handleControl('10')">报警处理-->
            <!--</Button>-->
        </ButtonGroup>
    </div>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations,camelcase */
import plusMenu from './modal/plus-menu'                        // 增/改菜单
import updateDepartment from './modal/update-department'         // 编辑部门
import queryDepartment from './modal/query-department'           // 查看部门
import plusFuncRole from './modal/plus-data-role'

export default {
    components: {
        plusMenu,           // 编辑菜单弹窗
        updateDepartment,    // 编辑部门弹窗
        queryDepartment,     // 查看部门弹窗
        plusFuncRole,       //数据角色
        viewFuncRole: plusFuncRole
    },
    /**
     *      row: 表格里每一行的数据 绑定到表格内的操作按钮上
     *      index: 表格每一行的索引
     *      gridBtnCfg: 表格的按钮权限配置
     * */
    props: ['row', 'index', 'gridBtnCfg'],
    data() {
        return {
            rowData: null
        }
    },
    methods: {
        handleControl(e) {
            let rowData = this.row
            this.$emit('clickTable', {buttonId: e, value: rowData, index: this.index})
        }
    }
}
</script>