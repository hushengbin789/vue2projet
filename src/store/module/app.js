
import {
  // getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage,
  getHomeRoute
} from '@/libs/util'
import routers from '@/router/routers'
export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    routerList: [],
    homeRoute: getHomeRoute(routers),
    currentRoute: '', // 当前理由
    local: ''
  },
  mutations: {

  },
  actions: {

  }
}
