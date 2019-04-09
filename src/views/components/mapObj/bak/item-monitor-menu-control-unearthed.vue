<template>
    <div>
        <h3 class="title">工地监控选项</h3>
        <h5>工地实时状况显示：
            <label>是否一直在地图上显示
                <i-switch size="small" v-model="controlSwitch.show">
                    <span slot="open"></span>
                    <span slot="close"></span>
                </i-switch>
            </label>

        </h5>
        <ul class="menu-control-list">
            <li>
                <label>核准消纳场
                    <i-switch size="large" v-model="controlSwitch.unearthed">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
                    </i-switch>
                </label>
            </li>
            <li>
                <label>无资质消纳场
                    <i-switch size="large" v-model="controlSwitch.unqualifiedUnEarched">
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
                    show: true,
                    unearthed: false,
                    unqualifiedUnEarched: true
                },
                btnData: [{
                    'label': '核准消纳场',
                    'type': 'unEarchedList'
                }, {
                    'label': '无资质消纳场',
                    'type': 'unqualifiedUnEarchedList'
                }]
            }
        },
        methods: {
            handeControlBtn(e) {
                this.$emit('handeControlBtn', e)
            }
        },
        name: "item-monitor-menu-control-unearthed"
    }
</script>

<style>


</style>