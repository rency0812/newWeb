<template>
    <div class="layout-map-tab">
        <div v-for="item,index in tabCfg">
            <!--// 组织架构-->
            <structureVechile :active="(index==tableIndex) ? true : false " :api="item.api" :tabLabel="item.label"
                              :tabIcon="item.icon" :tableIndex="index" :tabType="item.type"
                              v-if="item.name.indexOf('structureVechile') >-1" :style="{top:index * 32 +'px'}"
                              @switchTabMain="switchTab"/>

            <!--// 车辆列表-->
            <vechileLists :active="(index==tableIndex) ? true : false " :api="item.api" :tabLabel="item.label"
                          :tabIcon="item.icon" :tableIndex="index" :tabType="item.type"
                          v-if="item.name.indexOf('vechileLists') >-1" :style="{top:index * 32 +'px'}"
                          @switchTabMain="switchTab"/>


            <!--// 关注车辆-->
            <favoriteVechile :active="(index==tableIndex) ? true : false " :api="item.api" :tabLabel="item.label"
                             :tabIcon="item.icon" :tableIndex="index" :tabType="item.type"
                             v-if="item.name.indexOf('favoriteVechile') >-1" :style="{top:index * 32 +'px'}"
                             @switchTabMain="switchTab"/>


            <!--// 关注车辆-->
            <vechileVideo :active="(index==tableIndex) ? true : false " :api="item.api" :tabLabel="item.label"
                          :tabIcon="item.icon" :tableIndex="index" :tabType="item.type"
                          v-if="item.name.indexOf('vechileVideo') >-1" :style="{top:index * 32 +'px'}"
                          @switchTabMain="switchTab"/>


        </div>
    </div>
</template>

<script>

    //调用的组件
    import structureVechile from './monitorObj/structure-vechile'  //组织架构
    import vechileLists from './monitorObj/vechile-lists'  //车辆列表
    import favoriteVechile from './monitorObj/favorite-vechile'  //关注车辆
    import vechileVideo from './monitorObj/vechile-video'  //车辆视频

    //依赖库
    import Util from '../../../libs/util'
    import {mapState, mapMutations, mapGetters} from 'vuex'


    export default {
        props: ['tabCfg','page'],
        components: {
            structureVechile,  // 组织架构
            vechileLists,      // 车辆列表
            favoriteVechile,  // 关注车辆
            vechileVideo      // 车辆视频
        },
        data() {
            return {
                tableIndex: 0,
                monitorButton: []
            }
        },
        methods: {
            switchTab(data) {
                this.tableIndex = data.index
                this.$emit('containerChange', data.type)
            }
        },

        computed: {
            menuId() {
                return this.$route.meta.menuId
            }


        }
    }
</script>

