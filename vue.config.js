/**
 * 配置参考:
 * https://cli.vuejs.org/zh/config/
 */
const url = 'http://znyw-gateway:9999'
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => {
    // 忽略的打包文件
    config.externals({
      'axios': 'axios'
    })
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
  },
  // eslint-disable-next-line
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 仅在生产环境下启用该配置
      return {
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 1024, // 只有大小大于该值的资源会被处理,当前配置为对于超过1k的数据进行处理，不足1k的可能会越压缩越大
            minRatio: 0.99, // 只有压缩率小于这个值的资源才会被处理
            deleteOriginalAssets: true // 删除原文件
          })
        ]
      }
    }
  },
  // 配置转发代理
  devServer: {
    disableHostCheck: true,
    port: 8080,
    proxy: {
      '/': {
        target: url,
        ws: false, // 需要websocket 开启
        pathRewrite: {
          '^/': '/'
        }
      }
      // 3.5 以后不需要再配置
    }
  }
}
