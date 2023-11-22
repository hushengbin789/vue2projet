import axios from '@/libs/api.request'
// 装车订单详情--获取物流方式下拉框
export const getAllShippingmethodss = args => {
  return axios.request({
    url: '/logistics-engine/shippingmethod',
    method: 'post',
    data: {
      method: 'getAllShippingMethods',
      args: JSON.stringify(args)
    }
  })
}
// 获取所有国家
export const getAllCountries = args => {
  return axios.request({
    url: '/logistics-engine/common',
    method: 'post',
    data: {
      method: 'getAllCountries',
      args: JSON.stringify(args)
    }
  })
}
// 获取平台
export const getAllSalechannels = (args = {}) => {
  return axios.request({
    url: '/logistics-engine/common',
    method: 'post',
    data: {
      method: 'getAllSalechannels'
    }
  })
}
