<template>
    <div class="video-box">

        <div class="video-box-pause-img" v-show="!videoState" style="display:none">
            <Icon type="pause"></Icon>
        </div>

        <video :id='devNo+"_" + chnId' autoplay v-show="toplay"></video>
        <div class="video-control">
            <button class="video-control-button" style="float: left;" v-if="!videoState" @click="playVideo">
                <Icon type="md-play"></Icon>
            </button>
            <button class="video-control-button" style="float: left;" v-if="videoState" @click="pauseVideo">
                <Icon type="md-pause"></Icon>
            </button>
            {{vehNo}}--通道{{chnId}}
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
        <canvas :id='"c_"+devNo+"_" + chnId'
                style="display: none">
            Your browser does not support the HTML5 canvas tag.
        </canvas>

    </div>
</template>

<script>/* eslint-disable indent,no-undef,init-declarations,linebreak-style,no-unused-vars,camelcase,no-var,quotes,comma-spacing,comma-dangle,semi,no-console,no-dupe-keys,complexity,no-redeclare */
import Util from '../../../libs/util'
const videoUrl = require('../../../libs/api').videoUrl

export default {
    props: ['devNo', 'userId', 'toplay', 'vehNo', 'chnId'],
    data() {
        return {
            wfs: null,
            videoState: true,
            videoFull: false

        }
    },
    mounted() {
        this.videoState = true;
        console.log(this.toplay);
    },
    destroyed() {
        if (this.wfs) {
            this.wfs.websocketLoader.client.close();//离开路由之后断开websocket连接
        }
    },
    methods: {
        //请求视频
        reqVideo: function () {
            //debugger;
            var self = this
            self.wfs = new Wfs();
            var oVideo = document.getElementById(self.devNo + '_' + self.chnId);
            self.wfs.attachMedia(oVideo, self.userId + '_' + self.devNo + '_' + self.chnId);
            self.videoState = true
        },

        hanldeWfs: function () {
            var self = this;

            var oParam = {
                actiontype: "EntranceMedia",
                PhoneNum: self.devNo,
                IP: "61.136.223.44",
                TcpPort: 5556,
                Chanel: self.chnId,
                MediaType: 1,
                CodeType: 1
            };

            Util.ojax.post(videoUrl, oParam).then(function (res) {
                if (res.data.code === 1) {
                    console.log('wfs******video start*******');
                    self.reqVideo();
                }
            }).catch(function (error) {
                console.log(error)
            });
        },

        //播放暂停
        playVideo() {
            var self = this
            var oVideo = document.getElementById(self.devNo + "_" + self.chnId);
            self.videoState = true
            oVideo.play()
        },

        pauseVideo() {
            var self = this
            var oVideo = document.getElementById(self.devNo + "_" + self.chnId);
            self.videoState = false
            oVideo.pause()
        },

        //放大缩小
        fullWindow() {
            var self = this
            var oVideo = document.getElementById(self.devNo + "_" + self.chnId);
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
            var oVideo = document.getElementById(self.devNo + "_" + self.chnId)
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
            let $_oCan = document.getElementById("c_" + self.devNo + "_" + self.chnId)
            let oVideo = document.getElementById(self.devNo + "_" + self.chnId)
            let oContext = $_oCan.getContext('2d')
            $_oCan.width = window.innerWidth * 2
            $_oCan.height = window.innerHeight * 2
            oContext.drawImage(oVideo, 0, 0, $_oCan.width, $_oCan.height)
            let myCanvas = $_oCan
            let image = $_oCan.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream')

            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
            save_link.href = image
            save_link.download = '截图.png'

            var event = document.createEvent('MouseEvents')
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            save_link.dispatchEvent(event)

        },

    },

    watch: {
        toplay(n) {
            if (n) {
                this.hanldeWfs();
            } else {

                this.wfs.websocketLoader.client.close();
            }
        }
    }
}
</script>


<style>
    .video-box {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .video-box video {
        object-fit: fill;
        width: 100%;
        height: 100%
    }

    .video-control {
        text-align: center;
        width: 100%;
        height: 32px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, .65);
        color: #fff;
        line-height: 32px;
        font-size: 14px;
    }

    .video-control-button {
        width: 32px;
        height: 32px;
        text-align: center;
        color: #fff;
        background-color: #1550c5;
        border: none;
        font-size: 18px;
        margin-right: 1px;
        cursor: pointer;
    }

    .video-box-pause-img {
        position: absolute;
        width: 64px;
        height: 64px;
        left: 50%;
        top: 50%;
        text-align: center;
        margin-left: -32px;
        margin-top: -32px;
        color: #fff;
        font-size: 32px;

    }

</style>