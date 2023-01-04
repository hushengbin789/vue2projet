import axios from '@/libs/api.request'

// 登录
export const login = newPer => {
  return axios.request({
    url: '/usermgt-n/login',
    method: 'post',
    data: {
      method: '',
      args: JSON.stringify(newPer)
    }
  })
}

// 退出
export const logout = newPer => {
  return axios.request({
    url: '/usermgt-n/logout',
    method: 'post',
    data: {
      method: '',
      args: JSON.stringify(newPer)
    }
  })
}

// 获取 用户信息
export const getUserInfo = () => {
  return axios.request({
    url: '/usermgt-n/tokenuser',
    method: 'get',
    params: {
      _t: new Date().getTime()
    }
  })
}
