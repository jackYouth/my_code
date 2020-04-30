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

  - 推荐使用 DllPlugin 来处理第三方库. 因为相对于它, Externals 不够聪明, 比如当引入的其他插件依赖了 react 时, react 会被再次重复打包. CommonsChunkPlugin 每次构建时都会重新构建一次 vendor.
    > Externals 原理及解决方案: [https://juejin.im/entry/57996222128fe1005411c649](https://juejin.im/entry/57996222128fe1005411c649), externals 会将配置的依赖库在引用时指向全局变量, 从而避免重新打包这个库. 上面说的会重复打包, 其实是因为部分第三方 module 没有提供生产环境的文件, 无法通过 window 访问, 这样第三方 module 就无法配置 Externals, 没配置 Externals 就会打包, 打包就会将 react 打包进去. 根据这个问题, 我们可以新建一个 lib-bundles 文件, 在这里引入第三方 module 然后放到 window 下, 该文件打包后, script 标签在 html 中引入, 这样就可以再去配置 externals 了. 但是这种的话, 每个可能重复打包的库都要单独配置, 比较麻烦, 所以还是推荐使用 DllPlugin.
  - DllPlugin 原理: 借鉴 window 系统下的动态链接库思想, 一个 dll 包, 就是一个很纯净的库, 它本身是不能运行的, 是用来给业务代码引用的.
  - DllPlugin 配置方案
    - 新建一个 dll.config.js 文件
    ```js
    const path = require("path");
    const webpack = require("webpack");
    module.exports = {
      entry: {
        // 依赖的库数组
        vendor: [
          "prop-types",
          "babel-polyfill",
          "react",
          "react-dom",
          "react-router-dom",
        ],
      },
      output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        library: "[name]_[hash]",
      },
      plugins: [
        new webpack.DllPlugin({
          name: "[name]_[hash]", // dll 暴露的对象名，要跟 output.library 保持一致
          path: path.join(__dirname, "dist", "[name]-manifest.json"), // manifest.json 文件的输出路径，这个文件会用于后续的业务代码打包
          context: __dirname, // 解析包路径的上下文，这个要跟接下来配置的 webpack.config.js 一致
        }),
      ],
    };
    ```
    - webpack 运行这个文件后生成两个文件: vendor-manifest.json、vendor.js
      - vendor.js 是所有第三方包打包后的集合
      - vendor-manifest.json 中是每个第三方库对应的具体路径
    - 随后在 webpack.config.js 中 plugins 里, 加入 dll 的相关配置
      ```js
      // dll相关配置
      new webpack.DllReferencePlugin({
        context: __dirname,
        // manifest就是我们第一步中打包出来的json文件
        manifest: require("./dist/vendor-manifest.json"),
      });
      ```

- Happypack - 将 loader 由单进程转为多进程

  - happypack 会充分释放 CPU 在多核并发方面的优势, 帮我们将任务分解成多个子进程去并发执行, 大大提高打包效率.
  - 用法: loader 的配置指向 happypack 中配置的即可, 并且我们还可以设置进程并发的数量

    ```js
    const HappyPack = require('happypack')
    // 手动创建进程池
    const happyThreadPool =  HappyPack.ThreadPool({ size: os.cpus().length })

    module.exports = {
      module: {
        rules: [
          ...
          {
            test: /\.js$/,
            // 问号后面的查询参数指定了处理这类文件的HappyPack实例的名字
            loader: 'happypack/loader?id=happyBabel',
            ...
          },
        ],
      },
      plugins: [
        ...
        new HappyPack({
          // 这个HappyPack的“名字”就叫做happyBabel，和楼上的查询参数遥相呼应
          id: 'happyBabel',
          // 指定进程池
          threadPool: happyThreadPool,
          loaders: ['babel-loader?cacheDirectory']
        })
      ],
    }
    ```

- 压缩构建结果体积

  - 可视化文件结构工具, 找出大文件

    - 推荐使用 webpack-bundle-analyzer, 配置方法:

    ```js
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
      .BundleAnalyzerPlugin;

    module.exports = {
      plugins: [new BundleAnalyzerPlugin()],
    };
    ```

  - 拆分资源
    - 将固定引用的第三方包拆分出来, 方案就是上面说的 dll
    - 将首屏必须需要展示的东西, 单独拆到一个文件中 **(方案待补充)**
  - 按需加载
    - 实现思路:
      - 一次加载不完所有的文件内容, 只加载此刻需要用到的那部分(需要提前做好拆分)
      - 当需要用到更多内容时, 再对用到的内容进行即时加载
    - 以路由级别的按需加载为例, 实现步骤:
      - webpack 中, 对文件进行拆分
        ```js
        output: {
            path: path.join(__dirname, '/../dist'),
            filename: 'app.js',
            publicPath: defaultSettings.publicPath,
            // 指定 chunkFilename
            chunkFilename: '[name].[chunkhash:5].chunk.js',
        },
        ```
      - 路由处, 进行按需加载的处理
        ```js
         const getComponent => (location, cb) {
          require.ensure([], (require) => {
            cb(null, require('../pages/BugComponent').default)
          }, 'bug')
        },
        ...
        <Route path="/bug" getComponent={getComponent}>
        ```
        > 注意, 这里核心的方法就是 **require.ensure(dependencies, callback, chunkName)**, 这是一个异步方法, webpack 在打包时, 将 BugComponent 组件打包成一个文件, 当跳转到 /bug 路由时, 这个异步方法的回调才会生效, 才会去真正获取 BugComponent 中的内容.
        > **按需加载的粒度，还可以继续细化，细化到更小的组件、细化到某个功能点，都是 ok 的。**
        > 在 React-Router 4 中, 我们是用了 Code-splitting 替换掉了上面的操作. 但是 React-Router 4 中的按需加载使用的 Bundle-Loader, 其源码也是用 require.ensure 来实现的.
        > [Code-splitting 的 webpack 配置](https://webpack.docschina.org/guides/code-splitting/), require.ensure 是 webpack 遗留的功能, 目前主推的是 import()语法

# GZip 压缩原理

### 简介

GZip 是 http 压缩最常用的一种压缩方案, 还有一个是 deflate. Gzip 的内核就是 Deflate.

http 压缩是一种内置到网页服务器和网页客户端中的用以改进传输速度和带宽利用率的方式. 兼容的浏览器将支持的压缩方案告知服务端, 服务端使用对应方案压缩后, 返回给客户端, 客户端接受时自动解压缩. 不支持压缩方案的浏览器, 服务端就不会压缩, 客户端会接收未压缩的数据.

### 意义

Gzip 是以服务端的压缩时间和客户端解压缩时的 CPU 开销为代价, 省去了传输过程中的时间开销. 对于 1,2kb 的体积, 使用 GZip 是划算的.

> webpack 中的 GZip 和 http 的 GZip 并不一样, webpack 的 GZip 是为了给服务器分担压力, 通过在构建中去做一部分服务器的工作.

### 原理

GZip 是通过去除文件中的空格、换行、制表等符号, 并且将一些重复的名称, 使用一个较短的字符去替换它们的形式, 来减小文件体积. 所以说, 当代码重复率越高时, 压缩效率就越高. GZip 一般能减少 70%左右的体积.

### 开启方法

request 头中添加 accept-encoding: gzip, deflate
