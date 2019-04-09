<style>
    @import "../../../../../mapViewHtml/css/exsun_base.css";
    @import "../../../../../mapViewHtml/css/exsun_map.css";
    @import "../../../../../mapViewHtml/css/exsun_layout_map.css";
    @import "~leaflet/dist/leaflet.css";
    .ex-maptool-box {padding: 0 .75rem;background-color: #5e7aea;color: #fff;line-height: 2.2;cursor: pointer;float: left;padding: .35rem .75rem;min-height: 2.8rem;}
</style>

<template>
    <div class="layout-map-rule-container" id="layoutMapRule"></div>
</template>
<script>/* eslint-disable linebreak-style,indent */

//调用的库文件
import Util from '../../../../libs/util'
import * as types from '../../../../libs/types'
import L from '../../../../../mapViewHtml/js/libs/leaflet/leaflet-src.js'
import d from '../../../../../mapViewHtml/js/libs/leaflet.draw-src.js'
import jsFunc from '../../../../../mapViewHtml/js/page/EditJs-2.4.0-src'

export default {
    //组件注册，按照调用的来
    components: {

    },
    props:['isShow', 'editMapJson', 'isDraw'],
    data() {
        return {
            popRuleMap: null,
            oCenter:null,
            mapAoLatLng: null,
            drawMapJson: null,
            postValue:{}
        }
    },
    mounted() {

    },
    destroyed(){

    },
    methods: {
        //初始化地图
        initMap() {
            let self = this
            let aoContainer =document.getElementsByClassName('layout-map-rule-container')
            let mapId = 'mapId_' + this.$route.meta.id
            if(!self.popRuleMap){
                self.popRuleMap=  new L.MapLib.MapMaster.PopMap(self, {parentContainer:aoContainer[0], mapId: mapId})
                self.popRuleMap.loadMap(700, 550)
                self.popRuleMap.loadMapToolArea()
            }else{
                self.popRuleMap.resize()
            }
        },
        //有地图参数则开始画围栏
        drawMap(){
            let self = this
            if(this.popRuleMap){
                this.popRuleMap.fire('ESMapEdit:deleteFence')
                for(let i = 0; i<self.editMapJson.length; i++){
                    this.popRuleMap.fire('ESMapEdit:editDraw', JSON.parse(self.editMapJson[i].mapJson))
                }
                let liC = document.getElementsByClassName('ex-maptool-box')[0]
                liC.style.display = 'none'
            }
        }
    },
    watch: {
        //弹出窗口初始化地图
        isShow: {
            handler(n) {
                if (n) {
                    this.$nextTick(() => {
                        this.initMap()
                    })
                }else{
                    this.oCenter = null
                    this.mapAoLatLng = null
                }
            },
            immediate: true,
            deep: true
        },
        editMapJson: {
            handler(n) {
                if(n && n.length>0){
                    this.$nextTick(() => {
                        this.drawMap()
                    })
                }else if(n.length == 0){
                    if(this.popRuleMap){
                        this.popRuleMap.fire('ESMapEdit:deleteFence')
                        let liC = document.getElementsByClassName('ex-maptool-box')[0]
                        liC.style.display = 'none'
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    computed: {}
}
</script>

<style>
    .tree-default .tree-selected {
        background: #3bb15b !important;
        color: #fff;
    }
</style>