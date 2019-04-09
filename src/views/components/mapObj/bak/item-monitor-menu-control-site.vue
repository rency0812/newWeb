<template>
    <div>
        <h3 class="title">工地监控选项</h3>
        <h5>工地实时状况显示：
            <label>是否显示
                <i-switch size="small" v-model="controlSwitch.siteShow" @on-change="hanldeMapMarkerShowSite">
                    <span slot="open"></span>
                    <span slot="close"></span>
                </i-switch>
            </label>

        </h5>
        <ul class="menu-control-list">
            <li>
                <label>核准出土工地
                    <i-switch size="large" v-model="controlSwitch.ratify" @on-change="hanldeMapMarkerRatify">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
                    </i-switch>
                </label>
            </li>
            <li>
                <label>正在出土工地
                    <i-switch size="large" v-model="controlSwitch.now" @on-change="hanldeMapMarkerNow">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
                    </i-switch>
                </label>
            </li>
            <li>
                <label>提前出土工地
                    <i-switch size="large" v-model="controlSwitch.ahead" @on-change="hanldeMapMarkerAhead">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
                    </i-switch>
                </label>
            </li>
            <li>
                <label>无资质工地
                    <i-switch size="large" v-model="controlSwitch.unqualified" @on-change="hanldeMapMarkerUnqualified">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
                    </i-switch>
                </label>
            </li>
        </ul>
        <h5>查询选项：</h5>
        <control-list v-on:handeControlBtn="handeControlBtn" :controlData="btnData"></control-list>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations */
    import controlList from './item-monitor-control-box'
    export default {
        components: {
            'control-list': controlList
        },
        data() {
            return {
                controlSwitch: {
                    siteShow: true,
                    ratify: true,
                    now: true,
                    ahead: true,
                    unqualified: true
                },
                btnData: [{
                    'label': '核准出土工地',
                    'type': 'siteList'
                }, {
                    'label': '正在出土工地',
                    'type': 'nowSiteList'
                }, {
                    'label': '提前出土工地',
                    'type': 'ahradSiteList',
                }, {
                    'label': '无资质工地',
                    'type': 'unqualifiedSiteList',
                }, {
                    'label': '关注工地',
                    'type': 'favSiteList',
                }]
            }
        },
        methods: {
            handeControlBtn(e) {
                this.$emit('handeControlBtn', e)
            },
            hanldeMapMarkerShowSite(e) {
                this.$emit('mapSiteMarkerDisplay', 'siteShow', e)
            },
            hanldeMapMarkerRatify(e) {
                this.$emit('mapSiteMarkerDisplay', 'ratify', e)
            },
            hanldeMapMarkerNow(e) {
                this.$emit('mapSiteMarkerDisplay', 'now', e)
            },
            hanldeMapMarkerAhead(e) {
                this.$emit('mapSiteMarkerDisplay', 'ahead', e)
            },
            hanldeMapMarkerUnqualified(e) {
                this.$emit('mapSiteMarkerDisplay', 'unqualified', e)
            },
        },
        name: "item-monitor-menu-control-site"
    }
</script>

<style>


</style>