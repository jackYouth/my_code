# js方法

### apply、call、bind
+ apply(), 接受两个参数obj，array。
obj取自函数上下文的对象，函数中的this会指向这个对象。
array表示要传入函数中的参数，数组形式。
```js
  const obj = {
    name: 'jack'
  }
  // 这里不能写成箭头函数，不然this的指向不会变
  const func = function (left, right) {
    console.log(`${ left } ${ this.name } ${ right }`)
  }
  func.apply(obj, ['a', 'b'])     // a jack b
```
+ call(), 第一个参数obj也是上下文的对象，后面传入的是多个单独的参数
obj取自函数上下文的对象，函数中的this会指向这个对象。
多个单独的参数都是要要传入函数中的参数
```js
  const obj = {
    name: 'jack'
  }
  // 这里不能写成箭头函数，不然this的指向不会变
  const func = function (left, right) {
    console.log(`${ left } ${ this.name } ${ right }`)
  }
  func.call(obj, 'a', 'b')     // a jack b
```

+ bind()，和call接受的参数一样，但是返回值不一样，call和apply都是会立即执行，bind则是返回一个改变了上下文this之后的函数，然后我们就去使用这个改变后的函数了，至于之前的函数，并没有任何改变。
```js
  var obj = {
      name: 'jack'
  }

  function func() {
      console.log(this.name);
  }

  var func1 = func.bind(obj);
  func1();                        // jack
```

> 箭头函数为什么无法使用apply，call，bind等方法改变其内this的指向？<br>
> 网上的答案是箭头函数本身是没有this的，所以它内部的this其实就是外层代码块中的this，两者指向是一样的
```js
  var str = 'hcc'
  const foo2 = () => {
    let str = 'hcc2'
    console.log(this.str)
  }
  foo2.call({a:1})        //'hcc'
  // foo2外层其实就是window了
```