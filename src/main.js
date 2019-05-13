// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {ToastPlugin, AjaxPlugin, LoadingPlugin} from 'vux'
import {Upload} from 'element-ui'
import Moment from 'moment'
import Vuex from 'vuex'
import storeModule from '@/modules/storeModule'

import '@/assets/css/global.css'

Vue.use(Vuex)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(Upload)
Vue.config.productionTip = false

// axios
// AjaxPlugin.$http.defaults.baseURL = 'http://39.107.244.193:8080/'
AjaxPlugin.$http.defaults.baseURL = 'http://localhost:8080/'
// 务必开启携带cookie
AjaxPlugin.$http.defaults.withCredentials = true
AjaxPlugin.$http.defaults.timeout = 15000
// AjaxPlugin.$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const FastClick = require('fastclick')
FastClick.attach(document.body)

// moment全局过滤器
Vue.filter('convertTime', function (date) {
  let introduceDate = Moment(date)
  let nowDate = Moment(Moment())

  // 一小时之前的时间
  let hourDate = Moment(nowDate).subtract(1, 'hours')
  // 是否在一小时之内
  let isAfterHour = Moment(introduceDate).isAfter(hourDate)
  if (isAfterHour) {
    return Moment(introduceDate).startOf('minute').fromNow()
  }

  // 一天前的时间
  let dayDate = Moment(nowDate).subtract(1, 'days')
  // 是否在一天之内
  let isAfterDay = Moment(introduceDate).isAfter(dayDate)
  if (isAfterDay) {
    return Moment(introduceDate).startOf('hour').fromNow()
  }

  // 判断是不是今年
  let nowYear = Moment(nowDate).year()
  let introduceYear = Moment(introduceDate).year()
  if (nowYear === introduceYear) {
    return introduceDate.format('MMM Do HH:mm')
  }
  return introduceDate.format('YYYY-MM-DD HH:mm')
})
Moment.locale('zh-cn')

// 配置请求拦截器，显示loading
AjaxPlugin.$http.interceptors.request.use(function (config) {
  Vue.$vux.loading.show({
    text: '加载中...'
  })
  return config
})
// 配置响应拦截器，关闭loading
AjaxPlugin.$http.interceptors.response.use(function (config) {
  Vue.$vux.loading.hide()
  return config
})

// vuex
const store = new Vuex.Store({
  modules: {
    storeModule: storeModule
  }
})
store.registerModule('vux', {
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    }
  }
})

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})
  next()
  let allowBack = false
  if (to.meta.allowBack !== undefined) {
    allowBack = to.meta.allowBack
  }
  localStorage.setItem('allowBack', allowBack)

  history.pushState(null, null, location.href)
})

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
})
