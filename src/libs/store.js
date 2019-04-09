/* eslint-disable linebreak-style,indent,no-var,complexity */
import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'

Vue.use(Vuex)


export default new Vuex.Store({


    state: {
        title: '',

        //用户信息相关数据
        user: localStorage.$userstatus ? JSON.parse(localStorage.$userstatus) : {}, //用户信息
        token: localStorage.$userstatus ? JSON.parse(localStorage.$userstatus).token : null,      //登录token
        tokenDate: localStorage.$userstatus ? JSON.parse(localStorage.$userstatus).tokenDate : null,  //登录token时间
        platformState: localStorage.$platformState ? JSON.parse(localStorage.$platformState) : null,

        //菜单相关数据
        menu: localStorage.$menu ? localStorage.$menu : null,
        menutag: localStorage.$menutag ? JSON.parse(localStorage.$menutag) : [],


        mainHeight: sessionStorage.$screen ? window.screen.height : document.body.clientHeight,

        //页面状态变化
        pageScreen: false,
        headerControl: false,


        GPS: [{Lat: 30.376534, Lon: 114.307872}],
        ALARM: [],
        routes: null
    },
    mutations: {
        [types.USER]: (state, data) => {
            localStorage.$userstatus = data
            state.user = data
        },
        [types.SETTING]: (state, data) => {
            localStorage.$usersetting = data
        },
        [types.LOGOUT]: (state) => {
            localStorage.removeItem('token')
            state.token = null
        },


        [types.TITLE]: (state, data) => {
            state.title = data
        },

        //页面状态变化
        [types.Header]: (state, data) => {
            state.headerControl = data
        },
        [types.PageScreen]: (state, data) => {
            // console.log(data)
            state.pageScreen = data
        },
        [types.MENU]: (state, data) => {
            localStorage.$menu = data
            // localStorage.$menutag = JSON.stringify([])
            // localStorage.$breadcrumb = JSON.stringify([])
            state.menutag = []
            state.menu = data
        },
        [types.MENUTAG]: (state, data) => {
            localStorage.$menutag = JSON.stringify(data)
            state.menutag = data
        },
        [types.SCREEN]: (state, data) => {
            sessionStorage.$screen = data
            state.screen = data
            state.mainHeight = sessionStorage.$winheight
            sessionStorage.$winheight = document.body.clientHeight
        },
        [types.GPS]: (state, data) => {
            state.GPS = data
        },
        [types.ALARM]: (state, data) => {
            state.ALARM = data
        }
    },
    getters: {
        tableMenu(sideMenu = 1) {
            sideMenu = JSON.parse(localStorage.$platformState).sideMenu
            return sideMenu
        }

    }
})