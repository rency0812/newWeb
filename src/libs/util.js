/* eslint-disable no-undef,no-console,semi,no-unused-vars,linebreak-style,no-var,brace-style,camelcase,complexity,indent,init-declarations */
import axios from 'axios'
import Qs from 'qs'
import env from './env'

const _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const util = {}
const tenantName = localStorage.getItem('$platformState') ? JSON.parse(localStorage.getItem('$platformState')).tenantName : '依迅北斗'
util.title = function (title) {
    title = title ? title + ' | ' + tenantName : tenantName
    window.document.title = title
}

/* ================================开发接口地址==============================================*/

// let ajaxUrl = 'https://easy-mock.com/mock/5aa884d98ed9a05f24bed8eb/exui32'  //之前模拟数据接口

let ajaxUrl = '/'  //模拟数据接口

// let ojaxUrl = env === 'development' ? '/test' : 'http://180.101.255.219:38009/jt808web/' //测试
// let ojaxUrl = env === 'development' ? '/test' : 'http://192.168.1.88:38009/jt808web/' //张善庆
// let ojaxUrl = env === 'development' ? '/test' : 'http://192.168.1.7:38009/jt808web/' //胡智杰
// let ojaxUrl = env === 'development' ? '/test' : 'http://192.168.1.62:38009/jt808web/' //程照
let ojaxUrl = '/jt808web'


util.picUrl = 'http://180.101.255.219:10024/'
util.ojaxUrl = ojaxUrl
util.mapCenter = {
    lat: 30.222,
    lng: 113.255
}

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    'Content-Type': 'application/json'
})

util.ojax = axios.create({
    baseURL: ojaxUrl,
    timeout: 30000,
    'Content-Type': 'application/json'
})

// http request 拦截器
util.ajax.interceptors.request.use(
    config => {
        config.headers.token = localStorage.getItem('$userState') ? JSON.parse(localStorage.getItem('$userState')).token : 'notoken'
        return config
    },
    err => {
        // console.log(JSON.stringify(err))
        return Promise.reject(err)
    })
//
// http response 拦截器
util.ajax.interceptors.response.use(
    response => {
        return response
    },
    error => {
        // console.log(JSON.stringify(error))
        return Promise.reject(error.response)
    })

// http request 拦截器
util.ojax.interceptors.request.use(
    config => {
        // config.headers.token = localStorage.getItem('$userState') ? JSON.parse(localStorage.getItem('$userState')).token : 'notoken'

        // 暂时用userGuid代替token
        config.headers.token = localStorage.getItem('$userState') ? JSON.parse(localStorage.getItem('$userState')).userGuid : 'notoken'
        return config
    },
    err => {
        // console.log(err)
        return Promise.reject(err)
    })
//
// http response 拦截器
util.ojax.interceptors.response.use(
    response => {
        return response
    },
    error => {
        // console.log(JSON.stringify(error))
        return Promise.reject(error.response)
    })


//BASE64加密
const base64 = {
    _keyStr,
    encode: function (e) {
        var t = ''
        var n, r, i, s, o, u, a
        var f = 0
        e = Base64._utf8_encode(e)
        while (f < e.length) {
            n = e.charCodeAt(f++)
            r = e.charCodeAt(f++)
            i = e.charCodeAt(f++)
            s = n >> 2
            o = (n & 3) << 4 | r >> 4
            u = (r & 15) << 2 | i >> 6
            a = i & 63
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + _keyStr.charAt(s) + _keyStr.charAt(o) + _keyStr.charAt(u) + _keyStr.charAt(a)
        }
        return t
    },
    decode: function (e) {
        var t = ''
        var n, r, i
        var s, o, u, a
        var f = 0
        e = e.replace(/[^A-Za-z0-9+/=]/g, '')
        while (f < e.length) {
            s = _keyStr.indexOf(e.charAt(f++))
            o = _keyStr.indexOf(e.charAt(f++))
            u = _keyStr.indexOf(e.charAt(f++))
            a = _keyStr.indexOf(e.charAt(f++))
            n = s << 2 | o >> 4
            r = (o & 15) << 4 | u >> 2
            i = (u & 3) << 6 | a
            t = t + String.fromCharCode(n)
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t)
        return t
    },
    _utf8_encode: function (e) {
        e = e.replace(/rn/g, 'n')
        var t = ''
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n)
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192)
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224)
                t += String.fromCharCode(r >> 6 & 63 | 128)
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function (e) {
        var t = ''
        var n = 0
        var r = 0
        var c1 = 0
        var c2 = 0

        while (n < e.length) {
            r = e.charCodeAt(n)
            if (r < 128) {
                t += String.fromCharCode(r)
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1)
                t += String.fromCharCode((r & 31) << 6 | c2 & 63)
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1)
                c3 = e.charCodeAt(n + 2)
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
                n += 3
            }
        }
        return t
    }
}

//数组排重
util.uniqueArrayTitle = function (array) {
    var newArr = [array[0]]
    for (var i = 1; i < array.length; i++) {
        var Item = array[i]
        var repeat = false
        for (var j = 0; j < newArr.length; j++) {
            if (Item.title == newArr[j].title) {
                repeat = true
                break
            }
        }
        if (!repeat) {
            newArr.push(Item)
        }
    }
    return newArr
}
util.uniqueArray2 = function (array) {
    var newArr = []
    for (var i in array) {
        var Item = array[i]
        var repeat = false
        for (var j in newArr) {
            if (Item.label === newArr[j].label) {
                repeat = true
                break
            }
        }
        if (!repeat) {
            newArr.push(Item)
        }
    }
    return newArr
}
util.uniqueArrayPath = function (array) {
    var newArr = []
    for (var i in array) {
        var Item = array[i]
        var repeat = false
        for (var j in newArr) {
            if (Item.path === newArr[j].path) {
                repeat = true
                break
            }
        }
        if (!repeat) {
            newArr.push(Item)
        }
    }
    return newArr
}
util.uniqueArrayId = function (array) {
    var newArr = []
    for (var i in array) {
        var Item = array[i]
        var repeat = false
        for (var j in newArr) {
            if (Item.id === newArr[j].id) {
                repeat = true
                break
            }
        }
        if (!repeat) {
            newArr.push(Item)
        }
    }
    return newArr
}
util.formatTime = function (date) {
    let dateNew = new Date(date)
    const year = dateNew.getFullYear()
    const month = dateNew.getMonth() + 1
    const day = dateNew.getDate()
    const hour = dateNew.getHours()
    const minute = dateNew.getMinutes()
    const second = dateNew.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const hasClass = function (elem, cls) {
    cls = cls || ''
    if (cls.replace(/\s/g, '').length == 0) return false //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ')
}
util.addClass = function (elem, cls) {
    if (!hasClass(elem, cls)) {
        elem.className = elem.className == '' ? cls : elem.className + ' ' + cls
    }
}
util.removeClass = function (elem, cls) {
    if (hasClass(elem, cls)) {
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' '
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ')
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '')
    }
}


const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}


util.isInArray = function (arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}

util.isInObjArray = function (arr, value, key) {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i][key]) {
            return true;
        }
    }
    return false;
}

util.InObjArrayOfIndex = function (arr, value, key) {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i][key]) {
            return i;
        }
    }
    return -1;
}


//合并json
util.insetArray = function (newObj, oldObj) {
    for (var key in newObj) {
        oldObj[key] = newObj[key]
    }
    return oldObj
}

//json递归
util.getAllJson = function (jsons, name) {
    for (var key in jsons) {
        if (!(jsons[key] instanceof Object)) {
            if (jsons[key] == self.$route.path && key == name && jsons['url']) {
                self.MenuSide = jsons['children']
                if (jsons['children']) {
                    self.tableMenu = true
                }
            }
        } else {
            getAllJson(jsons[key], name); //如果是Object则递归
        }
    }
}

util.getTreeNodesChildren = function (arr, blankArr) {
    for (let key in arr) {
        blankArr.push(arr[key].id)
        if (arr[key].children) {
            util.getTreeNodesChildren(arr[key].children, blankArr)
        }
    }
    return blankArr
}


util.getTreeNodesByName = function (arr, blankArr, name) {
    for (let key in arr) {
        if (arr[key].data.type == name) {
            blankArr.push(arr[key].id)
        } else if (arr[key].children) {
            util.getTreeNodesByName(arr[key].children, blankArr, name)
        }
    }
    return blankArr
}


util.changeDate = function (dateA) {
    let dateee = new Date(dateA).toJSON();
    let date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    return date;
}


// 序列化导出参数
util.toParams = function (param) {
    var result = ''
    for (let name in param) {
        if (typeof param[name] != 'function' && param[name] != null) {
            result += '&' + name + '=' + encodeURI(param[name]);
        }
    }
    return result.substring(1)
},


    util.formatUnixTime = function (unixTime) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(unixTime);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);

        function add0(m) {
            return m < 10 ? '0' + m : m
        }
    }


// 获取当天一整天的时间段
util.getFromTodayToEnd = function () {
    let nD = new Date()
    let month = nD.getMonth() + 1
    let year = nD.getFullYear()
    let now = util.formatTime(nD)
    let day = nD.getDate()
    if (month < 10) {
        month = '0' + month
    }
    return year + '-' + month + '-' + day + ' 00:00:00' + '|' + now
}


// 获取当月第一天到今天的日期(含时间)
util.getFromTodayToEndMonth = function () {
    let nD = new Date()
    let month = nD.getMonth() + 1
    let year = nD.getFullYear()
    if (month < 10) {
        month = '0' + month
    }
    let firstDay = year + '-' + month + '-01 00:00:00'
    let now = util.formatTime(nD)
    return firstDay + '|' + now

}

// 获取当月月份日期
util.getCurrentMonth = function () {
    let nD = new Date()
    let month = nD.getMonth() + 1
    let year = nD.getFullYear()
    if (month < 10) {
        month = '0' + month
    }
    let firstDay = year + '-' + month
    return firstDay

}

// 获取当月第一天到今天的日期
util.getFromTodayToEndMonthDate = function () {
    let nD = new Date()
    let month = nD.getMonth() + 1
    let year = nD.getFullYear()
    let day = nD.getDate()
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    let firstDay = year + '-' + month + '-01'
    let now = year + '-' + month + '-' + day
    return firstDay + '|' + now

}


const doHandleMonth = function (month) {
    var m = month;
    if (month.toString().length == 1) {
        m = '0' + month;
    }
    return m;
}
// 获取几天前的日期 day传入几天 则往前推几天 eg: getLastDay(-7)获取七天前的日期
util.getLastDay = function (day) {
    var today = new Date();

    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

    today.setTime(targetday_milliseconds); //注意，这行是关键代码

    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);
    return tYear + '-' + tMonth + '-' + tDate;
}

util.getTodayDate = function(){
    let nD = new Date()
    let month = nD.getMonth() + 1
    let year = nD.getFullYear()
    let day = nD.getDate()
    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    let now = year + '-' + month + '-' + day
    return now
}


// ids设置树选中//
const arrFun = (treeData, nodeIds) => {
    if(!treeData||!treeData.length){
        return
    }
    treeData.forEach(v => {
        v.selected = false
        if(nodeIds.indexOf(v.id)>-1){
            v.selected = true
        }
        if(v.children){
            arrFun(v.children, nodeIds)
        }

    })

}
util.setNodeSelected = (treeData, nodeIds) => {
    arrFun(treeData, nodeIds)
}
// 获得报警类型Id
util.getAlertTypeId = (arr, modelArr) => {
    let newArr = []
    arr.forEach(val => {
        if(modelArr.length&&isNaN(modelArr[0])){
            if(modelArr.indexOf(val.alarmTypeName)>-1){
                newArr.push(val.id)
            }
        }
        if(modelArr.length&&!isNaN(modelArr[0])){
            if(modelArr.indexOf(val.id)>-1){
                newArr.push(val.alarmTypeName)
            }
        }
    })
    return newArr
}
// 导出
let exportExel = (url, param, type='get') => {
    if(type === 'post'){
        return util.ojax({
            url: url,
            method: type,
            data: param,
            responseType: 'blob'
        })
    }
    if(type==='get'){
        return util.ojax({
            url:url,
            method:type,
            params:param,
            responseType: 'blob'
        })
    }
}
util.exportExel = (fileName, url, param, type) => {
    exportExel(url, param, type).then(res => {
        if (!res||!res.data) { return }
        fileName = fileName || '文件'
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName + '.xls')
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(link.href)
    })
}


export default util
export const Base64 = base64
