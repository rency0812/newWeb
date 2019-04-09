/*
	ES.ExSunMap 2.4.0, a js library for ExSunMap lbs instance.
	(c) 2016-2018, liulin
	武汉依迅
	http://www.ExSunMap.cn/
*/

(function (window, document, L) {
/**
 * Created by liulin on 2016/11/8.
 *
 *
 */


L.ExSunMap = {};

L.ExSunMap.Version = '0.2.4';

// L.initTag = function (oTag, oOption) {
//     if (!oTag || !oOption) {
//         return;
//     }
//
//     //检索对象所有属性
//     for (var cItem in oOption) {
//         if ($.isArray(oOption[cItem])) {
//             //添加option对象
//             var cTemp = cItem;
//             for (var i = 0; i < oOption[cTemp].length; i++) {
//                 var oItem = $('<' + cTemp + '/>');
//                 this.initTag(oItem, oOption[cTemp][i]);
//                 oTag.append(oItem);
//             }
//         }
//         else if (typeof oOption[cItem] === 'object' && oOption[cItem] !== null) {
//             // 重复出现
//             var cTagTemp = ES.Util.replaceAll(cItem, '1', '');
//             var oItem1 = $('<' + cTagTemp + '/>');
//             this.initTag(oItem1, oOption[cItem]);
//             oTag.append(oItem1);
//         }
//         else if (cItem === 'html') {
//             var html = oTag.html();
//             oTag.html(html + ((oOption[cItem] !== null) ? oOption[cItem] : ''));
//         }
//         else {
//             oTag.attr(cItem, oOption[cItem]);
//         }
//     }
// };

/**
 * 后台请求数据
 */
L.ExSunMap = {
    //线路样式
    liveLineConfig: {
        opacity: 1,
        color: 'blue',
        weight: 3,
    },

    oLiveCircleMarkerConfig:{

        fill: true,
        fillColor: '#fff',
        radius: 3,
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    },

    // 个对象数组添加时间
    onEvent:function (clsName,eventName,fn,context) {
        var els = document.getElementsByClassName(clsName);
        if(!els || els.length<=0){
            return;
        }
        for(var i =0;i< els.length;i++){
            L.DomEvent.on(els[i], eventName, fn, context);
        }
    },


    hide:function (el) {
        el.style.display='none';
    },
    
    show:function (el) {
        el.style.display='block';
    },

    findLayer: function (oGroupLayer, cDevId) {
        if (!oGroupLayer || oGroupLayer.getLayers().length <= 0) {
            return null;
        }

        var aoLayer = oGroupLayer.getLayers();

        for (var oLayer in aoLayer) {
            if (aoLayer[oLayer].cId === cDevId) {
                return aoLayer[oLayer];
            }
        }

        return null;
    },

    // 返回数组索引,没有找到 返回-1
    // @aoTemp 为对象数组 ，@ao 为相同对象
    // @oTemp 为对象
    // @cKey 为对象属性
    arrayIndex: function (aoTemp, oTemp, cKey) {

        var nVal = -1;
        if (!aoTemp || aoTemp.length <= 0) {
            return nVal;
        }
        if (!cKey || !oTemp) {
            return nVal;
        }
        if (!oTemp.hasOwnProperty(cKey)) {
            return nVal;
        }
        if (!aoTemp[0].hasOwnProperty(cKey)) {
            return nVal;
        }
        for (var i = 0; i < aoTemp.length; i++) {
            if (aoTemp[i][cKey] === oTemp[cKey]) {
                nVal = i;
                break;
            }
        }

        return nVal;
    },

    initPopHtml:function (oGpsInfo) {

        oGpsInfo.online = "通信中断"
        oGpsInfo.speedStatus = "停止"
        oGpsInfo.gpsStatus = "未定位"

        if(!oGpsInfo.hasOwnProperty('vehTy'))
        {
            oGpsInfo.vehTy = ""
        }
        if(!oGpsInfo.hasOwnProperty('pos'))
        {
            oGpsInfo.pos = ""
        }
        // oGpsInfo 为标准数据处理
        if(oGpsInfo.sta===1 || oGpsInfo.sta===2||oGpsInfo.sta===3||oGpsInfo.sta===4){
            oGpsInfo.online = "在线"
        }
        else {
            oGpsInfo.online = "通信中断"
        }
        if(oGpsInfo.sta===1 ){
            oGpsInfo.speedStatus = "行驶"
        }
        else {
            oGpsInfo.online = "停止"
        }
        if(oGpsInfo.sta===4 ||oGpsInfo.sta===5){
            oGpsInfo.gpsStatus = "未定位"
        }
        else {
            oGpsInfo.gpsStatus = "已定位"
        }
        oGpsInfo.dura=L.ExSunMap.getTimeBySecond(oGpsInfo.dayHour);

        var cHtml = L.Util.template(L.ExSunMap.popHtml, oGpsInfo) ;
        return cHtml;
    },

    // 获得时间 根据秒，nInt = 62 = 1.01分钟
    getTimeBySecond: function (nInt) {
        //var nCurTick = new Date().getTime();
        //var nInt = nCurTick - nTick;
        if (nInt > 24 * 60 * 60 ) {
            var nDay = nInt / (24 * 60 * 60 );

            return  nDay.toFixed(2)  + "天";
        }
        else if (nInt > 1 * 60 * 60   && nInt <= 24 * 60 * 60  ) {

            var nH = nInt / (1 * 60 * 60 );
            return nH.toFixed(2)  + "时";
        }
        else {
            var nH = nInt /60 ;
            return nH.toFixed(2)  + "分";
        }
    },

    initPopEven: function (oPopup,oparent) {
        //var self = this;
        if (!oPopup) return;
        //oPopup.self = this;
        oPopup.on("contentupdate", function () {

            L.ExSunMap.onEvent('veh-detail','click',function () {
                oparent.$emit('detail',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('veh-history','click',function () {
                oparent.$emit('history',this.oGpsInfo);

            },this);

            L.ExSunMap.onEvent('veh-track','click',function (e) {

                if(e.currentTarget && e.currentTarget.innerText==='跟踪')
                {
                    // 改变当前按钮文档信息
                    oparent.$emit('track',this.oGpsInfo);

                    oparent.$emit('lst-track' ,this.oGpsInfo);
                    e.currentTarget.innerText = '取消跟踪';
                }
                else
                {
                    // 改变当前按钮文档信息
                    oparent.$emit('untrack',this.oGpsInfo);
                    oparent.$emit('lst-untrack' ,this.oGpsInfo);

                    e.currentTarget.innerText = '跟踪';
                }

            },this);

            L.ExSunMap.onEvent('veh-attend','click',function (e) {
                if(e.currentTarget && e.currentTarget.innerText==='关注') {
                    oparent.$emit('veh-attend',this.oGpsInfo);
                    e.currentTarget.innerHTML = '<a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 取消关注 </a>'
                } else {
                    oparent.$emit('veh-unattend',this.oGpsInfo);
                    e.currentTarget.innerHTML = '<a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 关注 </a>';
                }
            },this);

            L.ExSunMap.onEvent('veh-monitor','click',function () {
                oparent.$emit('monitor',this.oGpsInfo);
            },this);



            L.ExSunMap.onEvent('veh-video','click',function () {
                oparent.$emit('video',this.oGpsInfo);
            },this);



            // 指令下方设置
            L.ExSunMap.onEvent('send-call-name','click',function () {
                oparent.$emit('send-call-name',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('send-camera','click',function () {
                oparent.$emit('send-camera',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('send-text','click',function () {
                oparent.$emit('send-text',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('send-monitor','click',function () {
                oparent.$emit('send-monitor',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('send-config','click',function () {
                oparent.$emit('send-config',this.oGpsInfo);
            },this);

        }, oPopup);
    },

    popHtml:
    '       <div class="ex-maptip-wtm-content">'+
    '   <div class="ex-content-info-box">'+
    '               <h3>{vehNo} <span>{time}</span></h3>'+
    '       <div class="ex-content-info-car ec-u-sm-6">'+
    '           <ul> ' +
    '                       <li><strong>设备号：</strong><span>{devNo}</span></li>'+
    '                       <li><strong>车辆颜色：</strong><span>{vehPCor}</span></li>'+
    '                       <li><strong>车辆类型：</strong><span>{vehTy}</span></li>'+
    '                       <li><strong>车辆户籍：</strong><span>{deptName}</span></li>'+
    '                       <li><strong>最后速度：</strong><span>{speed} (Km/h)</span></li>'+
    '           </ul>'+
    '       </div>'+
    '       <div class="ex-content-info-state ec-u-sm-6">'+
    '           <ul>'+
    '                       <li><strong>在线状态：</strong><span>{online}</span></li>'+
    '                       <li><strong>行驶状态：</strong><span>{speedStatus} </span></li>'+
    '                       <li><strong>定位状态：</strong><span>{gpsStatus}</span></li>'+
    '                       <li><strong>今日时长：</strong><span>{dura} </span></li>'+
    '                       <li><strong>今日里程：</strong><span>{dayMile} Km</span></li>'+
    '                       <li><strong>总里程：</strong><span>{sumMile} Km</span></li>'+

    '                   </ul>'+
    '           </div>'+
    '           </div>'+
    '           <div class="ex-maptip-wtm-tool">'+
    '               <ul class="tool-btn ec-avg-sm-3 ec-u-sm-6">'+
    '                   <li><strong>最后位置：</strong><span>{pos}</span></li>'+
    '               </ul>'+
    '           </div>'+

    '           <div class="ex-maptip-wtm-tool">'+
    '           <ul class="tool-btn ec-avg-sm-3 ec-u-sm-6">'+
    '               <li class="veh-detail"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-truck"> 详情 </a></li>'+
    '               <li class="veh-history"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 轨迹 </a></li>'+
    '                   <li class="veh-track"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> {trackBtn} </a></li>'+
    '                   <li class="veh-attend"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 关注 </a></li>'+
    '                   <li class="veh-monitor"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 监控 </a></li>'+
    '                   <li class="veh-send">' +
    '                       <a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 指令下发 </a>' +
    '                       <ul class="veh-send-btn" >' +
    '                           <li class="send-call-name"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 点名 </a></li>' +
    '                           <li class="send-camera"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 拍照 </a></li>' +
    '                           <li class="send-text"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 文本 </a></li>' +
    '                           <li class="send-monitor"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 监听 </a></li>' +
    '                           <li class="send-config"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 参数设置 </a></li>' +
    '                       </ul>' +
    '                   </li>'+
    '                   <li class="veh-video"><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 视频 </a></li>'+
    '           </ul>'+
    '       </div>'+
    '       </div>'
}



L.getData = function (oData,cUrl,fnCallBack,oContext) {
    var obj = new XMLHttpRequest();
    obj.open("POST", cUrl, true);
    obj.setRequestHeader("Content-type", "application/json");
    obj.onreadystatechange = function() {
        if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {
            fnCallBack.call(oContext, obj.responseText);
        }
    };
    obj.send(oData);
};

/*
* name :		Tooltip.js
* des :			inside map vection div for show information
*
* date:			2016-11-8
* author:		liulin
* */


L.ExSunMap.Tooltip = L.Class.extend({

	initialize: function (map) {
		this._map = map;
		this._popupPane = map._panes.popupPane;
		var container = L.DomUtil.create('div', 'leaflet-draw-tooltip', this._popupPane);
		this._container = container;
		this._singleLineLabel = false;

		this._map.on('mouseout', this._onMouseOut, this);
	},

	dispose: function () {
		this._map.off('mouseout', this._onMouseOut, this);

		if (this._container) {
			this._popupPane.removeChild(this._container);
			this._container = null;
		}
	},

	updateContent: function (labelText) {
		if (!this._container) {
			return this;
		}
		labelText.subtext = labelText.subtext || '';

		// update the vertical position (only if changed)
		if (labelText.subtext.length === 0 && !this._singleLineLabel) {
			L.DomUtil.addClass(this._container, 'leaflet-draw-tooltip-single');
			this._singleLineLabel = true;
		}
		else if (labelText.subtext.length > 0 && this._singleLineLabel) {
			L.DomUtil.removeClass(this._container, 'leaflet-draw-tooltip-single');
			this._singleLineLabel = false;
		}

		this._container.innerHTML =
			(labelText.subtext.length > 0 ? '<span class="leaflet-draw-tooltip-subtext">' + labelText.subtext + '</span>' + '<br />' : '') +
			'<span>' + labelText.text + '</span>';

		return this;
	},

	updatePosition: function (latlng) {
		var pos = this._map.latLngToLayerPoint(latlng),
			tooltipContainer = this._container;

		if (this._container) {
			tooltipContainer.style.visibility = 'inherit';
			L.DomUtil.setPosition(tooltipContainer, pos);
		}

		return this;
	},

	showAsError: function () {
		if (this._container) {
			L.DomUtil.addClass(this._container, 'leaflet-error-draw-tooltip');
		}
		return this;
	},

	removeError: function () {
		if (this._container) {
			L.DomUtil.removeClass(this._container, 'leaflet-error-draw-tooltip');
		}
		return this;
	},

	_onMouseOut: function () {
		if (this._container) {
			this._container.style.visibility = 'hidden';
		}
	}
});




/**
 * Created by liulin on 2017/1/8.
 * 给地图添加 箭头补丁
 *
 */

//
// L.extend(L.SVG, {
//
//     _initContainer: function () {
//         this._container = L.SVG.create('svg');
//
//         // makes it possible to click through svg root; we'll reset it back in individual paths
//         this._container.setAttribute('pointer-events', 'none');
//
//         this._rootGroup = L.SVG.create('g');
//         this._container.appendChild(this._rootGroup);
//         var oDefs = this._createArrow();
//         this._container.appendChild(oDefs);
//     },
//
//     //创建箭头对象，定义不同箭头的颜色
//     _createArrow: function () {
//         var oDefs = L.Path.prototype._createElement('defs');
//         var oMarker = L.Path.prototype._createElement('marker');
//         oMarker.setAttribute('id', 'arrow');
//         oMarker.setAttribute('markerUnits', 'strokeWidth');
//         oMarker.setAttribute('markerWidth', '8');
//         oMarker.setAttribute('markerHeight', '8');
//         oMarker.setAttribute('viewBox', '0 0 12 12');
//         oMarker.setAttribute('refX', '6');
//         oMarker.setAttribute('refY', '6');
//         oMarker.setAttribute('orient', 'auto');
//         var oPath = L.Path.prototype._createElement('path');
//         oPath.setAttribute('d', 'M2,2 L10,6 L2,10 L3,6 L2,2');
//         oPath.setAttribute('style', 'fill: red;');
//         oDefs.appendChild(oMarker);
//         oMarker.appendChild(oPath);
//         return oDefs;
//     },
// });
//
// // 圆的补丁
// L.Circle.include({
//     getDueLat: function () {
//         var d = Math.PI / 180,
//             latR = (this._mRadius / L.CRS.Earth.R) / d;
//         return latR;
//     }
//
// });

L.Map.mergeOptions({
	touchExtend: true
});

L.Map.TouchExtend = L.Handler.extend({

	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
	},

	addHooks: function () {
		L.DomEvent.on(this._container, 'touchstart', this._onTouchStart, this);
		L.DomEvent.on(this._container, 'touchend', this._onTouchEnd, this);
		L.DomEvent.on(this._container, 'touchmove', this._onTouchMove, this);
		if (this._detectIE()) {
			L.DomEvent.on(this._container, 'MSPointerDown', this._onTouchStart, this);
			L.DomEvent.on(this._container, 'MSPointerUp', this._onTouchEnd, this);
			L.DomEvent.on(this._container, 'MSPointerMove', this._onTouchMove, this);
			L.DomEvent.on(this._container, 'MSPointerCancel', this._onTouchCancel, this);

		} else {
			L.DomEvent.on(this._container, 'touchcancel', this._onTouchCancel, this);
			L.DomEvent.on(this._container, 'touchleave', this._onTouchLeave, this);
		}
	},

	removeHooks: function () {
		L.DomEvent.off(this._container, 'touchstart', this._onTouchStart);
		L.DomEvent.off(this._container, 'touchend', this._onTouchEnd);
		L.DomEvent.off(this._container, 'touchmove', this._onTouchMove);
		if (this._detectIE()) {
			L.DomEvent.off(this._container, 'MSPointerDowm', this._onTouchStart);
			L.DomEvent.off(this._container, 'MSPointerUp', this._onTouchEnd);
			L.DomEvent.off(this._container, 'MSPointerMove', this._onTouchMove);
			L.DomEvent.off(this._container, 'MSPointerCancel', this._onTouchCancel);
		} else {
			L.DomEvent.off(this._container, 'touchcancel', this._onTouchCancel);
			L.DomEvent.off(this._container, 'touchleave', this._onTouchLeave);
		}
	},

	_touchEvent: function (e, type) {
		// #TODO: fix the pageX error that is do a bug in Android where a single touch triggers two click events
		// _filterClick is what leaflet uses as a workaround.
		// This is a problem with more things than just android. Another problem is touchEnd has no touches in
		// its touch list.
		var touchEvent = {};
		if (typeof e.touches !== 'undefined') {
			if (!e.touches.length) {
				return;
			}
			touchEvent = e.touches[0];
		} else if (e.pointerType === 'touch') {
			touchEvent = e;
            if (!this._filterClick(e)) {
                return;
            }
		} else {
			return;
		}

		var containerPoint = this._map.mouseEventToContainerPoint(touchEvent),
			layerPoint = this._map.mouseEventToLayerPoint(touchEvent),
			latlng = this._map.layerPointToLatLng(layerPoint);

		this._map.fire(type, {
			latlng: latlng,
			layerPoint: layerPoint,
			containerPoint: containerPoint,
			pageX: touchEvent.pageX,
			pageY: touchEvent.pageY,
			originalEvent: e
		});
	},

    /** Borrowed from Leaflet and modified for bool ops **/
    _filterClick: function (e) {
        var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
            elapsed = L.DomEvent._lastClick && (timeStamp - L.DomEvent._lastClick);

        // are they closer together than 500ms yet more than 100ms?
        // Android typically triggers them ~300ms apart while multiple listeners
        // on the same event should be triggered far faster;
        // or check if click is simulated on the element, and if it is, reject any non-simulated events
        if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
            L.DomEvent.stop(e);
            return false;
        }
        L.DomEvent._lastClick = timeStamp;
        return true;
    },

	_onTouchStart: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchstart';
		this._touchEvent(e, type);

	},

	_onTouchEnd: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchend';
		this._touchEvent(e, type);
	},

	_onTouchCancel: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchcancel';
		if (this._detectIE()) {
			type = 'pointercancel';
		}
		this._touchEvent(e, type);
	},

	_onTouchLeave: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchleave';
		this._touchEvent(e, type);
	},

	_onTouchMove: function (e) {
		if (!this._map._loaded) {
			return;
		}

		var type = 'touchmove';
		this._touchEvent(e, type);
	},

	_detectIE: function () {
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// IE 12 => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}
});

L.Map.addInitHook('addHandler', 'touchExtend', L.Map.TouchExtend);

// This isn't full Touch support. This is just to get makers to also support dom touch events after creation
// #TODO: find a better way of getting markers to support touch.
L.Marker.Touch = L.Marker.extend({

	_initInteraction: function () {
		if (!this.addInteractiveTarget) {
			// 0.7.x support
			return this._initInteractionLegacy();
		}
		// TODO this may need be updated to re-add touch events for 1.0+
		return L.Marker.prototype._initInteraction.apply(this);
	},

	// This is an exact copy of https://github.com/Leaflet/Leaflet/blob/v0.7/src/layer/marker/Marker.js
	// with the addition of the touch events on line 15.
	_initInteractionLegacy: function () {

		if (!this.options.clickable) {
			return;
		}

		// TODO refactor into something shared with Map/Path/etc. to DRY it up

		var icon = this._icon,
			events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu', 'touchstart', 'touchend', 'touchmove'];
		if (this._detectIE) {
			events.concat(['MSPointerDown', 'MSPointerUp', 'MSPointerMove', 'MSPointerCancel']);
		} else {
			events.concat(['touchcancel']);
		}

		L.DomUtil.addClass(icon, 'leaflet-clickable');
		L.DomEvent.on(icon, 'click', this._onMouseClick, this);
		L.DomEvent.on(icon, 'keypress', this._onKeyPress, this);

		for (var i = 0; i < events.length; i++) {
			L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
		}

		if (L.Handler.MarkerDrag) {
			this.dragging = new L.Handler.MarkerDrag(this);

			if (this.options.draggable) {
				this.dragging.enable();
			}
		}
	},
	_detectIE: function () {
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// IE 12 => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}
});


/*
 * L.LatLngUtil contains different utility functions for LatLngs.
 */

L.LatLngUtil = {
	// Clones a LatLngs[], returns [][]
	cloneLatLngs: function (latlngs) {
		var clone = [];
		for (var i = 0, l = latlngs.length; i < l; i++) {
			// Check for nested array (Polyline/Polygon)
			if (Array.isArray(latlngs[i])) {
				clone.push(L.LatLngUtil.cloneLatLngs(latlngs[i]));
			} else {
				clone.push(this.cloneLatLng(latlngs[i]));
			}
		}
		return clone;
	},

	cloneLatLng: function (latlng) {
		return L.latLng(latlng.lat, latlng.lng);
	}
};


L.GeometryUtil =  {

    // @method geodesicArea(): number
    geodesicArea: function (latLngs) {
        var pointsCount = latLngs.length,
            area = 0.0,
            d2r = Math.PI / 180,
            p1, p2;

        if (pointsCount > 2) {
            for (var i = 0; i < pointsCount; i++) {
                p1 = latLngs[i];
                p2 = latLngs[(i + 1) % pointsCount];
                area += ((p2.lng - p1.lng) * d2r) *
                    (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
            }
            area = area * 6378137.0 * 6378137.0 / 2.0;
        }

        return Math.abs(area);
    },

    // @method readableArea(area, isMetric): string
    // Returns a readable area string in yards or metric
    readableArea: function (area, isMetric) {
        var areaStr;

        if (isMetric) {
            if (area >= 10000) {
                areaStr = (area * 0.0001).toFixed(2) + ' ha';
            } else {
                areaStr = area.toFixed(2) + ' m&sup2;';
            }
        } else {
            area /= 0.836127; // Square yards in 1 meter

            if (area >= 3097600) { //3097600 square yards in 1 square mile
                areaStr = (area / 3097600).toFixed(2) + ' mi&sup2;';
            } else if (area >= 4840) {//48040 square yards in 1 acre
                areaStr = (area / 4840).toFixed(2) + ' acres';
            } else {
                areaStr = Math.ceil(area) + ' yd&sup2;';
            }
        }

        return areaStr;
    },

    // @method readableDistance(distance, units): string
    // Converts a metric distance to one of [ feet, nauticalMile, metric or yards ] string
    //
    // @alternative
    // @method readableDistance(distance, isMetric, useFeet, isNauticalMile): string
    // Converts metric distance to distance string.
    readableDistance: function (distance, isMetric, isFeet, isNauticalMile) {
        var distanceStr,
            units;

        if (typeof isMetric == "string") {
            units = isMetric;
        } else {
            if (isFeet) {
                units = 'feet';
            } else if (isNauticalMile) {
                units = 'nauticalMile';
            } else if (isMetric) {
                units = 'metric';
            } else {
                units = 'yards';
            }
        }

        switch (units) {
            case 'metric':
                // show metres when distance is < 1km, then show km
                if (distance > 1000) {
                    distanceStr = (distance / 1000).toFixed(2) + ' km';
                } else {
                    distanceStr = Math.ceil(distance) + ' m';
                }
                break;
            case 'feet':
                distance *= 1.09361 * 3;
                distanceStr = Math.ceil(distance) + ' ft';

                break;
            case 'nauticalMile':
                distance *= 0.53996;
                distanceStr = (distance / 1000).toFixed(2) + ' nm';
                break;
            case 'yards':
            default:
                distance *= 1.09361;

                if (distance > 1760) {
                    distanceStr = (distance / 1760).toFixed(2) + ' miles';
                } else {
                    distanceStr = Math.ceil(distance) + ' yd';
                }
                break;
        }
        return distanceStr;
    },

	// Ported from the OpenLayers implementation. See https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Geometry/LinearRing.js#L270
	geodesicAreaEx: function (latLngs) {
		var pointsCount = latLngs.length,
			area = 0.0,
			d2r = Math.PI / 180,
			p1, p2;

		if (pointsCount > 2) {
			for (var i = 0; i < pointsCount; i++) {
				p1 = latLngs[i];
				p2 = latLngs[(i + 1) % pointsCount];
				area += ((p2.lng - p1.lng) * d2r) *
						(2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
			}
			area = area * 6378137.0 * 6378137.0 / 2.0;
		}

		return Math.abs(area);
	},

	readableAreaEx: function (area, isMetric) {
		var areaStr;

		if (isMetric) {
			if (area >= 10000) {
				areaStr = (area * 0.0001).toFixed(2) + ' 平方公顷';//' ha';
			} else {
				areaStr = area.toFixed(2) + ' 平方米';//' m&sup2;';
			}
		} else {
			area /= 0.836127; // Square yards in 1 meter

			if (area >= 3097600) { //3097600 square yards in 1 square mile
				areaStr = (area / 3097600).toFixed(2) + ' mi&sup2;';
			} else if (area >= 4840) {//48040 square yards in 1 acre
				areaStr = (area / 4840).toFixed(2) + ' acres';
			} else {
				areaStr = Math.ceil(area) + ' yd&sup2;';
			}
		}

		return areaStr;
	},

	readableDistanceEx: function (distance, isMetric, useFeet) {
		var distanceStr;

		if (isMetric) {
			// show metres when distance is < 1km, then show km
			if (distance > 1000) {
				distanceStr = (distance  / 1000).toFixed(2) + ' 千米';
			} else {
				distanceStr = Math.ceil(distance) + ' 米';
			}
		} else {
			distance *= 1.09361;

			if (distance > 1760) {
				distanceStr = (distance / 1760).toFixed(2) + ' miles';
			} else {
				var suffix = ' yd';
				if (useFeet) {
					distance = distance * 3;
					suffix = ' ft';
				}
				distanceStr = Math.ceil(distance) + suffix;
			}
		}

		return distanceStr;
	},

    /**
     Shortcut function for converting distance to readable distance.
     @param {Number} distance distance to be converted
     @param {String} unit 'metric' or 'imperial'
     @returns {String} in yard or miles
     */
    readableDistance: function (distance, unit) {
        var isMetric = (unit !== 'imperial'),
            distanceStr;
        if (isMetric) {
            // show metres when distance is < 1km, then show km
            if (distance > 1000) {
                distanceStr = (distance  / 1000).toFixed(2) + ' km';
            }
            else {
                distanceStr = Math.ceil(distance) + ' m';
            }
        }
        else {
            distance *= 1.09361;
            if (distance > 1760) {
                distanceStr = (distance / 1760).toFixed(2) + ' miles';
            }
            else {
                distanceStr = Math.ceil(distance) + ' yd';
            }
        }
        return distanceStr;
    },


};


L.Util.extend(L.LineUtil, {
	// Checks to see if two line segments intersect. Does not handle degenerate cases.
	// http://compgeom.cs.uiuc.edu/~jeffe/teaching/373/notes/x06-sweepline.pdf
	segmentsIntersect: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2, /*Point*/ p3) {
		return	this._checkCounterclockwise(p, p2, p3) !==
				this._checkCounterclockwise(p1, p2, p3) &&
				this._checkCounterclockwise(p, p1, p2) !==
				this._checkCounterclockwise(p, p1, p3);
	},

	// check to see if points are in counterclockwise order
	_checkCounterclockwise: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
		return (p2.y - p.y) * (p1.x - p.x) > (p1.y - p.y) * (p2.x - p.x);
	}

});




L.Polyline.include({
	// Check to see if this polyline has any linesegments that intersect.
	// NOTE: does not support detecting intersection for degenerate cases.
	intersects: function () {
		var points = this._getProjectedPoints(),
			len = points ? points.length : 0,
			i, p, p1;

		if (this._tooFewPointsForIntersection()) {
			return false;
		}

		for (i = len - 1; i >= 3; i--) {
			p = points[i - 1];
			p1 = points[i];


			if (this._lineSegmentsIntersectsRange(p, p1, i - 2)) {
				return true;
			}
		}

		return false;
	},

	// Check for intersection if new latlng was added to this polyline.
	// NOTE: does not support detecting intersection for degenerate cases.
	newLatLngIntersects: function (latlng, skipFirst) {
		// Cannot check a polyline for intersecting lats/lngs when not added to the map
		if (!this._map) {
			return false;
		}

		return this.newPointIntersects(this._map.latLngToLayerPoint(latlng), skipFirst);
	},

	// Check for intersection if new point was added to this polyline.
	// newPoint must be a layer point.
	// NOTE: does not support detecting intersection for degenerate cases.
	newPointIntersects: function (newPoint, skipFirst) {
		var points = this._getProjectedPoints(),
			len = points ? points.length : 0,
			lastPoint = points ? points[len - 1] : null,
			// The previous previous line segment. Previous line segment doesn't need testing.
			maxIndex = len - 2;

		if (this._tooFewPointsForIntersection(1)) {
			return false;
		}

		return this._lineSegmentsIntersectsRange(lastPoint, newPoint, maxIndex, skipFirst ? 1 : 0);
	},

	// Polylines with 2 sides can only intersect in cases where points are collinear (we don't support detecting these).
	// Cannot have intersection when < 3 line segments (< 4 points)
	_tooFewPointsForIntersection: function (extraPoints) {
		var points = this._getProjectedPoints(),
			len = points ? points.length : 0;
		// Increment length by extraPoints if present
		len += extraPoints || 0;

		return !points || len <= 3;
	},

	// Checks a line segment intersections with any line segments before its predecessor.
	// Don't need to check the predecessor as will never intersect.
	_lineSegmentsIntersectsRange: function (p, p1, maxIndex, minIndex) {
		var points = this._getProjectedPoints(),
			p2, p3;

		minIndex = minIndex || 0;

		// Check all previous line segments (beside the immediately previous) for intersections
		for (var j = maxIndex; j > minIndex; j--) {
			p2 = points[j - 1];
			p3 = points[j];

			if (L.LineUtil.segmentsIntersect(p, p1, p2, p3)) {
				return true;
			}
		}

		return false;
	},

	_getProjectedPoints: function () {
		if (!this._defaultShape) {
			return this._originalPoints;
		}
		var points = [],
			_shape = this._defaultShape();

		for (var i = 0; i < _shape.length; i++) {
			points.push(this._map.latLngToLayerPoint(_shape[i]));
		}
		return points;
	}
});


L.Polygon.include({
	// Checks a polygon for any intersecting line segments. Ignores holes.
	intersects: function () {
		var polylineIntersects,
			points = this._getProjectedPoints(),
			len, firstPoint, lastPoint, maxIndex;

		if (this._tooFewPointsForIntersection()) {
			return false;
		}

		polylineIntersects = L.Polyline.prototype.intersects.call(this);

		// If already found an intersection don't need to check for any more.
		if (polylineIntersects) {
			return true;
		}

		len = points.length;
		firstPoint = points[0];
		lastPoint = points[len - 1];
		maxIndex = len - 2;

		// Check the line segment between last and first point. Don't need to check the first line segment (minIndex = 1)
		return this._lineSegmentsIntersectsRange(lastPoint, firstPoint, maxIndex, 1);
	}
});


/**
 * Created by liulin on 2016/11/4.
 *
 * 测量的配置文件要求
 */

L.ExSunMap.Measure = {};

L.ExSunMap.Measure.version = '2.4.0';





/**
 * 中文包
 * Created by Administrator on 2017/8/3.
 */

L.ExSunMap.Measure.Msg = {
    TipMarker: {
        setText: {
            beginText: '开始  '
        },
        createIcon: {
            closeText: '&times;'
        },
        addTotalPenal: {
            total: ' 总共 ',
        },
        setSubTotalDistTag: {
            total: ' 共 ',
        }
    },
    Dist: {
        _getTooltipText: {
            start: '点击开始测量距离.',
            cont: '点击继续测量距离.',
            end: '双击或者点击最后一个点结束测量.'
        }
    },
    Area: {
        _getTooltipText: {
            start: '点击开始测量面积.',
            cont: '点击继续测量面积.',
            end: '双击或者点击第一个点结束测量.'
        }
    },

    error: '<strong>错误:</strong> 线段不能相交!',

};

/**
 * Created by liulin on 2016/9/12.
 * name:            measure.dist.js
 * des:             public distance
 * author:          liulin
 * date:            2016-09-12
 *
 * think:
 * 1.manage draw distance object
 *
 */


// inherit the class Feature
// control measure,manage distance object
L.ExSunMap.Measure.DistMgr = L.Handler.extend({

    options: {},

    // catch distance obj

    initialize: function (map, options) {
        // set map for handler
        this._map = map;

        L.setOptions(this, options);
        this.aoMeasureHandker = [];

    },

    // start execute
    addHooks: function () {
        var oDist = L.ExSunMap.Measure.dist(this._map, this, this.options);
        this.oLastDist = oDist;
        this.aoMeasureHandker.push(oDist);
        oDist.createDist();
    },

    // end execute
    removeHooks: function () {

        this.oLastDist.removeDist();
    },

});

L.ExSunMap.Measure.distMgr = function (map, options) {

    return new L.ExSunMap.Measure.DistMgr(map, options);
};





/**
 * Created by liulin on 2016/9/12.
 * name:            measure.dist.js
 * des:             public distance
 * author:          liulin
 * date:            2016-09-12
 */



// inherit the class Feature
// draw marker  with draw one TipMarker
L.ExSunMap.Measure.Dist = L.Class.extend({
    // add event for dist
    includes: L.Mixin.Events,

    statics: {
        TYPE: 'DIST'
    },

    Poly: L.Polyline,

    options: {
        allowIntersection: true,
        repeatMode: false,
        drawError: {
            color: '#b00b00',
            timeout: 2500
        },

        touchIcon: new L.DivIcon({
            iconSize: new L.Point(20, 20),
            className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
        }),
        guidelineDistance: 20,
        maxGuideLineLength: 4000,
        shapeOptions: {
            stroke: true,
            color: '#f06eaa',
            weight: 2,
            opacity: 1,
            fill: false,
            clickable: true
        },

        metric: true, // Whether to use the metric measurement system or imperial

        feet: true, // When not metric, to use feet instead of yards for display.
        showLength: true, // Whether to display distance in the tooltip
        //zIndexOffset: 2000 // This should be > than the highest z-index any map layers
        // is show total dist for measure
        bIsTotalDist: true
    },

    // distance for the line  when tip show de dTatol distance
    //dTotalDist: 0,
    initialize: function (map, oParent, options) {
        // if touch, switch to touch icon
        if (L.Browser.touch) {
            this.options.icon = this.options.touchIcon;
        }

        this._oParent = oParent;

        // Need to set this here to ensure the correct message is used.
        this.options.drawError.message = L.ExSunMap.Measure.Msg.error;

        // Merge default drawError options with custom options
        if (options && options.drawError) {
            options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
        }

        // draw type
        this.type = L.ExSunMap.Measure.Dist.TYPE;

        this._map = map;

        // the map outer div for control
        this._container = map._container;

        // vector layer
        this._overlayPane = map._panes.overlayPane;

        // layer for  popup obj
        this._popupPane = map._panes.popupPane;

        // Merge default shapeOptions options with custom shapeOptions
        if (options && options.shapeOptions) {
            options.shapeOptions = L.Util.extend({}, this.options.shapeOptions, options.shapeOptions);
        }

        // catch the obj
        this._oLayerGroup = L.featureGroup().addTo(map);

        L.setOptions(this, options);

    },

    // begin execute draw distance
    createDist: function () {

        if (!this._map) {
            return;
        }

        L.DomUtil.disableTextSelection();

        this._container.focus();

        this._tooltip = new L.ExSunMap.Tooltip(this._map);

        L.DomEvent.on(this._container, 'keyup', this._cancelDrawing, this);

        // manager marker in line distance
        this._oMarkerMgr = new L.ExSunMap.Measure.MarkerMgr(this._map, this);

        // manager tip marker in line distance
        this._oTipMarkerMgr = new L.ExSunMap.Measure.TipMarkerMgr(this._map, this, {metric: this.options.metric});

        // draw line
        this._poly = new L.Polyline([], this.options.shapeOptions);

        // uodate tooltip text
        this._tooltip.updateContent(this._getTooltipText());


        this.initEvent();
    },

    initEvent: function () {

        // Make a transparent marker that will used to catch click events. These click
        // events will create the vertices. We need to do this so we can ensure that
        // we can create vertices over other map layers (markers, vector layers). We
        // also do not want to trigger any click handlers of objects we are clicking on
        // while drawing.
        if (!this._mouseMarker) {
            this._mouseMarker = L.marker(this._map.getCenter(), {
                icon: L.divIcon({
                    className: 'leaflet-mouse-marker',
                    iconAnchor: [20, 20],
                    iconSize: [40, 40]
                }),
                opacity: 0,
                zIndexOffset: this.options.zIndexOffset
            });
        }

        if (!L.Browser.touch) {
            this._map.on('mouseup', this._onMouseUp, this); // Necessary for 0.7 compatibility
        }

        this._mouseMarker
            .on('mousedown', this._onMouseDown, this)
            .on('mouseout', this._onMouseOut, this)
            .on('mouseup', this._onMouseUp, this) // Necessary for 0.8 compatibility
            .on('mousemove', this._onMouseMove, this) // Necessary to prevent 0.8 stutter
            .addTo(this._map);

        this._map
            .on('mouseup', this._onMouseUp, this) // Necessary for 0.7 compatibility
            .on('mousemove', this._onMouseMove, this)
            .on('zoomlevelschange', this._onZoomEnd, this)
            //.on('click', this._onTouch, this)
            .on('zoomend', this._onZoomEnd, this);
    },

    // finish execute draw distance
    removeDist: function () {

        L.DomUtil.enableTextSelection();

        this._tooltip.dispose();
        this._tooltip = null;

        L.DomEvent.off(this._container, 'keyup', this._cancelDrawing, this);

        this._clearHideErrorTimeout();

        // remove last marker event
        this._oMarkerMgr.cleanUpShape();

        this._map.removeLayer(this._poly);

        delete this._poly;

        this._mouseMarker
            .off('mousedown', this._onMouseDown, this)
            .off('mouseout', this._onMouseOut, this)
            .off('mouseup', this._onMouseUp, this)
            .off('mousemove', this._onMouseMove, this);

        this._map.removeLayer(this._mouseMarker);
        delete this._mouseMarker;

        // clean up DOM
        this._clearGuides();

        this._map
            .off('mouseup', this._onMouseUp, this)
            .off('mousemove', this._onMouseMove, this)
            .off('zoomlevelschange', this._onZoomEnd, this)
            .off('zoomend', this._onZoomEnd, this)
            //.off('click', this._onTouch, this);
    },

    deleteLastVertex: function () {
        if (this._markers.length <= 1) {
            return;
        }

        var lastMarker = this._markers.pop(),
            poly = this._poly,
            latlng = this._poly.spliceLatLngs(poly.getLatLngs().length - 1, 1)[0];

        this._markerGroup.removeLayer(lastMarker);

        if (poly.getLatLngs().length < 2) {
            this._map.removeLayer(poly);
        }

        this._vertexChanged(latlng, false);
    },

    // add marker and tipmarker for dist handler
    addVertex: function (latlng) {
        var markersLength = this._oMarkerMgr.getLen();

        if (markersLength > 0 && !this.options.allowIntersection && this._poly.newLatLngIntersects(latlng)) {
            this._showErrorTooltip();
            return;
        }
        else if (this._errorShown) {
            this._hideErrorTooltip();
        }

        // add marker
        var oRelaMarker = this._oMarkerMgr.createMarker(latlng);
        // add tip marker
        this._oTipMarkerMgr.createMarker(latlng, oRelaMarker, {
            className: 'rule_text_box',
            iconAnchor: [-10, 20]
        });

        this._poly.addLatLng(latlng);

        // add line for disctance
        if (this._poly.getLatLngs().length === 2) {
            this._map.addLayer(this._poly);
        }

        this._vertexChanged(latlng, true);
    },

    completeShape: function () {
        if (this._markers.length <= 1) {
            return;
        }


        this.removeDist();

        if (this.options.repeatMode) {
            this._oParent.enable();
        }
    },


    deleteHandler: function (oRelaMarker) {
        if (!this._oMarkerMgr || this._oMarkerMgr.getLen() <= 0) {
            return;
        }
        this._oMarkerMgr.removeMarker(oRelaMarker);

        var aoLatLng = this._oMarkerMgr.getPointMarkers();
        //redraw line for handler
        //this._poly.setLatLngs(aoLatLng);
        if (this._oRtnPoly) {
            this._oRtnPoly.setLatLngs(aoLatLng);
        }
    },

    clearData: function () {
        if (!this._oMarkerMgr || this._oMarkerMgr.getLen() <= 0) {
            return;
        }
        this._oMarkerMgr.clearData();
        //this._poly.setLatLngs([]);
        if (this._oRtnPoly) {
            this._oRtnPoly.setLatLngs([]);
        }
    },

    // finish dist when click last marker
    _finishShape: function () {

        var latlngs = this._poly._defaultShape ? this._poly._defaultShape() : this._poly.getLatLngs();
        var intersects = this._poly.newLatLngIntersects(latlngs[latlngs.length - 1]);

        if ((!this.options.allowIntersection && intersects) || !this._shapeIsValid()) {
            this._showErrorTooltip();
            return;
        }

        this._oTipMarkerMgr.addCloseBtn();

        // create result for map obj
        this._oRtnPoly = new this.Poly(this._poly.getLatLngs(), this.options.shapeOptions);
        this._oRtnPoly.addTo(this._oLayerGroup);

        this._oParent.disable();


        if (this.options.bIsTotalDist) {
            this._oTipMarkerMgr.addTotalDist();
        }

        if (this.options.repeatMode) {
            this.enable();
        }
    },


    //Called to verify the shape is valid when the user tries to finish it
    //Return false if the shape is not valid
    _shapeIsValid: function () {
        return true;
    },

    _onZoomEnd: function () {
        if (this._markers !== null) {
            this._updateGuide();
        }
    },

    // move mouse update point and guide flag
    _onMouseMove: function (e) {

        // screen point to latlng
        var newPos = this._map.mouseEventToLayerPoint(e.originalEvent);
        var latlng = this._map.layerPointToLatLng(newPos);

        // Save current  latlng to update tip obj
        this._currentLatLng = latlng;

        this._updateTooltip(latlng);

        // Update the guide line
        this._updateGuide(newPos);

        // Update the mouse marker position
        this._mouseMarker.setLatLng(latlng);

        L.DomEvent.preventDefault(e.originalEvent);
    },

    _vertexChanged: function () {
        this._map.fire('draw:drawvertex', {layers: this._markerGroup});

        // update marker event,init event for last marker
        this._oMarkerMgr.updateFinishHandler();

        this._clearGuides();

        this._updateTooltip();
    },

    // start execute,get start pos is judge is distance for map
    _onMouseDown: function (e) {
        var originalEvent = e.originalEvent;
        this._mouseDownOrigin = L.point(originalEvent.clientX, originalEvent.clientY);
    },

    // besause the distance is 0 so add marker for distance
    _onMouseUp: function (e) {
        if (this._mouseDownOrigin) {
            // We detect clicks within a certain tolerance, otherwise let it
            // be interpreted as a drag by the map
            var distance = L.point(e.originalEvent.clientX, e.originalEvent.clientY)
                .distanceTo(this._mouseDownOrigin);
            if (Math.abs(distance) < 9 * (window.devicePixelRatio || 1)) {
                this.addVertex(e.latlng);
            }
        }
        this._mouseDownOrigin = null;
    },

    _onTouch: function (e) {
        // #TODO: use touchstart and touchend vs using click(touch start & end).
        if (L.Browser.touch) { // #TODO: get rid of this once leaflet fixes their click/touch.
            this._onMouseDown(e);
            this._onMouseUp(e);
        }
    },

    _onMouseOut: function () {
        if (this._tooltip) {
            this._tooltip._onMouseOut.call(this._tooltip);
        }
    },

    // create marker
    _createMarker: function (latlng) {
        var marker = new L.Marker(latlng, {
            icon: this.options.icon,
            zIndexOffset: this.options.zIndexOffset * 2
        });

        this._markerGroup.addLayer(marker);

        return marker;
    },

    // draw guide where move mouse  newpos is mouse pos,
    _updateGuide: function (newPos) {
        var markerCount = this._oMarkerMgr ? this._oMarkerMgr.getLen() : 0;

        if (markerCount > 0) {
            newPos = newPos || this._map.latLngToLayerPoint(this._currentLatLng);

            // draw the guide line
            this._clearGuides();
            this._drawGuide(
                this._map.latLngToLayerPoint(this._oMarkerMgr.getLastGeoPos()),
                newPos
            );
        }
    },

    // update text for last
    _updateTooltip: function (latLng) {
        var text = this._getTooltipText();

        if (latLng) {
            this._tooltip.updatePosition(latLng);
        }

        if (!this._errorShown) {
            this._tooltip.updateContent(text);
        }
    },

    _drawGuide: function (pointA, pointB) {
        var length = Math.floor(Math.sqrt(Math.pow((pointB.x - pointA.x), 2) + Math.pow((pointB.y - pointA.y), 2))),
            guidelineDistance = this.options.guidelineDistance,
            maxGuideLineLength = this.options.maxGuideLineLength,
        // Only draw a guideline with a max length
            i = length > maxGuideLineLength ? length - maxGuideLineLength : guidelineDistance,
            fraction,
            dashPoint,
            dash;

        //create the guides container if we haven't yet
        if (!this._guidesContainer) {
            this._guidesContainer = L.DomUtil.create('div', 'leaflet-draw-guides', this._overlayPane);
        }

        //draw a dash every GuildeLineDistance
        for (; i < length; i += this.options.guidelineDistance) {
            //work out fraction along line we are
            fraction = i / length;

            //calculate new x,y point
            dashPoint = {
                x: Math.floor((pointA.x * (1 - fraction)) + (fraction * pointB.x)),
                y: Math.floor((pointA.y * (1 - fraction)) + (fraction * pointB.y))
            };

            //add guide dash to guide container
            dash = L.DomUtil.create('div', 'leaflet-draw-guide-dash', this._guidesContainer);
            dash.style.backgroundColor =
                !this._errorShown ? this.options.shapeOptions.color : this.options.drawError.color;

            L.DomUtil.setPosition(dash, dashPoint);
        }
    },

    _updateGuideColor: function (color) {
        if (this._guidesContainer) {
            for (var i = 0, l = this._guidesContainer.childNodes.length; i < l; i++) {
                this._guidesContainer.childNodes[i].style.backgroundColor = color;
            }
        }
    },

    // removes all child elements (guide dashes) from the guides container
    _clearGuides: function () {
        if (this._guidesContainer) {
            while (this._guidesContainer.firstChild) {
                this._guidesContainer.removeChild(this._guidesContainer.firstChild);
            }
        }
    },

    _getTooltipText: function () {
        var showLength = this.options.showLength,
            labelText, distanceStr;
        var nLen = this._oMarkerMgr.getLen();
        if (nLen === 0) {
            labelText = {
                text: L.ExSunMap.Measure.Msg.Dist._getTooltipText.start
            };
        } else {
            distanceStr = showLength ? this._getMeasurementString() : '';

            if (nLen === 1) {
                labelText = {
                    text: L.ExSunMap.Measure.Msg.Dist._getTooltipText.cont,
                    subtext: distanceStr
                };
            } else {
                labelText = {
                    text: L.ExSunMap.Measure.Msg.Dist._getTooltipText.end,
                    subtext: distanceStr
                };
            }
        }
        return labelText;
    },

    // get tipMarker distance
    _getMeasurementString: function () {
        var currentLatLng = this._currentLatLng,
            previousLatLng = this._oMarkerMgr.getLastGeoPos(),//this._markers[this._markers.length - 1].getLatLng(),
            distance;

        // calculate the distance from the last fixed point to the mouse position
        //this._measurementRunningTotal + currentLatLng.distanceTo(previousLatLng);
        distance = this._oTipMarkerMgr.getTotalDist() + currentLatLng.distanceTo(previousLatLng);


        return L.GeometryUtil.readableDistance(distance, this.options.metric, this.options.feet);
    },

    _showErrorTooltip: function () {
        this._errorShown = true;

        // Update tooltip
        this._tooltip
            .showAsError()
            .updateContent({text: this.options.drawError.message});

        // Update shape
        this._updateGuideColor(this.options.drawError.color);
        this._poly.setStyle({color: this.options.drawError.color});

        // Hide the error after 2 seconds
        this._clearHideErrorTimeout();
        this._hideErrorTimeout = setTimeout(L.Util.bind(this._hideErrorTooltip, this), this.options.drawError.timeout);
    },

    _hideErrorTooltip: function () {
        this._errorShown = false;

        this._clearHideErrorTimeout();

        // Revert tooltip
        this._tooltip
            .removeError()
            .updateContent(this._getTooltipText());

        // Revert shape
        this._updateGuideColor(this.options.shapeOptions.color);
        this._poly.setStyle({color: this.options.shapeOptions.color});
    },

    _clearHideErrorTimeout: function () {
        if (this._hideErrorTimeout) {
            clearTimeout(this._hideErrorTimeout);
            this._hideErrorTimeout = null;
        }
    },


    // Cancel drawing when the escape key is pressed
    _cancelDrawing: function (e) {
        this._map.fire('draw:canceled', {layerType: this.type});
        if (e.keyCode === 27) {
            this._oParent.disable();
        }
    }
});

L.ExSunMap.Measure.dist = function (map, options) {

    return new L.ExSunMap.Measure.Dist(map, options);
};





/**
 * Created by liulin on 2016/9/12.
 * name:            measure.dist.js
 * des:             public distance
 * author:          liulin
 * date:            2016-09-12
 */


// inhicnt class
// draw marker  with draw one TipMarker
// manage marker and tip marker
L.ExSunMap.Measure.MarkerMgr = L.Class.extend({
    statics: {
        TYPE: 'DIST'
    },

    //Marker data,in line marker ,where dist line in the line
    //_markers: [],

    // point total distance for map
    //_dTotalDist: 0,


    options: {
        icon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon'
        }),
        zIndexOffset: 2000
    },

    initialize: function (map, oParent, options) {
        this._map = map;
        this._oParent = oParent;
        L.setOptions(this, options);

        this._dTotalDist = 0;
        this._markers = [];
        this._layerGroup = L.featureGroup();
        this._map.addLayer(this._layerGroup);

    },

    // create marker
    createMarker: function (latlng, options) {

        var oTemp = L.extend({}, options, {
            icon: this.options.icon,
            zIndexOffset: this.options.zIndexOffset * 2
        });
        var oMarker = new L.Marker(latlng, oTemp);

        this._layerGroup.addLayer(oMarker);
        this._markers.push(oMarker);
        return oMarker;
    },

    // get marker length for de array
    getLen: function () {
        if (!this._markers) {
            return 0;
        }
        return this._markers.length;

    },

    getLastMarker: function () {

        if (!this._markers || this._markers.length <= 0) {
            return null;
        }

        return this._markers[this._markers.length - 1];
    },

    getLastGeoPos: function () {
        var oMarker = this.getLastMarker();

        return oMarker.getLatLng();
    },

    // get all marker  point  in the array
    getPointMarkers: function () {
        var aoLatLng = [];
        if (!this._markers || this._markers.length <= 0) {
            return aoLatLng;
        }
        for (var i = 0; i < this._markers.length; i++) {
            aoLatLng.push(this._markers[i].getLatLng());
        }
        return aoLatLng;
    },

    // judge finish draw for map
    updateFinishHandler: function () {
        var markerCount = this._markers.length;

        // The first marker should have a click handler to close the polygon
        if (markerCount > 1) {
            this._markers[markerCount-1].on('click', this._finishShape, this);
            this._markers[markerCount-1].on('dblclick', this._finishShape, this);
        }

        // Add and update the double click handler
        if (markerCount > 2) {
            this._markers[markerCount - 2].off('click', this._finishShape, this);
            this._markers[markerCount-2].on('dblclick', this._finishShape, this);
        }
    },


    cleanUpShape: function () {

        if (this._markers <= 1) {

            return;
        }

        this.getLastMarker().off('click', this._finishShape, this);

    },


    _finishShape: function () {

        //delegated parent execute
        this._oParent._finishShape();

    },

    // delete tipmarker and marker catch
    removeMarker: function (marker) {

        // Update Tipmarker text  for distance
        for (var i = this._markers.length - 1; i >= 0; i--) {
            if (this._markers[i] === marker) {
                // delete layer
                this._markers.splice(i, 1);
                break;
            }
        }

        this._layerGroup.removeLayer(marker);

    },


    updateDist: function () {
        for (var i = 0; i < this._markers; i++) {
            if (i === 0) {
                this._tipMarkers[i].setDist(0);
                continue;
            }

            var dist = this._tipMarkers[i].getLatLng().distanceTo(this._tipMarkers[i - 1]);
            this._tipMarkers[i].setDist(dist);
        }
    },


    clearData: function () {
        this._markers.splice(0, this._markers.length);
        this._layerGroup.clearLayers();
    },

    remove: function () {
        this._map.removeLayer(this._layerGroup);
        delete this._layerGroup;
        delete this._markers;
    }
});


/**
 * Created by liulin on 2016/9/12.
 * name:            measure.dist.js
 * des:             public distance
 * author:          liulin
 * date:            2016-09-12
 */


// inhicnt class
// draw marker  with draw one TipMarker
// manage marker and tip marker
L.ExSunMap.Measure.TipMarkerMgr = L.Class.extend({
    statics: {
        TYPE: 'DIST'
    },


    initialize: function (map, oParent, options) {
        this._map = map;
        L.setOptions(this, options);

        this._markers = [];
        // create layergourp add marker
        this._layerGroup = L.featureGroup();
        // add marker layer
        this._map.addLayer(this._layerGroup);
        // distance
        this._oParent = oParent;
    },

    options: {metric: true},


    // create marker
    createMarker: function (oLatLng, oRelaMarker, options) {

        var tipMarker = L.ExSunMap.Measure.tipMarker(oLatLng, this, options);
        tipMarker.addTo(this._layerGroup);
        this._markers.push(tipMarker);


        var oPreMarker = this.getSecLastMarker();
        var dDist = this.calDist(tipMarker, oPreMarker);
        tipMarker.setDist(dDist);

        if(this._markers.length  === 1)
        {
            tipMarker.setBeginText();
        }

        if (this._markers.length > 1) {
            dDist = this.getTotalDist();
            // set sub total dist for marker
            tipMarker.setSubTotalDist(dDist);
        }

        // rela marker that show in map
        if (oRelaMarker) {
            tipMarker.oRelaMarker = oRelaMarker;
        }

        return tipMarker;
    },

    // cal distance for two marker and set label for de oCurMarker
    calDist: function (oCurMarker, oPreMarker) {

        if (!oPreMarker) {

            return 0;
        }

        var oELatLng = oCurMarker.getLatLng();
        var oBLatLng = oPreMarker.getLatLng();
        return oELatLng.distanceTo(oBLatLng);
    },

    // get total distance
    getTotalDist: function () {
        if (this._markers.length <= 0) {
            return 0;
        }
        var dToTalDist = 0;
        for (var i = 0; i < this._markers.length; i++) {
            dToTalDist += this._markers[i].dDist;
        }

        return dToTalDist;
    },

    getLastMarker: function () {

        if (!this._markers || this._markers.length <= 0) {
            return null;
        }
        return this._markers[this.getLen() - 1];
    },

    getLastGeoPos: function () {
        var oMarker = this.getLastMarker();
        return oMarker.getLatLng();
    },

    getSecLastMarker: function () {
        if (!this._markers || this._markers.length <= 1) {
            return null;
        }
        return this._markers[this.getLen() - 2];

    },

    // get marker length
    getLen: function () {
        if (!this._markers) {
            return 0;
        }
        return this._markers.length;
    },


    // when finish dist  add close btn
    addCloseBtn: function () {
        var oMarker = this.getLastMarker();
        if (!oMarker) {
            return;
        }
        oMarker.addAllClose();
    },

    // add total tag
    addTotalDist: function () {

        var oMarker = this.getLastMarker();
        if (!oMarker) {
            return;
        }
        var dDist = this.getTotalDist();
        oMarker.addTotalPenal(dDist);

    },

    setTipTotalDist: function () {

        var oMarker = this.getLastMarker();
        if (!oMarker) {
            return;
        }
        var dDist = this.getTotalDist();

        oMarker.setTotalDist(dDist);
    },

    // set all marker distance and label
    setSubDist: function () {

        if (!this._markers || this._markers.length <= 0) {
            return;
        }

        this._markers[0].setDist(0);
        this._markers[0].deleteSubTotalTag();

        for (var i = 1; i < this._markers.length; i++) {
            var dDist = this.calDist(this._markers[i], this._markers[i - 1]);
            this._markers[i].setDist(dDist);
        }
    },

    // befor cal ,you need update marker dist
    setTipSubTotalDist: function () {

        if (!this._markers || this._markers.length <= 0) {
            return;
        }


        var dDist = 0;
        for (var i = 1; i < this._markers.length; i++) {
            dDist = this._markers[i].dDist + dDist;

            this._markers[i].setSubTotalDist(dDist);
        }

    },

    update: function () {

        this.setSubDist();

        this.setTipSubTotalDist();

        if (this._oParent.options.bIsTotalDist) {
            this.addTotalDist();
        }
        else {
            this.setTipTotalDist();
        }

        this.addCloseBtn();
    },

    // delete tipmarker and marker catch
    removeTipMarker: function (marker) {

        if (this._markers.length === 2) {
            this.clearData();
            this._oParent.clearData();
            return;
        }

        // Update Tipmarker text  for distance
        for (var i = this._markers.length - 1; i >= 0; i--) {
            if (this._markers[i] === marker) {
                // delete layer
                this._markers.splice(i, 1);
                break;
            }
        }

        this.update();


        if (marker.oRelaMarker) {
            // remove rela marker
            this._oParent.deleteHandler(marker.oRelaMarker);//fire("removeRelaMarker", {oRelaMarler: marker.oRelaMarler});
        }

        this._layerGroup.removeLayer(marker);


    },

    clearData: function () {
        // delete all data
        this._markers.splice(0, this._markers.length);
        this._layerGroup.clearLayers();
    },

    // delete dist,but draw dist is exist in catch
    deleteDist: function () {
        this.clearData();
        this._oParent.clearData();
    },

    remove: function () {
        this._map.removeLayer(this._layerGroup);
        delete this._layerGroup;
        delete  this._markers;
    }

});


/**
 * Created by liulin on 2016/9/12.
 * name:            measure.dist.js
 * des:             public distance
 * author:          liulin
 * date:            2016-09-12
 */


// inhicnt Class
// TipMarker is new obj for marker
L.ExSunMap.Measure.TipMarker = L.Marker.extend({
    options: {
        oShowConfig: {
            bIsSubDist: false,
            bIsSubTotalDist: true,
            bIsSubClose: true

        },
        metric: true
    },

    // config tag is create or order,set all site
    oUIConfig: {
        oSubBeginTxt: {
            nOrder: 1,
            cTagName: 'span',
        },
        oSubDist: {
            nOrder: 2,
            cTagName: 'span',
        },
        oSubTotalDist: {
            nOrder: 3,
            cTagName: 'span'
        },
        oTotalDist: {
            nOrder: 4,
            cTagName: 'span'
        },
        oSubClose: {
            nOrder: 5,
            cTagName: 'a',
            cClassName: 'ex-dist-subclose ec-text-lg',
            cText: '',
            cHtml: L.ExSunMap.Measure.Msg.TipMarker.createIcon.closeText,
            bIsClick: true
        },
        oTotalClose: {
            nOrder: 6,
            cTagName: 'a',
            cClassName: 'ex-dist-close ec-icon-trash',
            cText:'',
            cHtml: '',
            //fnCallBack:null
        },
    },

    initialize: function (latlng, oParent, options) {

        L.Util.extend(this.oUIConfig, options.oUIConfig);

        for (var cKey in this.oUIConfig) {
            if (this.oUIConfig[cKey].cTagName === 'span') {
                this.oUIConfig[cKey].metric = this.options.metric;
            }
        }

        L.Marker.prototype.initialize.call(this, latlng, options);

        this._oParent = oParent;

        // save tag for the tip marker
        this.aoTag = [];
    },

    _initIcon: function () {
        var options = this.options,
            map = this._map,
            animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
            classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide';

        // create div for marker
        var icon = this.createIcon();

        L.DomUtil.addClass(icon, classToAdd);

        if (options.keyboard) {
            icon.tabIndex = '0';
        }

        this._icon = icon;

        this._initInteraction();

        if (options.riseOnHover) {
            this.on({
                mouseover: this._bringToFront,
                mouseout: this._resetZIndex
            });
        }


        if (options.opacity < 1) {
            this._updateOpacity();
        }

        var panes = this._map._panes;

        panes.markerPane.appendChild(this._icon);

    },

    // set position for the marker div
    _setIconStyles: function (img, name) {
        var options = this.options,
            size = L.point(options[name + 'Size']),
            anchor;

        anchor = L.point(options.iconAnchor);

        if (!anchor && size) {
            anchor = size.divideBy(2, true);
        }

        img.className = 'leaflet-marker-' + name + ' ' + options.className;

        if (anchor) {
            img.style.marginLeft = (-anchor.x) + 'px';
            img.style.marginTop = (-anchor.y) + 'px';
        }

        if (size) {
            img.style.width = size.x + 'px';
            img.style.height = size.y + 'px';
        }
    },

    // create icon and init event
    createIcon: function () {
        var divContainer = L.DomUtil.create('div', '');
        this._setIconStyles(divContainer, 'icon');

        this.oTagContanier = divContainer;
        this.createTag();

        return divContainer;
    },

    createTag: function () {
        var oShowConfig = this.options.oShowConfig;
        for (var cKey in oShowConfig) {
            if (!oShowConfig[cKey]) {
                continue;
            }
            var cTag = cKey.replace('bIs', 'o');
            if (this.oUIConfig.hasOwnProperty(cTag)) {
                var oTag = new L.ExSunMap.Measure.TipTag(this, this.oUIConfig[cTag]);
                oTag.setFlag(cTag);
                this.addTag(oTag);
                if (this.oUIConfig[cTag].bIsClick) {

                    oTag.setClick(this.closeHanler, this);
                }
            }
        }
    },


    // add html tag for list
    addTag: function (oTag) {
        var aoTag = this.aoTag;

        if (aoTag.length <= 0) {
            aoTag.push(oTag);
            this.oTagContanier.appendChild(oTag.oTag);
            return;
        }
        var nIndex = aoTag.length;
        for (var i = 0; i < aoTag.length; i++) {
            if (oTag.nOrder < aoTag[i].nOrder) {
                nIndex = i;
                break;
            }
        }
        if (nIndex === aoTag.length) {
            this.oTagContanier.appendChild(oTag.oTag);
            this.aoTag.push(oTag);
        }
        else {

            this.oTagContanier.insertBefore(oTag.oTag, this.aoTag[nIndex].oTag);
            this.aoTag.splice(nIndex, 0, oTag);
        }

    },

    // add tag close all marker
    addAllClose: function () {

        var oTag = this.getTagByFlag('oTotalClose');
        if (oTag) {
            return;
        }
        oTag = L.ExSunMap.Measure.tipTag(this, this.oUIConfig.oTotalClose);
        oTag.setFlag('oTotalClose');
        this.addTag(oTag);

        oTag.setClick(function () {

            this._oParent.deleteDist();
        }, this);
    },


    // delet oTag
    deleteTag: function (cFlag) {
        var aoTag = this.aoTag;
        if (!aoTag || aoTag.length <= 0) {
            return;
        }

        for (var i = 0; i < aoTag.length; i++) {
            if (aoTag[i].cFlag === cFlag) {
                this.oTagContanier.removeChild(aoTag[i].oTag);
                aoTag.splice(i, 1);
                break;
            }
        }
    },

    deleteSubTotalTag: function () {

        this.deleteTag('oSubTotalDist');
    },

    addTotalPenal: function (dTotal) {
        var oTag = this.getTagByFlag('oTotalDist');
        if (!oTag) {
            oTag = L.ExSunMap.Measure.tipTag(this, this.oUIConfig.oTotalDist);
            oTag.setFlag('oTotalDist');
            this.addTag(oTag);
        }
        this.setTotalDist(dTotal, oTag);
    },

    setTotalDist: function (dTotal, oTag) {
        if (!oTag) {
            oTag = this.getTagByFlag('oTotalDist');
        }
        if (!oTag) {
            return;
        }
        this.deleteTag('oSubTotalDist');
        var cTemp = L.ExSunMap.Measure.Msg.TipMarker.addTotalPenal.total;

        oTag.setHTML(dTotal, cTemp);
    },

    // set marker length
    setDist: function (dDist) {
        this.dDist = dDist;
        var oTag = this.getTagByFlag('oSubDist');
        if (!oTag) {
            return;
        }

        oTag.setHTML(dDist);
    },

    setBeginText: function () {
        var cTag= 'oSubBeginTxt';
        var oTag = new L.ExSunMap.Measure.TipTag(this, this.oUIConfig[cTag]);
        oTag.setFlag(cTag);
        this.addTag(oTag);
        var cText = L.ExSunMap.Measure.Msg.TipMarker.setText.beginText;
        oTag.setHTML(cText);
    },

    getTagByFlag: function (cFlag) {
        var aoTag = this.aoTag;
        if (!aoTag || aoTag.length <= 0) {
            return undefined;
        }
        for (var i = 0; i < aoTag.length; i++) {
            if (aoTag[i].cFlag === cFlag) {
                return aoTag[i];

            }
        }

        return undefined;
    },

    setSubTotalDist: function (dTotal) {
        var oTag = this.getTagByFlag('oSubTotalDist');
        if (!oTag) {
            return;
        }
        var cTemp = L.ExSunMap.Measure.Msg.TipMarker.setSubTotalDistTag.total;
        //var cDist = (dTotal / 1000).toFixed(2) + L.measure.TipMarker.setSubTotalDistTag.until;

        oTag.setHTML(dTotal, cTemp);
    },


    closeHanler: function () {

        this._oParent.removeTipMarker(this);
    },

});


L.ExSunMap.Measure.tipMarker = function (oLatLng, tipMgr, options) {

    return new L.ExSunMap.Measure.TipMarker(oLatLng, tipMgr, options);
};


/**
 * Created by liulin on 2016/9/12.
 * name:            measure.TipTag.js
 * des:             tag for the tip
 * author:          liulin
 * date:            2016-09-27
 */


// inhicnt Class
// TipMarker is new obj for markertipmarker
L.ExSunMap.Measure.TipTag = L.Class.extend({
    // config tag is create or order
    options: {
        // show sub distance in marker
        cTagName: 'span',
        // class for the tag
        cClassName: '',
        // show sub marker total distance
        nOrder: 1,
        // show total dist
        cText: '',
        //metric
    },

    // init tag for control
    initialize: function (oParent, options) {
        L.setOptions(this, options);
        this._oParent = oParent;
        this.createTag();
        //this.cPreText = '';
    },


    // create icon and init event
    createTag: function () {
        var oTag = L.DomUtil.create(this.options.cTagName, '');
        this.nOrder = this.options.nOrder;
        if (this.options.cClassName) {
            L.DomUtil.addClass(oTag, this.options.cClassName);
        }

        oTag.text = this.options.cText;
        oTag.innerHTML =  this.options.cHtml||'';
        this.oTag = oTag;

        return oTag;
    },

    setFlag: function (cFlag) {
        this.cFlag = cFlag;
        this.oTag.setAttribute('cFlag', cFlag);
    },

    // set html
    setHTML: function (dDist, cPreText) {
        if (typeof dDist === 'string') {
            this.oTag.innerText = dDist;
            return;
        }

        var cDist = '';
        if (dDist !== 0) {
            //metric
            cDist = L.GeometryUtil.readableDistance(dDist, true);
        }
        this.oTag.innerHTML = (cPreText || '') + cDist;
    },

    setClick: function (fnCall, oContext) {
        L.DomEvent.on(this.oTag, 'click', fnCall, oContext);
    }

});


L.ExSunMap.Measure.tipTag = function (oParent, options) {

    return new  L.ExSunMap.Measure.TipTag(oParent, options);
};


/**
 * Created by liulin on 2016/11/7.
 */

L.ExSunMap.Measure.AreaMgr = L.ExSunMap.Measure.DistMgr.extend({

    // start execute
    addHooks: function () {
        var oDist = L.ExSunMap.Measure.area(this._map, this, this.options);
        this.oLastDist = oDist;
        this.aoMeasureHandker.push(oDist);
        oDist.createDist();
    },
});

L.ExSunMap.Measure.areaMgr = function (map, options) {

    return new L.ExSunMap.Measure.AreaMgr(map, options);
};


/**
 * name:    area.js
 * desc:    measure area for the map
 *
 * Created by liulin on 2016/11/5.
 *
 */

L.ExSunMap.Measure.Area = L.ExSunMap.Measure.Dist.extend({
    statics: {
        TYPE: 'area'
    },

    Poly: L.Polygon,

    options: {
        showArea: false,
        shapeOptions: {
            stroke: true,
            color: '#f06eaa',
            weight: 2,
            opacity: 1,
            fill: true,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: true
        },
        // Whether to use the metric measurement system or imperial
        metric: true
    },

    initialize: function (map, oParent, options) {
        L.ExSunMap.Measure.Dist.prototype.initialize.call(this, map, oParent, options);

        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = L.ExSunMap.Measure.Area.TYPE;
    },

    createDist: function () {

        if (!this._map) {
            return;
        }

        L.DomUtil.disableTextSelection();

        this._container.focus();

        this._tooltip = new L.ExSunMap.Tooltip(this._map);

        L.DomEvent.on(this._container, 'keyup', this._cancelDrawing, this);

        // manager marker in line distance
        this._oMarkerMgr = new L.ExSunMap.Measure.AreaMarkerMgr(this._map, this);

        // manager tip marker in line distance
        this._oTipMarkerMgr = new L.ExSunMap.Measure.AreaTipMarkerMgr(this._map, this);

        // draw line
        this._poly = new L.Polyline([], this.options.shapeOptions);

        // uodate tooltip text
        this._tooltip.updateContent(this._getTooltipText());

        this.initEvent();

    },

    _getTooltipText: function () {
        var text, subtext;
        var nLen = this._oMarkerMgr.getLen();
        if (nLen === 0) {
            text = L.ExSunMap.Measure.Msg.Area._getTooltipText.start;
        } else if (nLen < 3) {
            text = L.ExSunMap.Measure.Msg.Area._getTooltipText.cont;
        } else {
            text = L.ExSunMap.Measure.Msg.Area._getTooltipText.end;
            subtext = this._getMeasurementString();
        }

        return {
            text: text,
            subtext: subtext
        };
    },

    _getMeasurementString: function () {
        var area = this._area;

        if (!area) {
            return null;
        }

        return L.GeometryUtil.readableArea(area, this.options.metric);
    },

    _shapeIsValid: function () {
        var nLen = this._oMarkerMgr.getLen();
        return nLen >= 3;
    },

    _vertexChanged: function (latlng, added) {
        var latLngs;

        // Check to see if we should show the area
        if (!this.options.allowIntersection && this.options.showArea) {
            latLngs = this._poly.getLatLngs();

            this._area = L.GeometryUtil.geodesicArea(latLngs);
        }

        L.ExSunMap.Measure.Dist.prototype._vertexChanged.call(this, latlng, added);
    },

    _cleanUpShape: function () {
        var markerCount = this._markers.length;

        if (markerCount > 0) {
            this._markers[0].off('click', this._finishShape, this);

            if (markerCount > 2) {
                this._markers[markerCount - 1].off('dblclick', this._finishShape, this);
            }
        }
    },


});

L.ExSunMap.Measure.area = function (oMap, oParent, oOption) {
    return new L.ExSunMap.Measure.Area(oMap, oParent, oOption);
};

/**
 * Created by liulin on 2017/1/19.
 */


L.ExSunMap.Measure.AreaMarkerMgr= L.ExSunMap.Measure.MarkerMgr.extend({

    updateFinishHandler: function () {
        var markerCount = this._markers.length;

        // The first marker should have a click handler to close the polygon
        if (markerCount === 1) {
            this._markers[0].on('click', this._finishShape, this);
        }

        // Add and update the double click handler
        if (markerCount > 2) {
            this._markers[markerCount - 1].on('dblclick', this._finishShape, this);
            // Only need to remove handler if has been added before
            if (markerCount > 3) {
                this._markers[markerCount - 2].off('dblclick', this._finishShape, this);
            }
        }
    },

});

/**
 * Created by liulin on 2016/11/7.
 */

L.ExSunMap.Measure.AreaTipMarkerMgr = L.ExSunMap.Measure.TipMarkerMgr.extend({

    statics: {
        TYPE: 'AREA'
    },

    // create marker ,cal area for current marker
    createMarker: function (oLatLng, oRelaMarker, options) {

        var tipMarker = new L.ExSunMap.Measure.AreaTipMarker(oLatLng, this, options);
        tipMarker.addTo(this._layerGroup);
        this._markers.push(tipMarker);

        // rela marker that show in map
        if (oRelaMarker) {
            tipMarker.oRelaMarker = oRelaMarker;
        }

        return tipMarker;
    },

    // get total area
    getTotalDist: function () {
        if (this._markers.length <= 2) {
            return 0;
        }

        var aoLatlng = this._markers.map(function (oItem) {
            return oItem.getLatLng();
        });

        var dToTalArea = L.GeometryUtil.geodesicArea(aoLatlng);
        return dToTalArea;
    },

    // delete tipmarker and marker catch
    removeTipMarker: function (marker) {

        if (this._markers.length === 3) {
            this.clearData();
            this._oParent.clearData();
            return;
        }

        // Update Tipmarker text  for distance
        for (var i = this._markers.length - 1; i >= 0; i--) {
            if (this._markers[i] === marker) {
                // delete layer
                this._markers.splice(i, 1);
                break;
            }
        }

        this.update();


        if (marker.oRelaMarker) {
            // remove rela marker
            this._oParent.deleteHandler(marker.oRelaMarker);//fire("removeRelaMarker", {oRelaMarler: marker.oRelaMarler});
        }

        this._layerGroup.removeLayer(marker);

    },

    update: function () {

        if (this._oParent.options.bIsTotalDist) {
            this.addTotalDist();
        }
        else {
            this.setTipTotalDist();
        }

        this.addCloseBtn();
    },
});

/**
 * Created by liulin on 2016/11/7.
 */

L.ExSunMap.Measure.AreaTipMarker = L.ExSunMap.Measure.TipMarker.extend({

    options: {
        oShowConfig: {
            bIsSubDist: false,
            bIsSubClose: true

        },
        metric: true
    },

    oUIConfig: {
        oTotalDist: {
            nOrder: 3,
            cTagName: 'span'
        },

        //oSubClose: {
        //    nOrder: 4,
        //    cTagName: 'a',
        //    cText: L.ExSunMap.Measure.Msg.TipMarker.createIcon.closeText,
        //    bIsClick: true
        //},
        //oTotalClose: {
        //    nOrder: 5,
        //    cTagName: 'a',
        //    cClassName: '',
        //    cText: L.ExSunMap.Measure.Msg.TipMarker.createIcon.closeText
        //
        //},

        oSubClose: {
            nOrder: 4,
            cTagName: 'a',
            cClassName: 'ex-dist-subclose ec-text-lg',
            cText: '',
            cHtml: L.ExSunMap.Measure.Msg.TipMarker.createIcon.closeText,
            bIsClick: true
        },
        oTotalClose: {
            nOrder: 5,
            cTagName: 'a',
            cClassName: 'ex-dist-close ec-icon-trash',
            cText:'',
            cHtml: '',
            //fnCallBack:null
        },
    },

    createTag: function () {
        var oShowConfig = this.options.oShowConfig;
        for (var cKey in oShowConfig) {
            if (!oShowConfig[cKey]) {
                continue;
            }
            var cTag = cKey.replace('bIs', 'o');
            if (this.oUIConfig.hasOwnProperty(cTag)) {
                var oTag = new L.ExSunMap.Measure.AreaTipTag(this, this.oUIConfig[cTag]);
                oTag.setFlag(cTag);
                this.addTag(oTag);
                if (this.oUIConfig[cTag].bIsClick) {

                    oTag.setClick(this.closeHanler, this);
                }
            }
        }
    },

    addTotalPenal: function (dTotal) {
        var oTag = this.getTagByFlag('oTotalDist');
        if (!oTag) {
            oTag = new L.ExSunMap.Measure.AreaTipTag(this, this.oUIConfig.oTotalDist);
            oTag.setFlag('oTotalDist');
            this.addTag(oTag);
        }
        this.setTotalDist(dTotal, oTag);
    },

});

/**
 * Created by liulin on 2016/11/7.
 */

L.ExSunMap.Measure.AreaTipTag = L.ExSunMap.Measure.TipTag.extend({

    setHTML: function (dDist) {
        if (typeof dDist === 'string') {
            this.oTag.innerText = dDist;
            return;
        }

        var cDist = L.ExSunMap.Measure.Msg.TipMarker.setText.beginText;
        if (dDist !== 0) {
            cDist = L.GeometryUtil.readableAreaEx(dDist, this.options.metric);
        }
        this.oTag.innerHTML = cDist;
    },
});

/**
 * Created by liulin on 2016/11/8.
 */
L.ExSunMap.LocaltionSearch = {};

L.ExSunMap.LocaltionSearch.version = '2.4.0';

L.ExSunMap.LocaltionSearch.Msg = {

    addHooks: {
        locText: 'move mouse to search localtion',
    },

    _onMouseMove: {
        locTemp: 'lng:{lng},lat:{lat}',
    },

};


/**
 * Created by liulin on 2016/11/7.
 *
 *desc:         localtion  search where move mouse on the map
 *if you want to get localtion you must click the map ,the tip close
 * then the gps catch in the clip
 *
 */


L.ExSunMap.LocaltionSearch.Search = L.Handler.extend({

    statics: {
        TYPE: 'LocaltionSearch'
    },

    includes: L.Mixin.Events,

    initialize: function (map, options) {

        L.Handler.prototype.initialize.call(this, map);

        L.setOptions(this, options);

        this._uneditedLayerProps = {};

        //this.type = L.LocaltionSearch.TYPE;
    },

    enable: function () {
        if (this._enabled) {
            return;
        }

        this.fire('enabled', {handler: this.type});

        //this disable other handlers
        this._map.fire('tool:localStart', {handler: this.type});

        //allow drawLayer to be updated before beginning edition.
        L.Handler.prototype.enable.call(this);

    },

    disable: function () {
        if (!this._enabled) {
            return;
        }

        L.Handler.prototype.disable.call(this);
        this._map.fire('tool:localStop', {handler: this.type});

        this.fire('disabled', {handler: this.type});
    },

    addHooks: function () {

        var map = this._map;
        if (!map) {
            return;
        }

        map.getContainer().focus();

        this._tooltip = new L.ExSunMap.Tooltip(this._map);
        this._tooltip.updateContent({
            text: '',
            subtext: L.ExSunMap.LocaltionSearch.Msg.addHooks.locText,
        });
        L.DomUtil.addClass(this._map.getContainer(), 'toopTipClass');
        this._map.on('mousemove', this._onMouseMove, this)
            .on('click', this._onClick, this);
    },

    removeHooks: function () {
        if (this._map) {
            // Clean up selected layers.
            //this._featureGroup.eachLayer(this._disableLayerEdit, this);

            // Clear the backups of the original layers
            this._uneditedLayerProps = {};

            this._tooltip.dispose();
            this._tooltip = null;
            L.DomUtil.removeClass(this._map.getContainer(), 'toopTipClass');

            this._map.off('mousemove', this._onMouseMove, this)
                .off('click', this._onClick, this);
        }
    },

    // copy lat lng to catch
    _onClick: function (e) {
        var oContainer = this._map.getContainer();
        var oInput = L.DomUtil.create('input', '', oContainer);
        oInput.type = 'text';

        var oLatLng = {
            lat: e.latlng.lat.toFixed(6),
            lng: e.latlng.lng.toFixed(6)
        };

        oInput.value = L.Util.template(L.ExSunMap.LocaltionSearch.Msg._onMouseMove.locTemp, oLatLng);
        oInput.select();
        document.execCommand('Copy');
        oContainer.removeChild(oInput);

        this.disable();
    },

    _onMouseMove: function (e) {
        var oLatLng = {
            lat: e.latlng.lat.toFixed(6),
            lng: e.latlng.lng.toFixed(6)
        };
        this._tooltip.updateContent({
            text: L.ExSunMap.LocaltionSearch.Msg.addHooks.locText,
            subtext: L.Util.template(L.ExSunMap.LocaltionSearch.Msg._onMouseMove.locTemp, oLatLng)
        });
        this._tooltip.updatePosition(e.latlng);
    },


});

/**
 * Created by liulin on 2016/12/21.


 name:       MapRectBox.js
 des:        地图拉框组件
 date:       2016-06-14
 author:     liulin


 继承地图拉框组件，实现地图拉框功能，监听地图拉框
 */


// L.Map 地图类，合并为地图属性，并说明是否默认执行enable，
// 如果是外部按钮触发，设置为false，如果是加载地图控件自动触发设置为true

L.Map.mergeOptions({
    // @option boxZoom: Boolean = true
    // Whether the map can be zoomed to a rectangular area specified by
    // dragging the mouse while pressing the shift key.
    rectBox: false
});

//
L.Map.RectBox = L.Handler.extend({
    initialize: function (map) {
        this._map = map;
        this._container = map._container;
        this._pane = map._panes.overlayPane;
    },

    addHooks: function () {
        L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
        // 鼠标修改为手形
        L.DomUtil.addClass(this._container, 'leaflet-crosshair');
        this._map.dragging.disable();
    },

    removeHooks: function () {
        L.DomEvent.off(this._container, 'mousedown', this._onMouseDown, this);
        L.DomUtil.removeClass(this._container, 'leaflet-crosshair');
    },

    moved: function () {
        return this._moved;
    },

    _resetState: function () {
        this._moved = false;
    },

    _onMouseDown: function (e) {
        //if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

        this._resetState();

        L.DomUtil.disableTextSelection();
        L.DomUtil.disableImageDrag();

        this._startPoint = this._map.mouseEventToContainerPoint(e);

        if (L.version === '0.7.7') {
            L.DomEvent
                .on(document, 'mousemove', this._onMouseMove, this)
                .on(document, 'mouseup', this._onMouseUp, this)
                .on(document, 'keydown', this._onKeyDown, this);
        } else {
            L.DomEvent.on(document, {
                contextmenu: L.DomEvent.stop,
                mousemove: this._onMouseMove,
                mouseup: this._onMouseUp,
                keydown: this._onKeyDown
            }, this);
        }

    },

    _onMouseMove: function (e) {
        if (!this._moved) {
            this._moved = true;

            this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._container);


            this._map.fire('rectboxstart');
        }

        this._point = this._map.mouseEventToContainerPoint(e);

        var bounds = new L.Bounds(this._point, this._startPoint),
            size = bounds.getSize();

        L.DomUtil.setPosition(this._box, bounds.min);

        this._box.style.width = size.x + 'px';
        this._box.style.height = size.y + 'px';
    },

    _finish: function () {

        if (this._moved) {
            if (L.version === '0.7.7') {
                this._container.removeChild(this._box);
                this._container.style.cursor = '';
            } else {
                L.DomUtil.remove(this._box);
                L.DomUtil.removeClass(this._container, 'leaflet-crosshair');
            }
        }
        this._map.dragging.enable();

        L.DomUtil.enableTextSelection();
        L.DomUtil.enableImageDrag();
        if (L.version === '0.7.7') {
            L.DomEvent
                .off(document, 'mousemove', this._onMouseMove)
                .off(document, 'mouseup', this._onMouseUp)
                .off(document, 'keydown', this._onKeyDown);
        } else {
            L.DomEvent.off(document, {
                contextmenu: L.DomEvent.stop,
                mousemove: this._onMouseMove,
                mouseup: this._onMouseUp,
                keydown: this._onKeyDown
            }, this);
        }
    },

    _onMouseUp: function (e) {
        if ((e.which !== 1) && (e.button !== 1)) {
            return;
        }

        this._finish();

        if (!this._moved) {
            return;
        }
        // Postpone to next JS tick so internal click event handling
        // still see it as 'moved'.
        setTimeout(L.bind(this._resetState, this), 0);

        var bounds = new L.LatLngBounds(
            this._map.containerPointToLatLng(this._startPoint),
            this._map.containerPointToLatLng(this._point));

        this._map.fire('rectboxend', {boxBounds: bounds});

        this.endHandler(bounds);

    },

    // 拉框结束需要处理的事件，
    endHandler: function () {

    },

    _onKeyDown: function (e) {
        if (e.keyCode === 27) {
            this._finish();
        }
    }
});

// @section Handlers
// @property boxZoom: Handler
// Box (shift-drag with mouse) zoom handler.
L.Map.addInitHook('addHandler', 'rectBox', L.Map.RectBox);

// 拉框放大
L.Map.ScaleBig = L.Map.RectBox.extend({

    endHandler: function (bounds) {
        if (!bounds) {
            return;
        }
        this._map.fitBounds(bounds);
        this.disable();
    },
});

// 拉框放大
L.Map.ScaleSmall = L.Map.RectBox.extend({

    endHandler: function (bounds) {
        if (!bounds) {
            return;
        }
        this.zoomInBounds(bounds);
        this.disable();
    },

    //添加缩小方法，在中心点处缩小一个层级
    zoomInBounds: function (bounds, options) {

        var nZoom = this._map.getZoom();

        options = options || {};
        bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);

        var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
            paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),

            zoom = this._map.getBoundsZoom(bounds, false, paddingTL.add(paddingBR)),
            paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

            swPoint = this._map.project(bounds.getSouthWest(), zoom),
            nePoint = this._map.project(bounds.getNorthEast(), zoom),
            center = this._map.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

        var nLevel = ((zoom - nZoom) === 0) ? 1 : (zoom - nZoom);

        zoom = options && options.maxZoom ? Math.min(options.maxZoom, zoom) : nZoom - nLevel;

        return this._map.setView(center, zoom, options);
    },

});

/**
 * Created by liulin on 2016/11/23.
 *
 *
 *
 */


L.Util.extend(L.LineUtil, {



    // json 数据生成 html
    //@oTag Ϊjquery
    //@oOption
    initTag: function (oTag, oOption) {
        if (!oTag || !oOption) {
            return;
        }

        //
        for (var cItem in oOption) {
            if (L.Util.isArray(oOption[cItem])) {
                //
                var cTemp = cItem;
                for (var i = 0; i < oOption[cTemp].length; i++) {
                    var oItem = L.DomUtil.create(cTemp);
                    this.initTag(oItem, oOption[cTemp][i]);
                    oTag.appendChild(oItem);
                }
            }
            else if (typeof oOption[cItem] === 'object' && oOption[cItem] !== null) {
                //
                var cTagTemp = L.Util.replaceAll(cItem, '1', '');
                var oItem1 = L.DomUtil.create(cTagTemp);
                this.initTag(oItem1, oOption[cItem]);
                oTag.appendChild(oItem1);
            }
            else if (cItem === 'html') {
                var html = oTag.innerHTML;
                oTag.innerHTML = html + ((oOption[cItem] !== null) ? oOption[cItem] : '');

            }
            else {
                oTag.setAttribute(cItem, oOption[cItem]);

            }
        }
    },

    //
    //@s
    //@s1
    //@s2
    replaceAll: function (s, s1, s2) {
        return s.replace(new RegExp(s1, 'gm'), s2);
    },

});




/**
 * Created by liulin on 2016/11/23.
 *
 * 只对地图 的配置，不含控件的配置
 *
 * 这个文件可以可以扩展
 */
L.ExSunMap.MapMaster = {};
L.ExSunMap.MapMaster.vertion = '2.4.0';
L.ExSunMap.MapMaster.TileProvider = {

    oTianDiTu: {
        oNormal: {
            cName: '天地图',
            cMap: "http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}",
            cAnnotion: "http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}",
            acSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
        },
        oSatellite: {
            cName: '天地卫星图',
            cMap: "http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}",
            cAnnotion: "http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}",
            acSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
        },
        oTerrain: {
            cName: '天地地形图',
            cMap: "http://t{s}.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}",
            cAnnotion: "http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}",
            acSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
        },
    },

    oMapABC: {
        oNormal: {
            cName: 'MapABC',
            cMap: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            acSubdomains: ["a", "b", "c"]
        }
    },

    oGaoDe: {
        oNormal: {
            cName: '电子地图',
            cMap: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            acSubdomains: ["1", "2", "3", "4"]
        },
        oSatellite: {
            cName: '高德卫星图',
            cMap: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',

            acSubdomains: ["1", "2", "3", "4"]
        },
        oNetRoad: {
            cName: '高德路网图',
            cMap: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
            acSubdomains: ["1", "2", "3", "4"]
        }
    },

    oExSunMap: {
        oNormal: {
            cName: '依迅本地图',
            cMap: 'http://192.168.1.248:9000/map/get/{x}/{y}/{z}',
            acSubdomains: ["1", "2", "3", "4"]
        },
        oNormalSvr: {
            cName: '依迅服务器图',
            cMap: 'http://221.235.53.42:8008/mapimg.aspx?t=mapabc&z={z}&x={x}&y={y}',
            acSubdomains: ["1", "2", "3", "4"]
        },
    },

    oGoogleMap: {
        oNormal: {
            cName: '谷歌地图',
            cMap: 'http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
            acSubdomains: ["1", "2", "3", "4"]
        },
        oSatellite: {
            cName: '卫星图',
            cMap: 'http://mt3.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
            acSubdomains: ["1", "2", "3", "4"]
        },
        oTopographic: {
            cName: '谷歌地形图',
            cMap: 'http://mt0.google.cn/vt/lyrs=t&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
            nMaxLevel: 16,
            acSubdomains: ["1", "2", "3", "4"]
        },

    },

    oArcMap: {
        oFoursquare: {
            cMap: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
            cName: '灰度图',
            acSubdomains: ["1", "2", "3", "4"]
        },

    },

    oTDMap: {
        oNormal: {
            cName: '立体图',
            cMap: 'https://a.tiles.mapbox.com/v3/foursquare.map-0y1jh28j/{z}/{x}/{y}.png',
            acSubdomains: ["1", "2", "3", "4"]
        },
    },


};

// 定义快捷方式0,1,2 为天地图瓦片
L.ExSunMap.MapMaster.TileProvider[0]=L.ExSunMap.MapMaster.TileProvider.oTianDiTu.oNormal;
L.ExSunMap.MapMaster.TileProvider[1]=L.ExSunMap.MapMaster.TileProvider.oTianDiTu.oSatellite;
L.ExSunMap.MapMaster.TileProvider[2]=L.ExSunMap.MapMaster.TileProvider.oTianDiTu.oTerrain;

// 定义快捷方式 3 为MABC瓦片
L.ExSunMap.MapMaster.TileProvider[3]=L.ExSunMap.MapMaster.TileProvider.oMapABC.oNormal;

// 定义快捷方式 4，5，6 为高德瓦片
L.ExSunMap.MapMaster.TileProvider[4]=L.ExSunMap.MapMaster.TileProvider.oGaoDe.oNormal;
L.ExSunMap.MapMaster.TileProvider[5]=L.ExSunMap.MapMaster.TileProvider.oGaoDe.oSatellite;
L.ExSunMap.MapMaster.TileProvider[6]=L.ExSunMap.MapMaster.TileProvider.oGaoDe.oNetRoad;

// 依迅地图瓦片
L.ExSunMap.MapMaster.TileProvider[7]=L.ExSunMap.MapMaster.TileProvider.oExSunMap.oNormal;
L.ExSunMap.MapMaster.TileProvider[8]=L.ExSunMap.MapMaster.TileProvider.oExSunMap.oNormalSvr;

L.ExSunMap.MapMaster.TileProvider[9]=L.ExSunMap.MapMaster.TileProvider.oGoogleMap.oNormal;
L.ExSunMap.MapMaster.TileProvider[10]=L.ExSunMap.MapMaster.TileProvider.oGoogleMap.oSatellite;
L.ExSunMap.MapMaster.TileProvider[11]=L.ExSunMap.MapMaster.TileProvider.oGoogleMap.oTopographic;

L.ExSunMap.MapMaster.TileProvider[12]=L.ExSunMap.MapMaster.TileProvider.oArcMap.oFoursquare;
L.ExSunMap.MapMaster.TileProvider[13]=L.ExSunMap.MapMaster.TileProvider.oTDMap.oNormal;


L.ExSunMap.MapMaster.Err= {

    1: '没有设置图层！',
    2: 'Map parent container not found.',

};

L.ExSunMap.MapMaster.EventName= {

    // 地图加载完毕事件
    loadFinish: 'Map:loadFinish',

};







/**
 * Created by liulin on 2016/11/22.
 *
 * 地图整体思想
 *
 * 1. 图层 管理
 * 2. 地图 div 容器 管理
 * 3. 地图 外围容器
 *
 * 4. 整个 代码不能出现中文
 *
 * 5. 只能出现地图相关的数据
 * 6. 地图控件编程只能出现原生的js，不能只用jquest 对象
 * 7. 其他的所有地图操作都继承他
 *
 * 加载工具栏的容器，工具栏的容器在什么位置
 *
 *
 */


L.ExSunMap.MapMaster = L.Evented.extend({

    //对象的固有参数
    options: {

        // 地图div
        cDidId: 'divMap',

        // 地图容器上级容器
        cDivContainerId: 'divContainer',

        // 默认的图层
        nDefaultTile: 4,

        // 地图配置
        oMapOption: {
            zoomControl: false,
            layers: [],
            center: new L.LatLng(30.55072, 114.29471),
            zoom: 10
        },

        //瓦片参数
        oTileOption: {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map &copy;GB-20263—2018 <a target="_blank" href="#">电子地图</a> '
        },

        // 加载的瓦片,依据快捷方式加载
        anLoadTile: [4, 5, 6, 9, 10, 11, 12],

        // 地图图层提供者
        oProvider: L.ExSunMap.MapMaster.TileProvider,

        nMapWidth: 600,
        nMapHeight: 500

    },

    // 一下参数是一些常量
    cDiv: 'div',

    //对象的构造函数,oParent为外部对象
    initialize: function (oParent, oOption) {
        L.setOptions(this, oOption);

        // 加载外部page数据
        this._oParent = oParent;


        // 加载的图层数据
        this._oBaseLayer = {};
        // 默认图层
        this._oDefaultTile = undefined;
        // 加载图层
        this._initTile();

        this._getDefaultLayer();

        return this;
    },


    //一下为公共方法，地图有创建容器，或者在已经有的容器中添加数据

    //获得默认的瓦片设置
    getDefaultTile: function () {
        var cName = this.options.oProvider[this.options.nDefaultTile].cName;
        return this._oBaseLayer[cName];
    },

    //外部要重写此方法 当前html加载到页面中后触发
    loadMapMaster: function () {

        this._loadMap();
        return this;
    },

    //获得地图控件
    getMap: function () {
        return this._oMap;
    },

    //设置基本图层，外部可以获取当前图层瓦片
    getBaseLayers: function () {

        if (!this._oBaseLayer) {
            throw new Error(L.ExSunMap.MapMaster.Err[1]);
        }

        return this._oBaseLayer;
    },


    //一下为私有方法，不对外公布，如果对外公布，请去掉 "_"

    //获得默认的图层设置
    _getDefaultLayer: function () {

        var cName = this.options.oProvider[this.options.nDefaultTile].cName;

        this._oDefaultTile = this._oBaseLayer[cName];
        return this._oDefaultTile;
    },

    //加载地图
    _loadMap: function () {

        // 首先要判断是否有地图div ，没有就在地图容器中加载div
        var oDiv = L.DomUtil.get(this.options.cDidId);

        var nWidth = this.options.nMapWidth;
        var nHeight = this.options.nMapHeight;

        if (!oDiv) {

            var oContainer = L.DomUtil.get(this.options.cDivContainerId);
            if (!oContainer) {

                throw new Error(L.ExSunMap.MapMaster.Err[2]);
            }

            oDiv = L.DomUtil.create(this.cDiv, '', oContainer);
        }

        oDiv.style.width = nWidth + 'px';
        oDiv.style.height = nHeight + 'px';
        oDiv.id = this.options.cDidId;

        L.Util.extend(this.options.oMapOption, {layers: [this._oDefaultTile]});

        var oMap = this._oMap = new L.Map(this.options.cDidId, this.options.oMapOption);

        if (this._oParent) {
            if (this._oParent.setMap) {
                this._oParent.setMap(oMap);
            }
            //this._oParent.fire('Map:loadFinish', {oMap: oMap});

            this.fire('Map:loadFinish', {oMap: oMap});
        }

        return oMap;
    },

    // 初始化 瓦片数据
    _initTile: function () {

        var oOption = L.extend({}, this.options.oTileOption);
        var oProvider = this.options.oProvider;
        var anLoadTile = this.options.anLoadTile;

        if (!anLoadTile || anLoadTile.length <= 0) {
            return;
        }

        if (!oProvider) {
            return;
        }

        var oBaseLayer = {};
        for (var i = 0; i < anLoadTile.length; i++) {
            var oTemp = oProvider[anLoadTile[i]];
            oOption.maxZoom = oTemp.nMaxLevel || oOption.maxZoom;
            oOption.minZoom = oTemp.nMinLevel || oOption.minZoom;
            oOption.subdomains = oTemp.acSubdomains;

            var oTile = L.tileLayer(oTemp.cMap, oOption);

            oBaseLayer[oTemp.cName] = oTile;
        }

        this._oBaseLayer = oBaseLayer;

        // if (this._oParent) {
        //     this._oParent.fire('Map:loadTileFinish', {oBaseLayer: oBaseLayer});
        // }
        //
        // this.fire('Map:loadTileFinish', {oBaseLayer: oBaseLayer});

    },

    reflesh: function (nW, nH) {
        if (!this._oMap) {
            return;
        }
        var oContainer = this._oMap.getContainer();
        if (nW) {
            oContainer.style.width = nW + 'px';
        }
        if (nH) {
            oContainer.style.height = nH + 'px';
        }

        this._oMap._onResize();
    },

});

// 地图容器的扩展 给地图容器添加控件容器，不用地图自带的容器
L.ExSunMap.MapMaster.include({

    cTopLeftConfig: {
        div: {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'}

    },

    cTopRightConfig: {
        div: {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'}

    },

    // 一种是自带的容器，一种是系统默认的容器
    initTopLeft: function (cHtml) {

        var oDiv = L.DomUtil.get(this.options.cDidId);
        if (!oDiv) {
            return;
        }
        // 初始化结构
        if (!cHtml) {
            L.Util.initTag(oDiv, this.cTopLeftConfig);
        } else {
            L.Util.initTag(oDiv, cHtml);
        }
    },

    initTopRight: function () {


    },

});

/**
 * Created by liulin on 2016/11/23.
 */

L.ExSunMap.MapMaster.MapOpr =  L.Evented.extend({

    options: {

        // 飞行的最大图层
        nFlyZoom: 10,

        // 飞行的延时
        nFlyDuration: 1,

        // 允许飞行的做到图层
        nFlyMaxZoom: 15,

        // 地图飞行版本
        cFlayMapVertion: '1.0'
    },



    /**
     功能描述：页面的构造函数
     @oParent：父亲级容器，可以监听全局事件的容器
     @oOption：外部参赛设置
     */
    initialize: function (oParent, oOption,oMap) {
        oOption = L.setOptions(this, oOption);

        this._oParent = oParent;

        if( oMap && oMap instanceof L.Map ){
            this._oMap = oMap;
        }
        else
        {
            if (oParent) {
                if (oParent._oMap &&   oParent._oMap instanceof L.Map) {
                    this._oMap = oParent._oMap;
                } else {
                    if (oParent instanceof L.Map) {
                        this._oMap = oParent;
                    }
                    //else if (oParent.on) {
                    //oParent.on(L.ExSunMap.MapMaster.EventName.loadFinish, this.setMap, this);
                    //}
                }
            }
        }
        // 添加监听事件
        this._initOn();

    },


    // 移动地图 控制 在地图 leaflet.js 1.0 b版本适用
    flyTo: function (oData, options) {
        if (!this._oMap) {
            return;
        }
        var oLatlng = null;
        if(oData.hasOwnProperty('oGpsInfo')){
            var oGpsInfo = oData.oGpsInfo;
            oLatlng = L.latLng(oGpsInfo.Lat, oGpsInfo.Lon);
        }
        if(oData instanceof  L.LatLng){
            oLatlng = oData;
        }

        if(oData.hasOwnProperty('lat') && oData.hasOwnProperty('lng')){
            oLatlng = L.latLng(oData.lat, oData.lng);
        }
        if(oData.hasOwnProperty('Lat') && oData.hasOwnProperty('Lng')){
            oLatlng = L.latLng(oData.Lat, oData.Lng);
        }

        if (L.version < this.options.cFlayMapVertion) {
            return;
        }
        // 防止地图抖动问题
        if (this._oMap.getBounds().contains(oLatlng) && this._oMap.getZoom() >= this.options.nFlyMaxZoom) {
            this._oMap.panTo(oLatlng);
            return;
        }
        if(!options)
        {
            options = {};
        }
        this._oMap.flyTo(oLatlng, options.zoom || this.options.nFlyZoom, {duration: options.duration || this.options.nFlyDuration});
        return this;
    },

    // 刷新地图
    reflesh: function () {
        if (!this._oMap) {

            return;
        }

        this._oMap._onResize();
        return this;
    },

    //添加功能图层查找

    //在当前图层分组中查找图层，图层是根据终端号来查找的
    findLayer: function (oGroupLayer, cId) {
        if (!oGroupLayer || oGroupLayer.getLayers().length <= 0) {
            return null;
        }

        var aoLayer = oGroupLayer.getLayers();

        for (var oLayer in aoLayer) {
            if (aoLayer[oLayer].cId === cId) {
                return aoLayer[oLayer];
            }
        }

        return null;
    },

    //在地图范围内查找图层
    findLayerInMap: function (cId) {
        if (!this._oMap) {
            return null;
        }

        var oLayer = this._oMap._layers;

        if (!oLayer) {
            return null;
        }
        var aoLayer = [];
        for (var cKey in oLayer) {
            if (oLayer[cKey].cId === cId) {
                aoLayer.push(oLayer[cKey]);
            }
        }
        return aoLayer;
    },

    // 判断点在屏幕内
    posInSrceen: function (oLatLng) {
        if (!this._oMap) {
            return false;
        }

        var oBound = this._oMap.getBounds();
        return oBound.contains(oLatLng);
    },

    // 空点， 用于显示 label 信息
    _drawTip: function (oLatLng, oTemp) {
        var oOption = {
            cId: '1',
            cName: '测试tip',
            bNoHide: true,
        };

        L.Util.extend(oOption, oTemp);

        var oIcon = new L.DivIcon({
            html: '<div> </div>',
            className: '',
        });

        var oMarker = L.marker(oLatLng, {icon: oIcon, bIsNotEdit: true});
        oMarker.cId = 'TM_' + oOption.cId;

        //给oMarker绑定tip
        oMarker.bindLabel(oOption.cName, {noHide: oOption.bNoHide, direction: 'auto'});

        return oMarker;
    },


    /*
     功能描述：手动设置地图，如果用户不用默认地图对象时，需要手动设置地图，
     @oMap：设置的地图对象
     */
    setMap: function (oMap) {
        if (oMap instanceof L.Map) {
            this._oMap = oMap;
        }
        return this;
    },


    /*
     功能描述：删除不在屏幕范围内的点数据
     @aoPos：点数据对象数值如[{lat:30.233,lng:114.32}]
     @oBound：地图对象屏幕区间范围，如果为空取地图范围
     */
    delPosNotInScreen: function (aoPos, oBound) {
        if (!aoPos || aoPos.length <= 0) {
            return;
        }
        if (!oBound) {
            oBound = this.oMap.getBounds();
        }

        for (var i = (aoPos.length - 1); i >= 0; i--) {
            var oLatLng = L.latLng(aoPos[i].oLatLng.lat, aoPos[i].oLatLng.lng);
            if (!oBound.contains(oLatLng)) {
                //数组中删除点
                aoPos.splice(i, 1);
            }
        }
        return this;
    },

    //-- 私有方法

    // 加载地图图层
    _loadPage: function () {

    },


    _initOn: function () {

    },

});

///**
// * Created by liulin on 2016/11/23.
// */
//
//L.ExSunMap.Control = {};
//L.ExSunMap.Control.vertion = '0.1.0';
//L.ExSunMap.Control.Config = {
//
//    regionSwitch: '区域',
//    deptName: '武汉',
//};
//
//


///**
// * Created by liulin on 2016/11/23.
// *
// *
// */
//
//L.ExSunMap.Control.Region = L.Control.extend({
//
//    options: {
//        position: 'topleft',
//        className:'es-map-tool',
//        autoZIndex: true,
//    },
//
//    oUIInfo: {
//        'class': 'mapLocation map-t-box',
//        div: {
//            'class': 'col-md-6',
//            div: [
//                {
//                    'class': 'ui-dropdown item',
//                    style: 'cursor: default;float: left;  margin-top: 1em;',
//                    i: {'class': 'icon-pointer', html: L.ExSunMap.Control.Config.regionSwitch}
//                },
//                {
//                    'class': 'ui-dropdown item  localCenter',
//                    style: "width: 7em;text-overflow: ellipsis;line-height: 3em;float: left;",//overflow: hidden;
//                    span: {cid: 'divCenterPos', html: L.ExSunMap.Control.Config.deptName + '&nbsp;',},
//                    i: {'class': 'fa fa-angle-down'},
//                    div: {
//                        cid: 'divMapCenter',
//                        'class': 'map-loaction sub-menu',
//                        style: "display:none",
//                    }
//                }]
//        }
//    },
//
//    // 注册事件
//    initEvent: function () {
//
//    },
//
//    // 添加控件
//    onAdd: function (map) {
//        //
//        this.map = map;
//        // 容器
//        this.controlDiv = L.DomUtil.create('div', this.options.className);
//        //初始化容器
//        L.Util.initTag( this.controlDiv , this.oUIInfo);
//
//
//        return this.controlDiv;
//    },
//
//
//
//
//});

/**
 * Created by liulin on 2016/12/26.
 *
 * 负责管理整个界面的布局,如果有布局，就不用加载，直接加载地图
 *
 *
 */


L.ExSunMap.Layout = L.Evented.extend({

    options: {
        // 加载容器
        pContainer: 'ex-layout-content',
        // 加载地图图层id
        mapDivId: 'MapView',
    },

    initialize: function (oParent, options) {

        L.setOptions(this, options);
        this._oParent = oParent;


        this.pContainer = options.pContainer;
        if (typeof options.pContainer !== 'object') {
            this.pContainer = $(this.options.pContainer);
        }

        // 初始化界面
        this.initUI();

        // 添加项
        this.initOn();

    },

    // 初始化界面
    initUI: function () {

        var el = L.DomUtil.create('div','ex-layout-map-content',this.pContainer);

        L.DomUtil.create('div','ex-map-top ex-map-left ',el);
        L.DomUtil.create('div','ex-map-top ex-map-right',el);
        L.DomUtil.create('div','ex-map-bottom ex-map-left',el);
        L.DomUtil.create('div','ex-map-bottom ex-map-right',el);

        this.container = el;
        el.id= this.options.mapDivId;
    },

    initOn: function () {
        if (!this._oParent) {
            return;
        }
        this._oParent.on('MapControl:Layout.addToolItem', this.addToolItem, this);
    },

    addToolItem: function (oData) {
        //this._addToolItem(oData.cHTML);
    },

    // 添加项
    _addToolItem: function (cHTML) {
        //var $_oItem = $(cHTML);
        //this.container.append();
    },

    // 获取宽度
    getWidth: function () {
        return this.container.width();
    },

    dueWidth: function (nWidth) {
        this.container.width(this.container.width() - nWidth);
    },

    // 设置grid宽度
    setWidth: function (nWidth) {
        this.container.width(nWidth);
    },
});



/**
 * Created by liulin on 2016/12/26.
 */

L.ExSunMap.ESMapMaster =L.Evented.extend({

    options: {
        // 地图父级容器
        containerClass: 'ex-layout-content',

        // 地图divid
        mapContainerId: 'mapview',

        // 地图中心点纬度
        lat: 30.222,
        // 地图中心点经度
        lng: 113.255,

        // 飞行的最大图层
        nFlyZoom: 10,

        // 飞行的延时
        nFlyDuration: 1,

        // 允许飞行的做到图层
        nFlyMaxZoom: 15,

        // 地图飞行版本
        cFlayMapVertion: '1.0',


    },

    initialize: function (oParent, options) {
        L.setOptions(this, options);
        this._oParent = oParent;

        var aoContainer = document.getElementsByClassName(options.containerClass);
        if (!aoContainer || aoContainer.length <= 0) {
            return;
        }
        this.pContainer = aoContainer[0];
        // 初始化界面
        this.initUI();
    },

    initUI: function () {
        var el = L.DomUtil.create('div', 'ex-layout-map-content', this.pContainer);
        this.container = el;
        el.id = this.options.mapContainerId;
        L.DomUtil.create('div', 'layout-map-poi', el);
        L.DomUtil.create('div', 'layout-map-tool', el);
    },

    loadMap: function (nMapWidth, nMapHeight) {
        this.oMapMaster = new L.ExSunMap.MapMaster(this._oParent, {
            cDidId: this.options.mapContainerId,
            oMapOption: {
                zoomControl: false,
                layers: [],
                center: new L.LatLng(this.options.lat, this.options.lng),
                zoom: 10
            },
            nMapWidth: nMapWidth,
            nMapHeight: nMapHeight
        });

        this.oMapMaster.loadMapMaster();

        return this.oMapMaster;
    },

    resize: function (nW, nH) {
        this.container.style.width = nW + 'px';
        this.container.style.height = nH + 'px';
        this.oMapMaster.reflesh(nW, nH);
    },
    getMap:function () {
        return this.oMapMaster.getMap();
    },
    loadSearch: function (options) {
        this.search = new L.ExSunMap.ESMapSearch(this.oMapMaster, options);
    },

    loadToolBox: function (options) {
        this.search = new L.ExSunMap.ESMapToolBox(this.oMapMaster, options);
    },

    loadMapTile: function (options) {
        this.search = new L.ExSunMap.ESMapTile(this.oMapMaster,options);
    },

    loadMapFull: function (options) {
        this.oToolFull = new L.ExSunMap.ESMapFull(this.oMapMaster, options);
    },

    // 判断点在屏幕内
    posInSrceen: function (oLatLng) {
        if (!this.getMap()) {
            return false;
        }

        var oBound = this.getMap().getBounds();
        return oBound.contains(oLatLng);
    },

    // 移动地图 控制 在地图 leaflet.js 1.0 b版本适用
    flyTo: function (oData, options) {
        if (!this.getMap()) {
            return;
        }
        var oLatlng = null;

        if(oData instanceof  L.LatLng){
            oLatlng = oData;
        }

        if(oData.hasOwnProperty('lat') && oData.hasOwnProperty('lng')){
            oLatlng = L.latLng(oData.lat, oData.lng);
        }

        if(oData.hasOwnProperty('Lat') && oData.hasOwnProperty('Lng')){
            oLatlng = L.latLng(oData.Lat, oData.Lng);
        }

        if (L.version < this.options.cFlayMapVertion) {
            return;
        }
        // 防止地图抖动问题
        if (this.getMap().getBounds().contains(oLatlng) && this.getMap().getZoom() >= this.options.nFlyMaxZoom) {
            this.getMap().panTo(oLatlng);
            return;
        }
        if(!options)
        {
            options = {};
        }
        this.getMap().flyTo(oLatlng, options.zoom || this.options.nFlyZoom, {duration: options.duration || this.options.nFlyDuration});
        return this;
    },

    // 刷新地图
    reflesh: function () {
        if (!this.getMap()) {

            return;
        }

        this.getMap()._onResize();
        return this;
    },

    //添加功能图层查找

    //在当前图层分组中查找图层，图层是根据终端号来查找的
    findLayer: function (oGroupLayer, cId) {
        if (!oGroupLayer || oGroupLayer.getLayers().length <= 0) {
            return null;
        }

        var aoLayer = oGroupLayer.getLayers();

        for (var oLayer in aoLayer) {
            if (aoLayer[oLayer].cId === cId) {
                return aoLayer[oLayer];
            }
        }

        return null;
    },

    //在地图范围内查找图层
    findLayerInMap: function (cId) {
        if (!this.getMap()) {
            return null;
        }

        var oLayer = this.getMap()._layers;

        if (!oLayer) {
            return null;
        }
        var aoLayer = [];
        for (var cKey in oLayer) {
            if (oLayer[cKey].cId === cId) {
                aoLayer.push(oLayer[cKey]);
            }
        }
        return aoLayer;
    },


});

﻿ 
/*
name:           ESMapEdit
des:            地图图层编辑，创建图形和画图形

引用的库为 leaflet.draw-master.js 

对围栏进行编辑

*/



L.ExSunMap.ESMapEdit = L.Evented.extend({

    options: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left','ex-maptool-edit'],
        cBtnContain: '.ex-map-tool-edit',
        className: '',
        title: '图层编辑',
        penStyle: {
            stroke: true,
            color: '#0FFF05',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 3,
            opacity: 1,
            fill: true,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false

        },
    },

    hide:function (el) {
        el.style.display = 'none';
    },

    show:function (el) {
        el.style.display = 'block';
    },

    // 构造函数
    initialize: function (mapMaster, options) {
        L.extend(this.options, options);
        this.oPenStyle = this.options.penStyle;
        // 获得地图控件
        this._mapMaster = mapMaster;
        this._oMap = mapMaster.getMap();

        // 添加编辑图层
        this._oDrawLayer = L.featureGroup();
        this._oDrawLayer.addTo(this._oMap);

        // 父级容器
        //this._pContainer =document.getElementsByClassName(this.options.acParentDivClass);

        var aoTemp = document.getElementsByClassName(this.options.acParentDivClass.join(' '));
        if (aoTemp <= 0) {
            return;
        }
        this.pContainer = aoTemp[0];

        this.cFlag = 'add';

        // 设置父级容器的事件，是为了屏蔽地图的操作
        this.setParentEvent();


        // 初始化画笔
        this.initPen();

        // 初始化界面
        this.initUI();

        // 加载地图回调函数
        this.initCallBack();

        this.initOn();

    },

    // 注册监听事件
    initOn: function () {
        // 触发显示编辑按钮，并默认画
        this._oMapBase._oParent.on('ESMapEdit:showEditDraw', this.showEditAdd, this);
        this._oMapBase._oParent.on('ESMapEdit:clearLayers', this.clearLayers, this);

        // 删除围栏时要这的事情
        this._oMapBase._oParent.on('ESMapEdit:deleteFence', this.deleteFence, this);
        this._oMapBase._oParent.on('ESMapEdit:editDraw', this.editDraw, this);

    },

    // 编辑围栏数据,画围栏时要表明自己的名称
    editDraw: function (oData) {
        //画线加载时，加载图标
        this.cFlag = 'edit';
        var aX = oData.MapX.split(',');
        var aY = oData.MapY.split(',');
        if (!aX || !aY || aX.length <= 0) {
            return;
        }
        var aoLatLng = [];
        for (var i = 0; i < aX.length; i++) {
            var oLatLng = L.latLng(parseFloat(aY[i]), parseFloat(aX[i]));
            aoLatLng.push(oLatLng);
        }

        var oVehLine = L.polygon(aoLatLng, this.oPenStyle).addTo(this._oDrawLayer);

        oVehLine.cId = oData.Id;
        oVehLine.oFenceInfo = oData;


        oVehLine.bindTooltip(oData.Name).openTooltip();
        //oVehLine.oTip = oTip;
        this.fitBound();

        // 点击编辑时 控制按钮显示，显示编辑，其他隐藏
        this.$_btnPlus.hide();
        this.$_btnEdit.show();
        this.$_btnDel.show();
        this.$_btnCal.hide();
        this.$_btnSave.hide();
        this.dealEditUI();
    },

    fitBound: function () {
        if (!this._oDrawLayer) return;
        var oBound = this._oDrawLayer.getBounds();
        this._oMap.fitBounds(oBound);
    },

    // 画tip
    drawTip: function (oTemp) {
        var oOption = {
            bIsNotEdit: true,
            cName: '测试tip显示名称',
            oLatLng: {lat: 30.333, lng: 113.333},
            bNoHide: true
        };
        L.extend(oOption, oTemp);
        var oIcon = new L.DivIcon({
            html: '<div> </div>',
            className: '',
        });

        var oMarker = L.marker(oOption.oLatLng, {icon: oIcon, bIsNotEdit: oOption.bIsNotEdit});
        oMarker.cId = oOption.cId;

        //给oMarker绑定tip
        oMarker.bindLabel(oOption.cName, {noHide: oOption.bNoHide, direction: 'auto'});
        return oMarker;
    },

    deleteFence: function () {
        this._oDrawLayer.clearLayers();
        this.$_btnCal.hide();
        this.$_btnEdit.hide();
        this.dealEditUI();
    },

    clearLayers: function () {
        this._oDrawLayer.clearLayers();

        // 隐藏取消按钮
        this.$_btnCal.hide();
        this.dealEditUI();
    },

    showEditAdd: function () {
        this.cFlag = 'add';

        this.show();
        this.clearLayers();
        $(this.oOption.cBtnContain).find('.ec-icon-plus').parent().click();

    },

    // 界面处理
    dealEditUI: function () {
        var aoA = this._oContainer.getElementsByTagName('a');
        var bShow = false;
        for (var i = 0; i < aoA.length; i++) {
            if ( (aoA[i]).style.display !== 'none') {
                bShow = true;
            }
        }

        if (!bShow) {
            this.hide(this._oContainer);
        }
        else {
            this.show(this._oContainer);
        }
    },

    // 初始化画笔控件
    initPen: function () {

        // 画笔
        this.oDrawPen = {
            enabled: {shapeOptions: this.oPenStyle},
            handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
            title: L.drawLocal.draw.toolbar.buttons.polygon
        };

        // 画笔
        this.oEditPen = {
            enabled: this.oPenStyle,
            handler: new L.EditToolbar.Edit(this._oMap, {
                featureGroup: this._oDrawLayer,
                selectedPathOptions: {
                    dashArray: '10, 10',
                    fill: true,
                    fillColor: '#fe57a1',
                    fillOpacity: 0.1,
                    maintainColor: false
                },
                poly: {allowIntersection: false}
            }),
            title: L.drawLocal.edit.toolbar.buttons.edit
        };
    },

    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        //L.DomEvent.addListener(this._oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {

        var el=L.DomUtil.create('div','ex-maptool-box',this.pContainer);
        var ul =L.DomUtil.create('ul','ec-avg-sm-1 ex-map-tool-edit',el);
        this._createTool(ul);

        this.initEven();
        var cBtnContain = this.oOption.cBtnContain;

        this.hide(this.btnPlus);
        this.hide(this.btnEdit);
        this.hide(this.btnCal);
        this.hide(this.btnSave);
        this.hide(this.btnDel);
        this.dealEditUI();
    },

    
    _createTool:function (ul) {

        var li = L.DomUtil.create('li', '', ul);
        this.btnPlus   = L.DomUtil.create('a','ec-icon-plus',li);
        this.btnPlus.text('&nbsp;&nbsp;绘制')

        li = L.DomUtil.create('li', '', ul);
        this.btnEdit = L.DomUtil.create('a','ec-icon-pencil',li);
        this.btnEdit.text('&nbsp;编&nbsp;&nbsp;辑')

        li = L.DomUtil.create('li', '', ul);
        this.btnCal = L.DomUtil.create('a','ec-icon-power-off',li);
        this.btnCal.text('&nbsp;删&nbsp;&nbsp;除');

        li = L.DomUtil.create('li', '', ul);
        this.btnSave =L.DomUtil.create('a','ec-icon-save',li);
        this.btnSave.text('&nbsp;确&nbsp;&nbsp;定')

        li = L.DomUtil.create('li', '', ul);
        this.btnDel =L.DomUtil.create('a','ex-map-tool-cancel',li);
        this.btnDel.text('&nbsp;取&nbsp;&nbsp;消');
    },

    
    //初始化工具栏事件
    initEven: function () {
        var self = this;

        // 对象
        L.DomEvent.on(this.btnPlus, 'click', function () {
            self.oDrawPen.handler.enable();
            self.btnPlus.hide();
            self.btnSave.hide();
            self.btnEdit.hide();
            self.hide(this.btnPlus);
            self.hide(this.btnEdit);
            self.hide(this.btnSave);
            self.show(this.btnCal);
            self.dealEditUI();
        },this);

        // 确定修改
        L.DomEvent.on(this.btnSave, 'click', function () {
            // 触发结束编辑
            self.oEditPen.handler.save();
            self.oEditPen.handler.disable();

            // 点击确定 隐藏自身、取消、编辑
            self.hide(this.btnPlus);
            self.hide(this.btnEdit);
            self.hide(this.btnCal);
            self.hide(this.btnSave);
            self.dealEditUI();

        },this);

        // 编辑
        L.DomEvent.on(this.btnEdit, 'click', function () {

            this.hide(this.btnEdit);
            this.show(this.btnSave);
            this.show(this.btnCal);
            this.dealEditUI();
            this.oEditPen.handler.enable();
        });

        // 取消
        L.DomEvent.on(this.btnCal, 'click', function () {

            if (self.cFlag === 'add') {
                this.hide(this.btnPlus);
                this.hide(this.btnSave);
                this.hide(this.btnCal);
                this.hide(this.btnEdit);
            }

            if (self.cFlag === 'edit') {
                this.hide(this.btnPlus);
                this.hide(this.btnSave);
                this.hide(this.btnCal);
                this.show(this.btnEdit);
            }

            self.oDrawPen.handler.disable();
            // 撤销修改
            self.oEditPen.handler.revertLayers();
            self.oEditPen.handler.disable();

            self.dealEditUI();
        },this);

        // 删除
        L.DomEvent.on(this.btnDel, 'click', function () {
            this.hide(this.btnDel);
            if (self.cFlag === 'add') {
                // 全部隐藏
                this.hide(this.btnPlus);
                this.hide(this.btnSave);
                this.hide(this.btnCal);
                this.hide(this.btnEdit);
            }

            if (self.cFlag === 'edit') {
                this.hide(this.btnPlus);
                this.hide(this.btnSave);
                this.hide(this.btnCal);
                this.show(this.btnEdit);
            }

            if (self.cFlag === 'del') {

            }

            self.oDrawPen.handler.disable();
            // 撤销修改
            self.oEditPen.handler.revertLayers();
            self.oEditPen.handler.disable();

            self.dealEditUI();
        });
    },

    initCallBack: function () {
        var self = this;

        this._oMap.on('draw:created', function (e) {

            var oLayer = e.layer;

            self._oDrawLayer.addLayer(oLayer);
            var oInfo = self._getGisObj(oLayer);
            self._oMapBase._oParent.fire('FenceView:UI.addFence', oInfo);

        });

        this._oMap.on('draw:edited', function (e) {

            var aoLayer = e.layers;
            aoLayer.eachLayer(function (oLayer) {
                var oInfo = self._getGisObj(oLayer);
                self._oDrawLayer.addLayer(oLayer);
                oInfo.cId = oLayer.cId;
                oInfo.oFenceInfo = oLayer.oFenceInfo;
                self._oMapBase._oParent.fire('FenceView:UI.updateFence', oInfo);

            });
        });
    },

    // 获得所有画的model
    getDrawModeHandlers: function () {

        return [
            {
                enabled: this.options.polyline,
                handler: new L.Draw.Polyline(this._oMap, this.options.polyline),
                title: L.drawLocal.draw.toolbar.buttons.polyline
            },
            {
                enabled: {shapeOptions: this.oPenStyle},
                handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
                title: L.drawLocal.draw.toolbar.buttons.polygon
            },
            {
                enabled: this.options.rectangle,
                handler: new L.Draw.Rectangle(this._oMap, this.options.rectangle),
                title: L.drawLocal.draw.toolbar.buttons.rectangle
            },
            {
                enabled: this.options.circle,
                handler: new L.Draw.Circle(this._oMap, this.options.circle),
                title: L.drawLocal.draw.toolbar.buttons.circle
            },
            {
                enabled: this.options.marker,
                handler: new L.Draw.Marker(this._oMap, this.options.marker),
                title: L.drawLocal.draw.toolbar.buttons.marker
            }
        ];
    },

    // 获得所有的编辑model
    getEditModeHandlers: function () {

        return [
            {
                enabled: this.oPenStyle,
                handler: new L.EditToolbar.Edit(this._oMap, {
                    featureGroup: this._oDrawLayer,
                    selectedPathOptions: this.options.edit.selectedPathOptions,
                    poly: this.options.poly
                }),
                title: L.drawLocal.edit.toolbar.buttons.edit
            },
            {
                enabled: {},
                handler: new L.EditToolbar.Delete(this._oMap, {
                    featureGroup: this._oDrawLayer
                }),
                title: L.drawLocal.edit.toolbar.buttons.remove
            }
        ];
    },

    // 获得编辑对象
    _getGisObj: function (oLayer) {
        var oInfo = {};
        var oOption = oLayer.options;

        if (oLayer instanceof L.Circle) {
            //还要取一个经纬度
            //var oBound = oLayer.getBounds();
            var oLatLng = oLayer.getLatLng();
            var oLatLngTemp = L.latLng([oLatLng.lat + oLayer._getLatRadius(), oLatLng.lng]);
            oInfo = {
                aoLatLng: [oLatLng, oLatLngTemp],
                dRadius: oLayer.getRadius(),
                oOption: oOption,
                nType: this.getObjType(oLayer)
            };
        }
        else {

            oInfo = {aoLatLng: oLayer.getLatLngs(), oOption: oOption, nType: this.getObjType(oLayer)};
        }

        return oInfo;
    },

    getObjType: function (oLayer) {
        if (oLayer instanceof L.Rectangle) {
            return 3;
        }
        if (oLayer instanceof L.Polygon) {
            return 1;
        }
        if (oLayer instanceof L.Polyline) {
            return 4;
        }
        if (oLayer instanceof L.Circle) {
            return 2;
        }
        return 1;
    }

});




﻿/*
name:           MapTile.js
des:            地图全屏操作
date:           2016-06-02
author:         liulin

修改为用js加载

*/
L.ExSunMap.ESMapFull = L.Evented.extend({

    options: {
        // 加载全屏按钮容器
        cSelfDiv: 'ex-map-full',
        // 父级容器
        acParentDivClass: [
            'ex-layout-maptool',
            'ex-theme-maptool',
            'ex-map-top',
            'ex-map-right'
        ],

        cClassName: '',
        cTitle: '地图全屏',

    },


    // 构造函数
    initialize: function (mapMaster, options) {


        L.extend(this.options, options);

        // 获得地图控件
        this._mapMaster = mapMaster;
        this._oMap = mapMaster.getMap();

        //图层
        this._layers = {};
        //记录最近一次的div Z-index
        this._lastZIndex = 0;

        var aoTemp = document.getElementsByClassName(this.options.acParentDivClass.join(' '));
        if (aoTemp <= 0) {
            return;
        }
        this.pContainer = aoTemp[0];


        this.initUI();
        // 设置父级容器的事件
        this.setParentEvent();
    },


    // 设置父级容器的事件
    setParentEvent: function () {

        // 屏蔽事件
        //L.DomEvent.addListener(this.$_oPContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        this.container = L.DomUtil.create('div', 'ex-maptool-box ex-map-full', this.pContainer)
        this.container.innerHTML = '&nbsp;&nbsp;全屏';
        L.DomUtil.create('i', 'ec-icon-expand', this.container)
        this.initToolEvent();
    },

    //初始化工具栏事件
    initToolEvent: function () {
        //地图全屏按钮
        L.DomEvent.on(this.container, 'click', function () {
            if (!(this.isFullscreen)) {
                $('body').addClass('map_full');
                this.container.innerHTML = '<i class="ec-icon-compress"></i>&nbsp;&nbsp;恢复';

            } else {
                $('body').removeClass('map_full');
                this.container.innerHTML = '<i class="ec-icon-expand"></i>&nbsp;&nbsp;全屏';
            }

        }, this)

    },

});




﻿/*
name:           MapTile.js
des:           地图瓦片操作对象
date:           2016-06-02
author:         liulin

图层切换控件的编写

*/


L.ExSunMap.ESMapTile = L.Evented.extend({

    options: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['layout-map-tool'],

        cClassName: '',//ec-margin-right
        title: '图层切换',

    },

    // 构造函数
    initialize: function (mapMaster, options) {

        L.extend(this.options, options);

        // 获得地图控件
        this._mapMaster = mapMaster;
        this._oMap = mapMaster.getMap();

        //图层
        this._layers = {};

        //记录最近一次的div Z-index
        this._lastZIndex = 0;

        var aoTemp = document.getElementsByClassName(this.options.acParentDivClass.join(' '));
        if (aoTemp <= 0) {
            return;
        }
        this.pContainer = aoTemp[0];

        var aoLayer = this._mapMaster.getBaseLayers();
        // 添加图层
        for (var i in aoLayer) {
            this._addLayer(aoLayer[i], i);
        }


        this.initUI();

        // 设置父级容器的事件
        this.setParentEvent();
    },

    _addLayer: function (layer, name, overlay) {
        // 获得图层id
        var id = L.stamp(layer);

        this._layers[id] = {
            layer: layer,
            name: name,
            overlay: overlay
        };

        if (this.options.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }
    },

    // 设置父级容器的事件
    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener(this.container, 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'touchmove', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {

        this.container = L.DomUtil.create('div', '', this.pContainer);
        L.DomUtil.create('i', 'ec-icon-clone', this.container);
        this.span = L.DomUtil.create('span', '', this.container);
        this.span.innerHTML = '电子地图';
        L.DomUtil.create('i', 'ec-icon-angle-down', this.container);
        var ul = L.DomUtil.create('ul', 'ec-avg-sm-1 ec-dropdown-content', this.container);

        this.initToolEvent(ul);

    },

    //初始化工具栏事件
    initToolEvent: function (ul) {
        var self = this;

        var li = L.DomUtil.create('li', '', ul);
        var a = L.DomUtil.create('a', '', li);
        a.innerHTML = '<i class="ex-icon-maptool ex-maptool-china">&nbsp;电子地图</i>';
        L.DomEvent.on(a, 'click', function (e) {
            this.container.getElementsByTagName('span')[0].innerText = e.target.innerText;
            var cName = e.target.innerText.trim();
            self.selectLayer(cName);
        }, this);

        li = L.DomUtil.create('li', '', ul);
        a = L.DomUtil.create('a', '', li);
        a.innerHTML = '<i class="ex-icon-maptool ex-maptool-china">&nbsp;卫星图</i>';
        L.DomEvent.on(a, 'click', function (e) {
            this.container.getElementsByTagName('span')[0].innerText = e.target.innerText;
            var cName = e.target.innerText.trim();
            self.selectLayer(cName);
        }, this);

        li = L.DomUtil.create('li', '', ul);
        a = L.DomUtil.create('a', '', li);
        a.innerHTML = '<i class="ex-icon-maptool ex-maptool-china">&nbsp;灰度图</i>';
        L.DomEvent.on(a, 'click', function (e) {
            var cName = e.target.innerText.trim();
            this.container.getElementsByTagName('span')[0].innerText = e.target.innerText;
            self.selectLayer(cName);
        }, this);


        L.DomEvent.on(this.container, 'mouseover mouseout', function (e) {
            self._oMap.doubleClickZoom.disable();
            self._oMap.doubleClickZoom.enable();
        }, this);

    },

    // 选择图层
    selectLayer: function (cName) {
        if (cName === '灰度图') {
            if (this._oMap.getZoom() > 16) {
                this._oMap.setZoom(16);
            }
        }

        for (var key in this._layers) {
            var oItem = this._layers[key];
            if (oItem.name === cName && !this._oMap.hasLayer(oItem.layer)) {
                //添加图层
                this._oMap.addLayer(oItem.layer);
            }
            else if (this._oMap.hasLayer(oItem.layer) && oItem.name !== cName) {

                this._oMap.removeLayer(oItem.layer);
            }
        }
    },

});




﻿/*
name:           MapTile.js
des:           地图瓦片操作对象
date:           2016-06-02
author:         liulin

图层切换控件的编写

*/


L.ExSunMap.ESMapToolBox = L.Evented.extend({

    options: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['layout-map-tool'],

        cClassName: '',
        title: '图层切换',
    },


    // 构造函数
    initialize: function (mapMaster, options) {



        // 获得地图控件
        this._mapMaster = mapMaster;
        this._oMap = mapMaster.getMap();

        var aoTemp = document.getElementsByClassName(this.options.acParentDivClass.join(' '));
        if (aoTemp <= 0) {
            return;
        }
        this.pContainer = aoTemp[0];

        this.initUI();



        this.initMapTool();

        this.oActHandler = null;

        // 设置父级容器的事件
        this.setParentEvent();
    },

    initMapTool: function () {

        this.oScaleBig = new L.Map.ScaleBig(this._oMap);
        this.oScaleSmall = new L.Map.ScaleSmall(this._oMap);

        //地图测距查询
        this.oDistantHandler = L.ExSunMap.Measure.distMgr(this._oMap);

        //地图面积查询
        this.oAreaHandler = L.ExSunMap.Measure.areaMgr(this._oMap, {});

        //地图坐标查询
        this.oMapToolLocal = new L.ExSunMap.LocaltionSearch.Search(this._oMap);
    },

    // 设置父级容器的事件
    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener(this.container, 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'touchmove', L.DomEvent.stopPropagation);
    },

    //加载工具事件，初始化工具栏
    initUI: function () {

        //初始化界面
        this.container = L.DomUtil.create('div', '', this.pContainer);
        L.DomUtil.create('i', 'ec-icon-briefcase', this.container);
        this.span = L.DomUtil.create('span', '', this.container);
        this.span.innerHTML = '工具';
        L.DomUtil.create('i', 'ec-icon-angle-down', this.container);
        var ul = L.DomUtil.create('ul', 'ec-avg-sm-1 ec-dropdown-content', this.container);
        this.initToolEvent(ul);
    },

    //初始化工具栏事件
    initToolEvent: function (ul) {

        // 全国
        var li = L.DomUtil.create('li', '', ul);
        var a = L.DomUtil.create('a', '', li);
        a.innerHTML = '<i class="ex-icon-maptool ex-maptool-china">&nbsp;全国</i>';
        L.DomEvent.on(a, 'click', function (e) {
            var cName = e.target.innerText.trim();

            this.container.getElementsByTagName('span')[0].innerText = cName;

            if (this.oActHandler) {
                this.oActHandler.disable();
            }
            this._oMap.setView(new L.LatLng(35, 103.5), 4);

        }, this);

        li = L.DomUtil.create('li', '', ul);
        a = L.DomUtil.create('a', '', li);
        a.innerHTML = '<i class="ex-icon-maptool ex-maptool-range">&nbsp;测距</i>';
        L.DomEvent.on(a, 'click', function (e) {
            var cName = e.target.innerText.trim();

            this.container.getElementsByTagName('span')[0].innerText = cName;

            if (this.oActHandler) {
                this.oActHandler.disable();
            }
            this.oActHandler = this.oDistantHandler;
            this.oActHandler.enable();

        }, this);


        li = L.DomUtil.create('li', '', ul);
        a = L.DomUtil.create('a', '', li);
        a.innerHTML = '<i class="ex-icon-maptool ex-maptool-area">&nbsp;测面</i>';
        L.DomEvent.on(a, 'click', function (e) {
            var cName = e.target.innerText.trim();

            this.container.getElementsByTagName('span')[0].innerText = cName;

            if (this.oActHandler) {
                this.oActHandler.disable();
            }
            this.oActHandler = this.oAreaHandler;
            this.oActHandler.enable();
        }, this);

        li = L.DomUtil.create('li', '', ul);
        a = L.DomUtil.create('a', '', li);
        a.innerHTML = '<i class="ex-icon-maptool ex-maptool-scale-big">&nbsp;拉框放大</i>';
        L.DomEvent.on(a, 'click', function (e) {
            var cName = e.target.innerText.trim();

            this.container.getElementsByTagName('span')[0].innerText = cName;

            if (this.oActHandler) {
                this.oActHandler.disable();
            }
            this.oActHandler = this.oScaleBig;
            this.oActHandler.enable();
        }, this);

        li = L.DomUtil.create('li', '', ul);
        a = L.DomUtil.create('a', '', li);
        a.innerHTML = '<i class="ex-icon-maptool ex-maptool-scale-small">&nbsp;拉框缩小</i>';
        L.DomEvent.on(a, 'click', function (e) {
            var cName = e.target.innerText.trim();
            this.container.getElementsByTagName('span')[0].innerText = cName;

            if (this.oActHandler) {
                this.oActHandler.disable();
            }
            this.oActHandler = this.oScaleSmall;
            this.oActHandler.enable();
        }, this);


        li = L.DomUtil.create('li', '', ul);
        a = L.DomUtil.create('a', '', li);
        a.innerHTML = '<i class="ex-icon-maptool ex-maptool-location">&nbsp;坐标查询</i>';
        L.DomEvent.on(a, 'click', function (e) {
            var cName = e.target.innerText.trim();
            this.container.getElementsByTagName('span')[0].innerText = cName;

            if (this.oActHandler) {
                this.oActHandler.disable();
            }
            this.oActHandler = this.oMapToolLocal;
            this.oActHandler.enable();

        }, this);


    },

});






/**
 * poi查询 ， 访问的是高德地图 的 api接口
 *
 * Created by liulin on 2017/1/19.
 */




L.ExSunMap.ESMapSearch = L.Evented.extend({

    options: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['layout-map-poi'],

        className: '',
        title: '图层切换',
        // poi 查询地址
        cUrl: '/MapView/PoiSearch',

        // 具体参数含有可以查看高德MapApi
        oParam: {
            key: '',
            keywords: '',
            types: '050301',
            location: '113.22,30.333',
            city: '',
            citylimit: '',
            datatype: 'poi',
            output: 'JSON',
        },

    },


    // 构造函数
    initialize: function (mapMaster, options) {
        L.extend(this.options, options);
        // 获得地图控件
        this._mapMaster = mapMaster;
        this._oMap = mapMaster.getMap();
        //图层
        this.oLayer = L.featureGroup();
        this.oInputData = null;
        this.oLayer.addTo(this._oMap);
        var oMapContainer = this._oMap.getContainer();
        //this.oPContainer = oMapContainer.getElementsByClassName(this.options.acParentDivClass);
        var aoTemp = document.getElementsByClassName(this.options.acParentDivClass.join(' '));
        if (aoTemp <= 0) {
            return;
        }
        this.oPContainer = aoTemp[0];

        this.initUI();

        this.setParentEvent();
        // 注册事件
        this.initToolEvent();
    },


    // 设置父级容器的事件
    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener(this.container, 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.container, 'touchmove', L.DomEvent.stopPropagation);
    },

    //加载工具事件，初始化工具栏
    initUI: function () {

        //this.container = L.DomUtil.create('div', '', this.oPContainer)
        this.container = L.DomUtil.create('div', 'ec-input-group ex-maptool-search-box', this.oPContainer);

        this.input = L.DomUtil.create('input', 'ec-form-field', this.container );
        var span = L.DomUtil.create('span', 'ec-input-group-btn', this.container );
        this.ul = L.DomUtil.create('ul', 'ex-maptool-box-search-result', this.container );

        this.search = L.DomUtil.create('button', 'ec-btn ec-btn-primary ec-btn-sm search', span);
        this.clear = L.DomUtil.create('button', 'ec-btn ec-btn-default ec-btn-sm clear', span);
        this.search.innerHTML = '<span class="ec-icon-search"></span>';
        this.clear.innerHTML = '<span class="ec-icon-close"></span>';

        L.ExSunMap.hide(this.search);
    },

    //初始化工具栏事件
    initToolEvent: function () {
        var self = this;
        var bTo = false;

        L.DomEvent.on(document, 'keyup', function (e) {
            var myEvent = e || window.event;
            var keyCode = myEvent.keyCode;
            if (keyCode == 38 || keyCode == 40) {
                return;
            }
            // 判断查询结果是否为上次的查询结果
            if (self.oInputData && self.oInputData.name === this.input.value) {
                return;
            }

            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.input.value;
                var oLatLng = self._oMap.getCenter();
                var oParam = {};
                L.extend(oParam, self.options.oParam, {
                    keywords: cSearchVal,
                    location: oLatLng.lng + ',' + oLatLng.lat
                });
                L.getData(JSON.stringify(oParam) , self.options.cUrl, self.searchPoiHandler, self);
            }, 250);
        }, this);

        L.DomEvent.on(document, 'keydown', function (e) {
            // 没有显示不执行
            if (this.search.style.display === "none") {
                return;
            }
            var myEvent = e || window.event;
            var keyCode = myEvent.keyCode;

            if (keyCode === 38) {
                this.movePrev();
            } else if (keyCode === 40) {
                this.moveNext();
            }
            // 扑捉回车按钮 ， 然后定位当前的位置信息
            if (keyCode === 13) {
                var oLI = this.ul.getElementsByClassName('ec-active');
                this.localPos(oLI[0].oData);
                this.ul.innerHTML = '';
            }
        }, this);

        // 注册按钮时间
        L.DomEvent.on(this.clear, 'click', function (e) {
            this.oLayer.clearLayers();
            this.input.value = '';
        }, this);

        var oData={tips:[{cDist:'湖北省武汉市洪山区',name:'武汉站'},
            {cDist:'湖北省武汉市洪山区',name:'武汉大学'}
        ]};

        //this.searchPoiHandler(oData);
        // 查询事件
        L.DomEvent.on(this.search, 'click', function (e) {

            var cSearchVal = this.input.value;
            var oLatLng = this._oMap.getCenter();
            var oParam = {};
            L.extend(oParam, this.options.oParam, {
                keywords: cSearchVal,
                location: oLatLng.lng + ',' + oLatLng.lat
            });

            L.getData(JSON.stringify(oParam), this.options.cUrl, this.searchPoiHandler, this);
        }, this);

    },

    // 定位 当前位置,
    localPos: function (oData) {

        this.oLayer.clearLayers();

        //var oLI = this.ul.getElementsByClassName('ec-active');//.find("li.ec-active");
        //var oData = oLI.data('oData');

        var oMarker = L.marker([oData.lat, oData.lng]);
        oMarker.oData = oData;
        // 创建点
        oMarker.addTo(this.oLayer);

        this._oMap.flyTo([oData.lat, oData.lng], 16);
        // 给文本框赋值
        this.input.value = oData.name;

        this.oInputData = oData;

        this.ul.innerHTML = '';
        L.ExSunMap.hide(this.search);

    },

    getSelectIndex: function (aoLi) {
        for (var i = 0; i < aoLi.length; i++) {
            if (L.DomUtil.hasClass(aoLi[i], 'ec-active')) {
                return i;
            }
        }

        return -1;
    },

    // 光标上移动 38
    movePrev: function () {
        var aoLi = this.ul.getElementsByTagName('li');

        if (L.DomUtil.hasClass(aoLi[0], 'ec-active')) {
            this.input.focus();
            // 文本框选中
            return false;
        }
        else {
            var index = this.getSelectIndex(aoLi);
            L.DomUtil.removeClass(aoLi[index], 'ec-active');
            L.DomUtil.addClass(aoLi[index - 1], 'ec-active');
            var oData = aoLi[index - 1].oData;
            this.input.value = oData.name;
        }
    },

    // 光标下移动 40
    moveNext: function () {
        var aoLi = this.ul.getElementsByTagName('li');

        var index = this.getSelectIndex(aoLi, 'ec-active');

        if (index === -1) {
            L.DomUtil.addClass(aoLi[0], 'ec-active');

            this.input.value =aoLi[0].oData.name;

            return false;
        }

        if (index === aoLi.length - 1) {
            return false;
        }
        else {
            L.DomUtil.removeClass(aoLi[index], 'ec-active');
            L.DomUtil.addClass(aoLi[index + 1], 'ec-active');
            var oData = aoLi[index + 1].oData;
            this.input.value = oData.name;
        }
    },

    // 查询处理
    searchPoiHandler: function (oData) {
        this.ul.innerHTML = '';
        L.ExSunMap.hide(this.search);

        oData = JSON.parse(oData).detail;

        if (!oData || oData.status === 0 || oData.count <= 0) {
            return;
        }
        // 加载数据
        for (var i = 0; i < oData.tips.length; i++) {
            if (oData.tips[i].lng === 0) {
                continue;
            }
            oData.tips[i].cDist = oData.tips[i].district || '';
            var li = L.DomUtil.create('li', 'location', this.ul);
            li.innerHTML = L.Util.template(' <b>{name}</b><span>{cDist}</span> ', oData.tips[i]);
            li.oData = oData.tips[i];

            L.DomEvent.on(li, 'click', function (e) {
                this.localPos( e.currentTarget.oData);
            }, this);

            L.DomEvent.on(li, 'mouseover',  function (e) {
                L.DomUtil.addClass(e.currentTarget,'ec-active');
            }, this);

            L.DomEvent.on(li, 'mouseout',  function (e) {
                L.DomUtil.removeClass(e.currentTarget,'ec-active');
            }, this);
        }
        L.ExSunMap.show(this.search);

        L.ExSunMap.show(this.ul);
    }

});

/**
 * 聚合接口
 * Created by liulin on 2019/3/15.
 */


L.ExSunMap.VehClusterLayer = L.Evented.extend({
    //执行画点，画线操作
    options: {

        url:'',// 单车点击查询
        onDrawLayers: 'MapView:ClusterLayer.DrawLayers',
        onClearLayers: 'MapView:ClusterLayer.clearLayer',
        onRemoveLayers: 'MapView:ClusterLayer.removeLayers',

        cHtml: '<div cid="{devNo}" class="car-body" style="transform:rotate({dir}deg);-webkit-transform: rotate({dir}deg);"></div>' +
        '    <div class="pin-tip " style="display: block;">' +
        '        <div class="pin-dome">' +
        //'           <b></b><c></c><d></d>' +
        '       </div>' +
        '        <div class="pin-number">{vehNo}</div>' +
        '        <div class="pin-state">' +
        '        </div>' +
        '</div>',
    },
    oPopOption: { maxWidth: 500 ,autoPan: false},
    initialize: function (oParent, options,map) {

        L.setOptions(this, options);
        this._oMap = map;
        this._oParent = oParent;
        this._initGroup();
        this._loadOn();
    },

    // 初始化Group
    _initGroup: function () {
        var self = this;
        // 使用计划来画图
        this._oPosGroup = L.markerClusterGroup({
            // animateAddingMarkers: false,
            // showCoverageOnHover: false,
            // maxClusterRadius: function (z) {
            //     if (z <= 11) {
            //         return 1100;
            //     } else {
            //         return 100;
            //     }
            // },
            // iconCreateFunction: function (cluster) {
            //     var childCount = cluster.getChildCount();
            //     var c = ' marker-cluster-';
            //
            //     if (childCount == self.options.maxItem) {
            //         return new L.DivIcon({
            //             iconSize: [20, 20],
            //             html: '<div class="ex-monitor-mapicon-site alert">' +
            //             '           <div class="pin-tip" style="display: block;">' +
            //             '               <div class="areaCount-number">' + self.options.areaName + '</div>' +
            //             '           </div>' +
            //             '           <div class="site-body areaCount">' + childCount +
            //             '           </div>' +
            //             '       </div>'
            //         });
            //     } else {
            //         if (childCount < 10) {
            //             c += 'small';
            //             return new L.DivIcon({
            //                 html: '<div><span>' + childCount + '</span></div>',
            //                 className: 'marker-cluster' + c,
            //                 iconSize: new L.Point(40, 40)
            //             });
            //         } else if (childCount < 100) {
            //             c += 'medium';
            //             return new L.DivIcon({
            //                 html: '<div><span>' + childCount + '</span></div>',
            //                 className: 'marker-cluster' + c,
            //                 iconSize: new L.Point(40, 40)
            //             });
            //         } else if (childCount >= 100 && childCount < self.options.maxItem) {
            //             c += 'large';
            //             return new L.DivIcon({
            //                 html: '<div><span>' + childCount + '</span></div>',
            //                 className: 'marker-cluster' + c,
            //                 iconSize: new L.Point(40, 40)
            //             });
            //         }
            //     }
            // }
        });
        this._oMap.addLayer(this._oPosGroup);
    },

    //初始化时加载数据
    _loadOn: function () {
        var self =this;
        // 画所有的工地数据
        this._oParent.$on(this.options.onDrawLayers, this.drawLayers, this);
        this._oParent.$on(this.options.onClearLayers, this.clearLayer, this);
        this._oParent.$on(this.options.onRemoveLayers, this.removeLayers, this);


        // 去除重复车辆
        this._oParent.$on("MapView:ClusterLayer.removeLayer", this.removeLayer, this);

        // 添加数据
        this._oParent.$on("MapView:MapLive.addMarker",function (oData) {
            self.drawLayer(oData.oGpsInfo);
        },this);
    },

    removeLayer:function (oData) {
        if (!this._oPosGroup || !oData || !oData.oGpsInfo) {
            return;
        }
        this._removeLayer(oData.oGpsInfo);
    },

    removeLayers: function (oData) {
        if (!this._oPosGroup || !oData || oData.acId.length <= 0) {
            return;
        }
        var aoInfo = oData.acId;
        for (var i = 0; i < aoInfo.length; i++) {
            var nId = -parseInt(aoInfo[i]);
            this._removeLayer(nId);
        }
    },

    _removeLayer: function (oGpsInfo) {

        // var aoLayer = $.grep(this._oPosGroup.getLayers(), function (oLayer) {
        //     if (oLayer.cId === oGpsInfo.devNo) {
        //         return true;
        //     }
        // });
        // if (!aoLayer || aoLayer.length <= 0) {
        //     return;
        // }
        // for (var i = 0; i < aoLayer.length; i++) {
        //     this._oPosGroup.removeLayer(aoLayer[i]);
        // }
    },

    clearLayer: function () {
        this._oPosGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {

        if (!oData || !oData.aoData  || oData.aoData.length <= 0) {
            return;
        }
        //var aoLatLng = [];
        for (var i = 0; i < oData.aoData.length; i++) {

            //oData.aoData[i].latLng = oData.aoData[i].latLng;
            this.drawLayer(oData.aoData[i]);
            //aoLatLng.push(oData.aoData[i].latLng);
        }
    },

    drawLayer: function (oGpsInfo) {
        if (!oGpsInfo || !oGpsInfo.latLng) {
            return;
        }
        var oLayer = L.ExSunMap.findLayer(this._oPosGroup, oGpsInfo.devNo);
        if (oLayer) {
            if (!this._oMap.hasLayer(oLayer)) {
                this._oMap.addLayer(oLayer);
            }
            oLayer.setLatLng(oGpsInfo.latLng);
            return;
        }
        var cCls = this.getTruckCls(oGpsInfo);


        var oIcon = this._getIcon(cCls, L.Util.template(this.options.cHtml, oGpsInfo));
        var oMarker = L.marker(oGpsInfo.latLng, {icon: oIcon}).addTo(this._oPosGroup);
        oMarker.oGpsInfo = oGpsInfo;
        oMarker.cId = oGpsInfo.devNo;

        // 绑定弹出层
        this.initEventForMarker(oMarker);

    },

    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        var self = this;
        if (!oMarker) {
            return;
        }
        var oParam = {
            "devNos": [oMarker.oGpsInfo.devNo]
        }
        oMarker.on('click', function () {
            var that = this

            L.getData(JSON.stringify(oParam), self.options.url, function (oData) {
                var oTemp1 = JSON.parse(oData)
                if (oTemp1.code !== '0') {
                    return
                }
                var oTemp = oTemp1.detail

                if (!oTemp || oTemp.length <= 0) {
                    return
                }

                oTemp[0].trackBtn ='跟踪';
                var cHtml = L.ExSunMap.initPopHtml(oTemp[0]);

                that.bindPopup(cHtml, self.oPopOption);
                var oPopup = that.getPopup();
                oPopup.oGpsInfo = oTemp[0];

                L.ExSunMap.initPopEven(oPopup,self._oParent);
                self.initPopEven(oPopup);
                that.openPopup();
            }, self);
        });
    },

    initPopEven: function (oPopup) {
        var self = this;
        if (!oPopup) return;
        oPopup.self = this;
        oPopup.on("contentupdate", function () {

            // 车辆详情按钮
            var el = document.getElementsByClassName('veh-detail')[0];
            L.DomEvent.on(el, 'click', function () {
                //self._oParent.fire("MapView:VehDetail.showDetail",{oGpsInfo:oGpsInfo});
            }, this);

            el = document.getElementsByClassName('veh-history')[0];
            L.DomEvent.on(el, 'click', function () {
                // 单独的页面打开
                //window.open("http://ztc.comlbs.com/MapView/TrackView?PhoneNum=" + this.oGpsInfo.devNo + "&VehicleNo=" + this.oGpsInfo.vehNo);
                self._oParent.$emit('history',this.oGpsInfo);
            }, this);

            el = document.getElementsByClassName('veh-track')[0];
            L.DomEvent.on(el, 'click', function () {
                //self._oParent.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});
            }, this);

            el = document.getElementsByClassName('veh-attend')[0];
            L.DomEvent.on(el, 'click', function () {
                //self._oParent.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});
            }, this);

            // 监控
            el = document.getElementsByClassName('veh-monitor')[0];
            L.DomEvent.on(el, 'click', function () {
                self._oParent.$emit('monitor',   this.oGpsInfo);
            }, this);

            el = document.getElementsByClassName('veh-send')[0];
            L.DomEvent.on(el, 'click', function () {
                //self._oParent.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});
            }, this);
            el = document.getElementsByClassName('veh-video')[0];
            L.DomEvent.on(el, 'click', function () {
                //self._oParent.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});
            }, this);

            // 指令下方设置
            el = document.getElementsByClassName('send-call-name')[0];
            L.DomEvent.on(el, 'click', function () {
                self._oParent.$emit('send-call-name',this.oGpsInfo);
            }, this);

            el = document.getElementsByClassName('send-camera')[0];
            L.DomEvent.on(el, 'click', function () {
                self._oParent.$emit('send-camera',this.oGpsInfo);
            }, this);

            el = document.getElementsByClassName('send-text')[0];
            L.DomEvent.on(el, 'click', function () {
                self._oParent.$emit('send-text',this.oGpsInfo);
            }, this);

            el = document.getElementsByClassName('send-monitor')[0];
            L.DomEvent.on(el, 'click', function () {
                self._oParent.$emit('send-monitor',this.oGpsInfo);
            }, this);

            el = document.getElementsByClassName('send-config')[0];
            L.DomEvent.on(el, 'click', function () {
                self._oParent.$emit('send-config',this.oGpsInfo);
            }, this);

        }, oPopup);
    },

    // 画点
    _getIcon: function (cCls,cHtml) {
        var oIcon = L.divIcon({
            iconSize: [30, 40], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: cCls,
            html: cHtml,
        });
        return oIcon;
    },

    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getTruckCls: function (oData) {

        var cClsType = 'ex-monitor-mapicon-truck';
        var cClsStatus = 'green';

        if (oData.sta == '1' || oData.sta == '2') {
            cClsStatus = 'green';
        }
        else if (oData.sta == '3') {
            cClsStatus = 'green';
        }
        else if (oData.sta == '4') {
            cClsStatus = 'yellow';
        }
        else  {
            cClsStatus = 'gray';
        }
        return cClsType+' '+ cClsStatus;
    },


});

/**
 * 用于管理实时监控点信息
 *
 * Created by liulin on 2019/03/16.
 */

L.ExSunMap.LiveMange = L.Evented.extend({

    options:{
        nMonitorCnt:1

    },

    // 车辆列表构造函数
    initialize: function (oParent, options,map) {
        L.setOptions(this, options);
        this._oParent = oParent;
        this.map = map;
        this.initOn();

    },

    // 缓存车辆数据
    aoLivePos:[],

    // 监听当前事件
    initOn: function () {

        var self = this;

        this._oParent.$on("MapView:LiveMange.addLivePos", this.addLivePos, this);
        this._oParent.$on("MapView:LiveMange.addLive", this.addLive, this);

        //this._oParent.on("MapView:LiveMange.removeLive", this.removeLive, this);
        //this._oParent.on("MapView:LiveMange.removePos", this.removePos, this);
        //this._oParent.on("MapView:LiveMange.removeAll", this.removeAll, this);

        // hub 推送GPS数据 监听接口
        this._oParent.$on("ws:gps", function (oTemp) {
            var aoGpsInfo =oTemp.aoGpsInfo;
            // 监听轨迹数据
            if (!aoGpsInfo || aoGpsInfo.length <= 0) return;

            for(var i =0;i< aoGpsInfo.length;i++)
            {
                var oGpsInfo = aoGpsInfo[i];
                var nIndex = L.ExSunMap.arrayIndex(this.aoLivePos, oGpsInfo, "devNo");
                if (nIndex < 0) {
                    console.log("不用添加监视,不存在跟踪设备：" + oGpsInfo.devNo + ";车牌号" + oGpsInfo.vehNo);
                    //return;
                }
                if(oGpsInfo.vehNo === undefined){
                    oGpsInfo.vehNo = self.aoLivePos[0].options.vehNo;
                }
                //oGpsInfo.weight=oGpsInfo.weight === undefined? 0 : oGpsInfo.weight;
                oGpsInfo.bOpenBubble = true;

                if(!self.aoLivePos || self.aoLivePos.length<=0){
                    console.log('没有跟踪对象！');
                    return
                }

                self.aoLivePos[0].drawLiveTrack({ oGpsInfo: oGpsInfo });
            }
        }, this);
    },

    // 添加监视
    addLive: function (oTemp) {
        var aoGpsInfo = oTemp.oData;
        for (var i = 0; i < aoGpsInfo.length; i++) {
            this.addLivePos({oGpsInfo:aoGpsInfo[i]});
        }
    },

    // 移除监视
    removeLive: function (oData) {
        var acId = oData.acId
        for (var i = 0; i < acId.length; i++) {
            this.removePos({oGpsInfo: {PhoneNum: acId[i]}});
        }
    },



    // 是一个数组，分发数据到包,
    // setGpsInfo: function (oTemp) {
    //     var aoGpsInfo =oTemp.aoGpsInfo;
    //     // 监听轨迹数据
    //     if (!aoGpsInfo || aoGpsInfo.length <= 0) return;
    //
    //     var self = this;
    //
    //     for(var i =0;i< aoGpsInfo.length;i++)
    //     {
    //         var oGpsInfo = aoGpsInfo[i];
    //         var nIndex = L.ExSunMap.arrayIndex(this.aoLivePos, oGpsInfo, "devNo");
    //         if (nIndex < 0) {
    //             console.log("不用添加监视,不存在跟踪设备：" + oGpsInfo.devNo + ";车牌号" + oGpsInfo.vehNo);
    //             //return;
    //         }
    //         if(oGpsInfo.vehNo === undefined){
    //             oGpsInfo.vehNo = self.aoLivePos[0].options.vehNo;
    //         }
    //         //oGpsInfo.weight=oGpsInfo.weight === undefined? 0 : oGpsInfo.weight;
    //         oGpsInfo.bOpenBubble = true;
    //         if(!self.aoLivePos || self.aoLivePos.length<=0){
    //             console.log('没有跟踪对象！');
    //             return
    //         }
    //         self.aoLivePos[0].drawLiveTrack({ oGpsInfo: oGpsInfo });
    //     }
    //
    //
    // },

    // 添加实时跟踪 marker ,
    addLivePos: function (oData) {
        if (!oData || !oData.oGpsInfo){
            return;
        }


        var oGpsInfo = oData.oGpsInfo;
        if (L.ExSunMap.arrayIndex(this.aoLivePos, oData.oGpsInfo, "devNo")>=0) {
            console.log("地图实时跟踪中存在已经跟踪的设备号" + oGpsInfo.devNo + ";车牌号" + (oGpsInfo.devNo||'' )+ "！");
            return;
        }

        // 要判断是否超出了监控设备个数，如果是，要移除最后一个元素
        if (this.aoLivePos.length >=  this.options.nMonitorCnt) {
            var oMapLiveTemp = this.aoLivePos.pop();
            this.removeMonitor(oMapLiveTemp);
        }

        var oMapLive = new L.ExSunMap.MapLive(this._oParent,oData.oGpsInfo,this.map);
        this.aoLivePos.push(oMapLive);
        oData.oGpsInfo.bOpenBubble = true;
        oMapLive.drawLiveTrack(oData);
    },

    // 移除监控
    removeMonitor: function (oMapLive) {
        if (!oMapLive) return;
        oMapLive.offEven();
        oMapLive.clearLiveTrack();
    },

    // 设备号 为唯一的判断
    removePos: function (oData) {
        if (!oData || !oData.oGpsInfo || !oData.oGpsInfo.hasOwnProperty("devNo")){
            return;
        }


        var nIndex = L.ExSunMap.arrayIndex(this.aoLivePos, oData.oGpsInfo, "devNo");
        if (nIndex === -1) {
            //console.log("地图实时跟踪中不存在设备号" + oGpsInfo.PhoneNum + ";车牌号" + oGpsInfo.VehicleNo + "！");
            return;
        }
        var oMapLive = this.aoLivePos[nIndex];
        if (!oMapLive) {
            return;
        }
        this.removeMonitor(oMapLive);
        this.aoLivePos.splice(nIndex, 1);
    },

    //删除所有的订阅车辆记录
    removeAll: function () {
        if (!this.aoLivePos || this.aoLivePos.length <= 0) {
            return;
        }
        var aoGpsInfo = []
        for (var i = 0; i < this.aoLivePos.length; i++) {
            this.aoLivePos[i].offEven();
            this.aoLivePos[i].clearLiveTrack();
            aoGpsInfo.push(this.aoLivePos[i].options);
        }

        // 取消订阅
        this._oParent.$emit('HubSvr:batchUnsubGps', {aoGpsInfo: aoGpsInfo});

        // 删除所有元素
        this.aoLivePos.splice(0,this.aoLivePos.length);
    },

});


/**
 * 实时监控点
 *
 * Created by liulin on 2019/3/16.
 */
L.ExSunMap.MapLive = L.Evented.extend({

    /*
     为构造函数
     @oParent 为父级页面对象
     @oOption 为参数，设置当前的参数
     */
    initialize: function (oParent, options,oMap) {

        this._oParent = oParent;
        L.setOptions(this,options);

        this.devNo = options.devNo || "-1";
        this.cId = null;
        this._oMap = oMap;

        // 添加图层
        this._loadLayerGroup();

        this._initOn();
    },

    setOption: function(oGpsInfo) {
        if(oGpsInfo.hasOwnProperty('vehNo')){
            delete  oGpsInfo.vehNo;
        }

        return L.extend(this.options, oGpsInfo);
    },

    // 收到点击详情详情时设置的参数
    setFristGps:function(oGpsInfo) {
        this.oFristGps = oGpsInfo;
    },

    // 初始化监听事件
    _initOn: function () {

        this._oMap.on("moveend", this._mapMoveHandler, this);

        // 画实时点
        this._oParent.$on("MV:Real.drawLiveTrack", this.drawLiveTrack, this);

        // 判断是否显示弹出层
        this._oParent.$on("MV:Real.showVecMarkerPop", this._showVecMarkerPop, this);

        // 放大实时监控点
        this._oParent.$on("MV:Real.setLiveZoomIn", this.setLiveZoomIn, this);

        // 清除实时跟踪的点、历史点、轨迹线
        this._oParent.$on("MV:Real.clearLiveTrack", this.clearLiveTrack, this);

        this._oParent.$on("MapView:MapLive.setZoomIn", this.setZoomIn, this);

    },

    // 实现地图放大
    setZoomIn:function(oData) {
        if (!oData || !oData.oGpsInfo) {
            return;
        }

        var oGpsInfo = oData.oGpsInfo;

        var oLayer = L.ExSunMap.findLayer(this._oLivePosGroup, oGpsInfo.devNo);
        if (!oLayer) {
            return;
        }
        var oLatLng = oLayer.getLatLng();
        this._oMap.flyTo(oLatLng, 16);

        // 打开popup层显示车辆数据
        oLayer.openPopup();
    },

    // 关闭事件
    offEven: function () {
        this._oMap.off("moveend", this._mapMoveHandler, this);

        // 画实时点
        this._oParent.$off("ws:gps", this.drawLiveTrack, this);

        //解决聚合和实时同时存在问题
        this._oParent.$off("MV:Real.unVisibleMarker");

        // 判断是否显示弹出层
        this._oParent.$off("MV:Real.showVecMarkerPop", this._showVecMarkerPop, this);

        // 放大实时监控点
        this._oParent.$off("MV:Real.setLiveZoomIn", this.setLiveZoomIn, this);

        // 清楚实时跟踪的点、历史点、轨迹线
        this._oParent.$off("MV:Real.clearLiveTrack", this.clearLiveTrack, this);
    },

    //添加实时跟踪状态数据
    _loadLayerGroup: function () {

        //线路
        this._oLineGroup = L.featureGroup();
        this._oMap.addLayer(this._oLineGroup);

        //轨迹点
        this._oTrackGroup = L.featureGroup();
        this._oMap.addLayer(this._oTrackGroup);

        //实时跟踪点
        this._oLivePosGroup = L.featureGroup();
        this._oMap.addLayer(this._oLivePosGroup);
    },

    //判断弹出层是否应该弹出，如果地图为当前获得页，就弹出层，否则不弹出
    //对地图进行了放大缩小操作
    _showVecMarkerPop: function (oData) {
        if (!this._oLivePosGroup) return;


        var oGpsInfo = oData.oGpsInfo;
        this._oLivePosGroup.eachLayer(function (oLayer) {
            if (oGpsInfo.devNo != oLayer.cId) {
                oLayer.closePopup();
                return;
            }

            this._oMap.setView(oLayer.getLatLng(), 17);
            oGpsInfo.bOpenBubble ? oLayer.openPopup() : oLayer.closePopup();

        }, this);
    },

    //修改弹出层样式错误，
    _updateVecMarkerPop: function (oLivePosLayer, cHtml) {
        if (!oLivePosLayer) return;
        oLivePosLayer.setPopupContent(cHtml);
    },

    //画布,实时跟踪绘制，如线，轨迹点等，oPosInfo，为当前点信息
    _drawLiveHis: function ( ) {
        var oGpsInfo =  this.oGpsInfo;

        var oPrePosInfo = null;
        var oLineLayer = L.ExSunMap.findLayer(this._oLineGroup, oGpsInfo.devNo);
        var latlng = L.latLng(oGpsInfo.latLng.lat, oGpsInfo.latLng.lng);
        oGpsInfo.oLatLng = latlng;
        if (!oLineLayer) {
            //创建线图层
            var oPloyLine = L.polyline([oGpsInfo.oLatLng], L.ExSunMap.liveLineConfig);
            oPloyLine.cId = oGpsInfo.devNo;
            oPloyLine.oPrePosInfo = oGpsInfo;
            oPloyLine.addTo(this._oLineGroup);
        }
        else {
            oPrePosInfo = oLineLayer.oPrePosInfo;
            oLineLayer.oPrePosInfo = oGpsInfo;
            oLineLayer.addLatLng(oGpsInfo.oLatLng);
        }

        //创建轨迹图层
        if (oPrePosInfo) {
            var oTrackLayer = L.circleMarker(oPrePosInfo.oLatLng, L.ExSunMap.oLiveCircleMarkerConfig);

            oTrackLayer.addTo(this._oTrackGroup);
            oTrackLayer.oGpsInfo = oGpsInfo;
            // 设置对象的弹出层
            this.initPopup(oTrackLayer);


            L.ExSunMap.initPopEven(oTrackLayer.getPopup(),this._oParent);

            oGpsInfo.bOpenBubble ? oTrackLayer.openPopup() : oTrackLayer.closePopup();
        }
    },

    // 创建实时跟踪点
    _createLive: function (oGpsInfo) {

        var oLatLng = oGpsInfo.latLng;
        var oLayer = L.Marker.movingMarker([oLatLng], [], {
            icon: this._getPosIconInfo(oGpsInfo, {nWidth: 30, nHeight: 40, nInitDir: 180})
        });
        oLayer.cId = oGpsInfo.devNo;
        oLayer.oData = oGpsInfo;
        return oLayer;
    },

    // 在地图上绘制实时跟踪的点
    _drawLive: function () {
        if (!this._oLivePosGroup) {
            return;
        }
        var  oGpsInfo = this.oGpsInfo;
        var oLayer = L.ExSunMap.findLayer(this._oLivePosGroup, oGpsInfo.devNo);
        if (!oLayer) {
            this.clearLiveTrackFrom(oGpsInfo);
            oLayer = this._createLive(oGpsInfo);
            oLayer.addTo(this._oLivePosGroup);
            oLayer.oGpsInfo = oGpsInfo;
            this.initPopup(oLayer);

            L.ExSunMap.initPopEven(oLayer.getPopup(),this._oParent);

            oGpsInfo.bOpenBubble ? oLayer.openPopup() : oLayer.closePopup();
            this.oLayer = oLayer;
            var latlng = oLayer.getLatLng();
            this._oMap.flyTo(latlng, 16);
        }
        else {
            oLayer.moveTo(oGpsInfo.latLng,5000);
            if (oLayer.oCircle) {
                oLayer.oCircle.setLatLng(oGpsInfo.latLng);
            }
            oLayer.oGpsInfo = oGpsInfo;
            this.initPopup(oLayer);
        }
        this._setHeading(oGpsInfo, 180);

        oLayer._bringToFront();

        return oLayer;
    },


    // 地图监控移动设置
    _mapMoveHandler: function () {
        if (!this._oLivePosGroup) {
            return;
        }
        this._oLivePosGroup.eachLayer(function (oLayer) {
            if (!oLayer._bringToFront) return;
            oLayer._bringToFront();

        }, this);
    },

    // 清除实时跟踪的点，给其他图层添加点
    clearLiveTrack: function () {
        this._oLivePosGroup.clearLayers();
        this._oLineGroup.clearLayers();
        this._oTrackGroup.clearLayers();

        //在图层上添加车辆图表
        this._oParent.$emit("MapView:MapLive.addMarker", {oGpsInfo:this.options});
    },

    // 清除实时跟踪的对象，为自己
    clearLiveTrackFrom: function (oGpsInfo) {
        this._oLivePosGroup.clearLayers();
        this._oLineGroup.clearLayers();
        this._oTrackGroup.clearLayers();

        this._oParent.$emit("MapView:ClusterLayer.removeLayer", {oGpsInfo:oGpsInfo});
    },

    // 画实时跟踪轨迹数据
    drawLiveTrack: function (oData) {

        if (!oData.oGpsInfo.latLng) {
            return;
        }
        // 数据缓存到 this.oGpsInfo
        this.oGpsInfo = oData.oGpsInfo;

        this._drawLiveHis();
        this._drawLive();
    },

    // 放大地图,放大
    setLiveZoomIn: function () {

        var aoLayer = this._oLivePosGroup.getLayers();
        if (!aoLayer || aoLayer.length <= 0) {
            return;
        }
        if (!aoLayer[0].getLatLng) {
            return;
        }

        var oLatLng = aoLayer[0].getLatLng();

        var nMaxZoom = this._oMap.getMaxZoom();

        this._oMap.setView(oLatLng, nMaxZoom - 1);

    },

});


// 车辆实时跟踪的基本操作
L.ExSunMap.MapLive.include({
    // 设置弹出层的位置
    oPopOption: { maxWidth: 500 ,autoPan: false},
    // 获得实时跟踪点, 地图统计点数据
    _getPosIconInfo: function (oItem, oOption) {
        oItem.nDir = oItem.dir + oOption.nInitDir;
        return new L.DivIcon({
            html: L.Util.template(this._getIconHtml(), oItem),
            className: this.getLeightOnCls(oItem),
            iconSize: L.point(30, 40),
            iconAnchor: [10, 20],
            popupAnchor: L.point(-1, -20),
        });
    },

    _getIconHtml: function () {
        var cHtml =
            '<div cid="{devNo}" class="car-body" style="transform:rotateZ({nDir}deg);-webkit-transform: rotate({nDir}deg);"></div>' +
            '    <div class="pin-tip " style="display: block;">' +
            '        <div class="pin-dome"><b></b><c></c><d></d></div>' +
            '        <div class="pin-number">{vehNo}</div>' +
            '        <div class="pin-state">' +
            '        </div>' +
            '</div>';

        return cHtml;
    },

    // 设置车辆的角度
    _setHeading: function (oPosInfo, nInitDir) {
        if (!oPosInfo) {
            return;
        }
        if (!nInitDir) {
            nInitDir = 0;
        }
        oPosInfo.nDir = oPosInfo.dir + nInitDir;

        var vehEl = document.querySelectorAll('[cId="' + oPosInfo.devNo + '"]');
        if(!vehEl || vehEl.length<=0){
            return;
        }
        vehEl[0].style.transform = 'rotate({'+oPosInfo.nDir +'}deg)';//('transform')
        vehEl[0].style.webkitTransform = 'rotate({'+oPosInfo.nDir +'}deg)';

    },

    //根据告警类型，生成告警样式
    alarmToCls: function (oGpsInfo) {
        // 获得车辆的样式 和 车辆告警样式
        var oClass = { cAlarm: "" };
        oGpsInfo.cClsLight = "green";
        // 车灯要修改
        if (!oGpsInfo) return oClass;


        if (oGpsInfo.Speed > 60) {
            oClass.cAlarm = "car-state speed";
        }
        return oClass;
    },

});

// 弹出层的事件操作
L.ExSunMap.MapLive.include({



    initPopup: function (oLayer) {

        oLayer.oGpsInfo.trackBtn = '取消跟踪';
        if(oLayer.oGpsInfo.attention){
            oLayer.oGpsInfo.attentionBtn = '取消关注';
        }else{
            oLayer.oGpsInfo.attentionBtn = '关注';
        }
        var cHtml = L.ExSunMap.initPopHtml(oLayer.oGpsInfo);

        //更新弹出层的信息,修改的目的是防止注册2次点击事件
        var oPopup = oLayer.getPopup();
        if (!oPopup) {
            oPopup = oLayer.bindPopup(cHtml, this.oPopOption).getPopup();
        }
        // 在次注册事件
        oPopup.oGpsInfo = oLayer.oGpsInfo;
        oPopup.setContent(cHtml);

        return oPopup;
    },


    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getLeightOnCls: function (oData) {

        var cClsType = 'ex-monitor-mapicon-truck';
        var cClsStatus = 'gray';
        if (oData.carType == 0) {
            cClsType = 'ex-monitor-mapicon-tram';
        }

        if (oData.sta == 1 || oData.sta == 2 || oData.sta == 3) {
            cClsStatus = 'green';
        }

        else if (oData.sta == 4) {
            cClsStatus = 'yellow';
        } else if (oData.sta == 5) {
            cClsStatus = 'gray';
        }

        return cClsType + ' ' + cClsStatus;
    },
});


/**
 * websocket 服务
 *
 * Created by liulin on 2019/3/16.
 *
 * 订阅思想：
 * 增加了断开重新连接，重新连接时，车辆重新订阅
 * 如果是取消订阅，就要注销重新连接
 */

L.WebSocketSvr = L.Class.extend({
    options: {
        // hub 服务地址
        url: '',
        // 超时时长
        nTimeOut: 10000,

        // hub 服务名称
        cSvrName:'GpsHub',

        // 推送服务
        aoClientName:[],//[{cSvrFn:'sendAlarm',on:'ReceiveHGTAlarm'}],
    },

    // 车辆列表构造函数
    initialize: function (oParent, options) {
        L.setOptions(this, options);
        this._oParent = oParent;
        this.afnCallBack = [];
        //this.initSvr();
        // 启动hub服务
        this.start();

        // 开启监听
        this.initOn();

        this.onReceive();
    },

    initSvr: function () {
        var ws = null;
        try {
            ws = new WebSocket(this.options.url);
        }
        catch (e) {

        }
        if (!ws) {
            console.log('webSocket为空！');
            return;
        }
        this.ws = ws;
    },

    //开启hub监听，开启之后 在内存中 读取订阅数据，重新订阅
    start: function () {
        this.initSvr();

        try {
            this.ws.onopen=function() {
                console.log('webSocket已打开');
            };
        }
        catch (e) {

        }

    },

    //停止hub监听
    stop: function () {
        // 关闭连接
        this.ws.close();
    },

    // 取消开始订阅
    removeCallBack: function (fnCall, oGpsInfo) {
        if (!this.afnCallBack || this.afnCallBack.length <= 0) {
            return;
        }

        for (var i = this.afnCallBack.length - 1; i >= 0; i--) {
            var oTemp = this.afnCallBack[i];
            if (oTemp.fn === fnCall && oTemp.PhoneNum === oGpsInfo.PhoneNum) {
                // 删除
                this.afnCallBack.splice(i, 1);
            }
        }
    },

    initOn: function () {

        // 订阅车辆gps
        this._oParent.$on('HubSvr.subGps',this.subGps,this);

        //unSubAlarm
        //this._oParent.on('HubSvr:unSubAlarm', this.unSubAlarm, this);
        // 订阅告警
        //this._oParent.on('HubSvr:subAlarm', this.subAlarm, this);
        // 取消订阅车辆gps
        //this._oParent.on('HubSvr.unsubGps',this.unsubGpsByLstGpsInfo,this);

    },

    // 订阅车辆gps数据
    subGps:function (data) {
        data.type = '0';
        data.status = '1'
        console.log(JSON.stringify(data));
        this.ws.send(JSON.stringify(data));


    },

    // 取消订阅接口
    unsubGps:function (data) {
        data.type = '0'
        data.status = '0'
        this.ws.send(JSON.stringify(data));
    },

    // 接收数据
    onReceive:function () {
        var self =this;
        this.ws.onmessage = function(msg) {
            var temp = JSON.parse(msg.data);
            if(!temp.data || temp.data.length<=0)
            {
                return;
            }

            // 数据转化
            // bOpenBubble: true
            // dayHour: "3.21373E8"
            // dayMile: "495.89999999999964"
            // deptName: "房县恒达出租汽车有限公司"
            // devNo: "013068339618"
            // dir: 1
            // id: 25287
            // latLng: {lat: 32.05655, lng: 110.7267}
            // speed: "0"
            // sta: 2
            // sumMile: "11426.8"
            // time: "2019-03-22 16:31:54"
            // vehNo: "鄂CT7691"
            // vehPCor: "蓝色"



            //temp.data.dayHour = temp.data.dayHour
            self._oParent.$emit('ws:gps',{aoGpsInfo:temp.data});
        };
    },




});

/**
 * Created by liulin on 2019/3/20.
 */
L.ExSunMap.LocationLayer = L.Evented.extend({

    //执行画点，画线操作
    options: {

        url:'',// 单车点击查询
        onDrawLayers: 'MapView:ClusterLayer.DrawLayers',
        onClearLayers: 'MapView:ClusterLayer.clearLayer',
        onRemoveLayers: 'MapView:ClusterLayer.removeLayers',

        cHtml: '<div cid="{devNo}" class="car-body" style="transform:rotate({dir}deg);-webkit-transform: rotate({dir}deg);"></div>' +
        '    <div class="pin-tip " style="display: block;">' +
        '        <div class="pin-dome">' +
        //'           <b></b><c></c><d></d>' +
        '        </div>' +
        '        <div class="pin-number">{vehNo}</div>' +
        '        <div class="pin-state">' +
        '        </div>' +
        '</div>',
    },
    oPopOption: { maxWidth: 500 ,autoPan: false},

    initialize: function (oParent, options,map) {

        L.setOptions(this, options);
        this._oMap = map;
        this._oParent = oParent;
        this._initGroup();
        this._loadOn();
    },

    // 初始化Group
    _initGroup: function () {
        var self = this;
        // 使用计划来画图
        this._oPosGroup = L.featureGroup();
        this._oMap.addLayer(this._oPosGroup);
    },

    //初始化时加载数据
    _loadOn: function () {
        // 画所有的工地数据
        this._oParent.$on(this.options.onDrawLayers, this.drawLayers, this);
        this._oParent.$on(this.options.onClearLayers, this.clearLayer, this);
        this._oParent.$on(this.options.onRemoveLayers, this.removeLayers, this);

        // // 去除重复车辆
        // this._oParent.on("MapView:ClusterLayer.removeLayer", this.removeLayer, this);
        // // 添加数据
        // this._oParent.on("MapView:MapLive.addMarker",function (oData) {
        //     this.drawLayer(oData.oGpsInfo);
        // },this);

    },
    removeLayer:function (oData) {
        if (!this._oPosGroup || !oData || !oData.oGpsInfo) {
            return;
        }
        this._removeLayer(oData.oGpsInfo);
    },

    removeLayers: function (oData) {
        if (!this._oPosGroup || !oData || oData.acId.length <= 0) {
            return;
        }
        var aoInfo = oData.acId;
        for (var i = 0; i < aoInfo.length; i++) {
            var nId = -parseInt(aoInfo[i]);
            this._removeLayer(nId);
        }
    },

    _removeLayer: function (oGpsInfo) {

        // var aoLayer = $.grep(this._oPosGroup.getLayers(), function (oLayer) {
        //     if (oLayer.cId === oGpsInfo.devNo) {
        //         return true;
        //     }
        // });
        // if (!aoLayer || aoLayer.length <= 0) {
        //     return;
        // }
        // for (var i = 0; i < aoLayer.length; i++) {
        //     this._oPosGroup.removeLayer(aoLayer[i]);
        // }
    },

    clearLayer: function () {
        this._oPosGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {

        if (!oData || !oData.aoData  || oData.aoData.length <= 0) {
            return;
        }
        //var aoLatLng = [];
        for (var i = 0; i < oData.aoData.length; i++) {

            //oData.aoData[i].latLng = oData.aoData[i].latLng;
            this.drawLayer(oData.aoData[i]);
            //aoLatLng.push(oData.aoData[i].latLng);
        }
    },

    drawLayer: function (oGpsInfo) {
        if (!oGpsInfo || !oGpsInfo.latLng) {
            return;
        }
        var oLayer = L.ExSunMap.findLayer(this._oPosGroup, oGpsInfo.devNo);
        if (oLayer) {
            if (!this._oMap.hasLayer(oLayer)) {
                this._oMap.addLayer(oLayer);
            }
            oLayer.setLatLng(oGpsInfo.latLng);
            return;
        }
        var cCls = this.getTruckCls(oGpsInfo);


        var oIcon = this._getIcon(cCls, L.Util.template(this.options.cHtml, oGpsInfo));
        var oMarker = L.marker(oGpsInfo.latLng, {icon: oIcon}).addTo(this._oPosGroup);
        oMarker.oGpsInfo = oGpsInfo;
        oMarker.cId = oGpsInfo.devNo;

        // 绑定弹出层
        this.initEventForMarker(oMarker);
        return oMarker
    },

    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        var self = this;
        if (!oMarker) {
            return;
        }
        var oParam = {
            "devNos": [oMarker.oGpsInfo.devNo]
        }
        oMarker.on('click', function () {
            var that = this
            // 请求数据
            L.getData(JSON.stringify(oParam), self.options.url, function (oData) {
                var oTemp1 = JSON.parse(oData)
                if (oTemp1.code !== '0') {
                    return
                }
                var oTemp = oTemp1.detail

                if (!oTemp || oTemp.length <= 0) {
                    return
                }

                oTemp[0].trackBtn ='跟踪';
                var cHtml = L.ExSunMap.initPopHtml(oTemp[0]);
                that.bindPopup(cHtml, self.oPopOption);
                var oPopup = that.getPopup();
                oPopup.oGpsInfo = oTemp[0];
                //self.initPopEven(oPopup);
                L.ExSunMap.initPopEven(oPopup,self._oParent);
                that.openPopup();

            }, self);
        });
    },

    initPopEven: function (oPopup) {
        var self = this;
        if (!oPopup) return;
        oPopup.self = this;
        oPopup.on("contentupdate", function () {

            L.ExSunMap.onEvent('veh-detail','click',function () {
                //self._oParent.fire("MapView:VehDetail.showDetail",{oGpsInfo:oGpsInfo});
            },this);

            L.ExSunMap.onEvent('veh-history','click',function () {
                self._oParent.$emit('history',this.oGpsInfo);
                //window.open("http://ztc.comlbs.com/MapView/TrackView?PhoneNum=" + this.oGpsInfo.devNo + "&VehicleNo=" + this.oGpsInfo.vehNo);
            },this);

            L.ExSunMap.onEvent('veh-track','click',function () {
                self._oParent.$emit('track',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('veh-attend','click',function () {
                self._oParent.$emit('attend',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('veh-monitor','click',function () {
                self._oParent.$emit('monitor',this.oGpsInfo);
            },this);

            // L.ExSunMap.onEvent('veh-send','click',function () {
            //     self._oParent.$emit('send',this.oGpsInfo);
            // },this);

            L.ExSunMap.onEvent('veh-video','click',function () {
                self._oParent.$emit('video',this.oGpsInfo);
            },this);

            // el = document.getElementsByClassName('veh-video')[0];
            // L.DomEvent.on(el, 'click', function () {
            //     //self._oParent.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});
            // }, this);

            // 指令下方设置
            L.ExSunMap.onEvent('send-call-name','click',function () {
                self._oParent.$emit('send-call-name',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('send-camera','click',function () {
                self._oParent.$emit('send-camera',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('send-text','click',function () {
                self._oParent.$emit('send-text',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('send-monitor','click',function () {
                self._oParent.$emit('send-monitor',this.oGpsInfo);
            },this);

            L.ExSunMap.onEvent('send-config','click',function () {
                self._oParent.$emit('send-config',this.oGpsInfo);
            },this);

        }, oPopup);
    },

    // 画点
    _getIcon: function (cCls,cHtml) {
        var oIcon = L.divIcon({
            iconSize: [30, 40], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: cCls,
            html: cHtml,
        });
        return oIcon;
    },

    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getTruckCls: function (oData) {

        var cClsType = 'ex-monitor-mapicon-truck';
        var cClsStatus = 'green';

        if (oData.sta == '1' || oData.sta == '2') {
            cClsStatus = 'green';
        }
        else if (oData.sta == '3') {
            cClsStatus = 'green';
        }
        else if (oData.sta == '4') {
            cClsStatus = 'yellow';
        }
        else  {
            cClsStatus = 'gray';
        }
        return cClsType+' '+ cClsStatus;
    },

});

}(window, document, L));