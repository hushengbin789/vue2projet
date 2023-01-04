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
