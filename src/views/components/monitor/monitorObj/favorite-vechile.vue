<template>
    <div class="layout-map-tab-group" :class="{active:active}" style="height: 100%;">
        <div class="tab-li" @click="switchTab">
            <Tooltip :content="tabLabel" placement="left">
                <Icon :type="tabIcon"/>
            </Tooltip>
        </div>
        <div class="tab-componet" v-show="active" :style="{top: tableIndex * (-32) + 'px'}">
            <h2>关注车辆 &nbsp;&nbsp; <span>关注：80辆</span></h2>
            <div class="group-box layout-tree">
                <div class="layout-tree-content" style="height: 100%">
                    <div class="search-box" style="white-space: nowrap">
                        <Input v-model="searchValue" size="small" search autofocus enter-button
                               :placeholder="$t('formText.searchTip')"
                               class="fl" style="max-width: 80%;"
                               @on-change="searchTreeData" @on-click="searchTreeData" @on-enter="searchTreeData"/>
                        <Button icon="md-refresh" size="small" style="margin: 1px 0 0 7px" @click="refreshTree"/>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //调用依赖库
    import Util from '../../../../libs/util'


    //页面使用组件
    import pLoading from '../../common/pageLoading'

    export default {
        props: ['api', 'active', 'tableIndex', 'tabLabel', 'tabIcon', 'tabType'],
        data() {
            return {
                searchValue: null,
                spinShow: false
            }
        },
        components: {
            pLoading
        },
        mounted() {
        },
        methods: {
            //映射父组件的tab切换
            switchTab() {
                this.$emit('switchTabMain', {index: this.tableIndex, type: this.tabType})
            },
            searchTreeData() {

            },
            refreshTree() {

            }


        }
    }
</script>

<style scoped>

</style>
