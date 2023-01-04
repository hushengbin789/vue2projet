import Axios from 'axios'
// import { baseURL } from '_conf/url'
import { Message } from 'view-design'
import { getToken, setToken } from '@/libs/util'

class httpRequest {
  constructor() {
    this.options = {
      method: '',
      url: ''
    }
    // 存储请求队列
    this.queue = {}
  }

  // 销毁请求实例
  destroy(url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }

  interceptors(instance, url) {
    instance.interceptors.request.use(config => {
      if (!config.url.includes('/login')) {
        config.headers.Authorization = getToken()
        config.headers['system-name'] = 'logistics_engine_web'
      }
      return config
    }, error => {
      return Promise.reject(error)
    })

    instance.interceptors.response.use(res => {
      const { data } = res
      const is = this.destroy(url)
      if (!is) {
        console.log('is', is)
      }
      if (res.status === 500 || res.status === 401) {
        if (data.code === 11000 || data.code === '11000') {
          Message.warning('登录失效，请重新登录')
          // console.log(res)
          // 清除缓存  TODO
          localStorage.clear()
          setToken('')
          Cookies.remove('token')
          window.location.href = '/center-web/login'
        }
        return Promise.reject(res)
      }
      if (res.status !== 200) {
        return Promise.reject(res)
      }
      // return data
      return res
    }, error => {
      Message.error('服务内部错误')
      // 对响应错误做点什么
      return Promise.reject(error)
    })
  }

  // 创建实例
  create() {
    const conf = {
      baseURL: 'http://192.168.8.182:3000/',
      timeout: 10 * 60 * 1000, // 默认10分钟超时
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-URL-PATH': location.pathname
      },
      validateStatus: function(status) {
        // return status >= 200 && status < 300; // default
        return status >= 200
      }
    }
    return Axios.create(conf)
  }

  // 请求实例
  request(options) {
    const instance = this.create()
    this.interceptors(instance, options.url)
    options = Object.assign({}, options)
    this.queue[options.url] = instance
    return instance(options)
  }
}
export default httpRequest
