import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router.js'
import store from '../store/index'
// import iView from 'iview'

import { getToken } from '@/libs/util'
import { getUserInfo } from '@/api/user.api'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: '/logistics-web', // process.env.BASE_URL
  routes
})
// const LOGIN_PAGE_NAME = 'login'
// const SHEET_PAGE_NAME = 'sheet'
// 监听消息反馈
document.addEventListener('visibilitychange', async() => { // 浏览器切换事件
  const token = getToken()
  if (token && document.visibilityState === 'visible') { // 状态判断
    try {
      const res = await getUserInfo()
      console.log(res)
      if (res.status === 200) {
        const userInfo = res.data.result
        console.log('userInfo', userInfo)
        // 设置用户信息
        store.commit('setAvator', userInfo.avatar)
        store.commit('setUserName', userInfo.name || userInfo.employeeNo)
        store.commit('setUserId', userInfo.employeeNo) // 当前登录人工号
        // 获取用户菜单权限
      } else {
        window.location.href = '/center-web/login'
      }
    } catch (e) {
      console.log(e)
    }
  }
})
/* router.beforeEach(async(to, from, next) => {
  // iView.LoadingBar.start()
  console.log('beforeEach', to, from)
  try {
    const res = await getUserInfo()
    if (res.status === 200) {
      const userInfo = res.data.result || {}
      // 设置用户信息
      store.commit('setUserInfo', userInfo)
      // 获取用户菜单权限
      // await store.dispatch('getUserPermission', userInfo)
    }
  } catch (e) {
    console.log(e)
  }
}) */
export default router
