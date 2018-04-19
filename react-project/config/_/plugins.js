import { resolve } from 'path'
import os from 'os'
import webpack from 'webpack'
import { BundleAnalyzerPlugin as bundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import extractTextPlugin    from 'extract-text-webpack-plugin'
import offlinePlugin        from 'offline-plugin'
import copyPlugin           from 'copy-webpack-plugin'
import htmlWebpackPlugin    from 'html-webpack-plugin'
import webpackCleanupPlugin from 'webpack-cleanup-plugin'
import uglifyJsParallelPlugin from 'webpack-uglify-parallel'

import happyPack from 'happypack'

import title  from './title'
import { ASSET_PATH, SRC_PATH }    from '../../path.config'
//webpack common plugins
const happyThreadPool = happyPack.ThreadPool({ size: os.cpus().length })
const isProduction    = process.env.NODE_ENV === 'production'
const hashName        = isProduction ? 'chunkhash:8': 'hash:8'

const plugin = [
  new happyPack({
    id: 'happycached',
    loaders: ['babel-loader'],
    threadPool: happyThreadPool,
    cache: true,
    verbose: true
  }),
  new happyPack({
    id: 'happystyle',
    loaders: [ 'style', 'css', 'postcss', 'sass' ],
    threadPool: happyThreadPool,
    cache: true,
    verbose: true
  }),
  new extractTextPlugin('style/[name].css', { allChunks: true }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  // new webpack.optimize.CommonsChunkPlugin('scripts/vendor.bundle.js?[chunkhash:8]')
  new webpack.optimize.CommonsChunkPlugin({
    name     : 'vendor',
    filename : `scripts/vendor.bundle.[${ hashName }].js`,
    minChunks: 'Infinity'
  })
]

export default plugin

//根据项目名，输出路径生成插件
export const generatePlugin = (name, output) => {
  const service = title[name]
  const showAMap = name !== 'huafei' && name !== 'liuliang' && name !== 'chongzhi' && name !== 'jiayouka' && name !== 'chongzhijiaofei' && name !== 'cashier' && name !== 'lite-list' && name !== 'jianli'

  let plugin = [
    new htmlWebpackPlugin({
      template: resolve(ASSET_PATH, 'index.ejs'),
      inject  : true,
      cache   : true,
      minify  : {    //压缩HTML文件
        removeComments    : true,    //移除HTML中的注释
        collapseWhitespace: true,   //删除空白符与换行符
        minifyJS          : true
      },
      isProduction,
      showAMap,
      projectName: name,
      serviceName: service ? service.name : '没有配置标题'
    })
  ]
  //如果是生产打包
  if(isProduction) {
    plugin = plugin.concat([
      new webpackCleanupPlugin({
        //删除前预览
        // preview: true
      }),
      new offlinePlugin({
        updateStrategy: 'all',
        version: '[hash]',
        publicPath: `/${ name }/`,
        excludes: [`${ name }/`],
        rewrites: asset => {
          // 页面文件和静态资源使用不同的服务器，默认的是当前的服务器（html文件必须放在当前服务器中（比如dev-me），这样访问dev-me的域名才能找到对应文件）
          if (asset !== 'index.html') {
            // 使用cdn服务器
            // return `https://jackyouth.cdn.com/services/${name}/${asset}`
            return `/${ name }/`
          }
          return asset
        },
        ServiceWorker: {
          // output: `service-worker/sw.js`,
          cacheName: `otosaas-${ name }`,
          minify: true,
          // navigatorFallbackURL: `/`   //需调试 fallback
        },
        AppCache: {
          FALLBACK: { '/': `/${ name }/` },
          includeCrossOrigin: true
        }
      }),
      new copyPlugin([
        {
          context: ASSET_PATH,
          from: 'manifest.json',
          to  : output,
          transform: (content, path) => {
            const manifest = JSON.parse(new Buffer(content).toString())
            manifest.name       = name
            manifest.short_name = name
            manifest.start_url  = `/${ name }`
            return JSON.stringify(manifest)
          }
        },
        {
          context: resolve(SRC_PATH, 'images/manifest/'),
          from: '*',
          to  : resolve(output, 'icon')
        },
        {
          context: resolve(SRC_PATH, 'images/'),
          from: 'cc.gif',
          to  : output
        }
      ]),
      new uglifyJsParallelPlugin({
        workers: os.cpus().length,
        exclude: /\.min\.js$/,
        mangle: true,
        output: {
          comments: false,  // remove all comments
        },
        compress: {
          warnings: false
        }
      }),
      new bundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 9988,
        defaultSizes: 'parsed'
      })
    ])
  }

  return plugin


}
