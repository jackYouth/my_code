### class 中 set、get 关键字的使用

es6 中，在声明一个构造函数时，可以通过 set、get 关键字，对某个属性设置存值函数和取值函数，用于拦截改属性的存取行为。实例化该对象后，如果对该属性进行存取，会走对应的存、取值函数，而不会再是默认的赋值、取值操作。

```js
class Myclass {
  constructor() {}
  get props() {
    return "getter";
  }
  set props(value) {
    console.log("setter:" + value);
  }
}

const test = new Myclass();
test.props = 123; // 会打印出 setter:123
test.props; // 会返回 getter
```
