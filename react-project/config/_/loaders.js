// import extractTextPlugin from 'extract-text-webpack-plugin'
import { SRC_PATH, MODULE_PATH } from '../../path.config'

//webpack loaders
const loaders =
[
  {
    test: /\.jsx?$/,
    loader: 'happypack/loader?id=happycached',
    include: [ SRC_PATH, MODULE_PATH ]
  },
  {
    test: /\.(css|scss|sass)$/,
    include: [ SRC_PATH, MODULE_PATH ],
    loader: 'happypack/loader?id=happystyle'
  },
  {
    test: /\.(png|jpg|gif)$/,
    include: [ SRC_PATH, MODULE_PATH ],
    loader: 'url',
    query : {
      limit: 1,
      name : 'images/[name].[hash:8].[ext]'
    }
  },
  {
    test: /\.json$/,
    include: [ SRC_PATH, MODULE_PATH ],
    loader: 'json-loader',
  },
  {
    test: /\.(svg)$/i,
    loader: 'svg-sprite',
    include: [
      require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
      require.resolve('@boluome/oto_saas_web_app_component').replace(/index\.js$/, ''),
      SRC_PATH,  // 2. 自己私人的 svg 存放目录
    ]
  },
]

export default loaders

export const preLoaderConfig = [
  {
    test: /\.jsx?$/,
    loader: 'eslint-loader',
    include: [ SRC_PATH ]
  },
]

export const generateLoader = name => loaders.map(o => {
  // 将所有的图片的输出路径，设置成服务器的路径
  if ('url' === o.loader) {
    // o.query.publicPath = `https://jackyouth.cdn.com/services/${name}/`
    o.query.publicPath = `/${ name }/`
  }
  return o
})
