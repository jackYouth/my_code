# cookie、localStorage、sessionStorage的区别
### cookie
* cookie有小饼干的意思，顾名思义，所以cookie的大小限制为4kb。为网景前员工发明，主要用途是是用来保存登陆信息，用来后端识别此次http请求的用户是否有权限获取数据。
* cookie在每次http请求的时候都会被携带在请求头上，所以cookie的体积一定要小，一般不保存除登陆信息以外的东西
* 一般由服务器端生成，可设置失效时间
* 需要程序员自己封装，原生的cookie接口不太友好

### localStorage
* localStorage是html5中新加的技术，但是早在IE6时代，就有一个userData的东西用于本地存储，所以如果想要兼容IE6+浏览器，可以使用userData作为polyfill的一种方案

### sessionStorage
* sessionStorage和localStorage类似，session这个词，有会话的意思，所以他只会存在于当前标签页面中，其他同源的页面中是访问不到的，并且当前标签页面一旦关闭，sessionStorage就会消失

### cookie、localStorage、sessionStorage三者的区别

| 特性 | cookie | localStorage | sessionStorage |
| ---: | :--: | :--: | :--: |
| 数据生命周期 | 可设置失效时间 | 除非被清除，否则永久存在 | 当前标签一旦被关闭，就会被删除 |
| 数据大小 | 4kb | 一般为5MB | 同localStorage |
| 与服务器端通信 | 每次请求都会携带在http头中 | 仅在客户端（浏览器）中存在，不参与和服务器的通信 | 同localStorage |
| 易用性 | 需程序员自己封装，原声的cookie接口不太友好 | 原生接口也可接受，并可对其封装，来对Array和Object有更好的支持 | 同localStorage |