import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'
import XEUtils from 'xe-utils'
import plugin from '@/utils/plugin' // 自定义全局插件
// import i18n from '@/locale'
Vue.use(iView/* , {
  transfer: true,
  i18n: (key, value) => i18n.t(key, value)
} */)
Vue.config.productionTip = false
Vue.prototype.XEUtils = XEUtils
Vue.use(plugin) // 注册自定义全局插件

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
