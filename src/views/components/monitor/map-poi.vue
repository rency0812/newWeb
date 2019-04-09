<template>
    <div class="layout-map-poi">
        <Input
                v-model="poiText"
                icon="ios-search"
                placeholder="请输入搜索的地点"
                @on-change=searchEvt
                clearable
        />
        <div class="layout-map-poi-list" v-show="poiListShow">
            <div v-for="item in poiList" :data-location="item.location" :data-name="item.name" :key="item.name"
                 @click="mapToPoi">
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script>

    //vuex状态管理
    import {mapState, mapMutations, mapGetters} from 'vuex'
    import Util from '../../../libs/util'
    import Axios from 'axios'

    export default {
        data() {
            return {
                poiText: null,
                autoComponet: null,
                poiList: [],
                poiListShow: false,
                poiSearchId: null
            }
        },

        mounted() {
        },

        methods: {
            searchEvt() {
                let self = this
                let keyword = self.poiText
                clearTimeout(self.poiSearchId)
                self.poiSearchId = setTimeout(function () {
                    if (keyword !== '') self.amapPoiWebService({poiText: keyword})
                }, 700)
            },
            mapToPoi(e) {
                let self = this
                self.poiListShow = false
                self.poiText = e.currentTarget.dataset.name
                clearTimeout(self.poiSearchId)
                self.mapCenterChange(e.currentTarget.dataset.location)
                self.poiList = []
            },
            ...mapMutations('mapState', [
                'amapPoiWebService',
                'mapCenterChange'
            ])
        },
        computed: {
            menuId() {
                return this.$route.meta.menuId
            },
            ...mapGetters('mapState', [
                'mapData'
            ])
        },
        watch: {
            mapData: {
                handler(data) {
                    let self = this
                    let poiList = data.searchPoiList
                    this.poiList = []
                    for (var i in poiList) {
                        self.poiList.push({
                            name: poiList[i].name,
                            location: poiList[i].location
                        })
                    }
                    if (self.poiList.length > 0) self.poiListShow = true
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>
