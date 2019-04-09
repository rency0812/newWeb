<template>
    <div>
        <Input v-model="regionSelect" clearable element-id="poiSearchIpt" @on-change="poiSearch" icon="search"
               placeholder="请输入您要查询的地址或地区" class="map-tool-poi"></Input>

        <Dropdown class="map-tool-item tool-region" placement="bottom-start" @on-click="handleRegionPoi">
            <a href="javascript:void(0)">
                {{selectRegion}}
                <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list" class="map-tool-poi">
                <DropdownItem v-for="item in regionList"
                              :name="JSON.stringify({value:item.value,label:item.label,areCode:item.areCode})"
                              :key="item.value">{{ item.label }}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
    const GetTreeRegionUrl = require('../../../../libs/api').GetTreeRegionUrl
    import Util from '../../../../libs/util'

    let keyNumber = 0, qKey = '', polygons = []

    export default {
        props: ['mapStyle', 'lineStyle'],
        data() {
            return {
                regionList: [],
                searchList: [],
                regionSelect: '',
                selectRegion: '选择地区',
                inputLoading: false,
            }
        },
        mounted() {
            var self = this
            this.$nextTick(function () {
                self.handleRegion()
                setTimeout(function () {
                    self.$emit('mapToolEvent', function (mapObj, district) {
                        self.initRegion(mapObj, district, '武汉市')
                    })
                }, 1000)
            })
        },
        methods: {
            handleRegion() {
                var self = this
                var RegionData = JSON.parse(localStorage.getItem('$tree_region')) || null
                if (!RegionData) {
                    Util.ajax.post(GetTreeRegionUrl, {Account: 'admin'}).then((res) => {
                        RegionData = res.data.data.treeData
                        localStorage.$tree_region = JSON.stringify(RegionData)
                        self.handleRegionData(RegionData)
                    }).catch((error) => {
                        console.log(error)
                    })
                } else {
                    self.handleRegionData(RegionData)
                }
            },
            handleRegionData(RegionData) {
                var self = this
                var regionList = []
                for (var i in RegionData) {
                    regionList.push({
                        value: RegionData[i].coord + '',
                        label: RegionData[i].title
                    })
                    if (RegionData[i].children.length > 0) {
                        for (var t in RegionData[i].children) {
                            regionList.push({
                                areCode: RegionData[i].children[t].areCode + '',
                                label: RegionData[i].children[t].title,
                                value: RegionData[i].children[t].coord + ''
                            })
                        }
                    }
                }
                self.regionList = regionList
            },
            handleRegionPoi(v) {
                console.log(v)
                var self = this
                var selectData = JSON.parse(v)
                self.selectRegion = selectData.label
                var selectLabel = selectData.areCode
                self.regionSelect = selectData.label
                var poi = selectData.value.split(',')
                console.log(selectLabel)

                self.$emit('mapToolEvent', function (mapObj, district) {
                    if (selectLabel == 420118 || selectLabel == 420119 || selectLabel == 420120 || selectLabel == 420220) {
                        for (var i = 0, l = polygons.length; i < l; i++) {
                            polygons[i].setMap(null);
                        }
                        mapObj.panTo(poi)
                        mapObj.setZoom(12)
                    } else if (selectLabel) {
                        self.initRegion(mapObj, district, selectLabel)
                    } else {
                        self.initRegion(mapObj, district, '武汉市')
                    }
                })

            },
            initRegion(mapObj, district, label) {
                //清除地图上所有覆盖物
                for (var i = 0, l = polygons.length; i < l; i++) {
                    polygons[i].setMap(null);
                }
                AMap.service('AMap.DistrictSearch', function () {
                    var opts = {
                        subdistrict: 1,   //返回下一级行政区
                        extensions: 'all',  //返回行政区边界坐标组等具体信息
                        level: 'district'  //查询行政级别为 市
                    };
                    //实例化DistrictSearch
                    district = new AMap.DistrictSearch(opts);
                    //行政区查询
                    district.search(label, function (status, result) {
                        var bounds = result.districtList[0].boundaries;
                        polygons = [];
                        if (bounds) {
                            for (var i = 0, l = bounds.length; i < l; i++) {
                                //生成行政区划polygon
                                var polygon = new AMap.Polygon({
                                    map: mapObj,
                                    strokeWeight: 4,
                                    lineJoin: 'round',
                                    path: bounds[i],
                                    fillOpacity: 0.025,
                                    fillColor: '#3f51b5',
                                    strokeColor: '#ffd800',
                                    strokeStyle: 'dashed'
                                });
                                polygons.push(polygon);
                            }

                            // mapObj.setZoomAndCenter(12, result.districtList[0].center)
                            mapObj.setFitView(polygons);
                            // console.log(result)
                        }
                        console.log(polygons)
                    });
                });
            },
            handlePoiSearch(v) {
                var self = this
                var poi = v.value.split(',')

                var toMapLocation = function (mapObj, coverObj) {
                    var bdary = new BMap.Boundary();
                    bdary.get(v.label, function (rs) {
                        if (rs.boundaries.length >= 1) {
                            coverObj.PolyLineObj.setPath(rs.boundaries[0]);
                            coverObj.PolyLineObj.setStrokeOpacity(1)
                        } else {
                            coverObj.PolyLineObj.setStrokeOpacity(0.000000001)
                        }
                        mapObj.panTo(new BMap.Point(poi[0], poi[1]));
                        setTimeout(() => {
                            coverObj.MarkerSearch.setPosition(new BMap.Point(poi[0], poi[1]))
                            if (v.label === '武汉市') {
                                mapObj.setZoom(10);
                            } else {
                                mapObj.setZoom(16);
                            }
                        }, 300)
                    });
                }
                self.$emit('mapToolEvent', toMapLocation)
            },
            poiSearch(e) {
                var self = this
                var queryKey = e.target.value
                var auto

                console.log(queryKey)
                AMap.plugin('AMap.Autocomplete', function () {//异步
                    auto = new AMap.Autocomplete({
                        city:'武汉市',
                        input: "poiSearchIpt"
                    });
                });
                self.$emit('mapToolEvent', function (mapObj, district) {
                    var placeSearch
                    AMap.plugin('AMap.PlaceSearch', function () {//异步
                        placeSearch = new AMap.PlaceSearch({
                            map: mapObj
                        });  //构造地点查询类
                        AMap.event.addListener(auto, "select", select);
                    });

                    function select(e) {
                        placeSearch.setCity(e.poi.adcode);
                        placeSearch.search(e.poi.name);  //关键字查询查询
                    }

                })
            },
            toMapIndex() {
                this.handlePoiSearch(this.regionList[0])
            },
        },
        name: "search-poi"
    }
</script>

<style>
    .map-tool-poi {
        width: 350px !important;
        line-height: 32px;
        border: none;
        outline: none;
    }

    .map-tool-poi .ivu-input ,.map-tool-poi .ivu-input:focus,.map-tool-poi .ivu-input:hover {
        border: none !important;
        outline: none !important;
    }

    .search-data li {
        width: 100%;
    }


</style>