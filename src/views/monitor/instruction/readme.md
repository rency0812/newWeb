# 指令下发

## 1. 点名下发获取位置信息

请求：

```text
POST /jt808web/monitor/orderissue/callNames HTTP/1.1
Content-Type: application/json

{
  // 设备号
  "clientId": "012011113333"
}
```

响应（成功）：

```javascript
/*
  Content-Type: application/json;charset=UTF-8
*/
{
  "code": "0",
  "msg": "点名下发成功",
  "detail": {
    "latitude": "30.456466",   // 纬度
    "longitude": "114.405275", // 经度
    // ......
  }
}
```

## 2. 拍照

请求：（/monitor/orderissue/takePhotos/${设备号 clientId}）

```text
POST /jt808web/monitor/orderissue/takePhotos/012011113333 HTTP/1.1
Content-Type: application/json

{
    "operationTime": 1553131014085, // 操作时间。毫秒数
    "channelId": 1,                 // 拍照通道。“-1” 为全部
    "cmd": 2,                       // 拍照张数。单位：个。
    "time": 22,                     // 拍照间隔。单位：秒。
}
```

响应：

```javascript
/*
  Content-Type: application/json;charset=UTF-8
*/
{
  "code": "0",
  "error": null,
  "msg": "拍照成功",
  "detail": null,
  "retain": null
}
```

## 3. 文本

请求：（POST /monitor/orderissue/textSend/{clientId}）

```text
POST /jt808web/monitor/orderissue/textSend/012011113333 HTTP/1.1
Content-Type: application/json

{
    "operationTime": 1553131014085, // 操作时间。毫秒数
    "urgency": true,                // 显示方式：紧急
    "terminalDisplay": true,        // 显示方式：终端显示器
    "ttsPlay": true,                // 显示方式：终端 TTS 播读
    "screenDisplay": true,          // 显示方式：广告屏显示
    "content": true                 // 文本内容
}
```

响应：

```javascript
/*
  Content-Type: application/json;charset=UTF-8
*/
{
  "code": "0",
  "error": null,
  "msg": "拍照成功",
  "detail": null,
  "retain": null
}
```

## 4. 监听

请求：（POST /monitor/orderissue/monitor/{clientId}）

```text
POST /jt808web/monitor/orderissue/monitor/012011113333 HTTP/1.1
Content-Type: application/json

{
    "operationTime": 1553131014085, // 操作时间。毫秒数
    "flag": 0,                      // 监听方式。“0” 为 普通电话，“1” 为监听
    "phoneNum": "18700000000"       // 回拨号码。
}
```

响应：

```javascript
/*
  Content-Type: application/json;charset=UTF-8
*/
{
  "code": "0",
  "error": null,
  "msg": "监听指令下发成功",
  "detail": null,
  "retain": null
}
```

## 5. 配置

```text
网络配置
0x0001 DWORD 终端心跳发送间隔，单位为秒（s）
0x0010 STRING 主服务器 APN，无线通信拨号访问点。若网络制式为 CDMA，则该处为PPP 拨号号码
0x0013 STRING 主服务器地址,IP 或域名
0x0018 DWORD 服务器 TCP 端口

车辆信息
0x0080 DWORD 车辆里程表读数，1/10km
0x0081 WORD 车辆所在的省域 ID
0x0082 WORD 车辆所在的市域 ID
0x0083 STRING 公安交通管理部门颁发的机动车号牌
0x0084 BYTE 车牌颜色，按照 JT/T415-2006 的 5.4.12

行驶参数

0x0055 DWORD 最高速度，单位为公里每小时（km/h）
0x0056 DWORD 超速持续时间，单位为秒（s）
0x0057 DWORD 连续驾驶时间门限，单位为秒（s）
0x0058 DWORD 当天累计驾驶时间门限，单位为秒（s）
0x0059 DWORD 最小休息时间，单位为秒（s)
0x005A DWORD 最长停车时间，单位为秒（s）
```