import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
import * as commonOpr from '@/api/common.api'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    num: 0,
    saleChannels: [
      {
        label: 'Ebay',
        val: 'Ebay'
      },
      {
        label: '淘宝',
        val: 'TaoBao'
      },
      {
        label: '敦煌',
        val: 'DH'
      },
      {
        label: '速卖通',
        val: 'SMT'
      },
      {
        label: '线下交易',
        val: 'Offline'
      },
      {
        label: 'Amazon',
        val: 'Amazon'
      },
      {
        label: 'Wish',
        val: 'Wish'
      },
      {
        label: 'Lazada',
        val: 'Lazada'
      },
      {
        label: 'Linio',
        val: 'Linio'
      },
      {
        label: 'AmazonFBA',
        val: 'AmazonFBA'
      },
      {
        label: 'JOOM',
        val: 'Joom'
      },
      {
        label: '虾皮',
        val: 'Shopee'
      },
      {
        label: '限价产品',
        val: 'XJ'
      },
      {
        label: '阿里巴巴',
        val: '10'
      },
      {
        label: 'paytm',
        val: 'paytm'
      },
      {
        label: 'SHOPPO',
        val: 'SHOPPO'
      },
      {
        label: 'yandex',
        val: 'yandex'
      },
      {
        label: '11street',
        val: '11street'
      },
      {
        label: 'Tophatter',
        val: 'Tophatter'
      },
      {
        label: 'factorymarket',
        val: 'factorymarket'
      },
      {
        label: '丰卖网',
        val: 'Intmall'
      },
      {
        label: 'Mall.my',
        val: 'Mall.my'
      },
      {
        label: '杭州嘉云',
        val: 'HZJiaYun'
      },
      {
        label: 'VOVA',
        val: 'VOVA'
      }
    ], // 销售渠道
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
    saleChannels: function (state, getters) {
      return state.saleChannels
    },
    countries: function(state, getters) {
      return state.countries
    },
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
    setAllCountries(state, countries) {
      state.countries = countries
    },
    setAllSalechannels(state, saleChannels) {
      state.saleChannels = saleChannels
    },
    setAllShippingmethodss(state, data) {
      state.shippingmethodss = data
    }
  },
  actions: {
    getAllSalechannels({
      commit,
      state,
      dispatch
    }, params) {
      let tempSaleChannels = [
        { 'code': 'Alibaba.com', 'chineseName': '阿里巴巴国际站' },
        { 'code': 'Alibaba1688', 'chineseName': 'Alibaba1688' },
        { 'code': 'Allegro', 'chineseName': 'Allegro' },
        { 'code': 'Amazon', 'chineseName': '亚马逊' },
        { 'code': 'B2W', 'chineseName': 'B2W' },
        { 'code': 'Catch', 'chineseName': 'Catch' },
        { 'code': 'Cdiscount', 'chineseName': 'Cdiscount' },
        { 'code': 'Coupang', 'chineseName': 'Coupang' },
        { 'code': 'Ebay', 'chineseName': 'Ebay' },
        { 'code': 'Fanno', 'chineseName': 'Fanno' },
        { 'code': 'Fruugo', 'chineseName': 'Fruugo' },
        { 'code': 'Fyndiq', 'chineseName': 'Fyndiq' },
        { 'code': 'Hepsiburada', 'chineseName': 'Hepsiburada' },
        { 'code': 'JDWalmart', 'chineseName': 'JDWalmart' },
        { 'code': 'Joom', 'chineseName': 'Joom' },
        { 'code': 'Lazada', 'chineseName': 'Lazada' },
        { 'code': 'Mall.my', 'chineseName': 'Mall.my' },
        { 'code': 'Mercadolibre', 'chineseName': 'Mercadolibre' },
        { 'code': 'Microsoft', 'chineseName': 'Microsoft' },
        { 'code': 'NewEgg', 'chineseName': '新蛋' },
        { 'code': 'Nocnoc', 'chineseName': 'Nocnoc' },
        { 'code': 'OnBuy', 'chineseName': 'OnBuy' },
        { 'code': 'Ozon', 'chineseName': 'Ozon' },
        { 'code': 'Shopee', 'chineseName': '虾皮' },
        { 'code': 'Shopify', 'chineseName': 'Shopify' },
        { 'code': 'SMT', 'chineseName': '速卖通' },
        { 'code': 'Tiktok', 'chineseName': 'Tiktok' },
        { 'code': 'Voghion', 'chineseName': 'Voghion' },
        { 'code': 'Walmart', 'chineseName': '沃尔玛' },
        { 'code': 'Wish', 'chineseName': 'Wish' },
        { 'code': 'ZoodMall', 'chineseName': 'ZoodMall' },
        { 'code': 'All', 'chineseName': '全部' }
      ]
      commonOpr.getAllSalechannels().then(res => { 
        res.data.result.forEach(item => {
          tempSaleChannels.forEach(item1 => {
            if(item.code === item1.code){
              item.chineseName = item1.chineseName || item1.code
            }
          })
        })
        commit('setAllSalechannels', res.data.result.map(opt => ({
          code: opt.code,
          name: opt.name,
          chineseName: opt.chineseName
        })))
      }).catch(function (err) {
        console.log(err)
      })
    },
    getAllCountries({
      commit,
      state,
      dispatch
    }, params) {
      commonOpr.getAllCountries().then(res => {
        // console.log(res,'国家')
        res.data.result && res.data.result.forEach(item => {
          Object.assign(item, { chinesename1: `${item.twowordname}-${item.chinesename}` })
        })
        commit('setAllCountries', res.data.result)
      }).catch(function(err) {
        console.log(err)
      })
    },
    getAllShippingmethodss({
      commit,
      state,
      dispatch
    }, params) {
      commonOpr.getAllShippingmethodss().then(res => {
        commit('setAllShippingmethodss', res.data.result)
      }).catch(function(err) {
        console.log(err)
      })
    }
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
