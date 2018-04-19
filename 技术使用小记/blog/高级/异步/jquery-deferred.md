# jquery-deferred
## 什么时候提出来的，有什么好处
  + jquery-deferred是jquery 1.5版本之后提出的一个概念，他的好处从ajax的写法中就可以看出来：
  ```js
  // 1.5版本之前
  $.ajax({
    url: 'http://baidu.com',
    method: 'get',
    success: function(data) {

    },
    error: function(data) {

    }
  })
  // 他返回的是一个xhr对象

  // 1.5版本之后
  $.ajax({
    url: 'http://baidu.com',
    method: 'get'
  }).done(function(data){

  }).fail(function(data) {

  }).done(function(data){

  })
  // 可以无限的点下去，他返回的是一个deferred对象
  // 也可以写成这种形式，这样就很类似现在的promise的写法了
  $.ajax({
    url: 'http://baidu.com',
    method: 'get'
  }).then(function (data) {

  }, function(err){

  }).then(function (data) {

  }, function(err) {

  })
  // 可以无限的点下去，他返回的是一个deferred对象
  ```
  + jquery-deferred带来的变化
    + 无法改变JS异步和单线程的本质
    + 只能从语法上杜绝callback这种形式
    + 它其实是一种语法糖形式，但是实现了代码的解耦
    + 很好的体现了开发封闭原则（某段代码写好之后，就给他封闭起来，不再改动，如果后期添加的话，也从外部进行添加，比如通过1.5之后then的方式，更加优雅。1.5之前如果要改变的话，是必须要改变之前写好的代码的，这样一是麻烦，二是冗余）
  + jquery-deferred的使用
    ```js
    function waitHandler() {
      var dtd = new $.Deferred()

      // wait函数其实就是一个容器，用来功能封装，这样代码看起来一块一块的更优雅
      var wait = function(dtd) {
        // 分割线-------以下就是具体的异步函数，实际应用中，代码 直接换掉即可
        var task = function() {
          console.log('执行完成')
          dtd.resolve()          // 表示异步任务已经完成，返回值可以被then方法中的成功的回调函数捕捉到
          // dtd.reject()        // 表示异步任务已经失败或出错，返回值可以被then方法中的失败的回调函数捕捉到
          // 注意：成功失败只能执行一个，不能同时执行，会报错
        }
        setTimeout(task, 2000)
        // 分割线-------以上就是具体的异步函数，实际应用中，代码 直接换掉即可
        return dtd            // 要求返回deferred对象
      }

      // 这里一定要有返回值，而且返回值是deferred对象，这样才能后续使用then方法进行链式调用
      return wait(dtd)
    }
    ```
    + 这个函数的实质：其实就是内部中有一个异步执行的函数，通过使用Deferred实例，我们可以实现在函数外面，获取到异步执行结束后返回的数据
    + 具体实现步骤：
      1. 实例化一个Deferred实例，如：dtd
      2. 异步函数之行结束后，通过dtd.resolve(data)或dtd.reject(data)将成功或失败的结果返回
      3. 将这个dtd对象返回，因为函数执行结果是一个dtd对象，所以就可以直接调用dtd对象下的方法
      4. 函数执行后，通过.then(function(suc){}, function(err){})，来接收异步执行的结果
      > then方法内部应该也实现了Deferred的方法封装，所以仍然会返回Deferred对象，然后继续调用then方法
  + deferred对象方法的分类
    + 主动触发：dtd.resolve(), dtd.reject()
    + 被动监听：dtd.then(), dtd.done(), dtd.fail()
    > 这两类方法要分开，第一种放在封装函数内，第二种放在封装函数外。因为第一种方法如果写在封装的函数之外，调用后因为已经有了结果，所以第二种方法就会直接执行，而不会等到异步函数完成之后再去执行
  + deferred中的promise对像
    + 出现的原因：为了解决上述第一类方法，有可能在外部进行调用的这个漏洞，我们引入Promise对象，该对象一开始，是挂载在Deferred对象下的。
    + 与Deferred对象的区别是：只支持dtd的then、done、fail这三种方法。**注：这时的promise对象需要通过$.when(函数结果)一下才能调用then等方法**<br>
    所以上述代码中的wait函数的return dtd要改成return dtd.promise()，这样如果函数执行结果如果调用resolve或reject方法，就会报错