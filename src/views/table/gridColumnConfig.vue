<template>
    <div class="layout-table">
        <h2>
            <Icon type="ios-home"></Icon>
            <a href="/"> 首页 </a> > {{this.$route.meta.title}}
        </h2>
        <Split v-model="panelSplit">
            <div slot="left" class="layout-tree-content">
                <div class="search-box" style="white-space: nowrap">
                    <Input v-model="searchValue" size="small" search autofocus enter-button
                           :placeholder="$t('formText.searchTip')"
                           class="fl" style="max-width: 80%;" />
                    <Button icon="md-refresh" size="small" style="margin: 1px 0 0 7px" @click="getLeftTree">
                        {{$t('formText.fresh')}}
                    </Button>
                </div>
                <vue-js-tree :data='treeData'
                             :whole-row="false"
                             :loading-text="'loading....'"
                             :collapse="true"
                             ref="tree"
                             :allow-batch="true"
                             :show-checkbox="false"
                             :multiple="false"
                             v-if="treeData" @item-click="treeNodeClick"
                            style="width:100%;margin-top: 10px">
                </vue-js-tree>
            </div>
            <div slot="right" class="layout-table-content">
                <div class="layout-table" style="text-align: center" v-if="columnList.length > 0">
                    <div v-for="item in columnList" style="width:300px;line-height: 2;margin: 15px auto">
                        <Checkbox :label="item.title" size="large" :key="item.id" v-model="item.selected">
                            <span>{{item.title}}</span>
                        </Checkbox>
                        <InputNumber v-model="item.sortId" :name="item.name" :min="0" style="float: right"></InputNumber>
                    </div>
                    <div>
                        <Button type="default" style="margin: 10px 10px 10px 20px" @click="setSelectAll">{{sText}}</Button>
                        <Button type="default" style="margin: 10px" @click="getColumnCfg">重置</Button>
                        <Button type="primary" style="margin: 10px" @click="handleSave">保存</Button>
                    </div>
                </div>
                <div class="layout-table" style="text-align: center" v-else v-html="errorTips">
                    <!--<Form label-position="right" :label-width="100" style="width: 400px;margin: 0 auto">-->
                    <!--<FormItem v-for="item in columnList" :label="item.label + ':'"  :key="item.id">-->
                    <!--<InputNumber v-model="item.sortId" :placeholder="item.label + '...'" :name="item.name" :min="1"></InputNumber>-->
                    <!--</FormItem>-->
                    <!--</Form>-->
                    <!--<CheckboxGroup v-model="columnList">-->
                </div>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </div>
        </Split>
    </div>



    <!--<div style="padding: 20px">-->
        <!--<Row>-->
            <!--<Col span="3" v-for="(item, index) in treeList">-->
                <!--<div class="modal-tree-container" style="padding-left: 5px;border-left: 1px solid #ccc;height:300px;overflow: scroll">-->
                    <!--<div>-->
                        <!--<h3>第{{index}}个树</h3>-->
                    <!--</div>-->

                    <!--<vue-js-tree :data='item.treeData'-->
                                 <!--:whole-row="false"-->
                                 <!--:loading-text="'请稍候....'"-->
                                 <!--:collapse="true"-->
                                 <!--:allow-batch="true"-->
                                 <!--:show-checkbox="true"-->
                                 <!--:multiple="true"-->
                                 <!--:draggable="true"-->
                                 <!--:ref="'tree_' + index"-->
                                 <!--@item-click="treeNodeClick"-->
                                 <!--@item-drop-before = "itemDropBefore"-->
                                 <!--@item-drop="itemDrop"></vue-js-tree>-->
                <!--</div>-->

            <!--</Col>-->

        <!--</Row>-->
        <!--<div style="text-align: center;width: 100%;">-->
            <!--<Button type="default" style="margin: 20px">取消</Button>-->
            <!--<Button type="primary" style="margin: 20px">保存</Button>-->
        <!--</div>-->
    <!--</div>-->
</template>


<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations,camelcase,no-case-declarations */

import Util from '../../libs/util'
import vueJsTree from 'vue-jstree'
import formExt from '../components/table/formExt'

const gridColumnConfigUrl = require('../../libs/api').gridColumnConfigUrl
const GetBaseTreeUrl = require('../../libs/api').GetBaseTreeUrl
const saveGridColumnUrl = require('../../libs/api').saveGridColumnUrl

export default {
    components: {vueJsTree, formExt},
    data(){
        return{
            treeList: [
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理1",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                                "id": 22,
                                "text": "客户配置",
                                "pid": 11,
                                "url": "/table/clientConfig",
                                "opened": false,
                                "data": null,
                                "children": null,
                                "selected": false,
                                "icon": "tree-node tree-icon Department"
                            },{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        },{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        },{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        },{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        },{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        },{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        },{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理2",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
                {
                    treeData: [{
                        "id": 11,
                        "text": "配置管理3",
                        "pid": null,
                        "url": "/config",
                        "opened": true,
                        "data": null,
                        "children": [{
                            "id": 25,
                            "text": "报警推送配置",
                            "pid": 11,
                            "url": "/table/alarmPushConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }, {
                            "id": 22,
                            "text": "客户配置",
                            "pid": 11,
                            "url": "/table/clientConfig",
                            "opened": false,
                            "data": null,
                            "children": null,
                            "selected": false,
                            "icon": "tree-node tree-icon Department"
                        }
                        ]
                    }]
                },
            ],

            queryTreeList: [],

            columnList: [],
            panelSplit: 0.175,
            treeData:[],
            searchValue: null,
            sText: '全选',
            spinShow: false,
            menuId: null,
            errorTips: '点击左侧树节点, 进行对应的菜单列项操作'
        }
    },
    mounted(){
        let self = this
        self.$nextTick(function () {
            // 获取左侧树
            self.getLeftTree()
        })
    },
    methods:{
        // 设置全选/取消全选
        setSelectAll(){
            let self = this
            if(self.sText == '全选'){
                self.sText = '取消全选'
                for(let i in self.columnList){
                    self.columnList[i].selected = true
                }
            }else{
                self.sText = '全选'
                for(let i in self.columnList){
                    self.columnList[i].selected = false
                }
            }
        },
        // 获取左侧树
        getLeftTree(){
            let self = this
            Util.ojax.post(GetBaseTreeUrl, {treeName: 'menuTree'}).then(function (res) {
                if (res.data.code == 0) {
                    self.treeData = res.data.detail
                }
            })
        },
        // 点击左侧树节点
        treeNodeClick(e) {
            this.menuId = e.data.id
            this.spinShow = true
            this.menuId = e.data.id
            this.getColumnCfg()
        },
        // 请求列表数据  && 重置当前显示列表项数据
        getColumnCfg(){
            let self = this
            let menuId = self.menuId
            let roleId = JSON.parse(localStorage.getItem('$userState')).roleId || 0
            Util.ojax.post(gridColumnConfigUrl, {menuId: menuId, roleId: roleId}).then(function (res) {
                if (res.data.code == 0) {
                    if(res.data.detail.length > 0){
                        self.columnList = res.data.detail
                        for(let i in self.columnList){
                            self.columnList[i].roleId = roleId
                        }
                    }else{
                        self.columnList = []
                        self.errorTips = '暂无数据'
                    }
                }
                self.spinShow = false
            })
        },
        // 保存节点配置信息
        handleSave(){
            let self = this
            // 判断数组里面有没有重复数据
            if([...new Set(self.columnList.map(item=>item.sortId))].length < self.columnList.length){
                console.log('有重复')
                self.$Notice.error({
                    title: '提示',
                    desc: '排序有重复,请修改后重试!',
                    duration: 3
                })
                return
            }else{
                self.spinShow = true
                Util.ojax.post(saveGridColumnUrl, self.columnList).then(function (res) {
                    if (res.data.code == 0) {
                        self.$Notice.success({
                            title: '提示',
                            desc: '操作成功!',
                            duration: 3
                        })
                        self.getColumnCfg()
                    }
                })
            }
        },

        itemDropBefore (node, item, draggedItem , e) {
            if (!draggedItem) {
                item.addChild({
                    text: "newNode",
                    value: "newNode"
                })
            }
        },
        /** draggedItem => 拖拽的目标
         *  item 移动到的目标
         * */
        itemDrop (node, item, draggedItem , e) {
            debugger
            draggedItem.addAfter(item, draggedItem)
            // var sortBy = function(attr,rev) {
            //     if (rev == undefined) {
            //         rev = 1;
            //     } else {
            //         rev = (rev) ? 1 : -1;
            //     }
            //     return function (a, b) {
            //         a = a[attr];
            //         b = b[attr];
            //         if (a < b) {
            //             return rev * -1;
            //         }
            //         if (a > b) {
            //             return rev * 1;
            //         }
            //         return 0;
            //     }
            // }
            // item.children.sort(sortBy('text', true))
            // this.$refs.tree.handleRecursionNodeChildren(draggedItem, function (childrenItem) {
            //     childrenItem.selected = item.selected
            // })
            // console.log(node.model.text + ' drop !')
        },
    }
}
</script>
