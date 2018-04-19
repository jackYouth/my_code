# async和await
## 一、介绍一下async和await
+ then函数只是将callback进行了拆分
  then函数本质还是callback的写法，只是对其实现了拆分，使其更方便管理
+ async和await是最直接的同步写法
  + saync和await方法是异步函数使用同步写法的终极版本，属于es7范畴，但是es7目前还只是草案，未曾发布，只不过babel目前已经支持，所以我们也可以用
  + 用法：
    + await使用时，外层函数必须使用async标识
    + await后面必须跟的是一个Promise实例
    + 需要使用babel-polyfill
  ```js
  async function load() {
    const result1 = await loadImg(url1)
    console.log(result1)
    const result2 = await loadImg(url2)
    console.log(result2)
  }
  load()
  ```