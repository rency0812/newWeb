/* eslint-disable camelcase,no-undef */


/*
Video-2.3.0 code for exsun

Copyright©2015-2018 武汉依迅北斗空间技术有限公司 All Rights Reserved.

http://www.exsun.cn
*/

(function (window, document,  $) {/**
 *
 * 渣土车实时视频播放
 * Created by liulin on 2018/8/31.
 */
  ES.Muck = {
    version:'2.3.0'
  }


  ES.Muck.Video = ES.Page.extend({

    initialize: function (cId, oOption) {


      this.cId = cId
      this.initUI()
      this.initEvent()

    },

    // 初始画界面对象
    initUI: function () {

        // 页面布局
      this.oLayout = new ES.Muck.BaseLayout(this, {})



      let nW = $('.ex-layout-content').width()
      let nH = $('.ex-layout-content').height()  - 79

        // 左边树结构
      this.oTree = new ES.Muck.Tree(this, {}, {
        core: {
          'animation': 0,
          'check_callback': true,

          'state': {'opened': true},
          'data': {
            url: '/Vehicle/CameraTree',
            type: 'POST'
          }
        },
        checkbox:{
          tie_selection:false
        },

        plugins: ['checkbox', 'types', 'search', 'unique']
      })

      this.oScreen = new ES.Muck.Screen(this, {})
    },

    initEvent: function () {
      let self = this
      $('#reloadTree').bind('click', function () {
        self.oTree.reload()
      })
    }
  })

/**
 *
 * 视频 页面布局
 * Created by liulin on 2018/8/31.
 *
 */

  ES.Muck.BaseLayout = ES.Evented.extend({
    cHTML: '',
    oOption: {
      cPContainer: '.ex-layout-main',
      nWidth:220,
      nHeight:65,
      nSearchHeight:45
    },

    initialize: function (oParent, oOption) {
      ES.setOptions(this, oOption)
      this._oParent = oParent
        // 初始化界面
      this.initUI()
      this.initOn()
    },
    initOn: function () {
      this._oParent.on('Layout.resize', this.resize, this)
    },
    resize: function () {

      $('.ex-layout-content').css({ height: $(window).height(), width: $(window).width() - this.oOption.nWidth  })
        // if(oData.nWidth){
        //     this.$_oContainer.css({width:oData.nWidth});
        // }
        // if(oData.nHeight){
        //     this.$_oContainer.css({height:oData.nHeight});
        // }
    },
    reflesh: function (nWidth, nHeight) {
      this.$_oContainer.css({width:nWidth, height:nHeight})
    },

    initUI: function () {

        //this.$_oContainer = $(this.cHTML);
        //$(this.oOption.cPContainer).append(this.$_oContainer);
        // 主地图显示
      $('.ex-layout-content').css({ height: $(window).height(), width: $(window).width() - this.oOption.nWidth  })
        //var $dtGridCantrain = $('.dt-grid-container');
        //var $formSearch = $('.ex-layout-form-search');
        //$dtGridCantrain.height($('.ex-layout-content').height() - $formSearch.height() - this.oOption.nSearchHeight - $('.echarts-style-box').height()- 40);
    }
  })

/**
 * 视频 车辆树
 * Created by liulin on 2018/8/31.
 */

  ES.Muck.Tree = ES.Common.BaseTree.extend({

    initUI: function () {
      this.$_oContainer = $('.ex-theme-tree')
      this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content')
      this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt')
      this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn')
        //this.$_oContainer.find('h3').html(this.oOption.cTitle);
    },
    readyCallBack: function () {
        //this.checkAll();
    },
    checkCallBack: function (e, oNode) {
      if (oNode.node.id.indexOf('c') > -1) {
        this._oParent.oScreen.openVideo({
          cDevNo: oNode.node.data.devno,
          nCId: oNode.node.data.chanel,
          cVehNo: oNode.node.data.vehNo
        })
      }      else {
        let aoNode = this.getSelfChildNode(oNode.node)

        let nCnt = 0
        for (let i = 0; i < aoNode.length; i++) {
          if (nCnt > 16) {
            ES.aWarn('最多打开16个通道视频！')
            break
          }
          if (aoNode[i].id.indexOf('c') > -1) {
            nCnt = nCnt + 1
            this._oParent.oScreen.openVideo({
              cDevNo: aoNode[i].data.devno,
              nCId: aoNode[i].data.chanel,
              cVehNo: aoNode[i].data.vehNo
            })
          }
        }
      }
    },

    checkAllCallBack: function (e, oNode) {

    },

    uncheckCallBack: function (e, oNode) {
      if (oNode.node.id.indexOf('c') > -1) {
        this._oParent.oScreen.closeVideos([{
          cDevNo: oNode.node.data.devno,
          nCId: oNode.node.data.chanel,
          cVehNo: oNode.node.data.vehNo
        }])
      } else {
        let aoNode = this.getSelfChildNode(oNode.node)
        let aoData = []

        for (let i = 0; i < aoNode.length; i++) {
          if (aoNode[i].id.indexOf('c') > -1) {

            aoData.push({
              cDevNo: aoNode[i].data.devno,
              nCId: aoNode[i].data.chanel,
              cVehNo: aoNode[i].data.vehNo
            })
          }
        }
        this._oParent.oScreen.closeVideos(aoData)
      }
    },

    reload: function () {
      this.$_oTree.refresh()
    }
  })

/**
 * 做 屏幕控制
 * Created by liulin on 2018/8/31.
 */

  ES.Muck.Screen = ES.Evented.extend({

    initialize: function (oParent, oOption) {
      this._oParent = oParent
      this.initUI()
      this.createVideoBox()

      this.initEvent()

    },

    initUI: function () {
      this.$_oCameraBtn = $('.ex-camera-type > button')

      this.$_oCameraCtrl = $('.ex-camera-aoc a.screen')

      this.$_oVideLayout=$('.ex-layout-video-box')



    },

    initEvent: function () {
      let self = this
      this.$_oCameraBtn.unbind('click').bind('click', function () {

        let _type = $(this).attr('data-type')

        if ((_type == '2') || (_type == '4')) {
          self.eventCloud(true)
        } else {
          self.eventCloud(false)
        }
        if ((_type == '1') || (_type == '2')) {
          self.createVideoBox()

          $('.ex-camera-aoc').fadeIn()
        } else {
                //CreatOcxBox();
          $('.ex-camera-aoc').fadeOut()
        }

        self.$_oCameraBtn.removeClass('ec-btn-success').addClass('ec-btn-default')
        $(this).removeClass('ec-btn-default').addClass('ec-btn-success')

      })

      this.$_oCameraCtrl.bind('click', function () {

        let cNum = $(this).attr('screen-num')

        self.changeLayout(cNum)
      })


    },

    createVideoBox:function () {

      let self =this
      let _html = '<ul>'

      for (let i = 0; i < 16; i++) {
        let _i = i + 1

        _html +=
                '<li class="video_box"><div class="wndBg"><span id="span' + _i + '">窗口' + _i + '</span><em></em></div>'+
                '   <a href="javascript:void(0);" style="display: none" class="ex-video-play-btn"></a> ' +
                '   <video style="object-fit:fill; width:100%;height:100%" autoplay></video>' +
                '   <div class="ex-video-control">' +
                '       <a href="javascript:void(0);" class="ex-video-control-play" ></a>' +
                '       <div class="ec-align-right">' +
                '           <a href="javascript:void(0);" class="ex-video-control-cut" ></a>' +
                '           <a href="javascript:void(0);" style="display: none" class="ex-video-control-full" ></a>' +
                '       </div>' +
                '   </div>' +
                '</li>'

      }
      _html += '</ul>'
      $('.ex-layout-video-box').html(_html)

      this.$_oPlayBtn = $('.ex-video-control>a')
      this.$_oCutBtn =  $('.ex-video-control a.ex-video-control-cut')
      this.$_oFullBtn =  $('.ex-video-control a.ex-video-control-full')

      this.initVideoEvent()
    },

    initVideoEvent:function(){

      this.$_oPlayBtn.bind('click', function () {

        let cId =  $(this).parent().parent().attr('cid')
        if ($(this).hasClass('ex-video-control-pause')) {
          $(this).removeClass('ex-video-control-pause')
          $(this).addClass('ex-video-control-play')
          document.getElementById(cId).play()
        } else {
          $(this).removeClass('ex-video-control-play')
          $(this).addClass('ex-video-control-pause')
          document.getElementById(cId).pause()
        }

      })

      this.$_oCutBtn.bind('click', function () {
        let $_oCan = $('<canvas></canvas>')

        let cId =  $(this).parent().parent().parent().attr('cid')
        let oVideo = document.getElementById(cId)

        $_oCan.width($(oVideo).width())
        $_oCan.height($(oVideo).height())
        let oContext = $_oCan.get(0).getContext('2d')
        oContext.drawImage(oVideo, 0, 0, $(oVideo).width() * 7 / 6, $(oVideo).height() * 23 / 12, 0, 0, $_oCan.width(), $_oCan.height())
        let myCanvas = $_oCan.get(0)
        let image = myCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        window.location.href = image
      })

      this.$_oFullBtn.bind('click', function () {
        let cId = $(this).parent().parent().parent().attr('cid')
        let oVideo = document.getElementById(cId)
        if ($(this).hasClass('ex-video-control-full')) {
          if (oVideo.requestFullscreen) {
            oVideo.requestFullscreen()
          } else if (oVideo.mozRequestFullScreen) {
            oVideo.mozRequestFullScreen()
          } else if (oVideo.webkitRequestFullScreen) {
            oVideo.webkitRequestFullScreen()
          }


                // setTimeout(function () {
                //     oVideo.controls=false;
                // },100);
                //$(this).removeClass('ex-video-control-full');
                //$(this).addClass('ex-video-control-exitfull');
        }            else            {
          let de = document
          if (de.exitFullscreen) {
            de.exitFullscreen()
          } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen()
          } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen()
          }
                //$(this).removeClass('ex-video-control-exitfull');
                //$(this).addClass('ex-video-control-full');
        }

      })
    },

    showHideBox:function () {
      for (var i = 0; i < this.m_nNum; i++) {
        $('.ex-layout-video-box>ul>li').eq(i).show()
      }
      for (var i = this.m_nNum; i < 16; i++) {
        $('.ex-layout-video-box>ul>li').eq(i).hide()
      }
    },

    eventCloud:function (open) {
      if (open) {
        $('.ex-layout-sider > .ex-layout-struckbox-content').height($(window).height() - $('.ex-video-cloud-panel').height() - 68)
        $('.ex-video-cloud-panel').stop().animate({'bottom':'0'})
      } else {
        $('.ex-layout-sider > .ex-layout-struckbox-content').height($(window).height() - 68)
        $('.ex-video-cloud-panel').stop().animate({ 'bottom': '-100%' })
      }
    },

    // 分屏控制
    changeLayout:function (cNum) {

      this.m_nNum = parseInt(cNum)
      this.showHideBox()
      this.resizeVideoBox()
    },

    resizeVideoBox:function() {
      let  nWndWidth = $('.ex-layout-video').width()
      let  nWndHeight = $('.ex-layout-video').height() - 29

      $('.ex-layout-video-box').css({'width': nWndWidth, 'height': nWndHeight})
      switch (this.m_nNum) {
        case 1:
          $('.video_box').stop().animate({'width': nWndWidth, 'height': nWndHeight})
          break
        case 2:
          $('.video_box').stop().animate({'width': nWndWidth, 'height': nWndHeight / 2})
          break
        case 4:
          $('.video_box').stop().animate({'width': nWndWidth / 2, 'height': nWndHeight / 2})
          break
        case 6:
          $('.video_box').eq(0).stop().animate({
            'width': nWndWidth * 2 / 3 - 1,
            'height': nWndHeight * 2 / 3 - 2
          })
          for (let i = 1; i < 6; i++) {
            $('.video_box').eq(i).stop().animate({'width': nWndWidth / 3, 'height': nWndHeight / 3})
          }
          break
        case 9:
          $('.video_box').stop().animate({'width': nWndWidth / 3, 'height': nWndHeight / 3})
          break
        case 16:
          $('.video_box').stop().animate({'width': nWndWidth / 4, 'height': nWndHeight / 4})
          break
      }
    }
  })

// 视频操作
  ES.Muck.Screen.include({

    // 判断视频是否打开
    isVideoOpen:function(oData){
      let cId =oData.cDevNo+'_'+ oData.nCId
      return this.$_oVideLayout.find('li.video_box[cDevNo="'+cId+'"]').length>0?true:false
    },
    // 勾选一个打开一个，把车牌号车设备号传过来
    openVideo:function (oData) {
      if(this.isVideoOpen(oData)){
        return
      }

      let aoVideo = this.$_oVideLayout.find('li.video_box')

      let bFull = true

      for(let i =0;i< aoVideo.length;i++) {
        if (!$(aoVideo[i]).attr('cId')) {
                // 加载视频
          bFull = false
          $(aoVideo[i]).data('oData', oData)

          $(aoVideo[i]).attr({cId: oData.cDevNo +'_'+ oData.nCId})

          $(aoVideo[i]).find('video').attr({id: oData.cDevNo +'_'+ oData.nCId})

          $(aoVideo[i]).find('span').text(oData.cVehNo + '-' + oData.nCId + '通道')

          this.reqVideo(oData)
          break
        }
      }

      if(bFull) {
        ES.aWarn('电视墙已满，请关闭电视墙后在打开!')
        return
      }

      this.openByTreeCheck(aoVideo)
      this.showHideBox()
      this.resizeVideoBox()

    },

    // 用树节点打开
    openByTreeCheck:function(aoVideo) {
        //计算显示的分屏数
      let nNum = 0
      for (let i = 0; i < aoVideo.length; i++) {
        if ($(aoVideo[i]).data('oData')) {
          nNum = i + 1
        }
      }
      switch (nNum) {
        case 1:
          this.m_nNum = 1
          break
        case 2:
          this.m_nNum = 2
          break
        case 3:
        case 4:
          this.m_nNum = 4
          break
        case 5:
        case 6:
          this.m_nNum = 6
          break
        case 7:
        case 8:
        case 9:
          this.m_nNum = 9
          break
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
          this.m_nNum = 16
          break
      }
    },

    // 发送视频请求
    reqVideo:function(oData) {
      ES.reqData({
        data: {
          PhoneNum: oData.cDevNo,
          IP: m_oVideoConfig.IP,
          TcpPort: m_oVideoConfig.TcpPort,
          Chanel: oData.nCId,
          MediaType: m_oVideoConfig.MediaType,
          CodeType: m_oVideoConfig.CodeType
        },
        url: '/EntranceGuard/EntranceMedia',
        async: false

      }, this.reqVideoHandler, this, oData)
    },

    // 发送请求成功后 就开始ws 请求视频
    reqVideoHandler:function (oData) {

      let cId =  oData.cDevNo + '_' + oData.nCId
      let $_oVideo = this.$_oVideLayout.find('li.video_box[cId="' + cId + '"]')
      let wfs = new Wfs()
      let oVideo = document.getElementById(cId)
      wfs.attachMedia(oVideo, m_cUserId + '_' + cId)
      $_oVideo.data('wfs', wfs)
    },

    // 关闭视频当
    closeVideos:function (aoData) {
      if(!aoData || aoData.length<=0){
        return
      }
      let aoParam =[]
      for (let i = 0; i < aoData.length; i++) {
        aoParam.push({PhoneNum:aoData[i].cDevNo, Chanel:aoData[i].nCId})

        let cId =  aoData[i].cDevNo + '_' + aoData[i].nCId

        let $_oVideo =  this.$_oVideLayout.find('li.video_box[cId="'+cId+'"]')

        $_oVideo.find('span').text('窗口'+ ($_oVideo.index()+1))
        let wfs =$_oVideo.data('wfs')
        $_oVideo.find('video').removeAttr('id')
        $_oVideo.find('video').attr({'src':''})
        $_oVideo.removeAttr('cId')

            // 关闭连接
        wfs.websocketLoader.client.close()
      }

      ES.reqData({
        data: {
          List: aoParam,
                // 控制指令;0关闭音视频;1切换码流;2暂停传输;3恢复传输; 4关闭双向对讲
          CmdType: 0,
          CloseMediaType: m_oVideoConfig.MediaType,
          ChangeCodeType: m_oVideoConfig.CodeType
        },
        url: '/EntranceGuard/MediaControlDistribute',
        async: true

      }, this.closeVideosHandler, this)
    },

    closeVideosHandler:function (oData) {
        //if(oData)
    }
  })



}(window, document,  jQuery))