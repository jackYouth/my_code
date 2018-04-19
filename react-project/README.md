# OTOSaaS Web Apps

#### 相关文档

* [业务相关功能库（登陆、定位、支付等）](./BUSINESS.md)

#### 项目内别名

```js
  //business 业务相关功能库，用法：
  import * from 'business'

  //images   公共图片文件夹，用法：
  import img_src from 'images/img.png'
  ...
  <img src={ img_src } />
  ...

  //services  服务文件夹，用于服务之间相互引用，用法：
  import cashier from 'services/cashier'

  //svg       SVG图片文件夹，用法（参见 demo）：
  import { Icon } from 'antd-mobile'
  ...
  <Icon type={ require('svg[/services]/xxx.svg') } />
  ...

  //customize  根据客户定制的高阶组件
  import customize from 'customize'

  //styles     全局通用样式
  // @import '~styles/index.scss'

```

#### cdn
一共三处，可通过搜索jackyouth.cdn找出。config中三处：loaders中将所有图片打包后的公共路径都添加cdn前缀；plugins中离线插件中使用cdn与名下的文件作为离线文件；index中将打包后文件的访问地址加上cdn域名前缀


---

#### 注意事项
1. 重新建个服务来做，而不要直接修改demo~
2. 在develop上新建分支（feature-[功能]）
3. 切换到新的分支上开发
4. 服务测试完成后再合并到develop上


---

#### 服务名为demo的项目示例

###### 创建服务

```bash
  $ npm run new demo

  测试服务器默认监听9000端口，如需指定端口，则运行：
  $ npm run new demo 20000
```

###### 运行测试

```bash
  $ npm run demo
```
###### 编译项目

```bash
  $ npm run demo_build
```

###### 静态文件输出目录：./dist/demo
