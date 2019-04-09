<style>
    .ivu-tree-arrow {
        cursor: auto;

    }

    .ivu-tree-back-dotted {
        height: 23px;
        width: 6px;
        margin-right: 5px;
        display: block;
        float: left;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAeCAYAAAAPSW++AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhFNzg3QzA4OTgzMjExRTdCRTUzREQ5QkQyOUUyRDIyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhFNzg3QzA5OTgzMjExRTdCRTUzREQ5QkQyOUUyRDIyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OEU3ODdDMDY5ODMyMTFFN0JFNTNERDlCRDI5RTJEMjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OEU3ODdDMDc5ODMyMTFFN0JFNTNERDlCRDI5RTJEMjIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4ojzr5AAAAMElEQVR42mL4//8/Q2Vl5X8QjYwZQQQ2wAQiqqqqMGRHdWAC5NBFpkfDakB0AAQYAEexbhYeTfshAAAAAElFTkSuQmCC) 0 0 repeat-y;
    }

    .ivu-checkbox-wrapper + span, .ivu-tree .ivu-checkbox + span {
        margin: 0 !important;
    }
</style>
<template>
    <Tree :data="treeData" v-model="treeData" ref="Tree" :show-checkbox="treeCheck"
          @on-select-change="handleSelectTree"></Tree>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase */
import Util from '../../../libs/util'

const GetTreeRegionUrl = require('../../../libs/api').GetTreeRegionUrl
export default {
    props: ['treeCheck'],
    data() {
        return {
            treeCheck: true,
            treeData: [],
            treeParams: []
        }
    },
    methods: {
        handleSelectTree() {
            let self = this
            let selectData = this.$refs.Tree.getSelectedNodes()
            let newArr = new Array()
            for (var i in selectData) {
                newArr.push(selectData[i].name)
                if (selectData[i].name === 'wuhan') {
                    self.treeParams = ['wuhan']
                    console.log(JSON.stringify(self.treeParams))
                    return
                }
                if (selectData[i].children && selectData[i].children.length > 0) {
                    for (var j in selectData[i].children) {
                        newArr.push(selectData[i].children[j].name +'('+Math.round(Math.random()*5000)+')')
                        if (selectData[i].children[j].children && selectData[i].children[j].children.length > 0) {
                            for (var k in selectData[i].children[j]) {
                                newArr.push(selectData[i].children[j].children[k].name)
                            }
                        }
                    }
                }
                self.treeParams = newArr
            }
            self.treeParams = self.uniqueArray(self.treeParams)
            this.$emit('refreshtable', self.treeParams)
        },
        uniqueArray(array) {
            var newArr = [array[0]]
            for (var i = 1; i < array.length; i++) {
                var Item = array[i]
                var repeat = false
                for (var j = 0; j < newArr.length; j++) {
                    if (Item == newArr[j]) {
                        repeat = true
                        break
                    }
                }
                if (!repeat) {
                    newArr.push(Item)
                }
            }
            return newArr
        }
    },
    mounted() {
        let self = this
        if (localStorage.$tree_region) {
            self.treeData = JSON.parse(localStorage.$tree_region)
        } else {
            Util.ajax.post(GetTreeRegionUrl, {Account: 'admin'}).then(function (response) {
                self.treeData = response.data.data.treeData
                localStorage.$tree_region = JSON.stringify(response.data.data.treeData)
            }).catch(function (error) {
                console.log(error)
            })
        }
    },
    computed: {}
}


</script>