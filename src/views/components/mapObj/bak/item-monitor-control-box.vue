<template>
    <ul class="control-btn-box">
        <li v-for="(item,index) in controlData" :style="{width:liWidth}" :key="index">
            <a href="javasrcipt:void(0);" :data-type="item.type" @click="hanldeBtn">
                {{item.label}} <br/> [{{item.value}}]
            </a>
        </li>
    </ul>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations */
    export default {
        props: ['controlData'],
        data() {
            return {
                liWidth: null
            }
        },
        beforeMount() {
            this.liWidth = '33.33333%'
        },
        methods: {
            hanldeBtn(e) {
                var btnType = e.currentTarget.dataset.type
                this.$emit('handeControlBtn', btnType)
            }
        }
    }
</script>

<style>
    .control-btn-box li {
        float: left;
        margin: 10px auto;
    }

    .control-btn-box a {
        width: 80%;
        line-height: 27px;
        text-align: center;
        border-radius: 3px;
        font-size: 13px;
        padding: 0 15px;
        display: block;
        margin: 0 auto;
        color: #fff;
        background-color: #ff9800;
        background-image: -webkit-linear-gradient(-45deg, rgba(255, 255, 255, .05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .05) 50%, rgba(255, 255, 255, .05) 75%, transparent 75%, transparent) !important;
        background-image: -o-linear-gradient(-45deg, rgba(255, 255, 255, .05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .05) 50%, rgba(255, 255, 255, .105) 75%, transparent 75%, transparent) !important;
        background-image: linear-gradient(-45deg, rgba(255, 255, 255, .05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .1) 50%, rgba(255, 255, 255, .05) 75%, transparent 75%, transparent) !important;
        -webkit-background-size: 10px 10px !important;
        background-size: 10px 10px !important;
        box-shadow: 0 2px 2px rgba(0, 0, 0, .15);
        white-space: nowrap;

    }
</style>