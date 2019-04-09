/*
ESLib-2.3.0 code for exsun

Copyright©2015-2018 武汉依迅北斗空间技术有限公司 All Rights Reserved.

http://www.exsun.cn
*/




(function (window, document, $) {

/*
 * ES for code lib
 *
 * author:	liulin
 * date:	2016-11-201
 *
 *
 * 列出 组件目录
 */

var ES = {
	version: "2.3.0"
};

function expose() {
	var oldES = window.ES;

	ES.noConflict = function () {
		window.ES = oldES;
		return this;
	};

	window.ES = ES;
}

// define ES for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = ES;

// define ES as an AMD module
} else if (typeof define === 'function' && define.amd) {
	define(ES);
}

// define ES as a global  variable, saving the original ES to restore later if needed
if (typeof window !== 'undefined') {
	expose();
}


// 总目录文件
// 语言库
ES.Lang = {}

// 可视化组件库
ES.Common = {};

ES.Common.Lang={

    1: '确定',
    2: '取消',
    3: '新增',
    4: '修改',
    5: '删除',


    10: '新增数据成功！',
    11: '新增数据失败，失败原因{Msg}!',

    20: '修改数据成功！',
    21: '修改数据失败，失败原因{Msg}!',

    30: '删除数据失败，原因:没有获得业务数据',
    31: '确实要删除数据？',
    32: '删除数据成功！',
    33: '删除数据失败，失败原因{Msg}!',


    40: '设置成功！',
    41: '设置失败,失败原因{Msg}!',
}

// 地图控件
ES.MapControl={};

ES.MapControl.Config = {

    oRegionConfig: {
        cSwitchName: '区域',
        cDefaultCityName: '呼和浩特市',
        dLng: 111.657572,
        dLat: 40.805429,
    },
    oRegionRep: {
        cUrl: '',//'/MapView/GetRealRegion',
        oParam: {
            nDeptId: 1
        }
    },
};

// 这个一个临时的配置文件
    ES.oConfig= {
        dLng: 111.293275,
        dLat: 30.697875,
    };

/*
 * @namespace Util
 *
 * Various utility functions, used by Leaflet internally.
 */

ES.Util = {

	// @function extend(dest: Object, src?: Object): Object
	// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `ES.extend` shortcut.
	extend: function (dest) {
		var i, j, len, src;
		dest = dest || {};

		for (j = 1, len = arguments.length; j < len; j++) {
			src = arguments[j];
			for (i in src) {
				dest[i] = src[i];
			}
		}
		return dest;
	},

	// @function create(proto: Object, properties?: Object): Object
	// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
	create: Object.create || (function () {
		function F() {
		}

		return function (proto) {
			F.prototype = proto;
			return new F();
		};
	})(),

	// 做一个递归生成html对象的例子
	// 方法下次 所有开发不再使用
	// @oTag 为jquery 对象
	// @oOption 为生成对象
	initTag: function (oTag, oOption) {
		if (!oTag || !oOption) {
			return;
		}

		//检索对象所有属性
		for (var cItem in oOption) {
			if ($.isArray(oOption[cItem])) {
				//添加option对象
				var cTemp = cItem;
				for (var i = 0; i < oOption[cTemp].length; i++) {
					var oItem = $('<' + cTemp + '/>');
					this.initTag(oItem, oOption[cTemp][i]);
					oTag.append(oItem);
				}
			}
			else if (typeof oOption[cItem] === 'object' && oOption[cItem] !== null) {
				// 重复出现
				var cTagTemp = ES.Util.replaceAll(cItem, '1', '');
				var oItem1 = $('<' + cTagTemp + '/>');
				this.initTag(oItem1, oOption[cItem]);
				oTag.append(oItem1);
			}
			else if (cItem === 'html') {
				var html = oTag.html();
				oTag.html(html + ((oOption[cItem] !== null) ? oOption[cItem] : ''));
			}
			else {
				oTag.attr(cItem, oOption[cItem]);
			}
		}
	},

	// @function setOptions(obj: Object, options: Object): Object
	// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `ES.setOptions` shortcut.
	setOptions: function (obj, oOption) {
		if (!obj.hasOwnProperty('oOption')) {
			obj.oOption = obj.oOption ? ES.Util.create(obj.oOption) : {};
		}
		for (var i in oOption) {
			obj.oOption[i] = oOption[i];
		}
		return obj.oOption;
	},

	// @function trim(str: String): String
	// Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
	trim: function (str) {
		return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
	},

	// @function splitWords(str: String): String[]
	// Trims and splits the string on whitespace and returns the array of parts.
	splitWords: function (str) {
		return ES.Util.trim(str).split(/\s+/);
	},

	//获得url的参数信息，以字典形式给出
	//@cUrl url参数
	getArgs: function (cUrl) {
        var query = location.search.substring(1);
        if (cUrl) {
            query = cUrl;
        }
		var args = {};
		var pairs = query.split('&');
		for (var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('=');
			if (pos === -1) {
				continue;
			}
			var argname = pairs[i].substring(0, pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[argname] = value;
		}
		return args;
	},

	// @function template(str: String, data: Object): String
	// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
	// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
	// `('Hello foo, bar')`. You can also specify functions instead of strings for
	// data values — they will be evaluated passing `data` as an argument.
	template: function (str, data) {
		return str.replace(ES.Util.templateRe, function (str, key) {
			var value = data[key];

			if (value === undefined) {
				throw new Error('No value provided for variable ' + str);

			} else if (typeof value === 'function') {
				value = value(data);
			}
			return value;
		});
	},

	templateRe: /\{ *([\w_\-]+) *\}/g,


	//getData:ajax请求函数
	//@oParam：为请求的数据对象；
	//@cUrl：为请求的URL
	//@fnCallBack为回调函数；
	//@oContext为继承类；
	//@oExParam 只能为对象，不能为字符串
	getData: function (oParam, cUrl, fnCallBack, oContext, oExParam, oReqTemp) {
		if (!cUrl) {
			console.log(ES.Lang.Util.Err[2]);
			return;
		}
		if (!fnCallBack) {
			console.log(ES.Lang.Util.Err[3]);
			return;
		}


		var oReqParam = {
			type: 'POST',
			url: cUrl,
			dataType: 'json',
			data: oParam,
			success: function (oData) {
				//执行数据,不能用实例方法，在这里this为$对象,合并参数
				if (oExParam) {
					oExParam.oData = oData;
					fnCallBack.call(oContext, oExParam);
				}
				else {
					fnCallBack.call(oContext, oData);
				}
			},
			error: function (e, f, g) {
				if (oExParam) {
					oExParam.oData = null;
					fnCallBack.call(oContext, oExParam);
				}
				else {
					fnCallBack.call(oContext, null);
				}

				console.log(cUrl + ES.Lang.Util.Err[1]);

			},
		}

		ES.extend(oReqParam, oReqTemp);

		$.ajax(oReqParam);
	},

	// 判断数组中是否存在当前元素,
	// @aoTemp 为对象数组 ，@ao 为相同对象
	// @oTemp 为对象
	// @cKey 为对象属性
	isInArray: function (aoTemp, oTemp, cKey) {
		if (ES.Util.arrayIndex(aoTemp, oTemp, cKey) === -1) {
			return false;
		}
		return true;
	},

	// 把对象拆分为cMark 的字符串 , 如果cMark为空则用，分割
	// @aoTemp 为对象数组 ，@ao 为相同对象
	// @cMark 为分割参数
	// @cKey 为对象属性
	joinC: function (aoTemp, cKey, cMark) {
		var cVal = '';
		if (!cMark) {
			cMark = ',';
		}
		if (!aoTemp || !aoTemp.length || aoTemp.length <= 0 || !cKey) {
			return cVal;
		}

		var acTemp = [];
		for (var i = 0; i < aoTemp.length; i++) {
			if (!aoTemp[i].hasOwnProperty(cKey)) {
				continue;
			}
			acTemp.push(aoTemp[i][cKey]);
		}

		return acTemp.join(cMark);
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

	//字符串全局替换
	//@s 要操作字符串
	//@s1 替换 字符串
	//@s2 替换后 的字符串
	replaceAll: function (s, s1, s2) {
		return s.replace(new RegExp(s1, 'gm'), s2);
	},

	//将字符串转换成日期时间，有默认格式
	//@date 字符串
	//@pattern 转化的格式
	toDate: function (date, pattern) {
		if (!pattern || pattern === null) {
			pattern = 'yyyy-MM-dd hh:mm:ss';
		}

		var compare = {
			'y+': 'y',
			'M+': 'M',
			'd+': 'd',
			'h+': 'h',
			'm+': 'm',
			's+': 's'
		};
		var result = {
			'y': '',
			'M': '',
			'd': '',
			'h': '00',
			'm': '00',
			's': '00'
		};
		var tmp = pattern;
		for (var k in compare) {
			if (new RegExp('(' + k + ')').test(pattern)) {
				result[compare[k]] = date.substring(tmp.indexOf(RegExp.$1), tmp.indexOf(RegExp.$1) + RegExp.$1.length);
			}
		}
		//return new Date(result['y'], result['M'] - 1, result['d'], result['h'], result['m'], result['s']);
		return new Date(result.y, result.M - 1, result.d, result.h, result.m, result.s);
	},

	// 时间搓转化为时间格式
	// @value 为tick 或者 为时间
	// @format 为传化的字符串
	dateFormat: function (value, format) {
		if (value === '') {
			return '';
		}
		if (value.time) {
			value = new Date(value.time);
		}
		else {
			value = new Date(value);
		}

		var o = {
			'M+': value.getMonth() + 1, //month
			'd+': value.getDate(),    //day
			'h+': value.getHours(),   //hour
			'm+': value.getMinutes(), //minute
			's+': value.getSeconds(), //second
			'q+': Math.floor((value.getMonth() + 3) / 3), //quarter
			'S': value.getMilliseconds() //millisecond
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (value.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp('(' + k + ')').test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
			}
		}
		return format;
	},

	/*
	 加载进度条,进度条是基于jquery
	 @cTag:为加载进度条的容器,或者为jquery对象
	 @cFlag：为标志:"."或者"#"
	 */
	loadAn: function (cTag, cFlag) {
		//加载进度条
		var loadMaskHtml = '<div class="ex-layout-loading"><i>Loading...</i></div>';
		var oDiv = $(loadMaskHtml);
		if (typeof cTag === 'object') {
			cTag.append(oDiv);
			return;
		}

		if (!cFlag) {
			cFlag = '.';
		}

		$(cFlag + cTag).append(oDiv);
	},


	/*
	 移除进度条
	 加载进度条,进度条是基于jquery
	 @cTag:为加载进度条的容器,或者为jquery对象 .k-loading-mask
	 @cFlag：为标志:"."或者"#"
	 */
	removeAn: function (cTag, cFlag) {
		if (typeof cTag === 'object') {
			cTag.find('.ex-layout-loading').remove();
			return;
		}

		if (!cFlag) {
			cFlag = '.';
		}
		$(cFlag + cTag).find('.ex-layout-loading').remove();
	},

	aBase: function (oData) {

		var _alertHtml = '<div class="ec-alert {cColor} slidedown in"><button type="button" class="ec-close">&times;</button>{cMsg}</div>';
		_alertHtml = ES.Util.template(_alertHtml, oData);
		$('body').append(_alertHtml);
		$('.ec-alert').alert();
		setTimeout(function () {
			$('.ec-alert').alert('close');
		}, 1000);
	},

	// 成功提示窗体
	aSucess: function (cMsg) {

		ES.Util.aBase({cColor: 'ec-alert-success', cMsg: cMsg});
	},

	// 错误提示窗体
	aErr: function (cMsg) {
		ES.Util.aBase({cColor: 'ec-alert-danger', cMsg: cMsg});
	},

	// 告警提示窗体
	aWarn: function (cMsg) {

		ES.Util.aBase({cColor: 'ec-alert-warning', cMsg: cMsg});
	},


	// @function reqData(dest: Object, src?: Object): void
	// @oReqTemp 请求对象参数 ， 必须包含cUrl ，请求参数data 为可选
	// @oActive 必须包含fnCallBack 回调函数 和 oContext 函数执行的上下文
	// @oRespTemp 请求放回参数，可选参数，
	// 回调函数返回结果 为 rtnData
	reqData: function (oReqTemp, fnCallBack,oContext, oRespTemp) {
		if (!oReqTemp.hasOwnProperty('url')) {
			console.log(ES.Lang.Util.Err[2]);
			return;
		}


		if (!oRespTemp) {
			oRespTemp = {};
		}

		var oReqParam = {
			type: 'POST',
			dataType: 'json',
			success: function (data) {
				//执行数据,不能用实例方法，在这里this为$对象,合并参数
				oRespTemp.rtnData = data;
				fnCallBack.call(oContext, oRespTemp);
			},
			error: function (e, f, g) {
				oRespTemp.rtnData = null;
				fnCallBack.call(oContext, oRespTemp);
				console.log(this.url + ES.Lang.Util.Err[1]);
			},
		}

		ES.extend(oReqParam, oReqTemp);

		$.ajax(oReqParam);
	},


	getTag: function (oUIConfig) {
		var oDivTemp = $('<div></div>');
		ES.initTag(oDivTemp,oUIConfig);
		//var oNode = oDivTemp.first().addClass(this.oOption.cFlag);
		var $_oPanel = $(oDivTemp.html());
		delete oDivTemp;

		return $_oPanel
	},

	// 获取经纬度
	getLatLng: function (cY,cX) {

		var aoLatLng = [];
		if (!cX || !cY) {
			return aoLatLng;
		}

		var acX = cX.split(',');
		var acY = cY.split(',');
		if (acX.length != acY.length) {
			return aoLatLng;
		}

		for (var i = 0; i < acX.length; i++) {

			aoLatLng.push({lat: acY[i], lng: acX[i]});
		}
		return aoLatLng;
	},
	

};

(function () {
	// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

	function getPrefixed(name) {
		return window['webkit' + name] || window['moz' + name] || window['ms' + name];
	}

	var lastTime = 0;

	// fallback for IE 7-8
	function timeoutDefer(fn) {
		var time = +new Date(),
		    timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;
		return window.setTimeout(fn, timeToCall);
	}

	var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer,
	    cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
	               getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };


	// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
	// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
	// `context` if given. When `immediate` is set, `fn` is called immediately if
	// the browser doesn't have native support for
	// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
	// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
	ES.Util.requestAnimFrame = function (fn, context, immediate) {
		if (immediate && requestFn === timeoutDefer) {
			fn.call(context);
		} else {
			return requestFn.call(window, ES.bind(fn, context));
		}
	};

	// @function cancelAnimFrame(id: Number): undefined
	// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
	ES.Util.cancelAnimFrame = function (id) {
		if (id) {
			cancelFn.call(window, id);
		}
	};
})();

// shortcuts for most used utility functions
ES.extend = ES.Util.extend;
ES.setOptions = ES.Util.setOptions;
ES.template = ES.Util.template;
ES.loadAn = ES.Util.loadAn;
ES.removeAn = ES.Util.removeAn;
ES.getData = ES.Util.getData;
ES.initTag =ES.Util.initTag;
ES.getTag = ES.Util.getTag;
ES.aSucess = ES.Util.aSucess;
ES.aErr = ES.Util.aErr;
ES.aWarn = ES.Util.aWarn;
ES.reqData = ES.Util.reqData;



// @class Class
// @aka L.Class

// @section
// @uninheritable

// Thanks to John Resig and Dean Edwards for inspiration!

ES.Class = function () {};

ES.Class.extend = function (props) {

	// @function extend(props: Object): Function
	// [Extends the current class](#class-inheritance) given the properties to be included.
	// Returns a Javascript function that is a class constructor (to be called with `new`).
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		this.callInitHooks();
	};

	var parentProto = NewClass.__super__ = this.prototype;

	var proto = ES.Util.create(parentProto);
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	// inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		ES.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		ES.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (proto.options) {
		props.options = ES.Util.extend(ES.Util.create(proto.options), props.options);
	}

	// mix given properties into the prototype
	ES.extend(proto, props);

	proto._initHooks = [];

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parentProto.callInitHooks) {
			parentProto.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};


// @function include(properties: Object): this
// [Includes a mixin](#class-includes) into the current class.
ES.Class.include = function (props) {
	ES.extend(this.prototype, props);
	return this;
};

// @function mergeOptions(options: Object): this
// [Merges `options`](#class-options) into the defaults of the class.
ES.Class.mergeOptions = function (options) {
	ES.extend(this.prototype.options, options);
	return this;
};

// @function addInitHook(fn: Function): this
// Adds a [constructor hook](#class-constructor-hooks) to the class.
ES.Class.addInitHook = function (fn) { // (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
	return this;
};


/*
 * @class Evented
 * @aka L.Evented
 * @inherits Class
 *
 * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
 *
 * @example
 *
 * ```js
 * map.on('click', function(e) {
 * 	alert(e.latlng);
 * } );
 * ```
 *
 * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
 *
 * ```js
 * function onClick(e) { ... }
 *
 * map.on('click', onClick);
 * map.off('click', onClick);
 * ```
 */


ES.Evented = ES.Class.extend({

	/* @method on(type: String, fn: Function, context?: Object): this
	 * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
	 *
	 * @alternative
	 * @method on(eventMap: Object): this
	 * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
	 */
	on: function (types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (var type in types) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, types[type], fn);
			}

		} else {
			// types can be a string of space-separated words
			types =ES.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	/* @method off(type: String, fn?: Function, context?: Object): this
	 * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
	 *
	 * @alternative
	 * @method off(eventMap: Object): this
	 * Removes a set of type/listener pairs.
	 *
	 * @alternative
	 * @method off: this
	 * Removes all listeners to all events on the object.
	 */
	off: function (types, fn, context) {

		if (!types) {
			// clear all listeners if called without arguments
			delete this._events;

		} else if (typeof types === 'object') {
			for (var type in types) {
				this._off(type, types[type], fn);
			}

		} else {
			types =ES.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(types[i], fn, context);
			}
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function (type, fn, context) {
		this._events = this._events || {};

		/* get/init listeners for type */
		var typeListeners = this._events[type];
		if (!typeListeners) {
			typeListeners = [];
			this._events[type] = typeListeners;
		}

		if (context === this) {
			// Less memory footprint.
			context = undefined;
		}
		var newListener = {fn: fn, ctx: context},
			listeners = typeListeners;

		// check if fn already there
		for (var i = 0, len = listeners.length; i < len; i++) {
			if (listeners[i].fn === fn && listeners[i].ctx === context) {
				return;
			}
		}

		listeners.push(newListener);
	},

	_off: function (type, fn, context) {
		var listeners,
			i,
			len;

		if (!this._events) { return; }

		listeners = this._events[type];

		if (!listeners) {
			return;
		}

		if (!fn) {
			// Set all removed listeners to noop so they are not called if remove happens in fire
			for (i = 0, len = listeners.length; i < len; i++) {
				listeners[i].fn = L.Util.falseFn;
			}
			// clear all listeners for a type if function isn't specified
			delete this._events[type];
			return;
		}

		if (context === this) {
			context = undefined;
		}

		if (listeners) {

			// find fn and remove it
			for (i = 0, len = listeners.length; i < len; i++) {
				var l = listeners[i];
				if (l.ctx !== context) { continue; }
				if (l.fn === fn) {

					// set the removed listener to noop so that's not called if remove happens in fire
					l.fn = ES.Util.falseFn;

					if (this._firingCount) {
						/* copy array in case events are being fired */
						this._events[type] = listeners = listeners.slice();
					}
					listeners.splice(i, 1);

					return;
				}
			}
		}
	},

	// @method fire(type: String, data?: Object, propagate?: Boolean): this
	// Fires an event of the specified type. You can optionally provide an data
	// object — the first argument of the listener function will contain its
	// properties. The event can optionally be propagated to event parents.
	fire: function (type, data, propagate) {
		if (!this.listens(type, propagate)) { return this; }

		var event = ES.Util.extend({}, data, {type: type, target: this});

		if (this._events) {
			var listeners = this._events[type];

			if (listeners) {
				this._firingCount = (this._firingCount + 1) || 1;
				for (var i = 0, len = listeners.length; i < len; i++) {
					var l = listeners[i];
					l.fn.call(l.ctx || this, event);
				}

				this._firingCount--;
			}
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	},

	// @method listens(type: String): Boolean
	// Returns `true` if a particular event type has any listeners attached to it.
	listens: function (type, propagate) {
		var listeners = this._events && this._events[type];
		if (listeners && listeners.length) { return true; }

		if (propagate) {
			// also check parents for listeners if event propagates
			for (var id in this._eventParents) {
				if (this._eventParents[id].listens(type, propagate)) { return true; }
			}
		}
		return false;
	},

	// @method once(…): this
	// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
	once: function (types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				this.once(type, types[type], fn);
			}
			return this;
		}

		var handler = ES.bind(function () {
			this
				.off(types, fn, context)
				.off(types, handler, context);
		}, this);

		// add a listener that's executed once and removed after that
		return this
			.on(types, fn, context)
			.on(types, handler, context);
	},

	// @method addEventParent(obj: Evented): this
	// Adds an event parent - an `Evented` that will receive propagated events
	addEventParent: function (obj) {
		this._eventParents = this._eventParents || {};
		this._eventParents[ES.stamp(obj)] = obj;
		return this;
	},

	// @method removeEventParent(obj: Evented): this
	// Removes an event parent, so it will stop receiving propagated events
	removeEventParent: function (obj) {
		if (this._eventParents) {
			delete this._eventParents[ES.stamp(obj)];
		}
		return this;
	},

	_propagateEvent: function (e) {
		for (var id in this._eventParents) {
			this._eventParents[id].fire(e.type, ES.extend({layer: e.target}, e), true);
		}
	}
});

var proto = ES.Evented.prototype;

// aliases; we should ditch those eventually

// @method addEventListener(…): this
// Alias to [`on(…)`](#evented-on)
proto.addEventListener = proto.on;

// @method removeEventListener(…): this
// Alias to [`off(…)`](#evented-off)

// @method clearAllEventListeners(…): this
// Alias to [`off()`](#evented-off)
proto.removeEventListener = proto.clearAllEventListeners = proto.off;

// @method addOneTimeEventListener(…): this
// Alias to [`once(…)`](#evented-once)
proto.addOneTimeEventListener = proto.once;

// @method fireEvent(…): this
// Alias to [`fire(…)`](#evented-fire)
proto.fireEvent = proto.fire;

// @method hasEventListeners(…): Boolean
// Alias to [`listens(…)`](#evented-listens)
proto.hasEventListeners = proto.listens;

ES.Mixin = {Events: proto};


﻿/*
name        :               page.js 
des         :               页面基础对象，整个页面的外层容器
author      ：              liulin
date        ：              2016-2-17

思想：
为真个页面的外部容器，所有的对象以control 的形式添加到page对象中
如果是外部控制就使用page
如果是内部使用，就在control中完成

页面的设计远远比想象中要复杂，所以现在摒弃容器管理思想，
A.所有page只负责对象间的通信工作
B.页面公共元素的缓存
C.页面中的公共方法

*/



ES.Page = ES.Evented.extend({


    //页面id
    initialize: function (cId, oOption) {

        ES.setOptions(this, oOption);

        this.cId = cId;

        this.initLayout();
        this._onInit();

        this.initEvent();

    },


    initEvent: function () {
        
    },
    // 构建网页布局
    initLayout: function () {

    },

    //获得页面只要控件
    getMap: function () {
        return this._oMap;
    },

    //设置页面主要控件
    setMap: function (oData) {
        if (!oData) {
            console(ES.Lang.Page.setMap.Err);

            return;
        }
        if (!oData || oData.hasOwnProperty('oMap')) {
            if (oData.oMap instanceof L.Map) {
                this._oMap = oData.oMap;
                return;
            }
        }
        // 直接传地图控件
        if (oData instanceof L.Map) {
            this._oMap = oData;
        }
        else {
            console(ES.Lang.Page.setMap.ErrMap);
        }
    },

    // 添加控件
    addControl: function (control) {
        control.addTo(this);
        return this;
    },

    // todo 反射
    addHandler: function (name, HandlerClass) {
        if (!HandlerClass) {
            return this;
        }

        var handler = this[name] = new HandlerClass(this);

        this._handlers.push(handler);

        if (this.options[name]) {
            handler.enable();
        }

        return this;
    },

    //清楚对象
    remove: function () {
        if (this._loaded) {
            this.fire('unload');
        }

        this._initEvents('off');

        try {
            // throws error in IE6-8
            delete this._container._nId;
        } catch (e) {
            this._container._nId = undefined;
        }

        this._clearPanes();
        if (this._clearControlPos) {
            this._clearControlPos();
        }

        this._clearHandlers();

        return this;
    },

    // public methods for getting map state
    getContainer: function () {
        return this._container;
    },


    // 注册时间
    _onInit: function () {

        this.on('Map:loadFinish', this.setMap, this);

    },

});

ES.page = function (cId, oOption) {
    return new ES.Page(cId, oOption);
};


/**
 * Created by liulin on 2017/2/21.
 *
 * 内核语言文件
 *
 */


ES.Lang = ES.Lang||{}

ES.Lang.Page = {
    setMap: {
        Err: 'ES.Page->setMap 执行赋值失败，地图控件为空！',
        ErrMap: 'ES.Page->setMap 执行赋值失败,非法的地图控件',
    }
};

ES.Lang.Util = {
    Err: {
        1: '请求数据数据失败',
        2: '请求参数为空',
        3: '回调函数为空'
    }
};

/**
 * 坐标转换基础库
 *
 * Created by liulin on 2017/2/22.
 */


ES.CoordTrans = {
    PI : 3.14159265358979324,
    x_pi : 3.14159265358979324 * 3000.0 / 180.0,

    delta : function (lat, lon) {
        //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        var a = 6378245.0;
        //  ee: 椭球的偏心率。
        var ee = 0.00669342162296594323;
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
        return {'lat': dLat, 'lon': dLon};
    },

    //WGS-84 to GCJ-02
    gcj_encrypt : function (wgsLat, wgsLon) {
        if (this.outOfChina(wgsLat, wgsLon))
            return {'lat': wgsLat, 'lon': wgsLon};

        var d = this.delta(wgsLat, wgsLon);
        return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
    },

    //GCJ-02 to WGS-84
    gcj_decrypt : function (gcjLat, gcjLon) {
        if (this.outOfChina(gcjLat, gcjLon))
            return {'lat': gcjLat, 'lon': gcjLon};

        var d = this.delta(gcjLat, gcjLon);
        return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
    },

    //GCJ-02 to WGS-84 exactly
    gcj_decrypt_exact : function (gcjLat, gcjLon) {
        var initDelta = 0.01;
        var threshold = 0.000000001;
        var dLat = initDelta, dLon = initDelta;
        var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
        var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
        var wgsLat, wgsLon, i = 0;
        while (1) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            var tmp = this.gcj_encrypt(wgsLat, wgsLon);
            dLat = tmp.lat - gcjLat;
            dLon = tmp.lon - gcjLon;
            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                break;

            if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
            if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;

            if (++i > 10000) break;
        }

        return {'lat': wgsLat, 'lon': wgsLon};
    },

    //GCJ-02 to BD-09
    bd_encrypt : function (gcjLat, gcjLon) {
        var x = gcjLon, y = gcjLat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
        var bdLon = z * Math.cos(theta) + 0.0065;
        var bdLat = z * Math.sin(theta) + 0.006;
        return {'lat' : bdLat,'lon' : bdLon};
    },

    //BD-09 to GCJ-02
    bd_decrypt : function (bdLat, bdLon) {
        var x = bdLon - 0.0065, y = bdLat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
        var gcjLon = z * Math.cos(theta);
        var gcjLat = z * Math.sin(theta);
        return {lat : gcjLat, lng : gcjLon};
    },

    //WGS-84 to Web mercator
    //mercatorLat -> y mercatorLon -> x
    mercator_encrypt : function(wgsLat, wgsLon) {
        var x = wgsLon * 20037508.34 / 180.;
        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
        y = y * 20037508.34 / 180.;
        return {'lat' : y, 'lon' : x};

    },

    // Web mercator to WGS-84
    // mercatorLat -> y mercatorLon -> x
    mercator_decrypt : function(mercatorLat, mercatorLon) {
        var x = mercatorLon / 20037508.34 * 180.;
        var y = mercatorLat / 20037508.34 * 180.;
        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
        return {'lat' : y, 'lon' : x};

    },

    // two point's distance
    distance : function (latA, lonA, latB, lonB) {
        var earthR = 6371000.;
        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
        var s = x + y;
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        var alpha = Math.acos(s);
        var distance1 = alpha * earthR;
        return distance1;
    },

    outOfChina : function (lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },

    transformLat : function (x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },

    transformLon : function (x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    }

};



﻿/*

文本订阅规则： ES.Lang 为文本定义包，
.XXXX.XXXX定义对象,实际引用的对象
对象里订阅的对象，为方法，方法里定义的属性为错误编码

例如(for example)：
    ES.Lang.Map={
        flyTo:{
            1:'设备号{PhoneNum}，车牌号{VehicleNo} 无法使用flyTo，原因是地图控件不支持(注：目前1.0以上版本支持)！'
        }
    }
    ES.Lang 为文本包，Map为对象，flyTo为对象订阅的方法，1为错误代码
*/

ES.Lang = {};
ES.Lang.Page = {
    setMap: {
        Err: 'ES.Page->setMap 执行赋值失败，地图控件为空！',
        ErrMap: 'ES.Page->setMap 执行赋值失败,非法的地图控件',
    }
};

ES.Lang.Util = {
    Err: {
        1: '请求数据数据失败',
        2: '请求参数为空',
        3: '回调函数为空'
    }
};

ES.Lang.MapOpr = {

    initialize: {
        Err: '获取地图插件失败！，程序无法运行！',
        ErrMap: '地图控件为空，程序无法运行！',
    }
};
 


ES.Lang.Map = {
    p: {
        1: '地图控件为空，无法执行flyTo操作！',
    },
    flyTo: {
        1: '设备号{PhoneNum}，车牌号{VehicleNo} 无法使用flyTo，原因是地图控件不支持(注：目前1.0以上版本支持)！',
        2: '地图控件为空，无法执行flyTo操作！',

    },
    reflesh: {
        1: '地图控件为空，无法执行地图刷新操作！'
    },
    bcMap: {
        1: '地图控件为空或者对象非地图控件，无法执行广播地图事件！'
    }
};

ES.Lang.HubSvr = {
    _subSingleAlarmByGpsData: {
        1: '无法订阅车辆,原因：oGpsInfo 为空！',
        2: '无法订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hub服务没有订阅接口！',
        3: '开始订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hub服务没有订阅接口！时间:',
        4: '开始订阅车辆{PhoneNum};车牌号{VehicleNo}返回值:{results}时间:',
        5: '开始订阅车辆{PhoneNum};车牌号{VehicleNo}原因：{e}！时间:',
        6: '订阅车辆{PhoneNum}失败，原因:{e},时间:{cDateTime}',
    },

    unSubGpsByGpsData: {

        1: '无法取消订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hub服务没有订阅接口！',
        2: '无法取消订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hubhub服务断开！服务状态为:',
        3: '开始取消订阅车辆{PhoneNum};车牌号{VehicleNo}',
        4: '取消订阅车辆成功{PhoneNum};车牌号{VehicleNo}返回值:{results}时间:',
        5: '取消订阅车辆失败{PhoneNum};车牌号{VehicleNo}原因：{e}！时间:',
        6: '无法取消订阅车辆,原因：oGpsInfo 为空！',
    },

    // 正确 定义规则
    Msg: {
        11: '{fnName},{cDateTime} 订阅车辆：{PhoneNum}车牌号{VehicleNo}成功，返回值为：{results}',
        12: '{fnName},{cDateTime} 订阅车辆{cVehLst}成功，返回值为：{results}',
        21: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum} 成功,车牌号{VehicleNo}，返回值为：{results} ',
        41: '{fnName},{cDateTime} 取消订阅车辆{vehicleLst} 成功，返回值为：{results} ',

        31: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum}/{VehicleNo} 告警成功，返回值为：{results} ',
        51: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum}/{VehicleNo} 告警成功，返回值为：{results} ',
    },

    // 错误 定义规则 接口定义
    Err: {
        10: '{fnName},{cDateTime} 订阅车辆失败，原因：oGpsInfo 为空！',
        12: '{fnName},{cDateTime} 无法订阅车辆{PhoneNum};车牌号{VehicleNo}，原因：hub服务没有订阅接口！',
        13: '{fnName},{cDateTime} 开始订阅车辆{PhoneNum};车牌号{VehicleNo}！',
        15: '{fnName},{cDateTime} 订阅车辆：{PhoneNum}车牌号{VehicleNo}失败，原因:{e}',

        16: '{fnName},{cDateTime} 订阅车辆{cVehLst}失败，原因：hub接口 为空！',
        17: '{fnName},{cDateTime} 订阅车辆：{cVehLst}失败，原因:{e}',
        18: '{fnName},{cDateTime} 订阅车辆失败，原因：参数为空！',


        20: '{fnName},{cDateTime} 取消订阅失败，原因参数为空！',
        22: '{fnName},{cDateTime} 开始取消订阅车辆{PhoneNum};车牌号{VehicleNo}！',
        23: '{fnName},{cDateTime} 取消订阅车辆{vehicleLst}成功，返回值为：{results}',

        40: '{fnName},{cDateTime} 订阅车辆失败，原因：vehicleLst 为空！',
        41: '{fnName},{cDateTime} 取消订阅车辆失败，原因：hub接口 为空！',
        42: '{fnName},{cDateTime} 无法取消订阅车辆{vehicleLst}，原因：hub 服务断开！服务状态为：{state}',
        43: '{fnName},{cDateTime} 开始取消订阅车辆{vehicleLst}！',
        44: '{fnName},{cDateTime} 取消订阅车辆{vehicleLst}失败，原因:{e}',

        30: '{fnName},{cDateTime} 开始订阅所有车辆{PhoneNum}/{VehicleNo}告警，时间：{cDateTime}!',
        31: '{fnName},{cDateTime} 订阅所有车辆告警成功，时间：{cDateTime}!',
        32: '{fnName},{cDateTime} 订阅所有车辆告警成功失败，时间：{cDateTime}',
        33: '{fnName},{cDateTime} 无法取消订阅车辆{PhoneNum}/{VehicleNo}，原因：hub 服务断开！服务状态为：{state}',
        34: '{fnName},{cDateTime} 订阅所有车辆告警失败，原因：hub接口 为空！',
        35: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum}/{VehicleNo}告警失败，原因:{e}',


        50: '{fnName},{cDateTime} 开始订阅单台车辆{PhoneNum}/{VehicleNo}告警，时间：{cDateTime}!',
        51: '{fnName},{cDateTime} 订阅单台车辆告警成功，时间：{cDateTime}!',
        52: '{fnName},{cDateTime} 订阅单台车辆告警成功失败，时间：{cDateTime}',
        53: '{fnName},{cDateTime} 无法取消订阅单台车辆{PhoneNum}/{VehicleNo}，原因：hub 服务断开！服务状态为：{state}',
        54: '{fnName},{cDateTime} 订阅单台车辆告警失败，原因：hub接口 为空！',
        55: '{fnName},{cDateTime} 取消订阅单台车辆{PhoneNum}/{VehicleNo}告警失败，原因:{e}',
        56: '{fnName},{cDateTime} 取消订阅单台车辆告警失败，原因:oGpsInfo 为空',
    }


};

ES.Lang.HubSvr.HubMange = {
    addHub: {
        1: '订阅数据为空，无法进行设备订阅！',
        2: '地图实时跟踪中存在已经跟踪的设备号{PhoneNum};车牌号{VehicleNo}！'
    },
    removeHub: {
        1: '订阅数据为空，无法进行设备订阅！',
        2: '地图实时跟踪中存在已经跟踪的设备号{PhoneNum};车牌号{VehicleNo}！'
    },
    addAlarmHub: {
        1: '订阅数据为空，无法进行设备订阅！',
        2: '地图实时跟踪中存在已经跟踪的设备号{PhoneNum};车牌号{VehicleNo}！'
    }

};

ES.Lang.VehInfo = {};
ES.Lang.VehInfo.RealStatusNj = {
    setHubGpsInfo: {
        1: '执行hub推送时还没有初始化界面。'
    }
};


// 历史轨迹
ES.Lang.TrackView = {};
ES.Lang.TrackView.Contorl = {
    initSlider: {
        1: ''
    }

};


ES.Lang.Boss= {
    1: '确定',
    2: '取消',
    3: '新增',
    4: '修改',
    5: '删除',


    10: '新增数据成功！',
    11: '新增数据失败，失败原因{Message}!',

    20: '修改数据成功！',
    21: '修改数据失败，失败原因{Message}!',

    30: '删除数据失败，原因:没有获得业务数据',
    31: '确实要删除数据？',
    32: '删除数据成功！',
    33: '删除数据失败，失败原因{Message}!',


    40: '设置成功！',
    41: '设置失败,失败原因{Message}!',

};

ES.Lang.BaseDialog ={

    1: '确定',
    2: '取消',
    3: '新增',
    4: '修改',
    5: '删除',


    10: '新增数据成功！',
    11: '新增数据失败，失败原因{Message}!',

    20: '修改数据成功！',
    21: '修改数据失败，失败原因{Message}!',

    30: '删除数据失败，原因:没有获得业务数据',
    31: '确实要删除数据？',
    32: '删除数据成功！',
    33: '删除数据失败，失败原因{Message}!',
    34: '删除数据异常',

    40: '设置成功！',
    41: '设置失败,失败原因{Message}!',
}



﻿/*
name:           HubSvr.js
des:            hub服务，集成了hub服务的所有方法，所有要用的都继承这个基类；
date:           2016-06-15
author:         liulin


订阅思想：
    增加了断开重新连接，重新连接时，车辆重新订阅
    如果是取消订阅，就要注销重新连接

*/
ES.HubSvr = ES.Class.extend({
    oOption: {
        // hub 服务地址
        cHubUrl: '',
        // 超时时长
        nTimeOut: 10000,

        // hub 服务名称
        cSvrName:'GpsHub',

        // 推送服务
        aoClientName:[{cSvrFn:'sendAlarm',on:'ReceiveHGTAlarm'}],

    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.afnCallBack = [];

        this.initSvr();

        // 启动hub服务
        this.start();

        // 注册接受回调数据
        this.onReceiveGPS();

        // 开启监听
        this.initOn();

    },

    initSvr: function () {
        var self = this;
        $.connection.hub.url = this.oOption.cHubUrl;
        $.connection.hub.logging = true;
        this.svrBoss = $.connection[this.oOption.cSvrName];
        this.oConnection = $.connection.hub;
        var oConnection = this.oConnection;
        //断开超时时间
        var nTimeOut = this.oOption.nTimeOut;
        if(!this.oConnection.disconnected){
            return;
        }
        this.oConnection.disconnected(function () {
            console.log('disconnected id: ' + oConnection.id + ' state: ' + oConnection.state + '  ' + new Date().getSeconds().toString());
            setTimeout(function () {
                self.start();
            }, nTimeOut);
        });

        this.oConnection.error(function (error) {
            console.log('Error: ' + error);
        });
    },

    //开启hub监听，开启之后 在内存中 读取订阅数据，重新订阅
    start: function () {
        var oConnection = this.oConnection;

        var self = this;
        var hubSvr = null;
        try {
            hubSvr = this.oConnection.start()
        }
        catch (e) {

        }
        if (!hubSvr) {
            return;
        }

        hubSvr.done(function () {
            if (self.afnCallBack && self.afnCallBack.length > 0) {
                for (var i = 0; i < self.afnCallBack.length; i++) {
                    var oTemp = self.afnCallBack[i];
                    oTemp.fn.call(oTemp.oContext, oTemp.oData);
                }
            }
            console.log('started transport: ' + oConnection.transport.name + ' ' + oConnection.id);
        }).fail(function (err) {
            console.log('Could not connect.' + err);
        });
    },

    initOn: function () {
        this._oParent.on('HubSvr:subAlarm', this.subAlarm, this);
    },

    //停止hub监听
    stop: function () {
        this.oConnection.stop();
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

    onReceiveGPS: function () {

        if(!this.svrBoss){
            return;
        }

        var self = this;

        var aoClientName = this.oOption.aoClientName;
        for(var i =0;i< aoClientName.length;i++){
            var oTemp = aoClientName[i]

            this.svrBoss.client[oTemp.cSvrFn] = function (oData) {
                self._oParent.fire(oTemp.on, {oData: oData});
            };
        }
    },

    // 订阅视频
    subVehicleVideoPlay:function (cVehLst) {
        var oData = {cVehLst: cVehLst};

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._subVehicleVideoPlay, oContext: this, oData: oData});

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subVehicleVideoPlay(oData);
    },

    _subVehicleVideoPlay:function (oData) {
        var oTemp = {fnName: '_subVehicleVideoPlay', cDateTime: new Date().toLocaleString()};

        if (!oData || !oData.cVehLst) {
            console.log(ES.template(ES.Lang.HubSvr.Err[18], oTemp));
            return;
        }

        oTemp.cVehLst = oData.cVehLst;
        if (!this.svrBoss || !this.svrBoss.server.subVehicleVideoPlay) {
            console.log(ES.template(ES.Lang.HubSvr.Err[16], oTemp));
            return;
        }

        //console.log(ES.template(ES.Lang.HubSvr.Err[13], oTemp));
        this.svrBoss.server.subVehicleVideoPlay(oData.cVehLst).done(function (results) {
            oTemp.results = results;
            console.log('_subVehicleVideoPlay succ');

        }).fail(function (e) {
            oTemp.e = e;
            console.log('_subVehicleVideoPlay fail');
        });
    },
    
    // 订阅车辆
    vehicleSub: function (vehicleLst) {

        var oData = {cVehLst: vehicleLst};

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._vehicleSub, oContext: this, oData: oData});

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._vehicleSub(oData);

    },

    // 订阅车辆,批量订阅车辆
    _vehicleSub: function (oData) {
        var oTemp = {fnName: '_vehicleSub', cDateTime: new Date().toLocaleString()};

        if (!oData || !oData.cVehLst) {
            console.log(ES.template(ES.Lang.HubSvr.Err[18], oTemp));
            return;
        }

        oTemp.cVehLst = oData.cVehLst;
        if (!this.svrBoss || !this.svrBoss.server.sub) {
            console.log(ES.template(ES.Lang.HubSvr.Err[16], oTemp));
            return;
        }

        console.log(ES.template(ES.Lang.HubSvr.Err[13], oTemp));
        this.svrBoss.server.sub(oData.cVehLst).done(function (results) {
            oTemp.results = results;
            console.log(ES.template(ES.Lang.HubSvr.Err[12], oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template(ES.Lang.HubSvr.Err[17], oTemp));
        });
    },

    // 订阅车辆,防止连接断开，需要重新连接
    subGpsByGpsData: function (oGpsInfo) {

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({
            fn: this._subGpsByGpsData,
            oContext: this,
            oData: oGpsInfo,
            PhoneNum: oGpsInfo.PhoneNum
        });

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subGpsByGpsData(oGpsInfo);
    },


    // 通过GPSData取消订阅---
    unSubGpsByGpsData: function (oGpsInfo) {

        var oTemp = {fnName: 'unSubGpsByGpsData', cDateTime: new Date().toLocaleString()};

        if (!oGpsInfo) {

            console.log(ES.Util.template(ES.Lang.HubSvr.Err[20], oTemp));
            return;
        }
        ES.extend(oTemp, oGpsInfo);

        // 取消内存订阅
        this.removeCallBack(this._subGpsByGpsData, oGpsInfo);

        if (!this.svrBoss ||!this.svrBoss.server.unSub) {
            console.log(ES.Util.template(ES.Lang.HubSvr.Err[22], oTemp));
            return;
        }
        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            console.log(ES.Util.template(ES.Lang.HubSvr.Err[21], oTemp));
            return;
        }
        console.log(ES.Util.template(ES.Lang.HubSvr.Err[22], oTemp));
        this.svrBoss.server.unSub().done(function (results) {
            oTemp.results = results;
            console.log(ES.Util.template(ES.Lang.HubSvr.Msg[21], oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.Util.template(ES.Lang.HubSvr.Err[24], oTemp));
        });


    },

    // 订阅车辆,---
    _subGpsByGpsData: function (oGpsInfo) {
        var oTemp = {fnName: '_subGpsByGpsData', cDateTime: new Date().toLocaleString()};
        if (!oGpsInfo) {
            console.log(ES.template(ES.Lang.HubSvr.Err[10], oTemp));
            return;
        }
        if (!this.svrBoss ||!this.svrBoss.server.sub) {
            console.log(ES.template(ES.Lang.HubSvr.Err[16], oTemp));
            return;
        }
        console.log(ES.template(ES.Lang.HubSvr.Err[13], oTemp));

        this.svrBoss.server.sub(oGpsInfo.PhoneNum).done(function (results) {
            oTemp.results = results;
            console.log(ES.template(ES.Lang.HubSvr.Msg[11], oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template(ES.Lang.HubSvr.Err[15], oTemp));
        });
    },

    // 取消订阅车辆---
    vehicleUnSub: function (vehicleLst) {
        var oTemp = {fnName: '_subGpsByGpsData', cDateTime: new Date().toLocaleString(), vehicleLst: vehicleLst};
        if (!this.svrBoss ||!this.svrBoss.server.unSub) {
            console.log(ES.template(ES.Lang.HubSvr.Err[41], oTemp));
            return;
        }
        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            console.log(ES.template(ES.Lang.HubSvr.Err[42], oTemp));
            return;
        }
        console.log(ES.template(ES.Lang.HubSvr.Err[43], oTemp));
        this.svrBoss.server.unSub().done(function (results) {
            oTemp.results = results;
            console.log(ES.template(ES.Lang.HubSvr.Msg[41], oTemp));
        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template(ES.Lang.HubSvr.Err[44], oTemp));
        });
    },

    subAlarm: function (oData) {

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._subAlarm, oContext: this, oData: oData});

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subAlarm(oData);

    },

    // 添加告警 -----
    _subAlarm: function (oGpsInfo) {
        var oTemp = {fnName: '_subAlarm', cDateTime: new Date().toLocaleString()};

        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            console.log(ES.template(ES.Lang.HubSvr.Err[33], oTemp));
            return;
        }

        if (!this.svrBoss.server.subAlarm) {
            console.log(ES.template(ES.Lang.HubSvr.Err[34], oTemp));
            return;
        }

        console.log(ES.template(ES.Lang.HubSvr.Err[30], oTemp));
        this.svrBoss.server.subAlarm(oGpsInfo.nUserId, oGpsInfo.nPlatId, oGpsInfo.nDeptId).done(function (results) {
            oTemp.results = results;
            console.log(ES.template(ES.Lang.HubSvr.Err[31], oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template(ES.Lang.HubSvr.Err[35], oTemp));
        });

    },

    unSubAlarm: function () {
        if (!this.svrBoss.server.unSubAlarm) {
            return;
        }
        if (this.oConnection.state !== 1) {
            return;
        }
        this.svrBoss.server.unSubAlarm().done(function (results) {
            console.log('Seccuss at unSubAlarm: ' + results);

        }).fail(function (e) {
            console.log('Failed at unSubAlarm: ' + e);
        });
    },

    // 通过GpsData 订阅单台车辆 防止断开订阅
    subSingleAlarmByGpsData: function (oGpsInfo) {

        // 断开后重新订阅
        this.afnCallBack.push({
            fn: this._subSingleAlarmByGpsData,
            oContext: this,
            oData: oGpsInfo,
            PhoneNum: oGpsInfo.PhoneNum
        });

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subSingleAlarmByGpsData(oGpsInfo);

    },

    // 取消单台车辆的订阅 ---
    _subSingleAlarmByGpsData: function (oGpsInfo) {
        var oTemp = {fnName: '_subSingleAlarmByGpsData', cDateTime: new Date().toLocaleString()};

        var oMsg = ES.Lang.HubSvr.Err;

        if (!oGpsInfo) {
            console.log(ES.Util.template(oMsg[56], oTemp));
            return;
        }
        if (!this.svrBoss ||!this.svrBoss.server.subSingleDeviceAlarm) {
            console.log(ES.Util.template(oMsg[54], oTemp));
            return;
        }
        console.log(ES.Util.template(oMsg[50], oGpsInfo) + new Date());
        this.svrBoss.server.subSingleDeviceAlarm(oGpsInfo.PhoneNum).done(function (results) {
            oTemp.results = results;
            console.log(ES.Util.template(ES.Lang.HubSvr.Msg[51], oTemp));

        }).fail(function (e) {

            oTemp.e = e;
            console.log(ES.Util.template(oMsg[55], oTemp));
        });

    },

    // 取消订阅
    unSubSingleAlarmByGpsData: function (oGpsInfo) {
        if (!oGpsInfo) {
            return;
        }

        this.removeCallBack(this._subSingleAlarmByGpsData, oGpsInfo);
    },

    //----报警推送
    subSingleDeviceAlarm: function (deviceId) {

        if (!this.svrBoss ||!this.svrBoss.server.subSingleDeviceAlarm) {
            return;
        }
        this.svrBoss.server.subSingleDeviceAlarm(deviceId).done(function (results) {
            console.log('Seccuss at subSingleDeviceAlarm: ' + results);

        }).fail(function (e) {
            console.log('Failed at subSingleDeviceAlarm: ' + e);
        });
    },

    //订阅工地 获取图片
    subVehicleRecognition: function (siteInfo) {
        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._subVehicleRecognition, oContext: this, oData: oData});
        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }
        this._subVehicleRecognition(oData);
    },
    _subVehicleRecognition: function () {
        if (!this.svrBoss.server.subVehicleRecognition) {
            return;
        }
        if (this.oConnection.state !== 1) {
            return;
        }
        this.svrBoss.server.subVehicleRecognition().done(function (results) {
            console.log('Seccuss at subSiteImg: ' + results);

        }).fail(function (e) {
            console.log('Failed at subSiteImg: ' + e);
        });
    },

});

﻿
ES.MonitorTimer = ES.Class.extend({

    oOption: {
        // 定时器执行时间间隔
        nIntervalSpeed: 1000 * 60 * 10,

        // 是否默认开始执行
        bIsStart: true,

        // 注册执行的方法
        aoActive: [],
    },

    //定时器 id
    _nIntervalId: null,

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        if (this.oOption.bIsStart) {
            this.start();
        }
    },

    // 增加回调
    on: function (oActive) {
        if (!this.oOption.aoActive) {
            this.oOption.aoActive = [];
        }
        var bIn = false;
        $.each(this.oOption.aoActive, function (nIndex, oItem) {
            if (oItem.fnCallBack === oActive.fnCallBack && oItem.oContext === oActive.oContext) {
                oItem.fnCallBack = oActive.fnCallBack;
                bIn = true;
            }
        });
        if (bIn) {
            return;
        }
        this.oOption.aoActive.push(oActive);
    },

    // 注销回调
    off: function (fnCallBack, oContext) {
        if (!this.oOption.aoActive || this.oOption.aoActive.length <= 0) {
            return;
        }
        var aoActive = this.oOption.aoActive;

        for (var i = aoActive.length - 1; i >= 0; i--) {
            if (aoActive[i].oContext === oContext && aoActive[i].fnCallBack === fnCallBack) {
                // 删除该元素
                aoActive.slice(i, 1);
            }
        }
    },

    //开始轨迹回放
    start: function () {
        if (this._nIntervalId) {
            return;
        }
        //定时器
        this._nIntervalId = window.setInterval(
            this._tick,
            this.oOption.nIntervalSpeed,
            this);
    },

    stop: function () {
        if (!this._nIntervalId) {
            return;
        }
        clearInterval(this._nIntervalId);
        this._nIntervalId = null;
    },

    //暂停timer 后在按照时间启动


    // 获得定时器的状态,false表示定时器已经关闭，true表示定时器开，正在回放轨迹
    getStatus: function () {
        if (!this._nIntervalId) {
            return false;
        }
        return true;
    },

    //设置播放轨迹速度
    setSpeed: function (nIntervalSpeed) {
        this.oOption.nIntervalSpeed = nIntervalSpeed;

        if (this.oOption.nIntervalSpeed) {
            this.stop();
            this.start();
        }
    },

    //定时触发
    _tick: function (self) {
        self._callbacks();
    },

    //设置播放进度条,移动轨迹点到下一个位置
    _callbacks: function () {
        if (!this.oOption.aoActive || this.oOption.aoActive.length <= 0) {
            return;
        }
        var aoActive = this.oOption.aoActive;
        $.each(aoActive, function (nIndex, oItem) {
            if (!oItem.fnCallBack) {
                return;
            }
            if (!oItem.oContext && oItem.fnCallBack) {
                oItem.fnCallBack.call(this, {});
            }
            if (oItem.oContext && oItem.fnCallBack) {
                oItem.fnCallBack.call(oItem.oContext, {});
            }
            return true;
        });
    },

});

/**
 * name:  BaseDtGrid.js
 * des:   ajax 获得grid控件
 *
 * Created by liulin on 2017/3/30.
 *
 */

ES.Common.BaseDtGrid = ES.Evented.extend({

    // basedtgrid 设置
    oOption: {
        // 请求数据的url
        cUrl: '',
        // 界面容器
        cPContainer: '',
        // 默认的请求参数
        oDefaultParam:{},
    },

    // grid 配置
    oGridOption: {
        lang: 'zh-cn',
        ajaxLoad: false,
        check: false,
        exportFileName: '列表',
        datas: [],
        columns: [],
        gridContainer: 'dtGrid',
        toolbarContainer: 'dtGridPager',
        tools: '',
        pageSize: 10,
        pageSizeLimit: [10, 20, 30, 50],
    },

    // 构造函数
    initialize: function (oParent, oOption, oGridOption) {
        ES.setOptions(this, oOption);
        ES.extend(this.oGridOption, oGridOption);
        this._oParent = oParent;
        // 保存 grid 中的数据
        this._aoData = [];
        // 设置集合
        if (oOption.aoData) {
            this._aoData = oOption.aoData;
        }

        if (typeof this.oOption.cPContainer === 'object') {
            // 父亲级容器
            this.$_oPContainer = this.oOption.cPContainer;
        }
        else {
            this.$_oPContainer = $(this.oOption.cPContainer);
        }
    },

    // 初始化grid界面
    initGrid: function () {
        var self =this;
        var oDtGridOption = {
            datas: this._aoData,
            onRowClick: function (value, record, column, grid, dataNo, columnNo, cell, row, extraCell, e) {

            },
            onGridComplete: function (g) {
                self.gridComplete();
            },
            columns: this.getColumns(),
        };

        this._oDtGridOption = ES.extend({}, this.oGridOption, oDtGridOption);

        this.dtGrid = $.fn.DtGrid.init(this._oDtGridOption);

    },

    loadGrid:function() {


        this.dtGrid.reload(true);
    },

    setHeight: function () {
        $(this._oDtGridOption.gridContainer).height(200);
    },

    getColumns: function () {

    },

    // 监听外部事件
    initOn: function () {

        // 初始化监控列表，并添加一行数据
        this._oParent.on("MapView:ReceiveAlarm.showTrack", this.showTrack, this);

        // 初始化监控列表
        this._oParent.on("MapView:ReceiveAlarm.initUI", this.initUI, this);
        // 显示监控列表
        this._oParent.on("MapView:ReceiveAlarm.reShowTrack", this.reShowTrack, this);

        // 隐藏监控列表
        this._oParent.on("MapView:ReceiveAlarm.hideTrack", this.hideTrack, this);

        // 接收hub 服务
        this._oParent.on("ReceiveHGTAlarm", this.addRow, this);

        // 更新行数据
        this._oParent.on("MapView:TrackLst.updateRow", this.updateRow, this);
    },

});

// ajax 请求操作
ES.Common.BaseDtGrid.include({

    // 加载gird，并初始化界面
    ajaxLoad:function(){
        this._dtGrid.load();
    },

    // 给 grid 添加数据，推送图片数据和告警名称数据要进行设置
    addRow: function (oTemp) {
        if (!oTemp || !oTemp.aoData) {
            return;
        }
        var aoData = oTemp.aoData;
        for (var i = 0; i < aoData.length; i++) {

            this._aoData.unshift(aoData[i]);

            //if (this._aoData.length > this.oOption.nTop) {
            //    this._aoData.splice((this.oOption.nTop - 1), 1);
            //}
        }

        if (this.dtGrid) {
            // 重新加载内存中的数据
            this.dtGrid.reload(true);
        }
    },

    // 更新行数据
    updateRow: function (oData) {
        //if (!oData || !oData.oGpsInfo) return;
        //var oGpsInfo = oData.oGpsInfo;
        //
        //// 替换数据
        //for (var i = this._aoData.length - 1; i >= 0; i--) {
        //    if (this._aoData[i].PhoneNum == oGpsInfo.PhoneNum) {
        //        this._aoData.splice(i, 1, oData.oGpsInfo);
        //    }
        //}

        if (this.dtGrid) {
            // 重新加载内存中的数据
            this.dtGrid.reload(true);
        }
    },

    // 删除行数据
    delRow: function (oGpsInfo) {
        if (!oGpsInfo) return;

        //// 删除数据，重新绑定grid
        //for (var i = this._aoData.length - 1; i >= 0; i--)
        //{
        //    if (this._aoData[i].PhoneNum == oGpsInfo.PhoneNum)
        //    {
        //        this._aoData.splice(i, 1);
        //    }
        //}

        if (this.dtGrid) {
            // 重新加载内存中的数据
            this.dtGrid.reload(true);
        }
    },

    // 清除数据
    clearRow: function () {
        if (!this._aoData || this._aoData.length <= 0) {
            return;
        }

        this._aoData.splice(0, this._aoData.length);
        if (this.dtGrid) {
            // 重新加载内存中的数据
            this.dtGrid.reload(true);
        }
    },

    // 第一次的登录设置数据
    initData: function () {
        ES.loadAn($(this.oOption.cContainer));
        ES.reqData({}, this.initDataHandler, this);
    },

    initDataHandler: function (oData) {
        ES.removeAn($(this.oOption.cContainer));
        this._oParent.fire("ReceiveHGTAlarm", {aoData: oData.dataList});
    },

});

// grid请求数据
ES.Common.BaseDtGrid.include({

    // 加载gird，并初始化界面
    load:function(){
        // 需要设置请求默认的请求参数
        this.dtGrid.parameters = this.oOption.oDefaultParam;
        this._dtGrid.load();
    },

    // 触发后台查询，要做缓存查询
    query: function (oData) {
        // 添加查询层
        ES.loadAn($(this.oOption.cContainer));
        ES.extend(this.oOption.oDefaultParam, oData.oParam);
        // 重新设置查询条件
        this.dtGrid.parameters = this.oOption.oDefaultParam;
        this.dtGrid.refresh(true);

    },

    // 数据加载完成移除 遮罩层
    gridComplete: function () {
        ES.removeAn($(this.oOption.cContainer));
    },

});

/**
 * JQ grid 的基础包装 只能用 Url 来请求数据
 *
 * Created by liulin on 2017/8/31.
 */


ES.Common.BaseJqGrid = ES.Evented.extend({

    // grid 页面配置
    oOption: {
        // 容器
        cContainer: '.ex-layout-content',
        // grid id
        cGridContainer: 'dtGridContainer',
        // 分页菜单id
        cPagerContainer: 'dtGridToolBarContainer',

        // 查询默认参数
        oDefaultParam: {},
    },

    // gird 配置
    oJqGridOption: {
        url: '/EventType/Query',
        mtype: "POST",
        datatype: "json",
        multiselect: false,
        viewrecords: true,
        recordtext: '查询出 {2} 条记录， ',
        width: 600,
        height: 500,
        subGrid: false,
        subGridRowExpanded: null,
        rowNum: 20,
        rowList: [20, 30, 50],
        serializeGridData: function (data) {
            return JSON.stringify(data);
        },
        postData: { exparameters:  {} },

        jsonReader: {
            root: "dataList",
        },
        subGridOptions: {
            // load the subgrid data only once
            // and the just show/hide
            reloadOnExpand: false,
            // select the row when the expand column is clicked
            selectOnExpand: true
        },

    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption,oJqGridOption) {
        ES.setOptions(this, oOption);

        this._oParent = oParent;

        this.aoCol = [];
        this.setColumns();
        this.initOn();
        this.initUI();

        this.oSearchInput = $('#form-event-type-name');
        this.oSearchBtn = $('#form-event-type-search');

        var self = this;
        ES.extend(
            this.oJqGridOption,
            oJqGridOption,
            {
                onSelectRow: function (cId, d, e) {
                    var record = $(this).data('oData').dataList[parseInt(cId) - 1];
                    self.initClick(e, record);
                },
                colModel: this.aoCol,
                pager: '#' + this.oOption.cPagerContainer,
                loadComplete: function (data) {
                    self.gridData = data;
                    //缓存数据到控件
                    $(this).data('oData', data);
                },
            });
        //this.reflesh(this.oOption.nWidth, this.oOption.nHeight);
        //this.initGrid();

        this.initEvent();
        //$('.ec-radio-inline>input#qualificationAll').attr("checked", true);
    },

    // 外层大grid 和里成
    initClick: function (e, oModel) {
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('edit')) {
            this._oParent.fire('editEventType', {oModel: oModel});
        }
        if ($(e.target).hasClass('del')) {
            this._oParent.fire('delEventType', {oModel: oModel});
        }

        if ($(e.target).hasClass('addEC')) {
            // 添加下级孩子
            this._oParent.fire('addConfig', {oModel: {EventTypeId:oModel.Id,EventTypeName:oModel.EventTypeName}});
        }

        // 编辑
        if ($(e.target).hasClass('editC')) {
            this._oParent.fire('editConfig', {oModel: oModel});
        }
        // 删除
        if ($(e.target).hasClass('delC')) {
            this._oParent.fire('delConfig', {oModel: oModel});
        }
        // 复制添加
        if ($(e.target).hasClass('addC')) {
            //var oTemp = {};
            //ES.extend(oModel, oModel);
            //delete oTemp.Id;
            // 添加下级孩子
            this._oParent.fire('copyConfig', {oModel: oModel});
        }

    },

    initUI: function () {
        var oGrid = $(this.oOption.cContainer).find('#' + this.oOption.cGridContainer);

        if (!oGrid || oGrid.length <= 0) {
            $(this.oOption.cContainer).append('<table id="' + this.oOption.cGridContainer + '" class="dt-grid-container"></table>');
            $(this.oOption.cContainer).append('<div id="' + this.oOption.cPagerContainer + '" class="dt-grid-toolbar-container"></div>');
        }

        this.$_oGrid = $(this.oOption.cContainer).find('#' + this.oOption.cGridContainer);


        this.resizeBody()

    },
    resizeBody: function () {
        var self = this;
        $(window).resize(function () {
            $(self.oOption.cContainer).css("width", $(window).width() - $('.ex-layout-sider').width()+'px');
            $(self.oOption.cContainer).css({ height: $(window).height() });
            $('#' + self.oOption.cGridContainer).setGridWidth($(self.oOption.cContainer).width());
            $('#' + self.oOption.cGridContainer).setGridHeight($(self.oOption.cContainer).height() - $('.ex-layout-form-search').height() - 79);
        });

    },

    // 监听外部事件
    initOn: function () {
        // 查询数据
        this._oParent.on("jqGrid.query", this.query, this);
    },

    // 初始化grid界面
    initGrid: function (oOpt) {

        ES.extend(this.oJqGridOption, oOpt);
        this.oJqGrid = $('#' + this.oOption.cGridContainer).jqGrid(this.oJqGridOption);

    },

    // 获得相关的列数据,可以重新
    setColumns: function () {

        var aoCol = [
            //{label: '编号', name: 'Id',  editable: true, align: 'center'},
            {label: '名称', name: 'EventTypeName', editable: true, width: 200, align: 'center'},
            {label: '最大处置时间', name: 'MaxDealTime', align: 'center'},
            {
                label: '单位', name: 'Unit', align: 'center', formatter: function (val, opt, item) {
                var _checkhtml = '';
                //假数据
                //var _num = Math.round(Math.random() * 1);
                if (item.Unit === 1) {
                    _checkhtml = '分'
                } else if (item.Unit === 2) {
                    _checkhtml = '小时'
                }
                else {
                    _checkhtml = '天'
                }
                return _checkhtml;
            }
            },

            {label: '最大评分', name: 'MaxScore', align: 'center'},

            {label: '自动结案', name: 'IsAutoClose', editable: true, align: 'center', formatter: function (val, opt, item) {
                var _checkhtml = '';
                //假数据
                //var _num = Math.round(Math.random() * 1);
                if (item.IsAutoClose == 1) {
                    _checkhtml = '<input type="checkbox" checked  disabled="disabled" />'
                } else {
                    _checkhtml = '<input type="checkbox" disabled="disabled" />'
                }
                return _checkhtml;
            }},
            {label: '案件上报', name: 'IsEventReport', editable: true, align: 'center', formatter: function (val, opt, item) {
                var _checkhtml = '';

                if (item.IsEventReport == 1) {
                    _checkhtml = '<input type="checkbox" checked  disabled="disabled" />'
                } else {
                    _checkhtml = '<input type="checkbox"  disabled="disabled" />'
                }
                return _checkhtml;
            }},

            {label: '日常考核', name: 'IsAutoCheck', editable: true, align: 'center', formatter: function (val, opt, item) {
                var _checkhtml = '';

                if (item.IsAutoCheck == 1) {
                    _checkhtml = '<input type="checkbox" checked  disabled="disabled" />'
                } else {
                    _checkhtml = '<input type="checkbox" disabled="disabled" />'
                }
                return _checkhtml;
            }},

            {
                label: "操作",
                name: "actions",
                width: 450,
                align: 'center',
                formatter: function (val, opt, item) {
                    var content = '';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default addEC"><i class="ec-icon-plus addEC"></i>  新增</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default edit" ><i class="ec-icon-edit edit"></i>  编辑</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-danger del"><i class="ec-icon-trash-o del"></i>  删除</button>';
                    return content;
                }
            }
        ];

        this.aoCol = aoCol;

    },

    // 触发后台查询
    query: function (oData) {

        var postData = this.oJqGrid.jqGrid("getGridParam", "postData");
        if(!postData.exparameters){
            postData.exparameters ={};
        }
        if(oData){
            ES.extend(postData.exparameters, oData.oParam);
        }

        this.oJqGrid.jqGrid("setGridParam", { page: 1, postData: postData }).trigger("reloadGrid");

    },

    // 刷新grid 的宽度
    reflesh: function (nWidth,nHeight) {
        $(this.oOption.cContainer).css({width:nWidth, height:nHeight});
        this.$_oGrid.css({width:nWidth, height:nHeight});
    },

});

// 对查询控件的包装
ES.Common.BaseJqGrid.include({


    initEvent:function() {
        var self = this;

        // 注册查询事件
        this.oSearchBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            var oParam = {EventTypeName: cSearchVal};

            // 触发查询
            self.query({oParam: oParam});

        });

    },



});

/**
 * Created by liulin on 2016/11/29.
 *
 * think:
 * 加载数据有3种方式
 * A. 直接ajax加载数据
 * B. 外部数据加载
 * C. 间接加载数据
 *
 */


ES.Common.DtGrid = ES.Class.extend({

    oOption: {
        // 容器
        cContainer: '',
        // grid id
        cGridContainer: 'dtGridTrackContainer',
        // 分页菜单id
        cPagerContainer: 'dtGridTrackToolBarContainer',

        bAjaxLoad: false,

        // 是否立即加载数据
        bInitLoad: true,

        cUrl: null,

        oDefaultParam: {},

        dtGridOption: {
            lang: 'zh-cn',
            ajaxLoad: false,
            check: false,
            exportFileName: 'grid',
            tools: 'refresh|print',//'refresh|faseQuery|advanceQuery|export[excel,csv,pdf,txt]|print',
            pageSize: 10,
            pageSizeLimit: [10, 20, 30, 50],
        }
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption,aoCol) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        // 保存 grid 中的数据
        this._aoData = [];
        // 设置集合
        if(oOption.aoData){
            this._aoData = oOption.aoData;
        }

        if (typeof this.oOption.cContainer === 'object') {

            // 父亲级容器
            this.$_oContainer = this.oOption.cContainer;
        }
        else {
            this.$_oContainer = $(this.oOption.cContainer);
        }

        this.aoCol = aoCol||[];

        this.initOn();

        this.initUI();

        this.setColumns();

        this._loadMode();

        this.initGrid();

        if (this.oOption.bInitLoad) {
            this.dtGrid.load();
        }

        // 如果是第三种模式,加载数据，url 不为空，bAjax = false
        this._loadData();
    },

    // 判断加载数据的方式
    _loadMode: function () {
        var oOption = {};
        oOption = ES.extend(oOption, this.oOption.dtGridOption,
            {
                ajaxLoad: true,
                loadURL: this.oOption.cUrl,
                columns: this.aoCol,
                gridContainer: this.oOption.cGridContainer,
                toolbarContainer: this.oOption.cPagerContainer,
            });
        if (!this.oOption.bAjaxLoad) {
            ES.extend(oOption,
                {
                    ajaxLoad: false,
                    datas: this._aoData,
                });

        }

        this.dtGridOption = oOption;
    },

    _loadData: function () {
        //bAjaxLoad: false,
        //    cUrl: '',
        if (!this.oOption.bAjaxLoad && this.oOption.cUrl) {

            ES.getData({}, this.oOption.cUrl, this.loadDataHandler, this);
        }
    },

    // 加载数据
    loadDataHandler: function (oData) {

        if ($.isArray(oData)) {
            this.addRows(oData);
        }
        else {
            this.addRows(oData.aoData);
        }

    },

    initUI: function () {
        var oGrid =  this.$_oContainer.find('#' + this.oOption.cGridContainer);

        if (!oGrid || oGrid.length <= 0) {
            this.$_oContainer.append('<div id="' + this.oOption.cGridContainer + '" class="dt-grid-container"></div>');
            this.$_oContainer.append('<div id="' + this.oOption.cPagerContainer + '" class="dt-grid-toolbar-container"></div>');
        }
    },

    // 监听外部事件
    initOn: function () {

        // 添加数据
        this._oParent.on('DtGrid.addRows', this.addRows, this);

        // 更新行数据
        this._oParent.on('DtGrid.updateRow', this.updateRow, this);

        //
        this._oParent.on('DtGrid.query', this.query, this);
    },

    // 给 grid 添加数据
    addRows: function (aoData, bIsClear) {
        if (!aoData) {
            return;
        }
        if (bIsClear) {
            this._aoData.splice(0, this._aoData.length);
        }
        $.merge(this._aoData, aoData);
        if (this.dtGrid) {
            this.dtGrid.reload(true);
        }
    },

    clearGrid: function () {
        if (!this._aoData || this._aoData.length <= 0) {
            return;
        }
        this._aoData.splice(0, this._aoData.length);
        if (this.dtGrid) {
            this.dtGrid.reload(true);
        }
    },

    // 更新行数据
    updateRow: function ( ) {

    },

    // 删除行数据
    delRow: function ( ) {

    },

    // 初始化grid界面
    initGrid: function () {
        var self = this;

        ES.extend(this.dtGridOption, {
            onRowClick: function (value, record, column, grid, dataNo, columnNo, cell, row, extraCell, e) {
                self.initClick(e, record);

            },
            onCheck: function (isChecked, record, grid, dataNo, row, extraCell, e) {

                self.checkHandler(isChecked, record, e);
            },
            onGridComplete: function (grid, e) {
                self.gridComplete(grid, e);
            }
        });

        var dtgrid = $.fn.DtGrid.init(this.dtGridOption);
        this.dtGrid = dtgrid;
        this.dtGrid.parameters = this.oOption.oDefaultParam;

    },

    //isChecked, record, e
    checkHandler: function () {

    },

    //grid, e
    gridComplete: function () {
        ES.removeAn($(this.oOption.cContainer));
    },

    // grid 绑定点击事件
    //e, record
    initClick: function () {

    },

    height: function (nH) {
        nH = nH || 200;
        $('#' + this.oOption.cGridContainer).height(nH);
    },

    width: function (nW) {
        nW = nW || 200;
        $('#' + this.oOption.cGridContainer).width(nW);
    },

    // 获得相关的列数据,可以重新
    setColumns: function () {


        //var self = this;

        var aoCol = [
            //{
            //    id: 'VehicleStatus',
            //    title: '当前状态',
            //    type: 'string',
            //    columnClass: 'text-center'
            //},
            //{
            //    id: 'VehicleNo',
            //    title: '车牌号',
            //    type: 'string',
            //    columnClass: 'text-center'
            //},
            //
            //{
            //    id: 'Direction',
            //    title: '方向',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //
            //        var content = self._oParent.getDire(value);
            //        return content;
            //    }
            //},
            //
            //{
            //    id: 'Speed',
            //    title: '速度',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //
            //        var content = value + " Km/h";
            //        return content;
            //    }
            //},
            //
            //{
            //    id: 'PhoneNum',
            //    title: '期望角度',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //
            //        var content = (record.NJAngleExp || 0) + ' °';
            //        return content;
            //    }
            //},
            //{
            //    id: 'PhoneNum',
            //    title: '实际角度',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //        var content = (record.NJAngleReal || 0) + ' °';
            //        return content;
            //    }
            //},
            //
            //{
            //    id: 'PhoneNum',
            //    title: '横向偏差',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //
            //        var content = (record.NJDistanceErr || 0) + ' 厘米';
            //        return content;
            //    }
            //},
            //{
            //    id: 'PhoneNum',
            //    title: '航向角偏差',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //        var content = (record.NJHeadingErr || 0) + ' °';
            //        return content;
            //    }
            //},
            //{
            //    id: 'Speed',
            //    title: '作业面积',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //
            //        var content = (record.NJJobArea || 0) + ' 亩';
            //        return content;
            //    }
            //},
            //{
            //    id: 'GpsDateTime',
            //    title: '定位时间',
            //    type: 'date',
            //    columnClass: 'text-center',
            //    format: 'yyyy-MM-dd hh:mm:ss',
            //    otype: 'string',
            //    oformat: 'yyyy-MM-dd hh:mm:ss'
            //},
            //{
            //    id: 'PoiInfo',
            //    title: '位置信息',
            //    type: 'number',
            //    columnClass: 'text-center',
            //    hideType: 'xs'
            //},
            //{
            //    id: 'operation',
            //    title: '操作',
            //    type: 'string',
            //    columnClass: 'text-center grid-blue',
            //    resolution: function (value, record, column, grid, dataNo, columnNo) {
            //        var content = '';
            //        content += '<a  href="javascript:void(0);" title="详细" ><i class="ec-icon-eye"></i></a>';
            //        content += '&nbsp;&nbsp;';
            //        //content += '<a  href="javascript:void(0);" title="定位"><i class="ec-icon-link"></i></a>';
            //        //content += '&nbsp;&nbsp;';
            //        //content += '<a  href="javascript:void(0);" ><i class="ec-icon-user"></i></a>';
            //        //content += '&nbsp;&nbsp;';
            //        //content += '<a  href="javascript:void(0);" ><i class="ec-icon-pencil"></i></a>';
            //        //content += '&nbsp;&nbsp;';
            //        content += '<a  href="javascript:void(0);" title="取消跟踪"><i class="ec-icon-trash"></i></a>';
            //        return content;
            //    }
            //}
        ];

        $.merge(this.aoCol, aoCol);


    },

    // 触发后台查询，要做缓存查询
    query: function (oData) {
        // 添加查询层
        ES.loadAn($(this.oOption.cContainer));
        //var oParam = {};
        //ES.extend(oParam, oData.oParam, this.oOption.oDefaultParam);
        ES.extend(this.oOption.oDefaultParam, oData.oParam);
        // 重新设置查询条件
        this.dtGrid.parameters = this.oOption.oDefaultParam;
        this.dtGrid.refresh(true);

    },

    // 清空所有的选着
    uncheck: function () {
        $('input[id*=dt_grid_' + this.dtGrid.option.id + '_check_]').removeAttr('checked');
    }

});


ES.Common.dtGrid = function (oParent, oOption) {
    return new ES.Common.DtGrid(oParent, oOption);
};



/**
 * Created by liulin on 2016/12/12.
 *
 *
 *  think:
 * 加载数据有3种方式
 * A. 直接ajax加载数据
 * B. 外部数据加载
 * C. 间接加载数据
 */


ES.Common.JgGrid = ES.Class.extend({

    oOption: {
        // 容器
        cContainer: '',
        // grid id
        cGridContainer: 'dtGridTrackContainer',
        // 分页菜单id
        cPagerContainer: 'dtGridTrackToolBarContainer',
        //cTools: 'refresh|faseQuery|advanceQuery|export[excel,csv,pdf,txt]|print',
        bAjaxLoad: false,
        cUrl: null,

        oDefaultParam: {},

        jqGridOption: {
            ajaxLoad: false,
            url:'',
            mtype: "POST",
            datatype: "json",
            //datas: this._aoData，

            page: 1,
            subGrid: true,
            subGridRowExpanded: null,
            subGridOptions: {
                url: '',
                mtype: "POST",
                datatype: "json",
                reloadOnExpand: false,
                selectOnExpand: true,
                subGrid: false,
                subGridRowExpanded: null,
                subGridOptions: {},
            },
            rowNum: 20,
            rowList: [20, 30, 50],
            multiselect: true,
        }
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        // 保存 grid 中的数据
        this._aoData = [];
        this.aoCol = [];

        this.initOn();

        this.initUI();

        this.setColumns();

        this._loadMode();

        this.initGrid();

        if (this.oOption.bAjaxLoad) {
            this.jqGrid.query();
        }

        // 如果是第三种模式,加载数据，url 不为空，bAjax = false
        this._loadData();
    },

    // 判断加载数据的方式
    _loadMode: function () {
        var oOption = {};
        oOption = ES.extend(oOption, this.oOption.jqGridOption,
            {
                ajaxLoad: true,
                loadURL: this.oOption.cUrl,
                columns: this.aoCol,
                gridContainer: this.oOption.cGridContainer,
                toolbarContainer: this.oOption.cPagerContainer,

            });
        if (!this.oOption.bAjaxLoad) {
            ES.extend(oOption,
                {
                    ajaxLoad: false,
                    datas: this._aoData

                });

        }

        this.jqGridOption = oOption;
    },

    _loadData: function () {

        if (!this.oOption.bAjaxLoad && this.oOption.cUrl) {

            ES.getData({}, this.oOption.cUrl, this.loadDataHandler, this);
        }
    },

    // 加载数据
    loadDataHandler: function (oData) {

        if ($.isArray(oData)) {
            this.addRows(oData);
        }
        else {
            this.addRows(oData.aoData);
        }

    },

    initUI: function () {
        var oGrid = $(this.oOption.cContainer).find('#' + this.oOption.cGridContainer);

        if (!oGrid || oGrid.length <= 0) {
            $(this.oOption.cContainer).append('<div id="' + this.oOption.cGridContainer + '" class="dt-grid-container"></div>');
            $(this.oOption.cContainer).append('<div id="' + this.oOption.cPagerContainer + '" class="dt-grid-toolbar-container"></div>');
        }
    },

    // 监听外部事件
    initOn: function () {

        // 添加数据
        this._oParent.on("jqGrid.addRows", this.addRows, this);

        // 更新行数据
        this._oParent.on("jqGrid.updateRow", this.updateRow, this);

        //
        this._oParent.on("jqGrid.query", this.query, this);
    },

    // 初始化grid界面
    initGrid: function () {
        var self = this;

        ES.extend(this.jqGridOption, {
            onSelectRow: function (id, record, e) {
                self.initClick(e, record);
            }
        });

        var jqGrid = $.fn.jgGrid.init(this.jqGridOption);
        this.jqGrid = jqGrid;
        this.jqGrid.parameters = this.oOption.oDefaultParam;

        //dtgrid.load();
    },

    // grid 绑定点击事件e, record
    initClick: function () {

    },

    height: function (nH) {
        nH = nH || 200;
        $('#' + this.oOption.cGridContainer).height(nH);
    },

    width: function (nW) {
        nW = nW || 200;
        $('#' + this.oOption.cGridContainer).width(nW);
    },

    // 获得相关的列数据,可以重新
    setColumns: function () {

        var aoCol = [
            {label: 'ID', name: 'OrderID', key: true, editable: false, width: 25, align: 'center'},
            {label: '组织架构名称', name: 'CustomerID', editable: true},
            {label: '组织架构描述', name: 'OrderDate', editable: true, align: 'center'},
            {label: '电话', name: 'Freight', editable: true},
            {label: '传真', name: 'CustomerID', editable: true},
            {label: '日期', name: 'OrderDate', editable: true, align: 'center'},
            {
                label: '操作',
                name: 'actions',
                formatter: function formatHtml(cellValue, options, rowObject) {
                    var Html = '<a class="ec-btn ec-btn-default ec-btn-sm ec-radius" ><i class="ec-icon-pencil"></i>&nbsp;编辑</a>&nbsp;' +
                        '<a class="ec-btn ec-btn-primary ec-btn-sm ec-radius" ><i class="ec-icon-plus"></i>&nbsp;资源分类授权</a>&nbsp;' +
                        '<a class="ec-btn ec-btn-danger ec-btn-sm ec-radius" ><i class="ec-icon-trash-o"></i>&nbsp;删除</a>';
                    return Html;
                },
                align: 'center',
                width: 250
            }
        ];
        $.merge(this.aoCol, aoCol);
    },

    // 触发后台查询
    query: function (oData) {

        var oParam = {};
        ES.extend(oParam, oData.oParam);

        // 重新设置查询条件
        this.jqGrid.parameters = oParam;
        this.jqGrid.query();

    },

});

// 加载本地数据
ES.Common.JgGrid.include({

    // 更新行数据
    updateRow: function ( ) {

    },

    // 删除行数据
    delRow: function ( ) {

    },

    // 给 grid 添加数据
    addRows: function (aoData, bIsClear) {
        if (!aoData) {
            return;
        }
        if (bIsClear) {
            this._aoData.splice(0, this._aoData.length);

        }
        $.merge(this._aoData, aoData);
        if (this.jqGrid) {
            this.jqGrid.query();
        }
    },

});

ES.Common.jqGrid = function (oParent, oOption) {
    return new ES.Common.JgGrid(oParent, oOption);
};



/**
 * Created by liulin on 2016/12/14.
 *
 * list view 的基本操作
 *
 *
 */


// 加载list
ES.Common.ListView = ES.Class.extend({

    oOption: {
        // list 容器
        cSelecter: '.ex-layout-content>.ex-layout-panel>.ec-u-lg-2>.ec-panel-collapse>.ec-padding-top-0>ul',
        // 树url
        cUrl: '/ResourceType/GetResourceGroup',
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.$_oContainer = this.getContainer();

        // 初始化界面
        this.initUI();

        this.initOn();

    },

    initOn: function () {
        this._oParent.on('ListView.reflesh', this.reflesh, this);
    },

    getContainer: function () {
        var $_oContainer = $(this.oOption.cSelecter);
        if (typeof this.oOption.cSelecter === 'object') {
            $_oContainer = this.oOption.cSelecter;
        }
        return $_oContainer;
    },

    // 加载界面
    initUI: function () {
        //清空所有的li 对象
        this.$_oContainer.empty();
        ES.getData({}, this.oOption.cUrl, this.initUIHandler, this);
    },
    reflesh: function () {
        this.initUI();
    },

    // 加载界面
    initUIHandler: function (oData) {
        if (!oData) {
            return;
        }

        var cHtml = '<li class="ec-cf">' +
            '<a class="ec-u-xs-12" href="javascript:void(0)">{ResourceName}<span class="badge">{Cnt}</span> </a> ' +
            '<b></b></li>';

        for (var i = 0; i < oData.length; i++) {
            var cTem = ES.template(cHtml, oData[i]);
            var oLI = $(cTem);

            oLI.data('oData', oData[i]);
            this.$_oContainer.append(oLI);
        }

        this.initEven();
    },

    initEven: function () {
        var self = this;
        var oContainer = this.getContainer();
        oContainer.find('li').bind('click', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            if (self._oParent) {
                self._oParent.fire(self._oParent.getEventName('cliOnclick'), {oData: $(this).data('oData')});
            }
        });

        oContainer.find('li:eq(0)').click();
    }
});

/**
 * Created by liulin on 2016/11/29.
 *
 * 弹出层
 *
 */

ES.Common.BaseDialog = ES.Evented.extend({

    oDOption: {
        fixed: true,
        align: 'right bottom',
        title: 'title',
        content: '<div></div>',
    },

    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);

        this.oDOption = {};

        ES.extend(this.oDOption, oDOption);

        this.initButton();

        this.initDialog();

        // 注册监听事件
        this.initOn();

        // 监听窗体事件
        this.initEvent();
    },

    // 接口
    initOn: function () {

    },

    // 初始化窗体
    initDialog: function () {
        var oDiaLog = dialog(this.oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },

    // 初始化 button
    initButton: function () {
        var self = this;
        var aoButton = [

            {
                id: 'cancel',
                value: ES.Lang.BaseDialog[2],
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
            {
                value: ES.Lang.BaseDialog[1],
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            }
        ];
        this.oDOption.button = aoButton;
    },


    // 注册窗体事件
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }

        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
    },


    showModal: function (oData, cTitle) {
        this.oBusData = oData;
        if (cTitle) {
            this.oDialog.title(cTitle);
        }

        this.oDialog.showModal();
    },

    // 内容赋值后，需要重新设置事件
    setContent: function (cHTML) {

        this.oDialog.content(cHTML);

        return this;
    },

    // 隐藏脚部 脚部 包含按钮，状态check
    hideFooter: function () {
        this.oDialog._$('footer').hide();
    },

    // 保存业务数据
    save: function () {

    },

    // 保存数据成功后回调
    saveHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));
        //var oData = oTemp.oData;
        var bAdd = false;
        if (!oData) {
            ES.aErr(ES.Lang.BaseDialog[34]);
            this._oParent.fire(this.oOption.cErrEventName);
            return;
        }
        // if (!oData.nId) {
        //     bAdd = true;
        // }

        if (oData.IsSuccess) {
            ES.aSucess('操作成功！');
            this._oParent.fire(this.oOption.cSuccessEventName);

            if (this.oOption.bRemove) {
                this.oDialog.remove();
            }
            else {
                this.oDialog.close();
            }
        }
        else {

            ES.aErr(ES.template('操作失败: {Message}', oData));
            this._oParent.fire(this.oOption.cErrEventName);
        }
    },

});








/**
 * 弹出地图
 * Created by liulin on 2016/12/22.
 */

ES.Common.BaseDialog.Map = ES.Common.BaseDialog.extend({

    oUIConfig: {
        div: {
            //'class':'ex-layout-content1',
            style:'float:left !important;',
            div: {
                'class': 'ex-layout-map-content', id: '{cDivContainerID}',
                div: [
                    {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'},
                    {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right ex-maptool-edit'},
                    {'class': 'ex-layout-maptool ex-map-bottom ex-map-left'},
                    {'class': 'ex-layout-maptool ex-theme-maptool ex-map-bottom ex-map-right',}
                ]
            }
        }
    },


    initialize: function (oParent, oOption,oDOption) {
        oDOption.content =  this.initContain(oOption);
        ES.Common.BaseDialog.prototype.initialize.call(this, oParent, oOption,oDOption);
    },

    // 给树的上级容器做id
    initContain: function (oOption) {
        var $_oTemp = ES.getTag(this.oUIConfig);
        var cHtml = ES.template($_oTemp.prop("outerHTML"), oOption);

        return cHtml
    },

    initOn: function () {

    },

    initButton: function () {
        this.oOption.button = [];
    },

    Show: function (oData) {
        this.oBusData = oData.oModel;
        this.oDialog.showModal();
    },

    // 弹出对话框后在加载树
    afterOpen: function () {
        // 初始化树结构

        this.$_oContainer = $('#' + this.oOption.cDivContainerID);
        if (!this.oMapMaster) {
            this.InitMap();
            this.loadMapToolArea();
        }

        if(this.oBusData)
        {
            this.oDialog.title('编辑工地围栏');
            //在地图上画围栏
        }

    },

    // 加载事件
    initEvent:function(){
        ES.Common.BaseDialog.prototype.initEvent.call(this);
        var self = this;
        $('#' + this.oOption.cDivContainerID).find('button.ok').bind('click',function(){
            self.fire('button:ok');
        });

        $('#' + this.oOption.cDivContainerID).find('button.cancle').bind('click',function(){
            self.fire('button:cancle');
        });
    },

    showModal: function (oData) {
        this.oBusData = oData;


        this.oDialog.showModal();
        this.oDialog._$('footer').hide();

    },

    // 加载地图
    InitMap: function () {
        var nMapWidth = 900;
        var nMapHeight = 500;

        this.oMapMaster = new L.MapLib.MapMaster.Map(this, {
            cDidId: this.oOption.cDivContainerID,
            oMapOption: {
                zoomControl: false,
                layers: [],
                center: new L.LatLng(ES.oConfig.dLat, ES.oConfig.dLng),
                zoom: 10
            },
            nMapWidth:nMapWidth,
            nMapHeight:nMapHeight,
        });

        this.oMapMaster.loadMapMaster();
    },

    // 加载工具栏
    loadMapToolArea: function () {
        //this.oToolArea = new L.MapLib.MapControl.ESMapToolArea(this.oMapMaster, {});
        // 地图工具
        this.oToolBox = new L.MapLib.MapControl.ESMapToolBox(this.oMapMaster, {});
        // 地图瓦片
        this.oToolTile = new L.MapLib.MapControl.ESMapTile(this.oMapMaster, {});

        // 地图poi查询
        new L.MapLib.MapControl.ESMapSearch(this.oMapMaster, {});
        // 编辑工具
        this.oToolEdit = new L.MapLib.MapControl.ESPOpMapEdit(this.oMapMaster, {
            acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-right','ex-maptool-edit'],

        });
    },

});

/**
 * Created by liulin on 2017/11/7.
 */

ES.Common.BaseDialog.MapMarkerDlg = ES.Common.BaseDialog.Map.extend({

    // 加载工具栏
    loadMapToolArea: function () {
        //this.oToolArea = new L.MapLib.MapControl.ESMapToolArea(this.oMapMaster, {});
        // 地图工具
        this.oToolBox = new L.MapLib.MapControl.ESMapToolBox(this.oMapMaster, {});
        // 地图瓦片
        this.oToolTile = new L.MapLib.MapControl.ESMapTile(this.oMapMaster, {});

        // 地图poi查询
        new L.MapLib.MapControl.ESMapSearch(this.oMapMaster, {});
        // 编辑工具
        this.oToolEdit = new L.MapLib.MapControl.MapEditPos(this.oMapMaster, {
            acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-right','ex-maptool-edit'],

        });
    },

});

/**
 * Created by liulin on 2017/2/27.
 */

ES.Common.BaseDialog.MapMarkerSelect= ES.Common.BaseDialog.Map.extend({

    // 加载工具栏
    loadMapToolArea: function () {
        this.oToolArea = new ES.MapControl.ESMapToolArea(this.oMapMaster, {});
        this.oToolBox = new ES.MapControl.ESMapToolBox(this.oMapMaster, {});
        this.oToolTile = new ES.MapControl.ESMapTile(this.oMapMaster, {});

        new ES.MapControl.ESMapSearch(this.oMapMaster, {});
        this.oToolEdit = new ES.MapControl.MapEditPos(this.oMapMaster, {
            acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-right','ex-maptool-edit'],
        });

    },

})


/**
 * Created by liulin on 2016/12/6.
 */


ES.Common.DialogDel = ES.Common.BaseDialog.extend({

    oOption: {
        cDelEventName: 'DialogDel:Edit',
        cSuccessEventName: 'DialogDel:Success',
        cErrEventName: 'DialogDel:Err',
        cUrl:'',
        // 是否移除窗体
        bRemove:false,
        // 弹出窗体配置文件
        oDialogConfig: {
            fixed: true,
            align: 'right bottom',
            title: 'title',
            content: '确定要删除数据吗？',
        },
    },

    initialize: function (oParent, oOption,oDOption) {
        ES.Common.BaseDialog.prototype.initialize.call(this, oParent, oOption, oDOption);
        // 窗体保存的业务数据
        this.oBusData = null;
    },

    // 注册事件
    initOn: function () {
        this._oParent.on(this.oOption.cDelEventName, this.del, this);
    },

    // 加载html
    del: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },

    // 保存数据
    save: function () {
        if (!this.oBusData) {
            ES.aWarn(ES.Lang.BaseDialog[30]);
            return;
        }

        ES.loadAn($(this.oDialog.node));

        ES.getData(this.oBusData, this.oOption.cUrl, this.saveHandler, this);
    },

});

/**
 * name:        DialogEdit.js
 * des:         编辑实体数据
 *
 * Created by liulin on 2016/12/6.
 */

// 新增修改角色
ES.Common.DialogEdit = ES.Common.BaseDialog.extend({

    oOption: {
        cEditEventName: 'DialogEdit:Edit',
        cAddEventName: 'DialogEdit:Add',
        cSuccessEventName: 'DialogEdit:Success',
        cErrEventName: 'DialogEdit:Err',
        cUrl: '',
        // 是否移除窗体
        bRemove: false,
        // 弹出窗体配置文件
        oDialogConfig: {
            fixed: true,
            align: 'right bottom',
            title: 'title',
            content: '<div></div>',
        },
    },

    initialize: function (oParent, oOption, oDOption) {
        ES.Common.BaseDialog.prototype.initialize.call(this, oParent, oOption, oDOption);
        // 窗体保存的业务数据
        this.oBusData = null;
    },

    // 注册事件
    initOn: function () {
        this._oParent.on(this.oOption.cEditEventName, this.editShow, this);
        this._oParent.on(this.oOption.cAddEventName, this.addShow, this);
    },

    // 加载html
    editShow: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('编辑');

        this.oDialog.showModal();
    },

    addShow: function () {
        this.oBusData = null;
        this.oDialog.title('新增');
        this.oDialog.showModal();
    },

});



/**
 *
 * 树的弹出界面
 *
 * 直接把树集成进来
 *
 * Created by liulin on 2016/12/5.
 */


ES.Common.DialogTree = ES.Common.BaseDialog.extend({

    oOption: {
        // 保存数据的url
        cUrl: '',
        // 弹出层容器id
        //cDivContainer: '',
        // 树的check数据来源
        cTreeCheckUrl: '',

        cTreeUrl:'',

        cContentCls:'divContentId',

        // 是否移除窗体
        bRemove:false,

        // 弹出窗体配置文件
        cShowEventName:'DialogTree:show'
    },



    initialize: function (oParent, oOption, oDOption, oTOption) {

        this.oTOption = oTOption;
        // 设置弹出层的内容
        oDOption.content = ES.template(this.cHtml, {cContentCls: this.oOption.cContentCls});

        ES.Common.BaseDialog.prototype.initialize.call(this, oParent, oOption, oDOption);

    },


    initOn: function () {
        var cShowEventName = this.oOption.cShowEventName;
        if (!this._oParent || !this._oParent.on) {
            return;
        }
        this._oParent.on(cShowEventName, this.show, this);
    },



    // 点击确定时触发
    save: function () {

        ES.loadAn($(this.oDialog.node));


        //if (!this.oBusData) {
        //    ES.aWarn(ES.Common.Pop.Lang[30]);
        //    return;
        //}
        // 回调保存接口
        var anId = this.getTreeCheckNode();
        var nId = this.oBusData.nId;

        ES.getData({anId: anId, nId: nId}, this.oOption.cUrl, this.saveHandler, this);

    },

    // 获得勾选的节点值aa
    getTreeCheckNode: function () {
        // 获得所有选中的数组
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var anSiteId = [];
        // 获得所有选中的节点id,工地id
        for (var i = 0; i < aoNodeId.length; i++) {
            if (!aoNodeId[i]) {
                continue;
            }

            anSiteId.push(parseInt(aoNodeId[i]));
        }
        if (!anSiteId || anSiteId.length <= 0) {
            return [];
        }
        return anSiteId;
    },

    show: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },

    // 弹出对话框后在加载树
    afterOpen: function () {
        this.initTreeUI();
        this.initTree();
    },


});

ES.Common.DialogTree.include({
    cHtml:
    '<div style="padding-left:30px;" class = "{cContentCls}"> ' +
    '       <div class="ex-layout-struckbox-search">  ' +
    '          <div class="ec-input-group"> ' +
    '               <input type="text" class="ec-form-field ex-tree-search-ipt ex-tree-search-ipt-1" placeholder="请输入关键字"> ' +
    '                   <span class="ec-input-group-btn"> ' +
    '                       <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn ex-tree-search-btn-1" type="button"> ' +
    '                           <span class="ec-icon-search"></span>' +
    '                       </button>  ' +
    '                   </span>  ' +
    '           </div>  ' +
    '       </div>  ' +
    '       <div class="ex-layout-struckbox-content-1"></div>  ' +
    '   </div>',

    // 界面初始化
    initTreeUI: function () {
        this.$_oContainer = $('.' + this.oOption.cContentCls);
        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content-1');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt-1');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn-1');
        this.$_oContainer.find('h4').html(this.oOption.cTitle);
    },

    // 初始化树
    initTree: function () {

        if (!this.oTree) {
            this.oTree = this.$_oTreeContainer.jstree(this.oTOption);

            this.$_oTree = this.$_oTreeContainer.jstree(true);

            this.initTreeEvent();

            this.initCheckEvent();

        } else {
            //this.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            //this.$_oTree.refresh();
        }
    },

    //refleshTree: function () {
    //
    //},

    // 初始化树的事件
    initTreeEvent: function () {
        var self = this;

        this.oTree.on('ready.jstree', function (e, oThisNode) {
            if (!self.readyCallBack) {
                return;
            }
            self.readyCallBack(e, oThisNode);
        });

        this.oTree.on('after_open.jstree', function (e, oThisNode) {
            if (!self.treeAfterOpen) {
                return;
            }
            self.treeAfterOpen(e, oThisNode);
        });

        this.oTree.on('refresh.jstree', function (e, oThisNode) {
            if (!self.refreshCallBack) {
                return;
            }
            self.refreshCallBack(e, oThisNode);
        });

        this.oTree.on('select_node.jstree', function (e, oThisNode) {
            if (!self.selectCallBack) {
                return;
            }
            self.selectCallBack(e, oThisNode);
        });

        this.oTree.on("changed.jstree", function (e, oThisNode) {
            if (!self.changedCallBack) {
                return;
            }
            self.changedCallBack(e, oThisNode);
        });

        this.oTree.on("dblclick.jstree", function (e, oThisNode) {
            if (!self.dblclickCallBack) {
                return;
            }
            self.dblclickCallBack(e, oThisNode);
        });
    },

    // checkbox 相关的事件
    initCheckEvent: function () {
        var self = this;

        this.oTree.on('check_node.jstree', function (e, oThisNode) {
            if (!self.checkCallBack) {
                return;
            }
            self.checkCallBack(e, oThisNode);
        });

        // 取消 check 是的查询
        this.oTree.on('uncheck_node.jstree', function (e, oThisNode) {
            if (!self.uncheckCallBack) {
                return;
            }
            // 获得所有选中的数组
            self.uncheckCallBack(e, oThisNode);
        });

        // 选择所有节点触发
        this.oTree.on('check_all.jstree', function (e, oThisNode) {
            if (!self.checkAllCallBack) {
                return;
            }
            self.checkAllCallBack(e, oThisNode);
        });

        this.oTree.on('uncheck_all.jstree', function (e, oThisNode) {
            if (!self.uncheckAllCallBack) {
                return;
            }
            self.uncheckAllCallBack(e, oThisNode);
        });

    },

    //readyCallBack: function () {
    //    //ES.Util.reqData({url:this.oOption.cTreeCheckUrl,data:{nId:1}},this.initCheck,this);
    //},

    refreshCallBack: function () {
        this.initTreeCheck();
    },

    initTreeCheck: function () {
        this.uncheckAll();
        // 加载选择节点
        if (this.oTOption.cCheckUrl) {
            ES.getData(this.oBusData, this.oOption.cTreeCheckUrl, this.initCheck, this);
        }
    },

    initCheck: function (oData) {

        if (!oData|| !oData.rtnData || oData.rtnData.length <= 0) {
            return;
        }
        var anPerm = oData.rtnData;
        this.$_oTree.uncheck_all();
        this.setCheckNode(anPerm);
    },

    // 设置叶子节点为check，参数为叶子节点id
    setCheckNode: function (anData) {
        if (!anData || anData.length <= 0) {
            return;
        }
        for (var i = 0; i < anData.length; i++) {
            this.$_oTree.check_node(this.$_oTree.get_node(anData[i]));
        }
    },
});




/**
 * Created by liulin on 2016/12/8.
 */

// 树和grid 和 view
ES.Common.TreeGrid = ES.Common.BaseDialog.extend({

    oGridOption: {
        // 容器
        cContainer: '',
        // grid id
        cGridContainer: 'dtGridTrackContainer',
        // 分页菜单id
        cPagerContainer: 'dtGridTrackToolBarContainer',
        bAjaxLoad: false,
        cUrl: null,
        oDefaultParam: {},
        dtGridOption: {
            lang: 'zh-cn',
            ajaxLoad: false,
            check: false,
            exportFileName: 'grid',
            tools: 'refresh|faseQuery|advanceQuery|export[excel,csv,pdf,txt]|print',
            pageSize: 30,
            pageSizeLimit: [10, 20, 30, 50],
        }
    },

    oListViewOption: {},

    initialize: function (oParent, oOption, oTOption, oGOption, oLVOption) {
        this.oGOption = {};
        ES.extend(this.oGOption, this.oGridOption, oGOption);

        this.oLVOption = {};
        ES.extend(this.oLVOption, this.oListViewOption, oLVOption);

        this.oPopGrid = null;
        this.oGSearchInput = null;
        this.oGSearvhBtn = null;

        ES.Boss.Pop.Tree.prototype.initialize.call(this, oParent, oOption, oTOption);
    },

    afterOpen: function () {
        ES.Boss.Pop.Tree.prototype.afterOpen.call(this);
        this.oGSearchInput = $('#' + this.oOption.cDivContainer).find(this.oGOption.cSearchInputSel);
        this.oGSearvhBtn = $('#' + this.oOption.cDivContainer).find(this.oGOption.cSearchBtnSel);
        if (!this.oPopGrid) {
            // 加载grid结构
            this.oPopGrid = new ES.Boss.DtGrid.Tenant(this._oParent, this.oGOption);
        }
        else {
            // 情况所有的选择
            this.oPopGrid.uncheck();
        }
        this.initListView();
        this.initGSearchEvent();
    },

    initGSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oGSearvhBtn.bind('click', function () {
            if (!self.oPopGrid) {
                return;
            }
            var cSearchVal = self.oGSearchInput.val();
            // 触发查询

            self.oPopGrid.query({oParam: {TenantName: cSearchVal}});
        });
    },

    initListView: function () {
        if (!this.oPopListView) {
            // 加载grid结构
            this.oPopListView = new ES.Common.ListViewEx(this._oParent, this.oLVOption);
        }

        this.oPopListView.setBusData(this.oBusData);
        this.oPopListView.initUI();
    },

    // 初始化树，重载基类方法
    InitTree: function () {
        var self = this;
        if (!this.oPopTree) {
            this.oPopTree = new ES.Boss.JsTree(this._oParent, {
                cSelecter: this.oTreeContainer,
                // 树url
                cUrl: ES.template(this.oTOption.cTreeUrl, this.oBusData),
                // 属性控件使用的插件
                acPlugin: this.oTOption.acPlugin,
            });
            this.oPopTree.readyCallBack = function (obj, e) {
                // 默认选择第一个节点
                var oNode = e.instance.get_node(obj.target.firstChild.firstChild.lastChild);
                e.instance.select_node(oNode);
            };
            this.oPopTree.selectCallBack = function (obj, e) {
                //触发查询
                self._oParent.fire(self.oTOption.cSelectEventName, {oSelect: e, obj: obj});
            };
        } else {
            self.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            self.oPopTree.$_oTree.refresh();
        }
    },

    // 重新树的提交代码
    ok: function () {

        ES.loadAn($(this.oDialog.node));

        if (!this.oBusData) {
            ES.aWarn(ES.Common.Pop.Lang[30]);
            return;
        }
        // 回调保存接口
        var anPerm = this.oPopListView.getCheckNode();
        var nRoleId = this.oBusData.RoleId;

        ES.getData({lstId: anPerm, nRoleId: nRoleId}, this.oOption.cUrl, this.okHandler, this);

    },
});



// 加载list
ES.Common.ListViewEx = ES.Class.extend({

    oOption: {
        // list 容器
        cSelecter: '.ex-layout-content>.ex-layout-panel>.ec-u-lg-2>.ec-collapse>.ec-padding-0>ul',
        // 树url
        cUrl: '/ResourceType/GetResourceGroup',

        cId: 'TenantId'
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.$_oContainer = this.getContainer();

        this.initOn();

    },

    getCheckNode: function () {
        var self = this;
        var $_oContainer = this.getContainer();
        var anTemp = [];
        $_oContainer.find('li').each(function () {

            var oData = $(this).data('oData');
            if (!oData) {
                return true;
            }
            anTemp.push(oData[self.oOption.cId]);
            return true;
        });

        return anTemp;
    },

    getCheck: function (oData) {
        var anTemp = this.getCheckNode();
        $.merge(oData.anData, anTemp);
    },

    // 判断是否存在
    isExist: function (oModel) {
        var anTemp = this.getCheckNode();
        return $.inArray(oModel[this.oOption.cId], anTemp) >= 0;
    },


    setBusData: function (oBusData) {
        this.oBusData = oBusData;
    },

    initOn: function () {
        this._oParent.on(this._oParent.getEventName('cAddTenantUser'), this.Add, this);
        this._oParent.on(this._oParent.getEventName('cDelTenantUser'), this.Del, this);

        this._oParent.on(this._oParent.getEventName('cListViewData'), this.getCheck, this);//{ anData: anData }
    },

    cHtml: '<li>' +
    '<a  href="javascript:void(0)">{Name} </a> ' +
    '</li>',

    Add: function (oData) {
        var oModel = oData.oModel;
        if (this.isExist(oModel)) {
            return;
        }
        var $_oContainer = this.getContainer();
        var cTemp = ES.template(this.cHtml, oModel);

        var oLI = $(cTemp);
        oLI.data('oData', oModel);
        $_oContainer.append(oLI);
    },
    Del: function (oData) {
        var self = this;
        var oModel = oData.oModel;
        var $_oContainer = this.getContainer();
        $_oContainer.find('li').each(function () {

            var oData = $(this).data('oData');
            if (!oData) {
                return true;
            }
            if (oData[self.oOption.cId] === oModel[self.oOption.cId]) {
                $(this).remove();
                return false;
            }

            return true;
        });
    },

    getContainer: function () {
        var $_oContainer = $(this.oOption.cSelecter);
        if (typeof this.oOption.cSelecter === 'object') {
            $_oContainer = this.oOption.cSelecter;
        }
        return $_oContainer;
    },

    // 加载界面
    initUI: function () {
        //清空所有的li 对象
        this.$_oContainer.empty();
        ES.getData({}, ES.template(this.oOption.cUrl, this.oBusData), this.initUIHandler, this);
    },

    // 加载界面
    initUIHandler: function (oData) {
        if (!oData) {
            return;
        }
        var anId = [];
        for (var i = 0; i < oData.length; i++) {
            var cTem = ES.template(this.cHtml, oData[i]);
            var oLI = $(cTem);

            oLI.data('oData', oData[i]);
            this.$_oContainer.append(oLI);
            anId.push(oData[i][this.oOption.cId]);
        }
        // 完成后广播
        this._oParent.fire('ListView.loadFinish', {anId: anId});
    },
});



/**
 * Created by liulin on 2017/3/30.
 */

/**
 * jstreePenal.js
 * 查询、节点选择、树的基本操作集成组件
 *
 * 数据请求不要放在树控件里，放在其他地方
 *
 * Created by liulin on 2017/3/23.
 *
 * 树面板的资源在cHtml中，外面传入的只是资源id的容器，我们只能对他做删除操作
 *
 */

ES.Common.BaseTree = ES.Evented.extend({

    oOption: {
        // 树使用的容器
        cPContainer: '.ex-layout-struckbox-wrap',
    },

    oTreeOption:{

    },

    initialize: function (oParent, oOption, oTreeOption) {
        ES.extend(this.oTreeOption, oTreeOption);
        ES.setOptions(this, oOption);

        this._oParent = oParent;

        if (typeof  this.oOption.cPContainer === 'object') {
            this.$_oPContainer = this.oOption.cPContainer;
        } else {
            this.$_oPContainer = $(this.oOption.cPContainer);
        }

        // 初始化界面
        this.initUI();
        this.initTree();

        this.initSearchEvent();
    },

    // 获得外层容器的宽度
    getWidth: function () {

        return  this.$_oContainer.width();
    },

    initTreeTitle: function () {

        this.$_oContainer.find("a").each(function () {
            $(this).attr("title", $(this).text());
        })

    },

});

// ui面板
ES.Common.BaseTree.include({
    cUIConfig:
    '<div class="ex-layout-struckbox ex-theme-struckbox">' +
    '   <div class="ex-layout-struckbox-title ex-theme-struckbox-title"><h4 class="ec-align-left">工地地图</h4>' +
    '   </div>' +
    '   <div class="ex-layout-struckbox-wrap">' +
    '        <div class="ex-layout-struckbox-search">' +
    '             <div class="ec-input-group">' +
    '                 <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    '                 <span class="ec-input-group-btn">' +
    '                     <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button">' +
    '                         <span class="ec-icon-search"></span>' +
    '                     </button>' +
    '                 </span>' +
    '             </div>' +
    '         </div>' +
    '         <div class="ex-layout-struckbox-content"> </div>' +
    '    </div>' +
    '</div>',

    // 界面初始化
    initUI: function () {

        this.$_oContainer = $(this.cUIConfig);
        this.$_oPContainer.append(this.$_oContainer);

        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn');
        this.$_oContainer.find('h4').html(this.oOption.cTitle);
        //this.$_oContainer.find('h3').html(this.oOption.cTitle);

    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.$_oSearchBtn.bind('click', function () {
            if (!self.$_oTree) {
                return;
            }
            var cSearchVal = self.$_oSearchInput.val();
            // 触发查询
            self.$_oTree.search(cSearchVal, false, true);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.$_oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.$_oSearchInput.val();
                self.$_oTree.search(cSearchVal, false, true);
            }, 250);
        });
    },

});

// 树的初始化
ES.Common.BaseTree.include({

    // 构建树
    initTree: function () {

        this.oTree = this.$_oTreeContainer.jstree(this.oTreeOption);

        this.$_oTree = this.$_oTreeContainer.jstree(true);

        this.initTreeEvent();

        this.initCheckEvent();
    },

    // 初始化树的事件
    initTreeEvent: function () {
        var self = this;

        this.oTree.on('ready.jstree', function (e, oThisNode) {
                if (!self.readyCallBack) {
                return;
            }
            self.readyCallBack(e, oThisNode);
        });

            this.oTree.on('after_open.jstree', function (e, oThisNode) {
            if (!self.treeAfterOpen) {
                return;
            }
            self.treeAfterOpen(e, oThisNode);
        });

        this.oTree.on('refresh.jstree', function (e, oThisNode) {
            if (!self.refreshCallBack) {
                return;
            }
            self.refreshCallBack(e, oThisNode);
        });

        this.oTree.on('select_node.jstree', function (e, oThisNode) {
            if (!self.selectCallBack) {
                return;
            }
            self.selectCallBack(e, oThisNode);
        });

        this.oTree.on("changed.jstree", function (e, oThisNode) {
            if (!self.changedCallBack) {
                return;
            }
            self.changedCallBack(e, oThisNode);
        });

        this.oTree.on("dblclick.jstree", function (e, oThisNode) {
            if (!self.dblclickCallBack) {
                return;
            }
            self.dblclickCallBack(e, oThisNode);
        });
    },

    // checkbox 相关的事件
    initCheckEvent: function ()     {
        var self = this;

        this.oTree.on('check_node.jstree', function (e, oThisNode) {
            if (!self.checkCallBack) {
                return;
            }
            self.checkCallBack(e, oThisNode);
        });

        // 取消 check 是的查询
        this.oTree.on('uncheck_node.jstree', function (e, oThisNode) {
            if (!self.uncheckCallBack) {
                return;
            }
            // 获得所有选中的数组
            self.uncheckCallBack(e, oThisNode);
        });

        // 选择所有节点触发
        this.oTree.on('check_all.jstree', function (e, oThisNode) {
            if (!self.checkAllCallBack) {
                return;
            }
            self.checkAllCallBack(e, oThisNode);
        });

        this.oTree.on('uncheck_all.jstree', function (e, oThisNode) {
            if (!self.uncheckAllCallBack) {
                return;
            }
            self.uncheckAllCallBack(e, oThisNode);
        });

    },

    /*
     * 树的节点操作
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    getCheckId: function () {
        var cPrefix = this.oOption.cPrefix;
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var acRtn = null;

        if (cPrefix) {
            acRtn = aoNodeId.map(function (cItem) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return cItem;
                }
            });
        }
        else {
            acRtn = aoNodeId;
        }
        return acRtn;
    },

    /*
     * 获得自己和 孩子节点id
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    getSelfChildId: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }

        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {
            return acNodeId;
        }

        $.merge(acNodeId, oNode.children_d);
        var cPrefix = this.oOption.cPrefix;
        var acRtn = null;
        if (cPrefix) {

            acRtn = $.grep(acNodeId, function (cItem, i) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return true;
                }
            });

        }
        else {
            acRtn = acNodeId
        }

        return acRtn;
    },


    /*
     * 勾选回调函数
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    checkCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId()});
    },

    // 取消所有选择
    uncheckCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cUncheckEventName,{acId:this.getSelfChildId()});
    },


    // 取消所有的选择
    uncheckAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.uncheck_all) {
            return;
        }
        this.$_oTree.uncheck_all();
    },

    // 勾选 所有的选择
    checkAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.check_all) {
            return;
        }
        this.$_oTree.check_all();
    },


    // 设置叶子节点为check，参数为叶子节点id
    setCheckNode: function (anData) {
        if (!anData || anData.length <= 0) {
            return;
        }
        for (var i = 0; i < anData.length; i++) {
            this.$_oTree.check_node(this.$_oTree.get_node(anData[i]));
        }
    },


    getSelfChildNode: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }
        var aoRtn = [];
        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {

            if(cPrefix) {
                if (acNodeId[0].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
            }

            return aoRtn;
        }

        $.merge(acNodeId, oNode.children_d);

        var cPrefix = this.oOption.cPrefix;


        for(var i = 0;i< acNodeId.length;i++){
            if(cPrefix) {
                if (acNodeId[i].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
            }

        }

        return aoRtn;
    },

});

/**
 * Created by liulin on 2016/11/29.
 *
 *
 * 对jstree 的操作
 *
 */


ES.Common.JsTree = ES.Evented.extend({

    oOption: {
        // 树使用的容器
        cPContainer: '.ex-layout-struckbox-wrap',
    },

    oTreeOption:{
        'core': {
            'animation': 0,
            'check_callback': true,

            'state': {'opened': false},
            'data': {
                'url': '/MapMonitor/SiteTree',
            }
        },
        'checkbox': {
            'tie_selection': false
        },
        'plugins':['checkbox', 'types', 'search', 'state', 'unique'],

    },

    // 构造函数
    initialize: function (oParent, oOption, oTreeOption) {

        ES.extend(this.oTreeOption, oTreeOption);
        ES.setOptions(this, oOption);

        this._oParent = oParent;

        if (typeof  this.oOption.cPContainer === 'object') {
            this.$_oContainer = this.oOption.cPContainer;
        } else {
            this.$_oContainer = $(this.oOption.cPContainer);
        }

        // 初始化界面
        this.initTree();
        this.initEvent();
        this.initCheckEvent();
        this.initOn();

    },

    // 注册监听事件
    initOn: function () {
    },

    // 注册事件
    initEvent: function () {
    },

    // 构建树
    initTree: function () {
        // 树 对象
        this.oTree = this.$_oContainer.jstree(this.oTreeOption);

        // 树jquery 对象
        this.$_oTree = this.$_oContainer.jstree(true);

    },

    // 获得自己和 孩子节点id
    getSelfChildNode: function (oNode) {
        var acNode = [];
        if (!oNode) {
            return;
        }

        acNode.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {
            return acNode;
        }

        $.merge(acNode, oNode.children_d);
        return acNode;
    },

    initCheckEvent: function () {
        var self = this;
        if (!this.oTree) {
            return;
        }

        this.oTree.on('check_node.jstree', function (e, oThisNode) {
            if (!self.checkCallBack) {
                return;
            }
            self.checkCallBack(e, oThisNode);
        });

        // 取消 check 是的查询
        this.oTree.on('uncheck_node.jstree', function (e, oThisNode) {
            if (!self.uncheckCallBack) {
                return;
            }
            // 获得所有选中的数组
            self.uncheckCallBack(e, oThisNode);
        });

        // 选择所有节点触发
        this.oTree.on('check_all.jstree', function (e, oThisNode) {
            if (!self.checkAllCallBack) {
                return;
            }
            self.checkAllCallBack(e, oThisNode);
        });

        this.oTree.on('uncheck_all.jstree', function (e, oThisNode) {
            if (!self.uncheckAllCallBack) {
                return;
            }
            self.uncheckAllCallBack(e, oThisNode);
        });

        this.oTree.on('ready.jstree', function (e, oThisNode) {
            if (!self.readyCallBack) {
                return;
            }
            self.readyCallBack(e, oThisNode);
        });

        this.oTree.on('after_open.jstree', function (e, oThisNode) {
            if (!self.afterOpen) {
                return;
            }
            self.afterOpen(e, oThisNode);
        });

        this.oTree.on('refresh.jstree', function (e, oThisNode) {
            if (!self.refreshCallBack) {
                return;
            }
            self.refreshCallBack(e, oThisNode);
        });

        this.oTree.on('select_node.jstree', function (e, oThisNode) {
            if (!self.selectCallBack) {
                return;
            }
            self.selectCallBack(e, oThisNode);
        });

        this.oTree.on("changed.jstree", function (e, oThisNode) {
            if (!self.changedCallBack) {
                return;
            }
            self.changedCallBack(e, oThisNode);
        });

        this.oTree.on("dblclick.jstree", function (e, oThisNode) {
            if (!self.dblclickCallBack) {
                return;
            }
            self.dblclickCallBack(e, oThisNode);
        });

    },

    // 获得所有check 的节点数据
    getTreeCheckNode: function () {
        // 获得所有选中的数组
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var anSiteId = [];
        // 获得所有选中的节点id,工地id
        for (var i = 0; i < aoNodeId.length; i++) {
            if (!aoNodeId[i]) {
                continue;
            }

            anSiteId.push(parseInt(aoNodeId[i]));
        }
        if (!anSiteId || anSiteId.length <= 0) {
            return [];
        }
        return anSiteId;
    },

    // 获得 选择节点的id
    getCheckId: function (cPrefix) {

        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var acRtn = aoNodeId;

        if (cPrefix) {
            //acRtn = aoNodeId.map(function (cItem) {
            //    if (cItem.indexOf(cPrefix) === 0) {
            //        return cItem.replace(cPrefix, '')
            //    }
            //});
           var acTemp = [];
            $.each(aoNodeId, function (cItem,i) {
                cItem =   cItem.replace(cPrefix, '');
                acTemp.push(cItem);
            }) ;
            acRtn = acTemp;
        }
        return acRtn;
    },


    // 获得选中的叶子节点
    getLeafCheckNode: function () {

        var aoNodeId = this.$_oTree.get_bottom_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var anSiteId = [];
        // 获得所有选中的节点id,工地id
        for (var i = 0; i < aoNodeId.length; i++) {
            if (!aoNodeId[i]) {
                continue;
            }


            anSiteId.push(parseInt(aoNodeId[i]));
        }
        if (!anSiteId || anSiteId.length <= 0) {
            return [];
        }
        return anSiteId;
    },

    // 设置叶子节点为check，参数为叶子节点id
    setCheckNode: function (anData) {
        if (!anData || anData.length <= 0) {
            return;
        }

        for (var i = 0; i < anData.length; i++) {
            this.$_oTree.check_node(this.$_oTree.get_node(anData[i]));
        }
    },

    uncheckAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.uncheck_all) {
            return;
        }
        this.$_oTree.uncheck_all();
    },

    checkAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.check_all) {
            return;
        }
        this.$_oTree.check_all();
    },

    // 读后台的数据，让 checkbox 选中
    initCheck: function (anPerm) {
        if (!anPerm || anPerm.length <= 0) {
            return;
        }
        if ($.inArray('checkbox', this.oOption.acPlugin) >= 0){
            this.oPopTree.setCheckNode(anPerm);
        }
    },

});




/**
 * Created by exsun on 2017-01-09.
 *
 * 选择特定的节点 并负责
 *
 *
 */



ES.Common.SelectTree = ES.Evented.extend({

    oOption: {
        // 树的ur
        cUrl: '',
        // 弹出层容器
        cBandSel: '',

        cCheckUrl: '',
        // 树节点容器
        cTreeContainerSel: '.ex-tree-dom',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',
        // 监听事件，对外接口
        cEventName: 'cPermission',

        // 寻找节点的样式，叶子节点的样式
        cSelCls:'GridGroup',
    },

    cHtml:
    '<div class="ex-tree-select">' +
    '   <div class="ec-input-group">' +
    '       <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    '       <span class="ec-input-group-btn">' +
    '       <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button">' +
    '           <span class="ec-icon-search"></span>' +
    '       </button>' +
    '       </span>' +
    '   </div>' +
    '   <div class="ex-layout-struckbox-content ex-tree-dom"></div>' +
    '</div>',

    cHtmlCover:'<div class="ex-cover-tree-select" style="position: fixed; z-index: 1900; width:1000000px; height: 1000000px; top: -100000px; left: -100000px; display: block;"></div>',

    oTreeOption: {
        // 树的url
        //cTreeUrl: '',
        // 树所用的插件
        //acPlugin: ['checkbox', 'types', 'search', 'state', 'unique'],
        // 树的check数据来源
    },

    initialize: function (oParent, oOption, oTOption) {

        this.oTOption = {};
        ES.extend(this.oTOption, this.oTreeOption, oTOption);
        ES.setOptions(this,oOption);

        if(typeof this.oOption.cBandSel === 'object'){
            this.$_oBandContainer = this.oOption.cBandSel;
        }
        else {
            this.$_oBandContainer = $(this.oOption.cBandSel);
        }
        this.initObj();
        this.initEvent();

        this.oPopTree = null;
        this.oTreeContainer = null;
        this.oSearchInput = null;
        this.oSearvhBtn = null;

        this.bIn =false;
    },


    initOn: function () {
        var cEventName = this.oOption.cEventName;
        this._oParent.on(this._oParent.getEventName(cEventName), this.Show, this);
    },

    initObj: function () {
        // 选择树容器
        this.oTreeObj = $('<div cId="ex-common-select-tree">' + this.cHtml + '</div>');
        // 树的遮罩层
        this.$_oCover =  $(this.cHtmlCover);

    },

    initInEvent: function () {
        //var self = this;

        this.$_oCover.on('click',function(){
            $(this).siblings('div').hide();
            $(this).hide();
        });

    },

    initEvent: function () {
        var self = this;

        this.$_oBandContainer.bind('click focus', function (e) {
            var oObj = $(this).parent().find('div[cId="ex-common-select-tree"]');
            if (oObj && oObj.length > 0) {
                self.oTreeObj.show();

                $('.ex-cover-tree-select').show();
            }
            else {

                $(this).after(self.oTreeObj);
                $(this).after(self.$_oCover);
                //$(this).parent().append(self.oTreeObj);
                self.oTreeContainer = self.oTreeObj.find(self.oOption.cTreeContainerSel);
                self.oSearchInput = self.oTreeObj.find(self.oOption.cSearchInputSel);
                self.oSearvhBtn = self.oTreeObj.find(self.oOption.cSearchBtnSel);
                self.initSearchEvent();
                self.initTree();


            }
            self.initInEvent();
        });
    },


    initSelectTree:function(){

        $(this.$_oBandContainer).after(self.oTreeObj);
        $(this.$_oBandContainer).after(self.$_oCover);
        //$(this).parent().append(self.oTreeObj);
        this.oTreeContainer = this.oTreeObj.find(this.oOption.cTreeContainerSel);
        this.oSearchInput = this.oTreeObj.find(this.oOption.cSearchInputSel);
        this.oSearvhBtn = this.oTreeObj.find(this.oOption.cSearchBtnSel);
        this.initSearchEvent();
        this.initTree();
    },

});

// 注册查询事件
ES.Common.SelectTree.include({

    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {
            if (!self.oPopTree) {
                return;
            }
            var cSearchVal = self.oSearchInput.val();
            // 触发查询
            self.oPopTree.oTree.jstree(true).search(cSearchVal);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.oSearchInput.val();
                self.oPopTree.oTree.jstree(true).search(cSearchVal,false,true);
            }, 250);
        });
    },

    // 初始化树
    initTree: function () {
        var self = this;
        if (!this.oPopTree) {
            this.oPopTree = new ES.Common.JsTree(this._oParent, {
                cPContainer: this.oTreeContainer,
                cCheckUrl:this.oOption.cCheckUrl
            }, this.oTOption);

            this.oPopTree.readyCallBack = function () {
                self.initSelectNode();
            };

            this.oPopTree.afterOpen = function () {
                self.initSelectNode();
            };

            this.oPopTree.refreshCallBack = function () {
                //self.clearTree();
                //this.oSelectTree.on('selectVal',  this.setVal,this)
                self.initSelectNode();
            };
            this.oPopTree.selectCallBack = function (e, oThisNode) {
                //var node =oThisNode.node;// self.oPopTree.$_oTree.get_node(e.target);
                //self.fire('selectVal', { cVal:node.text,cId: node.id});
            };
            //this.oPopTree.selectCallBack = function () {
            //    //触发查询
            //}


            //this.oPopTree.unselectCallBack = function (e, oThisNode) {
            //    //var node =oThisNode.node;// self.oPopTree.$_oTree.get_node(e.target);
            //    //self.fire('selectVal', { cVal:node.text,cId: node.id});
            //};

        } else {
            //self.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            //self.oPopTree.$_oTree.refresh();

        }
    },

    // 重新加载树
    reload: function (url) {
        if (!this.oPopTree) {
            return;
        }
        this.oPopTree.$_oTree.settings.core.data.url = url;
        this.oPopTree.$_oTree.refresh();


    },

    // 注册单选事件
    initSelectNode: function () {
        var self = this;
        this.oTreeContainer.find('i.'+this.oOption.cSelCls).parent().parent().each(function () {
            var oInput = $(this).find('input[cId="selectNode"]');
            if(oInput && oInput.length>0){
                return;
            }

            var oRadio = $('<input type="radio" name = "'+self.oOption.cSelCls+'" style="vertical-align: sub;" cId="selectNode"  ></input>');
            $(this).find('a').prepend(oRadio);
            $(this).find('a').bind('click', function (e) {
                var node = self.oPopTree.$_oTree.get_node(e.target);
                self.fire('selectVal', { cVal:node.text,cId: node.id});
            })


        });
    },
});

/**
 * Created by liulin on 2017/1/18.
 */

ES.Common.SelectTreeNode = ES.Common.SelectTree.extend({
    // 注册单选事件
    initSelectNode: function () {
        //var self = this;
        //this.oTreeContainer.find('i.Department').parent().parent().each(function () {
        //    var oCheck = $('  <a>选择</a>');
        //
        //    $(this).append(oCheck);
        //    oCheck.bind('click', function (e) {
        //        var node = self.oPopTree.$_oTree.get_node(e.target);
        //        self.fire('selectVal', { cVal:node.text,cId: node.id});
        //    });
        //
        //});
    },



    initTree: function () {
        var self = this;
        if (!this.oPopTree) {
            this.oPopTree = new ES.Common.JsTree(this._oParent, {
                cPContainer: this.oTreeContainer,
                cCheckUrl:this.oOption.cCheckUrl
            }, this.oTOption);

            this.oPopTree.readyCallBack = function (e, oThisNode) {
                //self.initSelectNode();
                if(self.readyCallBack)
                {
                    self.readyCallBack(e, oThisNode);
                }
            };

            this.oPopTree.refreshCallBack = function () {
                //self.clearTree();
                //this.oSelectTree.on('selectVal',  this.setVal,this);
                //self.fire('selectVal',node);
            };
            this.oPopTree.selectCallBack = function (e, oThisNode) {
                var node =oThisNode.node;// self.oPopTree.$_oTree.get_node(e.target);
                self.fire('selectVal',node);
            };
            //this.oPopTree.selectCallBack = function () {
            //    //触发查询
            //}
        } else {
            //self.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            //self.oPopTree.$_oTree.refresh();
        }
    },

})


/**
 * TreePenal.js
 * 查询、节点选择、树的基本操作集成组件
 *
 * 数据请求不要放在树控件里，放在其他地方
 *
 * Created by liulin on 2017/3/23.
 *
 * 树面板的资源在cHtml中，外面传入的只是资源id的容器，我们只能对他做删除操作
 *
 */

ES.Common.TreePenal = ES.Common.BaseTree.extend({

    // 查询面板控件
    oOption: {

        // 面板的最上级容器，不是树容器
        cPContainer: '.ex-layout-main',

        // 标题
        cTitle:'树面板标题',

        // 树节点一般由多个表组成，围栏防止节点id有相同，在节点id前面加了前缀码,前缀码为空返回所有的节点元素
        cPrefix:undefined,

        // check 事件
        cCheckEventName:'Common:JsTreePenal.getCheckId',

        // uncheck 事件
        cUncheckEventName:'Common:JsTreePenal.getUncheckId',

        // 树显示
        cJsShowEvent:'Common:JsTreePenal.show',

        // 树隐藏
        cJsHideEvent:'Common:JsTreePenal.hide',
    },


    // 车辆列表构造函数
    initialize: function (oParent, oOption, oTOption) {
        // 设置树的属性
        this.oTreeOption = oTOption;

        // 合并属性
        ES.setOptions(this, oOption);

        // 设置父节点
        this._oParent = oParent;
        if (oParent && oParent._oParent) {
            // 整个页面通信容器
            this._oPage = oParent._oParent;
        }

        // 树容器
        this.$_oTreeContainer = null;
        // 查询容器
        this.$_oSearchInput = null;
        // 查询按钮
        this.$_oSearchBtn = null;
        // 是否check
        this.bCheck = true;

        if (typeof this.oOption.cPContainer === 'object') {
            this.$_oPContainer = this.oOption.cPContainer
        }
        else {
            this.$_oPContainer = $(this.oOption.cPContainer);
        }

        this.initUI();

        // 初始化界面
        this.initOn();

        this.initSearchEvent();

        this.initTree();

    },

　
    // 初始化界面
    initOn: function () {

        var self = this;

        // 内部面板监听
        this._oParent.on(this.oOption.cJsShowEvent, function () {
            self.$_oContainer.show();
        }, this);

        this._oParent.on(this.oOption.cJsHideEvent, function () {
            self.$_oContainer.hide();
        }, this);

        // 外部面板监听
        this._oPage.on("MapView:SiteStatic.Select", this.selectNode, this);

    },　
});

// ui面板
ES.Common.TreePenal.include({
    cUIConfig:
    '<div class="ex-layout-sider ex-theme-tree">' +
    '   <h3 class="ec-align-left">组织架构</h3>' +
    '   <div class="ex-layout-struckbox-search">' +
    '         <div class="ec-input-group">' +
    '              <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    '              <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button">' +
    '                       <span class="ec-icon-search"></span>' +
    '                   </button>' +
    '              </span>' +
    '          </div>' +
    '    </div>' +
    '    <div class="ex-layout-struckbox-content"> </div>' +
    '</div>',

    // 界面初始化
    initUI: function () {

        this.$_oContainer = $(this.cUIConfig);
        this.$_oPContainer.append(this.$_oContainer);

        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn');
        this.$_oContainer.find('h4').html(this.oOption.cTitle);

    },
　
});

　

/**
 * Created by liulin on 2017/3/30.
 */

ES.Common.TreePop = ES.Common.BaseTree.extend({

    // ��ѯ���ؼ�
    oOption: {

        // �������ϼ�����������������
        cPContainer: '.PContainer',

        // ���ڵ�һ���ɶ������ɣ�Χ����ֹ�ڵ�id����ͬ���ڽڵ�idǰ�����ǰ׺��,ǰ׺��Ϊ�շ������еĽڵ�Ԫ��
        cPrefix:undefined,

        cTreeCheckUrl:'',
        cTreeUrl:'',
    },


    // �����б����캯��
    initialize: function (oParent, oOption, oTOption) {
        // ������������
        this.oTreeOption = oTOption;

        // �ϲ�����
        ES.setOptions(this, oOption);

        // ���ø��ڵ�
        this._oParent = oParent;

        if (typeof this.oOption.cPContainer === 'object') {
            this.$_oPContainer = this.oOption.cPContainer
        }
        else {
            this.$_oPContainer = $(this.oOption.cPContainer);
        }
    },


    // ��ʼ������
    initOn: function () {

    },
});

// ui���
ES.Common.TreePop.include({
    cUIConfig:
    '<div style="padding-left:30px;"> ' +
'       <div class="ex-layout-struckbox-search">  ' +
'          <div class="ec-input-group"> ' +
'               <input type="text" class="ec-form-field ex-tree-search-ipt ex-tree-search-ipt-1" placeholder="������ؼ���"> ' +
'                   <span class="ec-input-group-btn"> ' +
'                       <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn ex-tree-search-btn-1" type="button"> ' +
'                           <span class="ec-icon-search"></span>' +
'                       </button>  ' +
'                   </span>  ' +
'           </div>  ' +
'       </div>  ' +
'       <div class="ex-layout-struckbox-content-1"></div>  ' +
'   </div>',

    // �����ʼ��
    initUI: function () {

        this.$_oContainer = $(this.cUIConfig);
        this.$_oPContainer.append(this.$_oContainer);

        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content-1');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt-1');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn-1');
        this.$_oContainer.find('h4').html(this.oOption.cTitle);

    },

    // ��ʼ����
    initTree: function () {

        if (!this.oTree) {
            this.oTree = this.$_oTreeContainer.jstree(this.oTreeOption);

            this.$_oTree = this.$_oTreeContainer.jstree(true);

            this.initTreeEvent();

            this.initCheckEven();

        } else {
            this.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            this.$_oTree.refresh();
        }
    },

    readyCallBack: function () {

    },

    refreshCallBack: function () {
        this.initTreeCheck();
    },

    initTreeCheck: function () {
        this.uncheckAll();
        // ����ѡ��ڵ�
        if (this.oTOption.cCheckUrl) {
            ES.getData({nId: this.oBusData.nId}, this.oOption.cTreeCheckUrl, this.initCheck, this);
        }
    },

    initCheck: function (anPerm) {
        if (!anPerm || anPerm.length <= 0) {
            return;
        }
        this.oTree.uncheckAll();
        this.oTree.setCheckNode(anPerm);
    },
    
});


/**
 * 这个容器，页面框架
 * Created by liulin on 2017/4/21.
 */
ES.WebFrame = ES.Evented.extend({


    oOption: {

    },

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);

        this._oParent = oParent;


        // 初始化界面
        this.initUI();
        this.initEvent();

        this.initOn();



    },

    // 界面已经初始化
    initUI: function () {

        this.oTabPanel = new ES.TabPanel(this, {});
        // 菜单加载对象
        this.oMenuFrame = new ES.MenuFrame(this, {});

        //设置高德
        this.oTabPanel. setHeight($(window).height() - this.oMenuFrame.getHeight()-28);//-this.oFooter.getHeight());
    },

    // 初始化事件
    initEvent: function () {

    },


    // 注册监听事件
    initOn: function () {


    },


});

/**
 * 菜单容器
 * 包括3部分 一部分为 Nav-top Nav-bottom Nav-menu
 * Created by liulin on 2017/4/21.
 */
ES.MenuFrame = ES.Evented.extend({
    oOption: {

    },
    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this._oParent = oParent;
        // 初始化界面
        this.initUI();
        this.initEvent();
        this.initOn();
    },

    // 界面已经初始化
    initUI: function () {
        this.$_oContainer = $('.ex-layout-header');
        this.oNavTop =new ES.MenuFrame.NavTop(this,{});
        this.oNavBottom =new ES.MenuFrame.NavBottom(this,{});
        this.oSubMenu =new ES.MenuFrame.SubMenu(this,{});
        this.oFooter =new ES.MenuFrame.Footer(this,{});
        // 触发第一条查询
        this.oNavTop.initNav();
    },
    getHeight: function () {
        return this.$_oContainer.height();
    },

    // 初始化事件
    initEvent: function () {

    },
    // 注册监听事件
    initOn: function () {

    },

});

ES.TabPanel = ES.Evented.extend({
    oOption: {},
    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this._oParent = oParent;
        this._aoPanel = [];
        // 初始化界面
        this.initUI();
        this.initEvent();
        this.initOn();
    },

    // 界面已经初始化
    initUI: function () {
        this.$_oContainer = $('.ex-layout-content');
    },
    setHeight: function (nH) {
        this.$_oContainer.height(nH);
    },
    // 初始化时间
    initEvent: function () {},
    // 注册监听事件
    initOn: function () {
        this._oParent.on('TabPanel.addPage',this.addPage,this);
        this._oParent.on('TabPanel.showPage',this.showPage,this);

        this._oParent.on('TabPanel.removePage',this.removePage,this);
    },
    removePage: function (oData) {
        if (!this._aoPanel || this._aoPanel.length <= 0) {
            return;
        }
        for (var i = 0; i < this._aoPanel.length; i++) {
            if (this._aoPanel[i].cId === oData.cId) {
                this._aoPanel[i].remove();
                this._aoPanel.splice(i,1);
                break;
            }
        }
    },
    // 显示车辆数据
    showPage: function (oData) {
        if(!this._aoPanel||this._aoPanel.length<=0) {
            return;
        }
        for (var i = 0; i < this._aoPanel.length; i++) {
            if (this._aoPanel[i].cId === oData.cId) {
                this._aoPanel[i].show();
                //if( this._aoPanel[i].get(0)
                //    && this._aoPanel[i].get(0).contentWindow
                //    && this._aoPanel[i].get(0).contentWindow.$('.ex-layout-content')){
                //    var _width = this._aoPanel[i].get(0).contentWindow.$('.ex-layout-content').width();
                //    this._aoPanel[i].get(0).contentWindow.$('.dt-grid-container').setGridWidth(_width);
                //}
            }
            else {
                this._aoPanel[i].hide();
            }
        }
        $('.ec-nav.ec-nav-pills.ex-layout-nav').find('[data-id=' + oData.cId + ']').click();
    },

    // 添加页面
    addPage:function(oData) {
        if (this._aoPanel.length <= 0) {
            this._addPage(oData);
        }
        // 如果界面缓存太多，影响显示速度，所以超过8个界面就动态删除
        if(this._aoPanel.length>=7) {
            this._oParent.fire('Footer.removePage', {cId: this._aoPanel[0].cId});
            var removeLi = this._aoPanel[0].cId;
            $('.ex-layout-footer>.ex-layout-page-tab-box>ol').find('li[cid='+removeLi+']').remove();
            this._aoPanel.splice(0, 1);
        }
        var bIn = false;
        for (var i = 0; i < this._aoPanel.length; i++) {
            if (this._aoPanel[i].cId === oData.cId) {
                this._aoPanel[i].show();
                bIn = true;
            }
            else {
                this._aoPanel[i].hide();
            }
        }
        if (!bIn) {
            this._addPage(oData);
        }
    },
    // 添加tab 页面
    _addPage: function (oData) {
        var cHTML = ES.template(this.cHtml, oData);
        var $_oIframe = $(cHTML);
        $_oIframe.cId =oData.cId;
        this.$_oContainer.append($_oIframe);
        this._aoPanel.push($_oIframe);
    },

    cHtml :
    '<iframe src="{cUrl}" ' +
    '   class="ex-layout-mainframe" ' +
    '   name="MainFrame" ' +
    '   id="{cId}" ' +
    '   allowfullscreen ' +
    '   mozallowfullscreen ' +
    '   webkitallowfullscreen ' +
    '   frameborder="0">' +
    '</iframe>'
});

/**
 * 第一级菜单 界面在网页中呈现
 * 页面公共模块
 * Created by liulin on 2017/4/21.
 */
ES.MenuFrame.NavTop = ES.Evented.extend({
    oOption: {

    },
    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this._oParent = oParent;
        // 初始化界面
        this.initUI();
        this.initEvent();
        this.initOn();
    },

    // 界面已经初始化
    initUI: function () {
        this.$_oContainer = $('.ex-layout-nav-top');
    },

    // 初始化第一条记录
    initNav: function () {
        this.$_oContainer.find('li').eq(0).click();
    },

    // 初始化事件
    initEvent: function () {
        var self= this;
        this.$_oContainer.find('li').bind('click', function () {
            self._oParent.oNavBottom.showMenu({cId:$(this).find('a').attr('data-id')});
            $(this).siblings().removeClass('ec-active').removeClass('flip').removeClass('in');
            $(this).addClass('ec-active').addClass('flip').addClass('in');
        })
    },
    // 注册监听事件
    initOn: function () {

    },
});

/**
 * 二级菜单初始化
 * Created by liulin on 2017/4/21.
 */
ES.MenuFrame.NavBottom = ES.Evented.extend({
    oOption: {
    },
    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this._oParent = oParent;
        this._oPage = oParent._oParent;
        // 初始化界面
        this.initUI();
        this.initEvent();
        this.initOn();
    },

    // 界面已经初始化
    initUI: function () {
        this.$_oContainer = $('.ex-layout-header-bottom');
    },
    // 初始化时间
    initEvent: function () {
        var self= this;
        this.$_oContainer.find('ul.firstMenu>li').bind('click', function () {
            self._oParent.oSubMenu.showMenu({cId:$(this).find("a").attr('data-id')});
            $(this).siblings().removeClass('ec-active').removeClass('flip').removeClass('in');
            $(this).addClass('ec-active').addClass('flip').addClass('in');
        });
    },

    // 显示模块的菜单
    // Example: @oData:{cId:'1'}
    showMenu: function ( oData) {
        this.$_oContainer.find('ul.firstMenu').hide();
        this.$_oContainer.find('ul.firstMenu[data-parent="'+oData.cId+'"]').show();
        var $_aoItem = this.$_oContainer.find('ul.firstMenu[data-parent="' + oData.cId + '"]').find('li.ec-active');
        if ($_aoItem.length > 0) {
            $_aoItem.click();
        }
        else {
            this.$_oContainer.find('ul.firstMenu[data-parent="' + oData.cId + '"]').find('li').eq(0).click();
        }
    },

    // 初始化第一条记录
    initNav: function () {
        this.$_oContainer.find('ul.firstMenu>li').eq(0).click();
    },
    // 注册监听事件
    initOn: function () {

    },
});

/**
 * Created by liulin on 2017/4/21.
 */


ES.MenuFrame.SubMenu = ES.Evented.extend({

    oOption: {

    },


    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);

        this._oParent = oParent;

        this._oPage = oParent._oParent;

        this.initOn();
        // 初始化界面
        this.initUI();
        this.initEvent();



    },

    // 界面已经初始化
    initUI: function () {
        this.$_oContainer = $('.ex-layout-submenu');
        //this.$_oContainer = $('.ex-layout-header-bottom');
    },

    // 初始化时间
    initEvent: function () {
        var self= this;
        this.$_oContainer.find('ul.secondMenu>li').bind('click', function () {
            self._oParent.oFooter.addPage({cId:$(this).find("a").attr('data-id'),cName:$(this).find("a").text()});
            $(this).siblings().removeClass('ec-active').removeClass('flip').removeClass('in');
            $(this).addClass('ec-active').addClass('flip').addClass('in');

            // // 显示菜单
             //self._oPage.fire('TabPanel.addPage',{cId:$(this).find('a').attr('data-id'),cUrl:$(this).find('a').attr('data-url')});
            // 显示菜单
            self._oPage.fire('TabPanel.addPage',{cId:$(this).find('a').attr('data-id'),cUrl:$(this).find('a').attr('data-url'),cName:$(this).text()});

        });
    },

    // 显示模块的菜单
    showMenu: function (oData) {
        this.$_oContainer.find('ul.secondMenu').hide();
        this.$_oContainer.find('ul.secondMenu[data-parent="' + oData.cId + '"]').show();

        var $_aoItem = this.$_oContainer.find('ul.secondMenu[data-parent="' + oData.cId + '"]').find('li.ec-active');

        if ($_aoItem.length > 0) {
            $_aoItem.click();
        }
        else {
            this.$_oContainer.find('ul.secondMenu[data-parent="' + oData.cId + '"]').find('li').eq(0).click();
        }
    },

    // 初始化第一条记录
    initNav: function () {
        this.$_oContainer.find('ul.secondMenu>li').eq(0).click();
    },

    // 注册监听事件
    initOn: function () {

    },

});


ES.MenuFrame.Footer = ES.Evented.extend({

    oOption: {

    },
    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this._oParent = oParent;
        // 初始化界面
        this.initUI();
        this.initEvent();
        this.initOn();
    },

    // 界面已经初始化
    initUI: function () {
        this.$_oContainer = $('.ex-layout-footer');
        // 任务实体
        this.$_oFooter = this.$_oContainer.find('ol.ex-layout-page-tab');
    },
    getHeight:function(){
        return this.$_oContainer.height();
    },

    getWidth: function () {
        return this.$_oContainer.width();
    },

    // 初始化事件
    initEvent: function () {
        //var self= this;
        //this.$_oFooter.find('li').bind('click', function () {
        //
        //    self.selectLi($(this));
        //    this._oParent.fire('TabPanel.showPage',{cId:$(this).cId});
        //});
        //
        //this.$_oFooter.find('em.remove').bind('click', function () {
        //    this._oParent.fire('TabPanel.removePage',{cId:$(this).cId});
        //    $(this).parent().remove();
        //});

    },

    selectLi: function ($_oLi) {
        $_oLi.siblings().removeClass('ec-active');
        $_oLi.addClass('ec-active');
    },

    // 注册监听事件
    initOn: function () {
        this._oParent.on('TabPanel.addPage',this.addPage,this);
        this._oParent.on('Footer.removePage',this.removePage,this);

        this._oParent.on('TabPanel.showMenu',this._showMenu,this);
    },
    removePage: function (oData) {
        var $_aoLi = this.$_oFooter.find('li');

        var bIn = false;
        for (var i = 0; i < $_aoLi.length; i++) {
            if ($_aoLi[i].cId === oData.cId) {
                $($_aoLi[i]).remove();
                break;
            }
        }
    },

    addPage:function(oData) {

        var $_aoLi = this.$_oFooter.find('li');

        var bIn = false;
        for (var i = 0; i < $_aoLi.length; i++) {
            if ($_aoLi[i].cId === oData.cId) {
                this.selectLi($($_aoLi[i]));
                bIn = true;
                break;
            }
        }
        if (!bIn) {
            this._addPage(oData);
        }
    },
    _showMenu:function(oData){
        var $_subLi = $('.ex-layout-submenu').find('li[cid='+oData.cId+']');//当前的页面的最底层菜单li
        var subParentId = $_subLi.parent().attr('data-parent');//最底层菜单的父级UL的data-parent
        var $_botLi = $('.ex-layout-header-bottom').find('li>a[data-id='+subParentId+']');//当前的页面的上级菜单li
        var botParentId = $_botLi.parent().parent().attr('data-parent');//菜单的父级UL的data-parent
        var $_topLi = $('.ex-layout-nav-top').find('li>a[data-id='+botParentId+']');//当前的页面的顶级菜单li
        $_topLi.click();
        $_botLi.click();
        $_subLi.click();
    },
    _addPage:function(oData) {
        var $_oli = $(ES.Util.template(this.cHtml, oData));
        $_oli[0].cId = oData.cId;
        this.$_oFooter.append($_oli);
        this.selectLi($($_oli[0]));

        var self = this;
        $_oli.bind('click', function () {
            self.selectLi($(this));
            self._oParent._oParent.fire('TabPanel.showPage', {cId: $(this)[0].cId});
            self._oParent.fire('TabPanel.showMenu', {cId: $(this)[0].cId});
        });
        $_oli.find('em.remove').bind('click', function () {
            var cId = $(this).parent()[0].cId;
            // self._oParent.fire('TabPanel.removePage', {cId: cId});
            // $(this).parent().remove();
            // self.$_oFooter.find('li:eq(0)').click();
            //
            if (!$(this).parent().hasClass('ec-active')) {
                self._oParent._oParent.fire('TabPanel.removePage', { cId: cId });
                $(this).parent().remove();
            } else {
                if ($(this).parent().index() !== 0) {
                    self._oParent._oParent.fire('TabPanel.removePage', { cId: cId });
                    $(this).parent().prev().click()
                    $(this).parent().remove();
                }
            }
        });
    },
});

ES.MenuFrame.Footer.include({
    cHtml: '<li cid="{cId}"><a class="tab" cid="{cId}" href="javascript:void(0);">{cName}</a><em cid="{cId}" class="remove">x</em></li>',
    cItem: '<li class="ec-active"><a class="tab" id="MainFrame0" href="javascript:void(0);"><i class="ec-icon-home"></i>&nbsp;&nbsp;数据概览</a></li>',

    cItem1: '<li class=""><a class="tab" id="MainFrame1" href="javascript:void(0);">任务管理</a><em id="MainFrame1" class="remove">x</em></li>'

});


}(window, document, jQuery));