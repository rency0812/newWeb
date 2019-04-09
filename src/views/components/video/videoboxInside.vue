<template>
    <div class="video-box">
        <div class="video-box-pause-img" v-show="!videoState" style="display:none">
            <Icon type="pause"></Icon>
        </div>
        <video :id='id'></video>
        <div class="video-control">
            <button class="video-control-button" style="float: left;" v-if="!videoState" @click="play">
                <Icon type="md-play"></Icon>
            </button>
            <button class="video-control-button" style="float: left;" v-if="videoState" @click="pause">
                <Icon type="md-pause"></Icon>
            </button>
            设备编号{{clientId}}
        </div>
        <canvas :id='"c_"+devNo+"_" + chnId'
                style="display: none">
            Your browser does not support the HTML5 canvas tag.
        </canvas>

    </div>
</template>

<script>
    import Util from '../../../libs/util'
    import axios from 'axios'
    // import flvjs from 'flv.js'
    import flvjs from 'flv.js/dist/flv.js'
    import {mapState, mapMutations, mapGetters} from 'vuex'

    let flvPlayer, videoElement
    export default {
        props: ['id', 'devNo', 'userId', 'toplay', 'vehNo', 'chnId', 'wsUrl', 'clientId'],
        components: {
            'remote-js': {
                render(createElement) {
                    return createElement('script', {attrs: {type: 'text/javascript', src: this.src}});
                },
                props: {
                    src: {type: String, required: true}
                }
            }
        },
        data() {
            return {
                wfs: null,
                videoState: false,
                videoFull: false,
                isLoad: false,
                hasInit:false,
                orgClientId:'',
                videoData: [],
                isVideoClose: false
            }
        },
        mounted() {
        },
        computed: {
            ...mapGetters('monitorState', [
                'getVechileVideoData'
            ]),
            ...mapGetters('monitorState', [
                'getVechileVideoData_frame'
            ])
        },
        watch: {
            getVechileVideoData: function(newValue, oldValue) {
                    if (this.clientId) {
                        if(!this.hasInit){
                            this.initVideo()
                            this.orgClientId = this.clientId
                            this.hasInit = true
                        }
                    } else {
                        if(this.hasInit){
                            this.destroy()
                            this.hasInit = false
                        }
                        if(this.orgClientId){
                            let hasWsUrl = false
                            for(let item  of this.getVechileVideoData_frame){
                                if(item.wsUrl){
                                    hasWsUrl = true
                                }
                            }
                            if(!hasWsUrl){
                                this.destroy()
                            }
                        }
                    }

                }
        },
        methods: {
            initVideo() {
                console.log('init')
                let _this = this
                videoElement = document.getElementById(this.id);
                if (flvjs.isSupported()) {
                    flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        isLive: true,
                        hasAudio: false,
                        hasVideo: true,
                        url: _this.wsUrl
                    }, {
                        enableStashBuffer: true,
                        lazyLoad: true,
                        stashInitialSize: 10240,
                        isLive: true,
                        accurateSeek: true
                    })
                    flvPlayer.attachMediaElement(videoElement);
                    this.load()
                    this.play()
                }
            },
            load() {
                flvPlayer.load();
                //请求视频
            },
            play() {
                if(this.isLoad){
                    flvPlayer.play()
                    this.videoState = true
                } else {
                    if (this.wsUrl) {
                        // 创建连接
                        this.isLoad = true
                        setTimeout(() => {
                            axios.get('http://180.101.249.129:30857/realtimeMediaUploadReq',
                                {
                                    params: {
                                        clientId: this.clientId,
                                        channelId: '1',
                                        mediaType: '1',
                                        codeType: '0',
                                        hostIP: '36.111.196.84',
                                        hostPort: '5556'
                                    }
                                }
                            ).then(res => {
                                if (res) {
                                    flvPlayer.play()
                                    this.videoState = true
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        }, 500)
                    }
                }

            },
            pause() {
                flvPlayer.pause();
                this.videoState = false
            },
            destroy() {
                console.log('destroy')
                axios.get('http://180.101.249.129:30857/realtimeMediaUploadControl',
                    {
                        params: {
                            clientId: this.orgClientId,
                            channelId: '1',
                            cmdType: '0',
                            closeMediaType: '0',
                            changeCodeType: '0',
                        }
                    }
                ).then(res=>{
                    this.videoState = false
                    flvPlayer.destroy()
                }).catch(error=>{
                    console.log(error)
                })
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
