<template>
    <div>
        <Button type="success" size="small" buttonId="2" icon="md-add" class="adv-search-btn"
                @click="handlePlus">编辑权限
        </Button>
        <Modal v-model="modalShow" :draggable="true" :mask-closable="true" class="layou-modal-input">
            <p slot="header">
                <Icon type="information-circled"></Icon>
                <span>用户权限设置</span>
            </p>
            <div class="layout-tree-body">
                <div class="layout-modal">
                    <div class="tree-title-box">
                        <Icon type="ios-user"></Icon>
                        功能角色
                    </div>
                    <div class="modal-tree-container">
                        <VJstree :data='functionTreeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
                                 ref="functionTree" :allow-batch="true"
                                 :show-checkbox="true" :multiple="true" @item-click="functionTreeNodeClick"/>
                    </div>
                </div>
                <div class="layout-modal">
                    <div class="tree-title-box">
                        <Icon type="ios-user"></Icon>
                        数据角色
                    </div>
                    <div class="modal-tree-container">
                        <VJstree :data='permissionTreeData' :whole-row="false" :loading-text="'loading....'" :collapse="true"
                                 ref="permissionTree" :allow-batch="true"
                                 :show-checkbox="true" :multiple="true" @item-click="permissionTreeNodeClick"/>
                    </div>
                </div>
                <!--<Split v-model="panelTreeSplit">-->
                    <!--<div slot="left" class="layout-tree-content" style="padding: 6px">-->

                        <!--<div class="layout-tree modal-tree-container">-->

                        <!--</div>-->

                    <!--</div>-->
                    <!--<div slot="right" class="layout-tree-content" style="padding: 6px">-->
                        <!--<div class="search-box tree-title-box" style="white-space: nowrap">-->
                            <!--<Icon type="ios-user"></Icon>-->
                            <!--数据角色-->
                        <!--</div>-->
                        <!--<div class="layout-tree modal-tree-container">-->

                        <!--</div>-->
                    <!--</div>-->
                <!--</Split>-->
            </div>

            <div slot="footer" class="layout-modal-button">
                <Button @click="handleCancel"> 取 消</Button>
                <Button type="success" icon="checkmark-round" :loading="modaLoading" @click="handleSave">
                    保 存
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>

    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import formComponent from '../form'
    import VJstree from 'vue-jstree'


    const componentName = 'plusDepartment'


    export default {
        components: {
            formComponent,
            VJstree
        },
        data() {
            return {
                panelTreeSplit: 0.5,
                modalShow: false,
                modaLoading: false,
                functionTreeData: [], // 功能权限树
                permissionTreeData:[] // 数据权限树
            }
        },
        methods: {
            // 编辑权限
            handlePlus(){
                this.modalShow = true
            },
            // 保存事件
            handleSave() {},
            // 取消事件
            handleCancel() {
                var self = this
                self.modalShow = false
            },
            // 功能权限树点击
            functionTreeNodeClick(n, i){

            },
            // 数据权限树点击
            permissionTreeNodeClick(n, i){

            },
            // 模拟树数据
            getDefaultTreeData(){
                let num = Math.floor(Math.random()*50)
                let treeData = []
                for(let i = 0; i<num;i++){
                    treeData[i] = {
                        id: i,
                        text: '部门' + i,
                        value: '部门' + i,
                        icon: '',
                        opened: true,
                        selected: false,
                        disabled: i % 2 == 1,
                        loading: false,
                        children: []
                    }
                }
                return treeData
            }
        },
        computed: {
            menuId() {
                return this.$route.meta.menuId
            },
            ...mapGetters('tableState', [
                'pageCfg'
            ])
        },
        watch: {
            pageCfg: {
                handler(data) {
                    // let self = this
                    // let menuId = self.menuId
                    // for (var i in data) {
                    //     if (menuId == data[i].menuId) {
                    //         self.modalFormCfg = data[i].pageCfg.componentCfg[componentName].modalCfg[0].children
                    //     }
                    // }
                },
                immediate: true,
                deep: true
            },
            modalShow: {
                handler(data) {
                    if(data){
                        this.functionTreeData = this.getDefaultTreeData()
                        this.permissionTreeData = this.getDefaultTreeData()
                    }else{
                        this.functionTreeData = []
                        this.permissionTreeData = []
                    }
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>

<style>
    .tree-title-box{background: #ffffff;color: #333333;line-height: 2;padding-left: 10px}
    .layout-modal{width:50%;padding: 5px;float: left}
    .modal-tree-container{padding: 5px 0 0 0;height: 360px;overflow: auto}
    .layout-tree-body{height:400px;}
</style>