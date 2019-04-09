<template>
    <div>
        <ul class="layout-entry-alerm">
            <!--<li data-type="1" @click="handleFloat" v-if="alermData.length>0">-->
                <!--<Icon type="alert-circled"></Icon>-->
                <!--<Badge :dot="alermData.length<9" :count="alermData.length" overflow-count="999">-->
                    <!--<a href="javascript:void(0);" class="layout-footer-link"> {{$t('footerText.alermtext')}}</a>-->
                <!--</Badge>-->
            <!--</li>-->
            <li data-type="1" @click="handleFloat">
                <Icon type="alert-circled"></Icon>
                <Badge dot :count="0" overflow-count="999">
                    <a href="javascript:void(0);" class="layout-footer-link"> 告警消息</a>
                </Badge>
            </li>
            <!--<li data-type="2" @click="handleFloat" v-if="msgData.length>0">-->
                <!--<Icon type="alert-circled"></Icon>-->
                <!--<Badge :dot="msgData.length<9" :count="msgData.length" overflow-count="999">-->
                    <!--<a href="javascript:void(0);" class="layout-footer-link"> {{$t('footerText.msgtext')}}</a>-->
                <!--</Badge>-->
            <!--</li>-->
            <!--<li data-type="3" @click="handleFloat" v-if="alermData[2]">-->
            <!--<Icon type="alert-circled"></Icon>-->
            <!--<Badge dot :count="alermData[2].count" overflow-count="999">-->
            <!--<a href="javascript:void(0);" class="layout-footer-link"> {{alermData[2].label}}</a>-->
            <!--</Badge>-->
            <!--</li>-->
        </ul>
        <alermBox/>
    </div>
</template>

<script>/* eslint-disable indent,linebreak-style */
//调用vuex状态管理
import {mapState} from 'vuex'

//调用依赖组件
import alermBox from './alermBox'


export default {
    components: {alermBox},
    data() {
        return {}
    },
    methods: {
        handleFloat(e) {
            debugger
            var self = this
            var target = e.target.offsetParent.parentElement
            var type = target.dataset.type
            // console.log(type)
            self.$emit('popAlerm', type)
        }
    },
    watch: {
        alermData: {
            handler(n) {
            },
            immediate: true,
            deep: true
        },
    },
    computed: {
        ...mapState('platformState', {
            alermData: (state) => state.alermState.alermData,
            msgData: (state) => state.alermState.msgData
        })
    }
}
</script>

<style>
    .layout-entry-alerm li {
        float: left;
        margin-right: 35px;
    }

    .layout-footer-link {
        color: #fff
    }

    .layout-footer-link:hover {
        color: #fc0;
    }

    .layout-entry-alerm .ivu-badge-count, .layout-entry-alerm .ivu-badge-dot {
        background-color: #f30;
        top: -15px;
        right: -15px;
        border: none;
        box-shadow: none;
        animation: blink 0.55s ease-in-out infinite both
    }

    .layout-entry-alerm .ivu-badge-dot {
        top: -5px;
        right: -10px;
        height: 6px;
        width: 6px;
    }

    .layout-entry-alerm .ivu-badge-count {
        animation: none;
    }


    @-webkit-keyframes blink {
        0% {
            opacity: 1
        }
        50% {
            opacity: .2
        }
        100% {
            opacity: 1
        }
    }

    @keyframes blink {
        0% {
            opacity: 1
        }
        50% {
            opacity: .2
        }
        100% {
            opacity: 1
        }
    }

</style>