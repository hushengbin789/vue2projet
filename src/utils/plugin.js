// vue全局插件
import { cloneDeep } from 'lodash'
import Moment from 'moment'
const install = (Vue, vm) => {
  Vue.prototype.$cloneDeep = obj => {
    return cloneDeep(obj)
  }

  Vue.prototype.$initTime = args => {
    if (args) {
      return Moment(args).format('YYYY-MM-DD HH:mm:ss')
    } else {
      return ''
    }
  }
  Vue.prototype.$moment = Moment
}
export default {
  install
}
