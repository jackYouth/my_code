# webpack 性能调优

### webpack 的优化瓶颈:

- 构建时间
- 文件体积

### webpack 优化方案

- 减少 loader 转译成本
  - 通过 loader 的 include 或 exclude 属性, 来限制打包范围. 这样对于某些不需要转译的文件(比如 node_modules)loader 就不回去处理.
  - 给 loader 开启缓存, 这样可以是 loader 提效两倍
    以官网给出的 babel-loader 配置为例:
    ```js
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          cacheDirectory: true,
          // Don't waste time on Gzipping the cache
          cacheCompression: false,
        },
      ];
    }
    ```
- 优化第三方库
  - 推荐使用 DllPlugin 来处理第三方库. 因为相对于它, Externals 不够聪明, 比如当引入的其他插件依赖了 react 时, react 会被再次重复打包.
    > Externals 原理及解决方案: [https://juejin.im/entry/57996222128fe1005411c649](https://juejin.im/entry/57996222128fe1005411c649), externals 会将配置的依赖库在引用时指向全局变量, 从而避免重新打包这个库. 上面说的会重复打包, 其实是因为部分第三方 module 没有提供生产环境的文件, 无法通过 window 访问, 这样第三方 module 就无法配置 Externals. 根据这个问题, 我们可以新建一个 lib-bundles 文件, 在这里引入第三方 module 然后放到 window 下, 该文件打包后, script 标签在 html 中引入, 这样就可以再去配置 externals 了. 但是这种的话, 每个可能重复打包的库都要单独配置, 比较麻烦, 所以还是推荐使用 DllPlugin.
  - DllPlugin 配置方案
    - path 是 manifest.json 文件的输出路径，这个文件会用于后续的业务代码打包；
    - name 是 dll 暴露的对象名，要跟 output.library 保持一致；
    - context 是解析包路径的上下文，这个要跟接下来配置的 webpack.config.js 一致。
