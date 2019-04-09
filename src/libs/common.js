/* eslint-disable linebreak-style,indent,no-var,complexity */
let alg = {}
// 遍历解析Json
alg.parseJson = function (jsonObj, value) {
    // 循环所有键
    for (var key in jsonObj) {
        //如果对象类型为object类型且数组长度大于0 或者 是对象 ，继续递归解析
        var element = jsonObj[key]
        console.log(element)
        if (element != value && typeof (element) == 'object' || typeof (element) == 'object') {
            alg.parseJson(element)
        } else { //不是对象或数组、直接输出
            return jsonObj['text']
        }
    }
}


//json递归
alg.getAllJson = function (jsons, value) {
    for (var key in jsons) {
        if (!(jsons[key] instanceof Object)) {
            if (jsons[key] && jsons['data.url'] == value) {
                console.log(jsons[key])
                return jsons[key]
            }
        } else {
            alg.getAllJson(jsons[key], value) //如果是Object则递归
        }
    }
}








export default alg