<template>
    <ul class="stastic-card">
        <li v-for="(item,index) in stasticTopData" :key="index" @click="selectActive"
            :style="{width:liWidth,margin:'.25%'}">
            <Card :bordered='false' :data-index="index" class="stastic-card-box"  :class="{'active':index===0}">
                <h3>{{item.label}}</h3>
                <p>{{item.value}}</p>
            </Card>
        </li>
    </ul>
</template>

<script>
    export default {
        props: ['stasticTopData', 'count'],
        data() {
            return {
                liWidth: null
            }
        },
        beforeMount() {
            this.liWidth = (100 / this.$props.count) - 0.5 + '%'
        },
        methods: {
            selectActive(e) {
                var self = this
                console.log(e.target.offsetParent.dataset.index)
                var index = e.target.offsetParent.dataset.index
                var targetNode = e.target.offsetParent
                var card = document.getElementsByClassName('stastic-card-box');
                var cardList = Array.prototype.slice.call(card);
                cardList.forEach((value, i, div) => {
                    div[i].classList = 'stastic-card-box ivu-card'
                });
                targetNode.classList = 'stastic-card-box ivu-card active'
            },

        }
    }
</script>

<style>
    ul.stastic-card > li {
        float: left;
    }

    ul.stastic-card::after {
        clear: both;
        content: '';
    }

    .stastic-card-box {
        border-radius: 3px !important;
        color: #fff;
        cursor: pointer;
        background-color: #8432ff !important;
        background-image: -webkit-linear-gradient(-45deg, rgba(255, 255, 255, .1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .1) 50%, rgba(255, 255, 255, .1) 75%, transparent 75%, transparent) !important;
        background-image: -o-linear-gradient(-45deg, rgba(255, 255, 255, .1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .1) 50%, rgba(255, 255, 255, .1) 75%, transparent 75%, transparent) !important;
        background-image: linear-gradient(-45deg, rgba(255, 255, 255, .1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .1) 50%, rgba(255, 255, 255, .1) 75%, transparent 75%, transparent) !important;
        -webkit-background-size: 20px 20px !important;
        background-size: 20px 20px !important;
        text-shadow: 0 5px 5px rgba(90, 15, 200, .45);
        text-align: center;
    }

    .stastic-card-box.active {
        background-color: #4c84ff !important;
        -webkit-animation: progress-bar-stripes 2s linear infinite;
        -o-animation: progress-bar-stripes 2s linear infinite;
        animation: progress-bar-stripes 2s linear infinite;
    }

    .stastic-card-box h3 {
        font-size: 14px;
        font-weight: normal;
        opacity: 0.85;
    }

    .stastic-card-box p {
        font-size: 26px;
        font-weight: 700;
    }
</style>