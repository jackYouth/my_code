import loaderConfig, { preLoaderConfig }   from './loaders'
import pluginConfig   from './plugins'
import aliasConfig    from './alias'
import postcssConfig  from './postcss'

import checkEnv       from './env'

const hashName =  process.env.NODE_ENV === 'production' ? 'chunkhash:8': 'hash:8'

const config = {
  entry : {
    vendor: [ 'babel-polyfill', 'react', 'react-redux', 'react-router', 'redux', 'react-dom' ]
  },
  output: {
    filename     : `scripts/bundle.[${ hashName }].js`,
    chunkFilename: `scripts/[name].[${ hashName }].chunk.js`
  },
  eslint: {
    configFile: './.eslintrc.js',
    failOnWarning: true, // eslint报warning了就终止webpack编译
    failOnError: true,   // eslint报error了就终止webpack编译
    // cache: true,
  },
  plugins: pluginConfig,
  module : {
    preLoaders: preLoaderConfig,
    loaders: loaderConfig,
    noparse: [ /react/ ]
  },
  resolve: {
    modulesDirectories: [ 'node_modules', 'src' ],
    alias: aliasConfig
  },
  postcss: postcssConfig
}

export default checkEnv(config)
