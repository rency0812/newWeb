<style>
    @import "../../../../../mapViewHtml/css/exsun_base.css";
    @import "../../../../../mapViewHtml/css/exsun_map.css";
    @import "../../../../../mapViewHtml/css/exsun_layout_map.css";
    @import "~leaflet/dist/leaflet.css";
    .ex-maptool-box {padding: 0 .75rem;background-color: #5e7aea;color: #fff;line-height: 2.2;cursor: pointer;float: left;padding: .35rem .75rem;min-height: 2.8rem;}
</style>

<template>
    <div class="layout-map-container"></div>
</template>
<script>/* eslint-disable linebreak-style,indent */

//调用的库文件
import Util from '../../../../libs/util'
import * as types from '../../../../libs/types'
import L from '../../../../../mapViewHtml/js/libs/leaflet/leaflet-src.js'
import d from '../../../../../mapViewHtml/js/libs/leaflet.draw-src.js'
import jsFunc from '../../../../../mapViewHtml/js/page/EditJs-2.4.0-src'
import zh from '../../../../../mapViewHtml/js/libs/zh-cn.js'

const BasePoi = require('../../../../libs/api').BasePoi


export default {
    //组件注册，按照调用的来
    components: {},
    props:['isShow', 'editMapJson', 'drawType'],
    data() {
        return {
            popMap: null,
            oCenter:null,
            mapAoLatLng: null,
            drawMapJson: this.$props.editMapJson,
            postValue:{}
        }
    },
    mounted() {

    },
    methods: {
        //初始化地图
        initMap() {
            let self = this
            let aoContainer =document.getElementsByClassName('layout-map-container')
            let mapId = 'mapId_' + this.$route.meta.id
            // if(!this.popMap){
            this.popMap=  new L.MapLib.MapMaster.PopMap(this, {parentContainer:aoContainer[0], drawType: self.drawType, mapId: mapId})
            this.popMap.loadMap(1200, 550)
            this.popMap.loadMapToolArea()
            // }
            // this.popMap.on('ESMapEdit:deleteFence')
            if(self.drawMapJson){
                self.drawMap()
                this.popMap.on('FenceView:UI.updateFence', function(oData){
                    self.initMapData(oData)
                })
            }else{
                self.initDrawMap()
                this.popMap.on('FenceView:UI.addFence', function (oData) {
                    self.initMapData(oData)
                })
            }
        },
        //地图数据
        initMapData(oData){
            let self = this
            self.oCenter = oData.centerPoint
            if(self.drawType == 'polyline') {
                self.mapAoLatLng = oData.aoLatLng
            }else{
                self.mapAoLatLng = oData.aoLatLng[0]
            }
        },
        //转换地址
        transAddress(){
            let self = this
            let postV = {
                actiontype: 'ToGpsLngLatGaoDe',
                lng: self.oCenter.lng.toFixed(6),
                lat: self.oCenter.lat.toFixed(6)
            }
            Util.ojax.post(BasePoi, postV).then(function(oData){
                if(oData.data.code == 1){
                    self.postValue = {
                        addr: oData.data.detail.regeocode.formatted_address,
                        aoLatLng: {aoLatLng: self.mapAoLatLng},
                        center: self.oCenter,
                        showModal: false
                    }
                    self.$emit('postMapData', self.postValue)
                    self.$nextTick(function(){

                    })
                }else{
                    self.$Notice.error({
                        title: '温馨提示！',
                        desc: '请求失败，请删除后重新画地图！',
                        duration: 5
                    })
                }
            }).catch(function(error){
                self.$Notice.error({
                    title: '温馨提示！',
                    desc: '请求地址失败，请删除后重新画地图！',
                    duration: 5
                })
            })
        },
        //没有地图参数初始化绘画
        initDrawMap(){
            this.popMap.fire('ESMapEdit:showEditDraw')
        },
        //有地图参数则开始画围栏
        drawMap(){
            let self = this

            this.popMap.fire('ESMapEdit:editDraw', JSON.parse(self.drawMapJson))
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
                    if(this.popMap){
                        // debugger
                        // this.popMap.remove()
                        this.popMap.fire('ESMapEdit:deleteFence')
                        this.popMap.fire('ESMap:removeMap');
                        this.popMap = null
                    }
                }
            },
            immediate: true,
            deep: true
        },
        oCenter: {
            handler(n) {
                if(n){
                    this.transAddress()
                }
            },
            immediate: true,
            deep: true
        },
        editMapJson: {
            handler(newValue, oldValue) {
                if(newValue != oldValue){
                    this.drawMapJson = newValue
                    // this.$nextTick(() => {
                    //     this.initMap()
                    // })
                }
            },
            immediate: true,
            deep: true
        }
    },
    computed: {


    }
}
</script>

<style>
    .tree-default .tree-selected {
        background: #3bb15b !important;
        color: #fff;
    }
</style>