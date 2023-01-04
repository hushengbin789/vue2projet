
import { getToken, setToken } from '@/libs/util'
import {
  getMenuCodes,
  getAllMenus
} from '@/api/menu.opt.api'
export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',

    userInfo: null,
    menus: null, // 所有的菜单
    menuPermission: [] // 当前用户的菜单权限
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setUserName(state, name) {
      state.userName = name
    },
    setMenus(state, menus) {
      state.menus = menus // 所有菜单
    },
    setMenuPermission(state, menuPermission) {
      state.menuPermission = menuPermission // 当前用户的菜单权限
    }
  },
  actions: {
    // 获取用户 菜单权限
    getUserPermission({
      state, commit
    }, user = {}) {
      return new Promise((resolve, reject) => {
        getMenuCodes(state.userInfo.employeeNo).then(function(res) {
          // console.log(res) userInfo.employeeNo
          commit('setMenuPermission', res.data.result || [])
          resolve(res.data.result || [])
        }).catch(function(err) {
          // console.log(err)
          reject(err)
        })
        getAllMenus().then(function(res) {
          // console.log(res.data.result)
          commit('setMenus', res.data.result[0])
        }).catch(function(err) {
          console.log(err)
        })
      })
    }
  }
}
