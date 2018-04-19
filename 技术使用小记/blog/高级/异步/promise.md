# Promise的基本使用和原理
## [一、基本语法回顾](#一、基本语法回顾)
## [二、异常捕获](#二、异常捕获)
## [三、多个串联](#三、多个串联)
## [四、Promise.all和Promise.race](#四、Promise.all和Promise.race)
## [五、Promise标准](#五、Promise标准)
## [六、Promise总结](#六、Promise总结)

## 一、基本语法回顾
```js
const loadImg = src => {
  const promise = new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.onload = () => {
      resolve(img)
    }
    img.onfail = () => {
      reject()
    }
    img.src = src
  })
  return promise
}

const test = loadImg('https://coding.m.imooc.com/static/module/common/img/logo2.png')
test.then(img => {
  console.log(img.width)
}, () => {
  console.log(‘failed’)
}).then(img => {
  console.log(img.height)
})
// 对于原生不支持Promise语法的浏览器，可以先引用bootcdn中的bluebird，来兼容
```
## 二、异常捕获
+ 实际应用中，then方法里都只写一个函数，表示成功之后函数，最后在所有的then之后，统一用catch方法，用来捕获异常
catch方法可以捕获到所有的异常情况
+ 常见的异常包括：reject返回的结果、throw new Error()方法人为抛出的异常
```js
const result = loadImg('https://coding.m.imooc.com/static/module/common/img/logo2.png')
result.then(img => {
  console.log(img.width)
  return img
}).then(img => {
  console.log(img.height)
}).catch(ex => {
  // 统一捕获异常
  console.log(ex)
})

// 可以通过人为抛出一个异常来测试catch方法：throw new Error('人为抛出异常')
```
## 三、多个串联
+ 使用场景：如果同时有多个Promise对象时，如果下一个promise对象的创建需要使用到上一个promise对象返回的结果，那么可以在第一个promise对象的then方法中获取到结果之后，根据这个结果再去创建并返回下一个promise对象。
+ 好处：使用then方法可以讲这些步骤以扁平化的方式写出来，方便管理。避免了之前callback无限嵌套的模式
```js
// 例：先获取第一张图片，然后再获取第二张图片。先用这个例子简单模拟一下
const result1 = loadImg('https://coding.m.imooc.com/static/module/common/img/logo1.png')
result1.then(function(img) {
  console.log('第一张图片加载完毕', img.height())
  return loadImg('https://coding.m.imooc.com/static/module/common/img/logo2.png')
}).then(function(img) {
  console.log('第二张图片加载完毕', img.height())
}).catch(function(ex) {
  // 统一捕获异常
  console.log(ex)
})
```

## 四、Promise.all和Promise.race
```js
// Promise.all()方法接收一个Promise对象的数组，待数组中所有的promise对象执行完毕后，才会触发then方法
Promise.all([result1, result2]).then(function(datas) {
  // 接受到的datas是一个数组，里面元素的顺序是先前参数中promise对象的顺序
  console.log(datas[0])
  console.log(datas[1])
})

// Promise.race()方法接收一个Promise对象的数组，这里只要数组中有一个promise对象执行完毕后，就会触发then方法
Promise.race([result1, result2]).then(function (data) {
  // 接受到的data就是最先执行完毕的promise对象返回的结果
  console.log(data)
})
```
> 注：这里的Promise都是大写，表明all和race是window下面Promise对象中的方法

## 五、promise标准
+ 状态变化
  + 三种状态：pendding、fulfilled、rejected
  + 状态变化过程：pendding -> fulfilled，或pendding -> rejected
  + 状态变化的不可逆性：pendding一旦变成fulfilled或rejected之后，就不能再变回pendding了
+ then
  + Promise实例必须实现then这个方法，不然没有意义
  + then方法必须可以接收两个函数作为参数
  + then方法返回的必须是一个Promise实例
    如果then方法没有显式的通过return返回一个promise对象，那么就会默认向上找最近的一个promise对象去返回
+ 关于标准的一些闲谈
  + 任何技术的推广都需要标准的支撑
    常见的标准：W3C，ECMA，http等等
  + 如html、css、js等，都有标准，无规矩不成方圆
  + 任何不符合标准的东西终将被用户抛弃
  + 不要挑战标准，不要自造标准
    遇到问题，要去找标准，然后按照标准去解决，不要自造标准。因为你的代码总归不是自己一个人就能全部搞定的，终将和别人联调时，这时别人可不会管你的标准。而已有的标准虽然有的可能不好用，但都是久经考验的

## 六、Promise总结
+ 基本语法的回顾
+ 异常的捕获
  catch方法进行统一异常捕获，异常主要包括：reject方法返回，throw new Error()人为制造一个错误
+ Promise的串联
  Promise链式的执行方式，使串联操作看起来更美观
+ Promise.all()和Promise.race()
  + all：所有，即传入的所有promise对象都执行完毕后，再调用then方法
  + race：竞赛，即传入的promise对象中只要有一个执行完毕，就立即调用then方法
  + 所以对于传入同样的参数，且promise个数大于1个时，race方法总会比all方法先执行
+ Promise的标准
  + 状态变化
  + then函数


> 来谈谈你对promise的理解
+ 首先先说明一下promise是有jquery-deferred演变过来的，然后再说说jquery-deferred的实现，最后再回到promise上来，说一下promise的语法，all和race方法，then方法等
