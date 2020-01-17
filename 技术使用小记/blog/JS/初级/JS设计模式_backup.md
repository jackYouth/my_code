# JS 设计模式

### 单例模式

终极目标是闭包实现私有成员的惰性实例化单体, 三个特点:

- 该类只有一个实例
- 该类自行创建该实例(在该类内部创建自身的实例对象)
- 向整个系统公开这个实例接口
  > 通常该类中自己定义的属性和方法, 外界系统只是调用这个实例中定义的属性和方法.

```js
var LazySingleton = function() {
  var attr = 1;
  fn = function() {};
  var obj = {
    method: function() {
      fn();
    },
    getAttr: function() {
      return attr;
    }
  };
  function init() {
    return obj;
  }
  return { getInstance: init };
};
LazySingleton.getInstance().method();
// 其中attr, fn都是实例私有的无法被改变, 当执行到变量时LazySingleton时, 并没有加载自身, 而是通过getInstance才会加载, 这就实现了惰性实例化
```
