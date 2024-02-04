const path = require('path')
const CracoLessPlugin = require('craco-less')
const resolve = (dir) => path.resolve(__dirname, dir)

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyvars: {
              // 编写样式变量(可全局使用)
              // "@primary-color":"#1DA57A"
            },
            javascriptEnabled: true
          }
        }
      }
    }
  ],
  webpack: {
    alias: {
      '@': resolve('src')
    }
  }
}
