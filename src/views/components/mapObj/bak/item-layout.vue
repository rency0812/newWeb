<template>
    <div>
        <Dropdown class="map-tool-item" @on-click="changeLayout">
            <a href="javascript:void(0);" type="primary">
                {{layoutTitle}}
                <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem name="normal">正常模式</DropdownItem>
                <DropdownItem name="dark">投影模式</DropdownItem>

                <DropdownItem name="deg0">平面模式</DropdownItem>
                <DropdownItem name="deg55">立体模式</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Dropdown class="map-tool-item" @on-click="changeLayout">
            <a href="javascript:void(0);" type="primary">
                叠加图层
                <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem name="traffic" v-if="isTrafficVisible">√ 实时路况</DropdownItem>
                <DropdownItem name="traffic" v-else>实时路况</DropdownItem>
                <DropdownItem name="star" v-if="isStarVisible">√ 卫星模式</DropdownItem>
                <DropdownItem name="star"v-else>卫星模式</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations */
    let deg = 0
    var trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10
    });
    export default {
        data() {
            return {
                layoutTitle: '投影模式',
                isTrafficVisible:false,
                isStarVisible:false,
                mapStyle: ''
            }
        },
        methods: {
            changeLayout(name) {
                var self = this
                var toLayoutNormal
                switch (name) {
                    case 'normal':
                        self.layoutTitle = '正常模式'
                        self.mapStyle = 'normal'
                        toLayoutNormal = function (mapObj, starMap) {
                            mapObj.setMapStyle('amap://styles/whitesmoke');
                            starMap.setOpacity(0)
                            self.isStarVisible = false;
                            mapObj.setPitch(deg)
                        }
                        break
                    case 'dark':
                        self.layoutTitle = '投影模式'
                        self.mapStyle = 'dark'
                        toLayoutNormal = function (mapObj, starMap) {
                            mapObj.setMapStyle('amap://styles/934f7845cedfc7c4913b6a2641d17cbf');
                            starMap.setOpacity(0)
                            self.isStarVisible = false;
                            mapObj.setPitch(deg)
                        }
                        break
                    case 'star':
                        toLayoutNormal = function (mapObj, starMap) {
                            if (self.isStarVisible) {
                                self.isStarVisible = false;
                                starMap.setOpacity(0)
                            } else {
                                self.isStarVisible = true;
                                starMap.setOpacity(1)
                            }
                        }
                        break
                    case 'deg0':
                        self.layoutTitle = '平面模式'
                        self.mapStyle = 'deg0'
                        toLayoutNormal = function (mapObj) {
                            mapObj.setPitch(0)
                            deg = 0
                        }
                        break
                    case 'deg55':
                        self.layoutTitle = '立体模式'
                        self.mapStyle = 'deg55'
                        toLayoutNormal = function (mapObj) {
                            mapObj.setPitch(55)
                            deg = 55
                        }
                        break
                    case 'traffic':
                        toLayoutNormal = function (mapObj) {
                            if (self.isTrafficVisible) {
                                self.isTrafficVisible = false;
                                trafficLayer.hide()
                            } else {
                                self.isTrafficVisible = true;
                                trafficLayer.setMap(mapObj);
                                trafficLayer.show()
                            }
                        }
                        break


                }
                self.$emit('mapToolEvent', toLayoutNormal, self.mapStyle)
            }
        },
        name: "layout-change"
    }
</script>

<style>

</style>