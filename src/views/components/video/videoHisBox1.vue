<template>
    <div class="video-box">
        <div class="video-box-pause-img" v-show="!videoState" style="display:none">
            <Icon type="pause"></Icon>
        </div>
        <video :id='"c_" + ChanelId' autoplay v-show="toplay"></video>
        <div class="video-control">
            <button class="video-control-button" style="float: left;" v-if="!videoState" @click="playVideo">
                <Icon type="md-play"></Icon>
            </button>
            <button class="video-control-button" style="float: left;" v-if="videoState" @click="pauseVideo">
                <Icon type="md-pause"></Icon>
            </button>
            <!--{{PhoneNum}}-->
            <!--<button class="video-control-button" style="float: right;" v-if="!videoFull" @click="fullWindow">-->
                <!--<Icon type="md-expand"></Icon>-->
            <!--</button>-->
            <!--<button class="video-control-button" style="float: right;" v-if="videoFull" @click="smallWindow">-->
                <!--<Icon type="md-contract"></Icon>-->
            <!--</button>-->
            <button class="video-control-button" style="float: right;" @click="cutVideo">
                <Icon type="md-aperture"></Icon>
            </button>
        </div>
        <canvas :id='"can_" + ChanelId'
                style="display: none">
            Your browser does not support the HTML5 canvas tag.
        </canvas>

    </div>
</template>

<script>/* eslint-disable linebreak-style,indent,no-console,no-unused-vars,quotes,no-var,camelcase,no-undef */
import Util from '../../../libs/util'
const videoUrl = require('../../../libs/api').videoUrl

export default {
    props: ['videoSrc', 'ChanelId', 'toplay', 'PhoneNum', 'StartTime', 'EndTime', 'userId'],
    data() {
        return {
            wfs: null,
            videoState: true,
            videoFull: false,
            videoUrl: ''
        }
    },
    mounted() {
//         let self = this
//         self.videoState = true
// //        this.hanldeWfs(this.cid)
//         console.log(self.toplay)
//         console.log(self.videoSrc)
//         self.videoUrl = self.videoSrc
//         setTimeout(function () {
//             self.playVideo()
//         }, 2000)

    },
    destroyed() {
        let self = this
        if (self.wfs) {
            self.wfs.websocketLoader.client.close()//离开路由之后断开websocket连接
            var oVideo = document.getElementById("c_" + self.ChanelId)
            this.videoState = false
            oVideo.stop()
        }
    },
    methods: {
        //请求视频
        reqVideo(e) {
            var self = this
            self.wfs = new Wfs()
            var oVideo = document.getElementById("c_" + e)
            self.wfs.attachMedia(oVideo, self.userId + '_' + self.PhoneNum + '_' + e)
            self.videoState = true
        },
        hanldeWfs(e) {
            var self = this
            var token = localStorage.getItem('$token').access_token

            var oParams = {
                actiontype: 'VideoPlayback',
                PhoneNum: self.PhoneNum,
                ProPhoneNum: self.PhoneNum,
                IP: '61.136.223.44',
                TcpPort: '5556',
                UdpPort: 0,
                ChanelNo: self.ChanelId,
                MediaType: 0,
                CodeType: 1,
                StorageType: 1,
                PlayType: 0,
                PlaySpeed: 0,
                CmdType: 9,
                ProChanelNo: self.ChanelId,
                StartTime: self.StartTime,
                EndTime: self.EndTime
            }
            console.log(self.ChanelId)
            Util.ojax.post(videoUrl, oParams, {headers: {token: token}}).then(function (res) {
                if (res.data.code == 1) {
                    console.log('wfs////start/////')
                    self.reqVideo(e)
                }else{
                    self.$Notice.error({
                        title: '错误提示!',
                        desc: res.data.msg,
                        duration: 5
                    })
                }
            })
        },

        //播放暂停
        playVideo() {
            var self = this
            var oVideo = document.getElementById("c_" + self.ChanelId)
            self.videoState = true
            oVideo.play()
        },
        pauseVideo() {
            var self = this
            var oVideo = document.getElementById("c_" + self.ChanelId)
            self.videoState = false
            oVideo.pause()
        },

        //放大缩小
        fullWindow() {
            var self = this
            var oVideo = document.getElementById("c_" + self.ChanelId)
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
            var oVideo = document.getElementById("c_" + self.ChanelId)
            var parentsOvideo = oVideo.parentNode.parentNode
            var fullWid = window.innerWidth
            parentsOvideo.style.position = 'relative'
            parentsOvideo.style.width = '100%'
            parentsOvideo.style.height = '65%'
            parentsOvideo.style.left = 'auto'
            parentsOvideo.style.top = 'auto'
            parentsOvideo.style.zIndex = 'auto'

            self.videoFull = false
        },

        //截图
        cutVideo() {
            var self = this
            let $_oCan = document.getElementById("can_" + self.ChanelId)
            let oVideo = document.getElementById("c_" + self.ChanelId)
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
        closeVideo(){
            let self = this
            var oVideo = document.getElementById("c_" + self.ChanelId)
            if(oVideo){
                self.wfs.websocketLoader.client.close()
                self.videoState = false
                oVideo.src = ''
            }
        }

    },
    watch: {
        toplay(e) {
            let self = this
            if (e) {
                // let videoUrl = self.videoSrc
                // self.videoUrl = videoUrl
                self.hanldeWfs(self.ChanelId)
                setTimeout(function () {
                    self.playVideo()
                }, 2000)

            } else {
                if(self.wfs){
                    self.closeVideo()
                }
            }
        }
    }
}
</script>