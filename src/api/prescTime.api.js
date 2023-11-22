import axios from '@/libs/api.request'

// 妥投超时-查询详情
export const searchLogisticsPrescTime = (args = {}) => {
  return axios.request({
    url: '/logistics-engine/logisticsPrescTime',
    method: 'post',
    data: {
      method: 'searchLogisticsPrescTime',
      args: JSON.stringify(args)
    }
  })
}
// 导出
export const ExportData = reqBody => {
  return axios.request({
    url: '/logistics-engine/logisticsPrescTime/export',
    data: {
      args: JSON.stringify(reqBody)
    },
    method: 'post',
    responseType: 'blob'
  })
}
