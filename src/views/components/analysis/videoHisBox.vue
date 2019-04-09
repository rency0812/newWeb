<template>
    <div class="video-box">
        <div class="video-box-pause-img" v-show="!videoState" style="display:none">
            <Icon type="pause"></Icon>
        </div>
        <video :src="videoSrc" :id='"c_" + cid' autoplay v-show="toplay"></video>
        <div class="video-control">
            <button class="video-control-button" style="float: left;" v-if="!videoState" @click="playVideo">
                <Icon type="md-play"></Icon>
            </button>
            <button class="video-control-button" style="float: left;" v-if="videoState" @click="pauseVideo">
                <Icon type="md-pause"></Icon>
            </button>
            <!--{{PhoneNum}}-->
            <button class="video-control-button" style="float: right;" v-if="!videoFull" @click="fullWindow">
                <Icon type="md-expand"></Icon>
            </button>
            <button class="video-control-button" style="float: right;" v-if="videoFull" @click="smallWindow">
                <Icon type="md-contract"></Icon>
            </button>
            <button class="video-control-button" style="float: right;" @click="cutVideo">
                <Icon type="md-aperture"></Icon>
            </button>
        </div>
        <canvas :id='"can_" + cid'
                style="display: none">
            Your browser does not support the HTML5 canvas tag.
        </canvas>

    </div>
</template>

<script>/* eslint-disable linebreak-style,indent,no-console,no-unused-vars,quotes,no-var,camelcase,no-undef */
import Util from '../../../libs/util'

const videoUrl = require('../../../libs/api').videoUrl

export default {
    props: ['videoSrc', 'cid', 'toplay', 'videoSrc', 'PhoneNum', 'StartTime', 'EndTime', 'userId'],
    data() {
        return {
            videoState: true,
            videoFull: false,
            videoUrl: ''
        }
    },
    methods: {
        //播放暂停
        playVideo() {
            var self = this
            var oVideo = document.getElementById("c_" + self.cid)
            self.videoState = true
            oVideo.play()
        },
        pauseVideo() {
            var self = this
            var oVideo = document.getElementById("c_" + self.cid)
            self.videoState = false
            oVideo.pause()
        },

        //放大缩小
        fullWindow() {
            var self = this
            var oVideo = document.getElementById("c_" + self.cid)
            var parentsOvideo = oVideo.parentNode.parentNode
            var fullWid = window.innerWidth
            parentsOvideo.style.position = 'absolute'
            parentsOvideo.style.width = fullWid * 0.8 + 'px'
            parentsOvideo.style.height = '100%'
            parentsOvideo.style.left = '0'
            parentsOvideo.style.top = '0'
            parentsOvideo.style.zIndex = '1000'
            self.videoFull = true
        },
        smallWindow() {
            var self = this
            var oVideo = document.getElementById("c_" + self.cid)
            var parentsOvideo = oVideo.parentNode.parentNode
            var fullWid = window.innerWidth
            parentsOvideo.style.position = 'relative'
            parentsOvideo.style.width = '480px'
            parentsOvideo.style.height = '270px'
            parentsOvideo.style.left = 'auto'
            parentsOvideo.style.top = 'auto'
            parentsOvideo.style.zIndex = 'auto'

            self.videoFull = false
        },

        //截图
        cutVideo() {
            var self = this
            let $_oCan = document.getElementById("can_" + self.cid)
            let oVideo = document.getElementById("c_" + self.cid)
            let oContext = $_oCan.getContext('2d')
            $_oCan.width = window.innerWidth * 2
            $_oCan.height = window.innerHeight * 2
            oContext.drawImage(oVideo, 0, 0, $_oCan.width, $_oCan.height)
            let myCanvas = $_oCan
            let image = $_oCan.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream')
//            window.location.href = image
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
            save_link.href = image
            save_link.download = '截图.png'

            var event = document.createEvent('MouseEvents')
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            save_link.dispatchEvent(event)
        },
        closeVideo() {
            let self = this
            self.wfs.websocketLoader.client.close()
            var oVideo = document.getElementById("c_" + self.cid)
            self.videoState = false
            oVideo.stop()
        }

    }
}
</script>