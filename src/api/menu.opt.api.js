import axios from '@/libs/api.request'

// 获取用户职能列表-根据工号查询角色相关菜单code
export const getMenuCodes = (args = {}) => {
  return axios.request({
    url: '/usermgt-n/sys/menu/getMenuCodes',
    method: 'post',
    data: {
      args: args
    }
  })
}
// 系统映射管理-查询系统
export const getAllMenus = () => {
  return axios.request({
    url: '/usermgt-n/sys/system/listSystem',
    method: 'post',
    data: {
      method: ''
      // args: JSON.stringify(['menu-logistics-engine'])
    }
  })
}
