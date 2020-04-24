### model 层在 backbone 架构中的作用

* 对业务中实体对象的抽象
* 做数据持久化（本地存储）
* 与服务端进行数据交互（因此 model 应该是携带数据流窜于各个模块之间的东西）

### 最简单的对象

```js
var Man = Backbone.Model.extends({
  initialize() {
    alert("you create me!");
  }
});

var man = new Man();
```

这样就完成了一个最简单的 Model，只是实现了 initialize 方法，也称构造函数，该函数会在 Modle 被实例化时调用。

### 对象赋值和取值

定义属性有两种方法，定义方法一种，取值一种：

```js
var Man = Backbone.Model.extend({
  initialize() {
    alert("you create me");
  },
  // 直接定义，用来设置属性的默认值
  default: {
    name: "zhangsan",
    ege: "18"
  },
  say(value) {
    return `${this.get("name")} say ${value}`;
  }
});

var man = new Man();
alert(man.get("name"));
// 外部设置对象的某个属性
man.set({ name: "lisi" });
// 调用对象的某个属性
alert(man.get("name"));
// 调用对象的某个方法
alert(man.say("hahahahhahaha"));
```

由此可以看出，backbone 中属性、方法的定义和获取，都是通过字典的形式进行的

### 监听属性的变化

在构造函数中进行属性 change 事件的绑定

```js
initialize() {
    alert('you create me')
    this.bind('change:name', function() {
        console.log(`您改变了name属性为：${ this.get('name') }`);
    })
}

man.set({ name: '王五' })
```

### 添加验证规则和错误提示

```js
initialize() {
    this.bind('invalid', function(model, error) {
        alert(error)
    })
}

validate(attributes) {
    if (attributes.name === '') {
        return 'name 不能为空！'
    }
}

// set时，默认不会触发验证
man.set({ name: '' })
// set时，手动触发验证方式
man.set({ name: '', validate: true })
// save时，触发validate函数验证，将返回值传给绑定的invalid事件的第二个参数
man.save()

// 注：invalid事件绑定也可以放在实例外
man.on('invaild', function(model, error) {
    alert(error)
})
```
