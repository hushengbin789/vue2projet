//  时效报表查询
import axios from '@/libs/api.request'
// 时效报表查询
export const searchLogisticsLimitation = (args = {}) => {
  return axios.request({
    url: '/logistics-engine/logisticsLimitation',
    method: 'post',
    data: {
      method: 'searchLogisticsLimitation',
      args: JSON.stringify(args)
    }
  })
}
// 时效导出流
export const exportLogisticsLimitation = (args = {}) => {
  return axios.request({
    url: '/logistics-engine/logisticsLimitation/export',
    method: 'post',
    responseType: 'blob',
    data: {
      method: 'searchLogisticsLimitation',
      args: JSON.stringify(args)
    }
  })
}
// 物流追踪报表导出流
export const exportLogisticsTrajectory = (args = {}) => {
  return axios.request({
    url: '/logistics-engine/logisticsTrajectory/export',
    method: 'post',
    responseType: 'blob',
    data: {
      args: JSON.stringify(args)
    }
  })
}
