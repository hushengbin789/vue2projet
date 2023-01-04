import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    num: 0
  },
  getters: {
  },
  mutations: {
    setUserNames(state, type = '++') {
      type == '++' ? state.num++ : state.num--
    }
  },
  actions: {
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
