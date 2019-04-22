# MVVM和vue
### MVVM
+ 如何理解MVVM
+ 如何实现MVVM
+ 是否读过vue源码
### 题目
+ 说一下使用jquery和使用框架的区别（从jquery和vue实现to-do-list的代码中可以分析出区别）
  + 数据和视图的分离（数据就是js逻辑，视图就是html标签），解耦（开放封闭原则 ）
    + 他的数据和视图是耦合在一起的（li标签和title）。在js中，直接生成li标签对应的视图。
    + vue中视图全在html，数据的处理全在js中，所以二者实现了分离。
  + 以数据驱动视图，只需要关注数据变化，dom操作被封装
    + jquery的本质还是dom改变视图，通过操作li标签实现ul中视图的更改。通过操作input标签，实现input中视图的更改
    + vue中，他通过js的一系列封装，实现了根据数据来渲染视图的功能（dom操作被封装）。v-model就相当于react中的state，当v-model对应的数据改变时，vue就会自动根据最新的数据，来重新渲染视图。
+ 说一下对MVVM的理解
  说到MVVM，那必须要说一下MVC。MVC出现的比较早，在asp、.net时代就有了一些相关的理念。MVC的架构可解读为：视图（view） --> 控制器（controller） --> 数据源模型（model） --> 视图（view）；
  视图
+ vue中如何实现响应式
+ vue中如何解析模版
+ vue的整个实现流程



