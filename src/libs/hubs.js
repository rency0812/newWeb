/* eslint-disable init-declarations,no-undef,no-console,no-unused-vars */
import store from './store'
import * as types from './types'

export default {
  hub: this.hub,
  gpshub: this.gpshub,
  item: this.item,
  content() {
    let _this = this
    Promise.all([
      require('../../statics/jquery.signalR-2.2.2.min'),
      require('../../statics/hubs')
    ]).then(function () {
      $.support.cors = true
      $.connection.hub.url = 'http://signalr.bss.comlbs.com/signalr'
      _this.hub = $.connection.hub
        _this.gpshub = $.connection.GpsHub
        _this.gpshub.client.handlerGps = function (items) {
            console.log(items)
            if (items.length == 0) return
            _this.item = items
            store.commit(types.GPS, items)
        }

      _this.gpshub.client.handlerAlarm = function (items) {
        console.log(items)
        if (items.length == 0) return
        _this.item = items
        store.commit(types.ALARM, items)
      }

      _this.hub.disconnected(function () {
        console.log('disconnected.' + new Date().getSeconds().toString())
        setTimeout(function () {
          console.log('reconnect...' + new Date().toString())
          hub.start().done(function () {
            console.log('reconn succ.')
          })
        }, 5000) // Restart connection after 5 seconds.
      })
      _this.hub.start().done(function () {
        console.log('start succ.')
      }).fail(function (err) {
        console.log(err)
        console.log('Could not connect.' + err)
      })
    })
  }
}