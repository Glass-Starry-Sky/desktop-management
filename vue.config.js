const { defineConfig } = require('@vue/cli-service')

const webpack = require('webpack')
// element-plus
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: "./",


  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        icon: "./public/desktopX.ico"

      }
      //支持dll动态库的一些模块引入
      //因为这两个模块中包含原生 C代码，所以要在运行的时候再获取，而不是被webpack打包到bundle中
      //目前用不到，而且打包了后会出现问题，2022/10/5

      // externals: ['ffi-napi', 'ref-napi'],
      // builderOptions: {
      //   extraResources: {
      //     // 拷贝静态文件到指定位置,否则打包之后出现找不到资源的问题.将整个resources目录拷贝到 发布的根目录下
      //     from: 'resources/',
      //     to: './'
      //   }
      // }

    }
  },

  //element-plus
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      //jquery
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })

    ],
  }
})
