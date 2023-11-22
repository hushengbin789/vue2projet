import Cookie from 'js-cookie'

export const TOKEN_KEY = 'token2'

export const setToken = token => {
  Cookie.set(TOKEN_KEY, token, { expires: 1 })
  Cookie.set('token', token, { expires: 1 })
}

export const getToken = () => {
  const token = Cookie.get(TOKEN_KEY)
  if (token) return token
  else return false
}
/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
  let i = -1
  const len = routers.length
  let homeRoute = {}
  while (++i < len) {
    const item = routers[i]
    if (item.children && item.children.length) {
      const res = getHomeRoute(item.children)
      if (res.name) return res
    } else {
      if (item.name === 'home') homeRoute = item
    }
  }
  return homeRoute
}
