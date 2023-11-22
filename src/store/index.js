import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
import * as commonOpr from '@/api/common.api'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    num: 0,
    skuTags: [], // sku 标签
    homeTypeCount: [], // homeTypeCount
    homeNoticeTable: [], // homeNoticeTable
    homeTabDataList: [], // 自定义规则 物流方式 索赔进度 通知公告-table
    homeTabDataListTotal: 0, // 自定义规则 物流方式 索赔进度 table的总数
    orderTags: [], // 订单 标签
    countries: [], // 国家
    currency: [], // 币种
    shippingmethod: [], // 物流方式
    shippingCompanys: [], // 物流方式
    shippingmethodss: [] // 物流方式s
  },
  getters: {
    shippingmethodss: function(state, getters) {
      const arr = []
      const obj = state.shippingmethodss
      for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
          arr.push({
            code: `${i}`,
            name: `${obj[i]}`
          })
        }
      }
      return arr
    }
  },
  mutations: {
    setUserNames(state, type = '++') {
      type == '++' ? state.num++ : state.num--
    },
    setAllShippingmethodss(state, data) {
      state.shippingmethodss = data
    }
  },
  actions: {
    getAllShippingmethodss({
        commit,
        state,
        dispatch
      }, params) {
      commonOpr.getAllShippingmethodss().then(res => {
        commit('setAllShippingmethodss', res.data.result)
      }).catch(function (err) {
        console.log(err)
      })
    },
  },
  modules: {
    user
  },
  // plugins: [createPersistedState()]
  plugins: [createPersistedState({ key: 'logistics_store' })]
  /* plugins: [createPersistedState({
    storage: window.sessionStorage
  })] */
  /* plugins: [createPersistedState({
    reducer: data => {
      return {
        city: data.num
      }
    }
  })] */

})
