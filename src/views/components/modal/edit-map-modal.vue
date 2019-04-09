<template>
    <Modal v-model="editCloudMapModal.showModal" :draggable="true" :mask-closable="false" width="1200" :footer-hide="true"
           class="layou-modal-input">
        <div slot="header">
            <Icon type="information-circled"></Icon>
            <span>地图</span>
        </div>
        <div class="layout-modal-content" style="overflow: hidden">
            <map-container v-on:postMapData="postMapData"
                           :editMapJson="editMapJson"
                           :isShow="isShow"
                           :drawType="nDrawType"></map-container>
        </div>
    </Modal>
</template>
<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,linebreak-style,camelcase,no-dupe-keys */
//调用的库文件
/**********调用的组件*************/
import mapContainer from '../mapObj/bak/map-container'

export default {
    components: {
        mapContainer
    },
    props: ['modalCfg', 'mapJson', 'nDrawType'],
    data() {
        return {
            editCloudMapModal: this.$props.modalCfg, //传递进来的配置文件

            //数据交换池
            postValue: {
                pageIndex: 1,
                pageSize: 20,
                pageTotal: 0,
                buttonId: 0,
                menuId: this.$route.meta.id,
                searchModel: {},
                editModel: {} //传递进来或初始化的输入框
            },

            //传给地图组件的参数 mapJson是从父组件传过来的参数
            editMapJson: this.$props.mapJson,
            isShow: false
        }
    },
    mounted() {},
    methods: {
        //画好的地图的参数(从地图子组件传过来的)
        postMapData(v){
            if(v){
                this.editCloudMapModal.showModal = v.showModal
                this.modalCfg.mapJson = JSON.stringify(v.aoLatLng)
                this.$emit('postMapData', v)
            }
        }
    },
    watch: {
        modalCfg: {
            handler(n) {
                if (n) {
                    this.mapModal = n
                }
            },
            immediate: true,
            deep: true
        },
        editCloudMapModal: {
            handler(n) {
                this.isShow = n.showModal
                this.editMapJson = n.mapJson
            },
            immediate: true,
            deep: true
        },
        // mapJson: {
        //     handler(n) {
        //         this.editMapJson = n
        //     },
        //     immediate: true,
        //     deep: true
        // }
    }
}
</script>