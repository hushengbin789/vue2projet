//  时效报表查询
import axios from '@/libs/api.request'

//  预报信息管理 / 同步记录 列表
export const list = ({ shippingMethodCode, syncTimeStart, syncTimeEnd, coNos, refShippingOrderNos, apvNos, shippingOrderNos, pageReqired = true, limit = 20, offset = 0, sort = 'desc', order }) => {
  return axios.request({
    url: '/logistics-engine/synclogisticsrecord',
    method: 'post',
    data: {
      method: 'searchSyncLogisticsRecords',
      args: JSON.stringify({
        search: {
          shippingMethodCode,
          syncTimeStart,
          syncTimeEnd,
          coNos,
          apvNos,
          refShippingOrderNos,
          shippingOrderNos
        },
        pageReqired,
        limit,
        offset,
        sort,
        order
      })
    }
  })
}
