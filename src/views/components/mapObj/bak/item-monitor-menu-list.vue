<template>
    <ul class="stastic-card monitor">
        <li v-for="(item,index) in stasticTopData" :key="index" @click="selectActive"
            :style="{width:liWidth,margin:'.25%'}">
            <Card :bordered='false' :data-index="index" :data-type="item.type" class="stastic-card-box" :class="{'active':index===0}">
                <h3>{{item.label}}</h3>
                <p>{{item.value}}</p>
            </Card>
        </li>
    </ul>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations */
    export default {
        props: ['stasticTopData', 'StasticCount'],
        data() {
            return {
                liWidth: null
            }
        },
        created() {
            console.log(this.$props.StasticCount)
            this.liWidth = (100 / this.$props.StasticCount) - 0.5 + '%'
        },
        methods: {
            selectActive(e) {
                var self = this
                var index = e.target.offsetParent.dataset.index
                var type = e.target.offsetParent.dataset.type
                var targetNode = e.target.offsetParent
                var card = document.getElementsByClassName('stastic-card-box');
                var cardList = Array.prototype.slice.call(card);
                cardList.forEach((value, i, div) => {
                    div[i].classList = 'stastic-card-box ivu-card'
                });
                targetNode.classList = 'stastic-card-box ivu-card active'
                self.$emit('handleControlPanel',type)
            },

        }
    }
</script>

<style>
    .stastic-card.monitor {
        background-color: #162159;
        box-shadow: inset 12px 0 12px rgba(0, 0, 0, .15);
    }
</style>