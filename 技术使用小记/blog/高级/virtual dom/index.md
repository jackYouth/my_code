# virtual dom（简称vdom）
### 一、vdom是什么，有什么存在的必要
### 二、如何应用vdom，核心api是什么
### 三、介绍一下diff算法

### 一、vdom是什么，有什么存在的必要
+ 什么是vdom？
  + virtual dom ：虚拟dom
  + 原理是：使用js模拟dom结构<br>
  所以说他不是真实的dom
  + DOM结构的变化，放在js层来做<br>
  因为前端的三种语言，只有js是一种图灵完备的语言。所谓的图灵完备就是可以使用判断，循环，递归等逻辑处理，可以实现无限循环，无限执行的一个语言
  + 增加重绘性能<br>
  比如说a, b, c三个p标签，现在要去掉b标签。传统的实现是把a, b, c三个标签全部删除，然后再重新渲染a, c标签；vdom的做法是通过diff算法，比对出只有b标签需要删除，然后就直接把b标签删除了。这种情况下因为少重绘了两个，所以肯定是增加了重绘性能。
  + vdom的结构
    ```js
      /* html结构
      <ul id='list'>
        <li className='item'>ITEM 1</li>
        <li className='item'>ITEM 2</li>
      </ul>
      */

      // 对应的vdom结构应该是
      {
        tag:  'ul',
        attr: { id: 'list' },
        children : [
          {
            tag: 'li',
            attr: { className: 'item' },
            children: ['ITEM 1']
          },
          {
            tag: 'li',
            attr: { className: 'item' },
            children: ['ITEM 2']
          },
        ]
      }
    ```
    + 这里children表示节点内的内容，如果为对象说明内容是节点，如果是字符串说明内容是文本。
    + 另外因为class是关键字，所以使用className代替html中的class属性。
    + 这时，如果第二个li中的文本改变，就不会像之前：直接删除整个ul标签，然后再重新插入一个新的ul标签。而是通过js比对出第二个li标签下的children改变了，所以直接使用js把改变生效，这样就一定程度上避免了dom操作。dom是最耗费浏览器性能的，一万次js操作还没有一次dom操作耗费的性能多
+ 设计一个简单的需求场景
  将该数据展示成一个表格，并且随便修改一个信息，表格内容发生改变
  ```js
    var data = [
      {
        name: '张三',
        age:  '16',
        address: '北京'
      },
      {
        name: '李四',
        age: '17',
        address: '上海'
      },
      {
        name: '王五',
        age: '18',
        address: '广州'
      },
    ]
  ```
+ 用jquery实现
  ```js
    // 初始化一个render函数
    function render(data) {
      var $container = $('#container')
      // 先清空container，重要！
      $('#container').html('')
      // 拼接table
      var $table = $('<table></table>')
      $table += $('<td><tr>name</tr><tr>age</tr><tr>address</tr></td>')
      data.forEach(function(o) {
        $table += $('<td><tr>' + o.name + '</tr><tr>' + o.age + '</tr><tr>' + o.address + '</tr></td>')
      })
      // 注意：添加真实节点的操作，必须等到dom拼接完毕之后，才可以进行，如果在之前就进行的化，那么下面的每次拼接，都相当于插入节点，会重新渲染，更加耗费性能
      $container.append($table)
    }

    // 点击事件，改变内容
    let i = 0
    $('#btnChange').onclick = function() {
      i++
      data[0].age = 30 + i
      data[1].address = '深圳'
      // re-render 再次渲染
      render(data)
    }

    // 首次渲染
    render(data)
  ```

+ 遇到的问题
  如果不用vdom会遇到的一些问题：
  + dom操作是昂贵的，js更加高效
  + 尽量用js避免dom操作，而不是'推倒重来'<br>
    因为现在使用jquery实现的话，每次点击按钮，仍然会更新整个table按钮，这个也符合我们的预期，因为每次执行render函数，都会先将容器清空
  + 项目越复杂，vdom的影响就越严重
  + vdom可以解决这些问题

+ 总结 - 什么是vdom，vdom有什么存在的必要
  + virtual dom 就是虚拟dom
    + 用js来模拟dom结构 （实现原理）
  + dom操作非常昂贵
    + 所以将dom的对比操作放到js层，经过diff算法，比对出哪部分dom被改变了，然后就使用js去改变这部分的dom结构，提高效率
  + 真实dom的结构非常复杂，而通过js创造的vdom因为只创建需要的东西，所以相对而言结构会简单很多
### 二、如何应用vdom，核心api是什么
+ 介绍一下snabbdom
  + snabbdom是一个vdom的库，下面通过snabbdom来介绍一下vdom的核心api<br>
    > 首先，理解一下dom和node的区别，dom是一个结构，node是一个节点，我现在理解的他俩的区别是包容关系，dom是由node组成的一个节点结构
    ```js
      var container = document.getElementById('container')
      var vnode = h(
        'div#container.two.class',          // 这里的div和上面获取到的container必须是一样的，注意patch方法传入的两个dom结构，肯定会是以同级的形式进行对比
        {
          on: {
            click: someFn,
          }
        },
        [
          h(
            'span',
            {
              style: { fontWeight: 'bold' }
            },
            'this is bold'
          ),
          ' and this is just normal text',
          h(
            'a',
            {
              props: { href: '/foo' }
            },
            'i\'ll tack you places!'
          )
        ]
      )
      patch(container, vnode);      // 第一次渲染

      var newVnode = h(
        'div#container.two.class',
        {
          on: {
            click: someFn,
          }
        },
        [
          h(
            'span',
            {
              style: { fontWeight: 'bold' }
            },
            'this is bold'
          ),
          ' and this is just normal text',
          h(
            'a',
            {
              props: { href: '/foo' }
            },
            'i\'ll tack you places!'
          )
        ]
      )
      patch(vNode, newVnode);      // 在次渲染时，将先前的vnode和新的newVnode传过去，由snabbdom这个库，来找出前后两个dom结构之间有什么区别，然后有针对性的去改变之前的dom
    ```
+ 从这里可以看出snabbdom的两个核心api：
  + h方法
    h方法接收三个参数：
    + String，表示node节点的选择器，包括节点名称，id和class选择器
    + Object，表示node的属性，分为三大类：style、on、props，这三类也都是Object
    + Array或String，
      + 为Array时，表明有多个子内容。这些字内容有两种形式h方法、String，h方法说明当前子内容是节点，String说明当前子内容是文本
      + 为String时，表示只有一个内容且是文本格式

  + patch方法
    传入两个dom结构，然后由snabbdom这个库，来找出后一个dom相对于前一个 dom结构之间有什么区别，最后有针对性的去改变之前的dom。
    > dom结构是如何变化的，可以在浏览器的开发者模式中直接看到。上述使用patch方法时，如果只是第二个li发生改变的话，那么就只会有第二个li闪烁，第一个li不会闪。上述jquery模拟时，则是ul、两个li都进行了闪烁，这就说明了使用patch方法，他只会重新渲染改变了的dom，这样就很大程度上减少了dom的操作。<br>
  + snabbdom的具体使用
    + patch方法是初始化时得到的，需要先引用snabbdom封装的用于解析vdom结构的一些js文件
    ```js
      var patch = snabbdom.init({
        snabbdom_class,
        snabbdom_props,
        snabbdom_style,
        snabbdom_eventlisteners,
      })
    ```
    + snabbdom_class
    + snabbdom_props
    + snabbdom_style
    + snabbdom_eventlisteners
  + 使用snabbdom重写上面jquery实现的demo
  ```js
    var data = [
      {
        name: '张三',
        age: '16',
        address: '北京'
      },
      {
        name: '李四',
        age: '17',
        address: '上海'
      },
      {
        name: '王五',
        age: '18',
        address: '广州'
      },
    ]

    var patch = snabbdom.init({
      snabbdom_class,
      snabbdom_props,
      snabbdom_style,
      snabbdom_eventlisteners,
    })

    var container = document.getElementById('container')
    var vdom = contaienr
    function render(data) {
      var newVdom = h(
        'table',
        {},
        data.map(o => {
          var tds = []
          for (let oo in o) {
            if (oo.hasOwnProperty) {
              tds.push(h('td', {}, o[oo] + ''))
            }
          }
          return h(
            'tr',
            {},
            tds
          )
        })
      )
      patch(vdom, newVdom)
      // 更新当前最新的vdom
      vdom = newVdom
    }

    // 第一次渲染
    data.unshift({
      name: '姓名',
      age: '年龄',
      address: '地址',
    })
    render(data)

    document.getElementById('btn').onclick = function() {
      data[1].age = 88
      data[2].address = '深圳'
      render(data)
    }

    // 在浏览器中对比可知，下面这种，当点击btn时，dom结构中只会有第二个tr的第二个td、第三个tr的第三个td闪烁，区别于之前jquery的table标签全部闪烁
  ```
+ 总结
  + 如何使用vdom（可以用snabbdom使用过程做一个介绍，实现了什么，好处是什么）
  + vdom的两个核心api：h函数，patch函数（二者各完成了什么样的工作）
  + vdom中包含diff算法（patch函数）

### 三、介绍一下diff算法
+ 什么是diff算法<br>
  diff算法并不是react或vdom中独有的，他早就充斥于我们身边，就比如linux中的diff命令，和git中的git diff命令，都是diff算法的实际应用
+ 为什么只是去繁就简的说一下diff<br>
  + diff算法非常复杂，实现难度很大，工作量也很大
  + 去繁就简，讲明白核心流程。（谨记二八原则，工作中很多事情都是满足二八原则的，比如20%的代码完成80%的功能，另外80%的代码去完成剩下20%的功能。所以说我们只需要了解这20%的核心功能就行了，并且，着这0%也并不简单）
  + 面试官也大部分不清楚细节，但是他们都会关心核心流程
  + 去繁就简之后，依旧有很大挑战性，并不简单
+ vdom为什么使用diff算法<br>
  + dom操作非常昂贵，因此应该尽量减少dom操作
  + vdom的核心逻辑是找出本次dom必须更新的节点，然后去更新他们，其他不更新
  + 这个找出的过程，就需要diff算法
+ diff算法的实现流程<br>
  + vnode如何生成真实node
  ```js
    // vnode的结构（简易版，和真实的vnode结构差距很大，只供示例，无法线上跑起来）
    {
      tag: String,
      attr: Object,
      children: Array | String
    }
    // vnode生成真实node
    function createElement(vnode) {
      var tag = vnode.tag
      var attrs = vnode. attrs || {}
      var children = vnode.children || []
      if (!tag) return null
      // 创建元素
      var elem = document.createElement(tag)
      // 添加属性
      var attrName
      for (attrName in attrs) {
        if (attrs.hasOwnProperty(attrName)) {
          elem.setAttribute(attrName, attrs[attrName])
        }
      }
      // 子元素
      children.forEach(function(childNode) {
        // 给elem添加子元素
        elem.appendChild(createElement(childNode))
      })
      // 返回真是的node元素
      return elem
    }
    // vnode的更新(首先既然是更新，所以vnode和newVnode最外层的tag肯定是相同的，所以我们只需要比对并更新children即可)
    function updateChildren(vnode, newVnode) {
      const children = vnode.children || []
      const newChildren = newVnode.children || []
      // 遍历现在所有的children
      children.forEach(function(child, index) {
        var newChild = newChildren[index]
        // 当前新的vnode中没有tag时，没有必要比对，直接结束
        if (!newChild.tag) return null
        if (newChild.tag === newChild.tag) {
          // 两个tag一样时，递归，再去比对当前这两个子元素的子元素
          updateChildren(child, newChild)
        } else {
          // 两个tag不一样时，将newChild创建成真实的node节点后，替换旧的child对应的node节点
          replaceNode(child, newChild)
        }
      })
    }

  ```
  > 有一个问题：如果children中，只是在索引为2的地方插入了一个数据，那么索引2之后的所有dom在这种情况下不是全部都更新了吗？
  答：所以vdom中，批量生成节点的时候，需要多传一个key，这就是让diff算法根据这个key去进行比较，而不单单只是顺序
  > 递归的本质：可以无限循环。当你不知道一个东西需要执行几次时，就需要使用递归的方式，比如此例中：chilren成功继续执行，chilren不成功，终止。
  + diff实现流程的总结
    + patch(container, vnode)和patch(vnode, newVnode)
    + createElement
    + updateChildren
+ vdom中其他没有说的一些知识
  + 节点的新增和删除
  + 节点的重新排序（这个就已经很难了）
  + 节点属性、样式、时间绑定的更新
  + 极致压榨性能（这个就不是人能看懂的了）
  + 。。。

## 四、总结（vdom）
+ vdom是什么？为什么要用呢vdom？
  + vdom：virtual dom，虚拟dom。使用js来模拟出dom结构
  + 因为dom操作非常‘昂贵’，将dom对比操作放在js层（也只有js可以做对比操作）
+ vdom的一个应用，以及核心api
  + 如何使用？可以用snabbdom的用法来举例
  + 核心api：h函数和patch函数
+ 介绍一下diff算法
  + 知道diff算法是什么，是linux中的一个基本命令
  + vdom中应用diff算法，是为了找出需要更新的节点
  + 实现：patch(container, vnode)和patch(vnode, newVnode)