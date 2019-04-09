<template>
    <component :is="tagName" :class="classes" :disabled="disabled" @click="handleClickLink" v-bind="tagProps">
        <Icon class="ivu-load-loop" type="ios-loading" v-if="loading"></Icon>
        <Icon :type="icon" :custom="customIcon" v-if="(icon || customIcon) && !loading"></Icon>
        <span v-if="showSlot" ref="slot"><slot></slot></span>
    </component>
</template>
<script>

  import Icon from 'iview/src/components/icon';
  import { oneOf } from 'iview/src/utils/assist';
  import mixinsLink from 'iview/src/mixins/link';

  import Util from '../../../libs/util'
  const pageUrl = require('../../../libs/api.js').mapMonitor;

  import Vue from 'vue';

  const prefixCls = 'ivu-btn';
  const vehicleAttention = require('../../../libs/api').vehicleAttention
  const vehicleUnAttention = require('../../../libs/api').vehicleUnAttention

  export default {
      name: 'Button',
      mixins: [mixinsLink],
      components: {Icon},

      created() {
          //console.log(this.page, this.data);
      },

      props: {

          //#region 扩展属性
          page: {
              type: Object,
          },

          data: {
              type: Object,
          },
          //#endregion

          //#region button其他属性
          type: {
              validator (value) {
                  return oneOf(value, ['default', 'primary', 'dashed', 'text', 'info', 'success', 'warning', 'error']);
              },
              default: 'default'
          },
          shape: {
              validator (value) {
                  return oneOf(value, ['circle', 'circle-outline']);
              }
          },
          size: {
              validator (value) {
                  return oneOf(value, ['small', 'large', 'default']);
              },
              default () {
                  return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size;
              }
          },
          loading: Boolean,
          //disabled: Boolean,
          htmlType: {
              default: 'button',
              validator (value) {
                  return oneOf(value, ['button', 'submit', 'reset']);
              }
          },
          icon: {
              type: String,
              default: ''
          },
          customIcon: {
              type: String,
              default: ''
          },
          long: {
              type: Boolean,
              default: false
          },
          ghost: {
              type: Boolean,
              default: false
          }
          //#endregion

      },

      data () {
          return {
              showSlot: true,
              disabled: false
          };
      },
      computed: {
          classes () {
              return [
                  `${prefixCls}`,
                  `${prefixCls}-${this.type}`,
                  {
                      [`${prefixCls}-long`]: this.long,
                      [`${prefixCls}-${this.shape}`]: !!this.shape,
                      [`${prefixCls}-${this.size}`]: this.size !== 'default',
                      [`${prefixCls}-loading`]: this.loading != null && this.loading,
                      [`${prefixCls}-icon-only`]: !this.showSlot && (!!this.icon || !!this.customIcon || this.loading),
                      [`${prefixCls}-ghost`]: this.ghost
                  }
              ];
          },
          // Point out if it should render as <a> tag
          isHrefPattern() {
              const {to} = this;
              return !!to;
          },
          tagName() {
              const {isHrefPattern} = this;
              return isHrefPattern ? 'a' : 'button';
          },
          tagProps() {
              const {isHrefPattern} = this;
              if (isHrefPattern) {
                  const {linkUrl, target} = this;
                  return {href: linkUrl, target};
              } else {
                  const {htmlType} = this;
                  return {type: htmlType};
              }
          }
      },
      methods: {
          // Ctrl or CMD and click, open in new window when use `to`
          handleClickLink (event) {

              this.$emit('click', event);
              this.page.$emit('veh-track', this.data);
              const openInNewWindow = event.ctrlKey || event.metaKey;

              this.handleCheckClick(event, openInNewWindow);
          },

          convertGps: function (data, self) {

              if(data.mobile && !data.devNo){
                  data.devNo = data.mobile;
              }
              Util.ojax.post(pageUrl.realLocation, {devNos: [data.devNo]}).then(function (response) {
                  if (response.data.code !== '0') {
                      // 查询数据为0
                      return;
                  }

                  // 触发跟踪事件
                  self.page.$emit('track', response.data.detail[0]);

              });
          },

      },
      mounted () {
          this.showSlot = this.$slots.default !== undefined;
          let self = this;

          // 地图点击取消跟踪按钮时，恢复按钮状态
          this.page.$on('lst-untrack', function (e) {

              if (self.data.devNo === e.devNo) {
                  self.disabled = false;
              }
          });

          // 地图点击跟踪按钮时，按钮状态不可用
          this.page.$on('lst-track', function (e) {

              if (self.data.devNo === e.devNo) {
                  self.disabled = true;
              }
          });

          // 监控列表和告警列表 互斥 显示
          this.page.$on('veh-track', function (e) {

              if (self.data.devNo === e.devNo) {
                  self.convertGps(e, self)
                  self.disabled = true;
              }
              else {
                  self.page.$emit('untrack', e);
                  self.disabled = false;
              }
          });

          // 点击地图关注事件
          this.page.$on('attend', function (e) {
              debugger
          });

          // 点击地图取消关注事件
          this.page.$on('unattend', function (e) {
              debugger
          });


      }
  };
</script>
