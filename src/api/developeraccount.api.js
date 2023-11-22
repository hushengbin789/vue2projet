import axios from '@/libs/api.request'
// 物流公司下拉框
export const getCompanyList = () => {
  return axios.request({
    url: '/logistics-engine/shippingcompany',
    method: 'post',
    data: {
      method: 'findSelectValues'
    }
  })
}
