# 原型
## 说一个原型的实际应用
  + 描述一下jquery如何使用原型
  + 描述一下zepto如何使用原型
## 原型如何实现它的扩展性

## 原型的实际应用
以jquery和zepto来说，我们分成三个步骤：
+ juqery和zepto的简单使用
  + 引用jquery之后，如下代码：<br>
    const $p = $('p');  <br>
    这里$('p')，就相当于实例化出一个实例。然后这个实例上面就可以使用原型上的一些方法，比如$p.css('width', '100px')
  + zepto插件的使用和jquery一样
+ zepto如何使用原型（根据源码去剖析）
  +  以$('p').css('width', '100px')为例解析
  ```js
    // 这句话通过拆分成$('p'), css()，可以知道zepto中使用$('p')可以返回一个表示p节点的实例对象，该对象下封装好了很多方法，比如css()方法
    // 代码演示推进过程
    window.zepto = {}

    window.$ = function(selector) {
      return zepto.init(selector)
    }

    // 初始化选择器这里，源码中做了很多兼容，因为我们只说一下zepto中原型的使用，所以对这部分实现进行了弱化
    zepto.init = selector => {
      // Array.prototype.slice.call()，的作用是将NodeList（类数组）转成一个真实的数组
      const dom = Array.prototype.slice.call(document.querySelectorAll(selector))
      return zepto.Z(dom, selector)
    }

    zepto.Z = (dom, selector) => {
      // 这里出现了关键字new，说明是用了构造函数，也就是说初始化选择器是，返回的其实就是Z这个构造函数
      return new Z(dom, selector)
    }

    function Z(dom, selector) {
      const len = dom ? dom.length : 0
      for (let i = 0; i < len; i++) {
        // 首先该构造函数中要包括选择到的节点元素，所以这里以类数组的形式先拷贝下来，这样$('p')[0]就代表获取到的第一个dom元素了
        this[i] = dom(i)
      }
      // 同时该构造函数也应该有length属性等等，该有的属性需要一一添加上
      this.length = len
      this.selector = selector || ''
    }
    // 这里就是为构造函数的原型上，添加一些方法
    zepto.Z.prototype = Z.prototype = $.fn

    $.fn = {
      constructor: zepto.Z,
      css: function(key, value) {
        console.log('css suc')
      },
      html: function(content) {
        console.log('html suc')
      },
    }
  ```

+ jquery如何使用原型
  jquery相对于zepto，总体实现结果大体是相同的，但是一些内部的算法可能稍有差异，jquery健壮性更强，zepto代码量更少
  ```js
    window.$ = jQuery
    // jQuery就等于$，这里在一开始时，就出现了关键字new，说明从一开始就直接是用了构造函数
    var jQuery = function(selector) {
      return new jQuery.fn.init(selector)
    }

    // 定义构造函数(源码中的init方法实现是比较复杂的，因为有很多属性和兼容要处理，这里是针对原型的实现而做了弱化)
    var init = jQuery.fn.init = function(selector) {
      const dom = Array.prototype.slice.call(document.querySelectorAll(selector))
      const len = dom ? dom.length : 0
      for (let i = 0; i < len; i++) this[i] = dom[i]
      this.length = len
      this.selector = selector || ''
    }

    init.prototype = jQuery.fn

    jQuery.fn = jQuery.prototype = {
      css(key, value) {
        alert('css')
      },
      html(value) {
        alert('html')
      },
    }
  ```
  > 综上，对于介绍一个原型的实际应用这个题目，分成三步：1,描述一下jquery如何使用原型的；2，描述一下zepto如何使用原型的；3，结合自己的项目经验，说一个自己开发的例子

## 原型如何实现他的扩展性
+ 如果你仔细看过并理解了上面的源码解析时，你肯定就会有一个疑问：<br>
  &emsp;&emsp;不管是jquery还是zepto，他们在赋值原型属性的时候，中间都经过了jQuery.fn或$.fn这一步，例如zepto的最后：
  ```js
    zepto.Z.prototype = Z.prototype = $.fn
    $.fn = {
      constructor: zepto.Z,
      css: function(key, value) {
        console.log('css suc')
      },
      html: function(content) {
        console.log('html suc')
      },
    }
  ```
  &emsp;&emsp;这里的实例对象是Z，我们在给他添加原型时，是先赋值给了$.fn，理论上直接把后面的对象赋值给Z.prototype就行了，那为什么要这样写？本着存在即合理的原则，这样写肯定是有他的作用。那么他的用处体现在哪里呢？他的用处实在是太亮眼了。<br>
  &emsp;&emsp;因为Z.prototype = $.fn，那么当我们在外部给$.fn添加属性时，其实就相当于直接给Z.prototype添加属性啊，这样不就完成了源码外部实现原型属性的扩展了吗。<br>
  ```js
    $.fn.getNodeName = function() {
      alert(this[0].nodeName)
    }
    // 这里的this是直接指向zepto中的原型对象Z的，这也是这种方法实现插件扩展的优势
  ```
  &emsp;&emsp;这也就是我们常说的，jquery插件的封装，利用的就是$.fn来直接操作jquery内部的原型链。
+ 通过$.fn来给原型增加属性的好处
  1. 只有$暴露在window全局对象中
  2. 将插件扩展统一到$.fn.这一个接口，方便使用
+ 封装完的插件，通过$可以直接调用到
  > 总结：原型如何实现它的扩展性：说一下jquery和zepto的插件机制；结合自己的经验，说一下自己做过的基于原型的插件

# 总结
## 说一个原型的实际应用
  + 描述一下jquery如何使用原型
  + 描述一下zepto如何使用原型
    + 上面两个剖析源码时的三个点：入口、构造函数、构造函数的原型
    + 围绕着这三个点，阐述一下具体的实现过程
  + 结合自己的项目经验，说一个自己开发的例子
## 原型如何实现它的扩展性
  + 说一下jquery和zepto的插件机制
    + 三个点：扩展插件的写法、扩展到哪里了、有什么好处
    + 围绕这三个点，阐述一下具体的实现过程
  + 结合自己的项目经验，说一个自己开发的例子