
import { /*  getToken, */ setToken } from '@/libs/util'
import {
  getMenuCodes,
  getAllMenus
} from '@/api/menu.opt.api'
import { login } from '@/api/user.api'
import { Base64 } from 'js-base64'
export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: '',
    token2: '',
    access: '',

    userInfo: null,
    menus: null, // 所有的菜单
    menuPermission: [] // 当前用户的菜单权限
  },
  getters: {
    hasButtonPermission: state => permission => {
      // return true;
      return (state.menuPermission || []).includes(permission)
    }
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    // 旧系统token
    setToken(state, token) {
      state.token = token
      setToken(token, 'token')
    },
    // 新系统token
    setToken2(state, token) {
      state.token2 = token
      setToken(token, 'token2')
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
    },
    // 登录
    handleLogin({ commit },
      {
        userName,
        password
      }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        const temp = Base64.encode(password)
        console.log('登录+加密', temp)
        console.log('登录+解码', Base64.decode(temp))
        login({
          employeeNo: userName,
          password: Base64.encode(password)
        }).then(resp => {
          const result = resp.data.result
          console.log('登录1', result)
          // commit('setToken', result.oldAccessToken)
          // commit('setToken2', result.accessToken)
          if (result) {
            resolve(result)
          } else {
            reject(new Error('token 信息不存在'))
          }
        }).catch(err => {
          if (err.data.code === '150014') {
            Message.error('错误代码【' + err.data.code + '】，' + '账户已被禁用，请联系管理员操作~')
          } else {
            Message.error('错误代码【' + err.data.code + '】，' + err.data.message)
          }
        })
      })
    }
  }
}
