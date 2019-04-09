<template>
    <div class="layout-main-nav">
        <Dropdown v-for="item in menuData" :key="item.id" @on-click="toRouter" trigger="hover" >
            <DropdownItem v-if="!item.children"><img :src="item.icon"  v-if="item.icon"/> {{item.text}}</DropdownItem>
            <DropdownItem v-if="item.children"><img :src="item.icon"  v-if="item.icon"/>  {{item.text}}
                <Icon type="ios-arrow-down" v-if="item.children"></Icon>
            </DropdownItem>
            <DropdownMenu slot="list" v-for="i in item.children" :key="i.id" class="submenu-list">
                <DropdownItem v-if="!i.children" :name="i.url"><img :src="i.icon" v-if="i.icon"/> {{i.text}}</DropdownItem>
                <Dropdown v-if="i.children" placement="right-start">
                    <DropdownItem :name="i.url">
                        <img :src="i.icon" v-if="i.icon"/> {{i.text}}
                        <Icon type="ios-arrow-forward"></Icon>
                    </DropdownItem>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="ii in i.children" :name="ii.url" :key="ii.id"><img :src="ii.icon" v-if="ii.icon"/> {{ii.text}}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */

//调用vuex
import {mapState, mapMutations} from 'vuex'

export default {
    data() {
        return {activeName: null}
    },
    mounted() {
        this.loadMenu()
    },
    methods: {
        toRouter(url) {
            this.$router.push(url)
            this.storeMenuActive(url)
        },
        ...mapMutations('platformState', [
            'loadMenu', //加载菜单
            'storeMenuActive'  //暂存当前主菜单
        ])
    },
    computed: {
        ...mapState('platformState', {
            menuData: (state) => state.menuState.menuData,  //获取菜单数据,
            menuActive: (state) => state.menuState.menuActive,  //获取当前主栏目,
        })
    }
}
</script>


<style>
</style>
