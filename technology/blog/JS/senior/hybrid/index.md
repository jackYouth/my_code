# hybrid
## 一、hybrid的定义：什么是hybrid？hybrid能用来做什么
## 二、hibrid的存在意义：hibrid和h5有什么区别
## 三、hibrid的实现：js如何与app进行通讯
## 四、总结

## 一、hybrid的定义：什么是hybrid？hybrid能用来做什么
从五个角度来说明：
+ a) hybrid的文字解释
  hybrid的意思就是混合，通常指的是前端和客户端的混合开发。所以需要前端和客户端两方配合开发。
+ b) 存在的价值
  可快速迭代更新，无需app发布时的审核（因为app的权限一般都很高，比如获取地理位置，相机，横屏竖屏等权限，如果不进行审核，就有可能因为权限过高获取到手机底层信息，从而造成漏洞，所以各家手机中的app商店中会对app在本商店中是否可以发布做出严格的审核）
  体验流畅，与NA差不多
  节省开发成本和沟通成本，双方共用同一套代码
+ c) webview
  是app的一个组件，可以有，也可以没有
  它可以加载html页面，算是一个小型的浏览器内核
+ d) file://协议
  file协议：是本地文件的访问，快 ，断网也可以获取。比如我们打开本地网页时，网址就是file://开头的
  http(s)协议：是网络加载，慢 ，断网就获取不到了。
  由此我们可以知道，hybrid走的是file协议，因为他的体验需要和NA差不多，所以不能使用http(s)协议，不然会太慢
+ e) hybrid的实现流程
  使用hybrid的场景：并不是所有的场景下都需要使用hybrid的，那么如何来区分呢：
    体验要求极致，变化不频繁的，用NA（头条首页）
    体验要求高，变化频繁的，用hybrid（头条新闻详情页 ）
    体验无要求，不常用，用html（一般都是反馈页，举报页这些一年基本上都不用的页面）
    （ 我公司现在使用的算是第三种，是让客户，在一个webview中使用https协议来加载页面，所以不算hybrid，所以会太慢）
  实现流程：
    前端做好静态页面（html、css、js）之后，将它交给客户端
    客户端拿到前端静态页面之后，以文件的形式存入客户端中
    客户端在一个webview中，使用file协议加载这些静态页面
<br>
<img src='./img/hybrid_1' width='300px' />
<br>
  经过上面三个流程之后，我们可以思考到，仍然会有两个问题：
  + **App发布之后，静态文件如何更新?**<br>
  这个只能客户端来做，因为h5权限很小，只能进行页面展示。大体步骤是：客户端每次打开后都去server端下载一下最新的静态文件，我们来维护这个静态文件<br>
  具体实现：<br>
  首先要分版本，有版本号，比如时间戳201803150715<br>
  将静态文件压缩成一个zip包，上传到服务器（打包后，体积小，在同一个文件夹下好管理）<br>
  客户端每次打开都请求server端，对比一下版本号<br>
  如果server版本号大于客户端，就将zip包下载下来<br>
  下载完成后，解压zip包，然后将现有文件覆盖
<br>
<img src='./img/hybrid_2' width='300px' />
<br>
  + 静态页面如何获取到内容，因为是从原生页面点击跳转至的h5页面<br>
  这里不能通过ajax的形式，因为跨域、慢（跨域：客户端和前端使用的接口的域名一般都不一样，但是这个问题可以解决，慢：在打开页面时，需要先请求回数据，然后再进行渲染，这个过程就慢了）<br>
  该问题就是js如何与客户端进行通信，具体内容可以看下面4中的描述<br>

## 二、hibrid的存在意义：hibrid和h5有什么区别
+ hibrid的优点：体验好，可快速迭代<br>
  hibrid打开前端页面和原生差不多，类似今日头条的新闻页面<br>
  h5代开前端页面一般首先会有一段白屏，好的html页面还会加上一个进度条。类似微信朋友圈
+ 缺点：开发成本高，运维成本高<br>
  开发成本：联调，测试，查bug都比较麻烦<br>
  运维成本：参考之前的上线流程， h5端需要打造一个发布平台（包括：上传，分版本，压缩等功能），客户端每次打开都需要请求接口，对比一下版本等等
+  适用的场景：hybrid适用于产品型，h5适用于运营型<br>
  产品型：产品功能稳定，体验要求高，迭代频繁<br>
  运营型：单次运营活动（如红包）或不常用功能

## 三、hibrid的实现：js如何与app进行通讯
微信公众号开发平台中提供的js-sdk就是一个最直接的js-bridge的例子，了解js如何与app进行通讯，我们会从下面四个方面来说：
+ JS和客户端通讯的基本形式<br>
  js访问客户端，提供参数和回调函数。客户端通过回调函数返回内容

+ schema协议的简介和使用<br>
  之前介绍了file协议和http(s)协议，这里是schema协议，常见的还有socket协议和ssh协议。协议就是两方约定通讯的规范。
  schema协议是前端和客户端通讯的约定<br>
  下图为微信客户端设置的一些schema协议，前端通过调用该链接，就可以访问到客户端对应的功能，当然这些schema协议不一定能用，但是格式是对的
<br>
<img src='./img/hybrid_3' width='300px' />
<br>
微信有严格的限制，外部页面不能随意使用schema，需遵循一定的条件。微信的js-sdk其实就是schema协议的封装，并且他也遵循了这些条件封装而成，所以我们可以直接使用。外部公司是没有这个权限去使用他的schema协议的。<br>
但是在我们自己公司进行hybrid开发时，客户端会把具体的schema协议和使用权限给到我们。
schema使用的步骤：
```js
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = 'weixin://dl/scan'
  const body = document.body || document.getElementsByTagName('body')[0]
  body.appendChild(iframe)
  // 清楚当次使用iframe标签，防止内存泄漏
  setTimeout(() => {
    body.removeChild(iframe)
    iframe = null
  })
  // 传参的话：
  // 定义callback方法，必须是全局window对象下，才能访问到
  window.scan_callback = function(result) {
    alert(result)
  }
  iframe.src = 'weixin://dl/scan?a=a&b=b&callback=scan_callback'
```
+ schame使用的封装
```js
// 封装结果长这样：
window.invoke.share({ title: 'xxx', content: 'xxx' }, function(result) {
  if(result.code === 1) alert('分享成功')
  else alert(result.message)
})

// 向上推一层可知，schame最外层的封装应该为：
(function(window, undefined) {
  function invokeShare(data, callback) {
    _invoke('share', data, callback)
  }
  function invokeScan(data, callback) {
    _invoke('share', data, callback)
  }
  window.invoke = {
    invokeShare,
    invokeScan,
  }
})(window)

// 再向上推一层可知，_invoke的封装：
function _invoke(action, data, callback) {
  // 拼接schame协议
  const action = 'share'
  const data = { a: 1, b: 2, c: 3 }
  const schameHeader = `myapp://path/${ action }?a=a`
  let schame = Object.keys(data).reduce((p, c) => `${ p }&${ key }=${ data[key] }`, schameHeader)
  // 处理callback
  let callbackName = ''
  if (typeof callback === 'string') {
    callbackName = callback
  } else {
    callbackName = `${ action }${ Date.now() }`
    window[callbackName] = callback
  }
  schame = `${ schame }&${ callbackName }=${ callback }`
  // iframe中调用schame
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = schame
  const body = document.body || document.getElementsByTagName('body')[0]
  body.appendChild(iframe)
  setTimeout(() => {
    body.removeChild(iframe)
  })
}
```
+ 内置上线
将封装好的schame协议代码打包，去个名字(如：invoke.js)内置到客户端中(和hybrid中的静态资源一样)<br>
客户端每次打开webview时，都默认执行一下invoke.js文件<br>
这样因为是本地加载，免去网络加载的时间，更快<br>
同时本地加载，没有网络请求，黑客就看不到schame协议，更安全

> js和app之间的通讯小结
> + 通讯的基本形式：这个和我们的http通讯类似，大致都分三部分：调用能力、传递参数、监听回调<br>
> + 对schame协议的理解和使用<br>
> + 调用schame协议的封装<br>
> + 内置上线的好处：更快，更安全

## 四、总结
1. hybrid是什么，为什么要用hybrid<br>
2. 介绍一下hybrid的更新、上线流程<br>
3. hybrid和h5的区别<br>
4. 客户端如何与前端进行通讯
### 解释：
+ hybrid的意思就是混合，在这里它表示前端、客户端的混合开发。<br>
  hybrid存在的核心意义就是快速迭代更新，无需审核（要知道苹果的应用商店审核快的也要一星期，安卓的话最快也要一两天）<br>
  hybrid实现的流程图：webview、静态资源、file协议
+ 掌握先前画的上线流程图（上面一个server端，下面n个客户端）<br>
  服务端当前的版本和zip包的维护<br>
  更新zip包之前，先对一下版本号<br>
  如果客户端zip包的版本号小于server端的，那么就下载，解压和覆盖
+ hybrid：<br>
  优点：体验好，可快速迭代更新<br>
  缺点：开发成本高，运维成本高<br>
  适用的场景：hybrid适合产品型，h5适用运营型（产品型：一般页面都比较固定，运营型：一般就是临时的活动页）
+ 通讯的基本形式：可调用型，传递参数，监听回调<br>
  对schame协议的理解和使用<br>
  调用schame协议的封装<br>
  内置上线的好处：更快，更安全