<template>
    <div class="layout-map">
        <div class="layout-map-tool">
            <ButtonGroup size="small">
                <Button icon="md-barcode" @click="drawRule">测距</Button>
                <Button icon="md-barcode" @click="drawArea">测面</Button>
                <Button icon="md-barcode">路况</Button>
                <Button icon="md-barcode">卫星</Button>
                <Button icon="md-barcode">标记</Button>
                <Button icon="md-barcode" @click="closeDraw">清除</Button>
            </ButtonGroup>
        </div>
        <mapPoi v-if="pageCfg.mapPoi"/>
        <div id="MonitorMap" style="width: 100%; height: 100%"></div>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations */

//调用的组件
import mapPoi from './map-poi'
import mapTool from './map-tool'
import {mapState, mapGetters} from 'vuex'



//纠偏库
var wgs84togcj02 = require('../../../libs/gps').wgs84togcj02
var gcj02tobd09 = require('../../../libs/gps').gcj02tobd09


export default {
    components: {
        mapPoi,
        mapTool
    },
    data() {
        return {
            mapObj: null,
            poiText: ''

        }
    },
    mounted() {
        var self = this
        this.$nextTick(function () {
            self.initMap()
        })
    },
    methods: {
        initMap() {
            var self = this
            self.mapObj = new AMap.Map('MonitorMap', self.mapData)
            self.mapObj.addControl(new AMap.ControlBar({
                showZoomBar: false,
                showControlButton: true,
                position: {
                    right: '290px',
                    bottom: '-65px'
                }
            }))

            self.mapObj.addControl(new AMap.ControlBar({
                showZoomBar: false,
                showControlButton: true,
                position: {
                    right: '290px',
                    bottom: '-65px'
                }
            }))
            self.mouseTool = new AMap.MouseTool(self.mapObj);

        },

        drawRule() {
            let self = this
            self.mouseTool.rule({
                lineOptions: { //可缺省
                    strokeStyle: "solid",
                    strokeColor: "#f60",
                    strokeOpacity: 1,
                    strokeWeight: 5
                }
            });
        },
        drawArea() {
            let self = this
            self.mouseTool.measureArea({
                strokeColor: '#80d8ff',
                fillColor: '#80d8ff',
                fillOpacity: 0.3
                //同 Polygon 的 Option 设置
            });
        },
        closeDraw() {
            let self = this
            self.mouseTool.close(true)
        }

    },
    computed: {
        menuId() {
            return this.$route.meta.menuId
        },
        ...mapState('mapState', {
            mapData: (state) => state.mapData
        }),
        ...mapGetters('mapState', [
            'pageCfg',
            'mapCenter'
        ])
    },
    watch: {
        mapCenter: {
            handler(data) {
                let self = this
                let mapCenter = data
                self.mapObj.setCenter(mapCenter)
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
