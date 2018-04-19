import { resolve } from 'path'
import { SVC_PATH, DIST_PATH, ASSET_PATH, SRC_PATH } from '../path.config'
import config from './_'
import { generatePlugin } from './_/plugins'
import { generateLoader } from './_/loaders'

export const define = name => {
  const entryPath  = resolve(SVC_PATH , name)
  const outputPath = resolve(DIST_PATH, name)

  config.entry.app         = entryPath
  config.output.path       = outputPath

  config.plugins           = config.plugins.concat(generatePlugin(name, outputPath))
  if(config.devServer) { //测试
    config.output.publicPath = `/${ name }/`
    config.devServer.historyApiFallback = { index: `/${ name }/` }
  } else {
    // 项目输出时的默认cdn位置
    // config.output.publicPath = `https://jackyouth.cdn.com/services/${name}/`
    config.output.publicPath = `/${ name }/`
    config.module.loaders  = generateLoader(name)
  }
  return config
}

export default config
