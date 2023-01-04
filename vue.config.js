const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const interfaces = require('os').networkInterfaces()
let localhostIp = ''
for (const devName in interfaces) {
  const iface = interfaces[devName]
  for (let i = 0; i < iface.length; i++) {
    const alias = iface[i]
    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
      localhostIp = alias.address
    }
  }
}
module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL, // 根地址，默认/
  outputDir: 'dist', // 打包目录
  // 别名
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_conf', resolve('config'))
    /* config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      }) */
  },
  assetsDir: 'assets', // 静态资源目录
  lintOnSave: false,
  productionSourceMap: false, // 建议生产关闭
  devServer: {
    open: true,
    host: localhostIp,
    port: '3000',
    proxy: {
      '/logistics-engine/': {
        target: 'http://192.168.3.162',
        changeOrigin: true,
        pathRewrite: {
          // '^/logistics-engine': '/'
        }
      },
      /* '/logistics-engine': {
        // 目标服务器地址
        target: 'http://192.168.3.162',
        // target: 'http://10.100.1.1:32100',
        // target: 'http://192.168.8.237:8080', // cq
        // 路径重写
        pathRewrite: {
          // '^/logistics-engine': ''
        },
        changeOrigin: true
      }, */
      '/usermgt-n': {
        // 目标服务器地址
        // target: 'http://10.100.1.1:32100',
        target: 'http://192.168.3.165',
        // 路径重写
        pathRewrite: {
          // '^/usermgt': ''
        },
        changeOrigin: true
      }
    }
  }
}
