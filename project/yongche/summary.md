# 用车项目 小结
## 技术难点
### 等待应答和行程中两种状态下的订单轮询
1， 使用状态+订单id的形式，命名定时器
2， 当切换页面的时候，在componentWillUnmount中，关闭定时器，确保定时器只存在于改页面，且该页面只有一个定时器工作
3， 在订单轮询的时候，根据返回的状态，来确定开启或关闭哪一个定时器，因为在切换回该页面的时候，有可能是任何一种状态，所以，在每一个状态中，都要判断一下当前有没有该订单该状态对应的计时器，如果没有，就新建一个

### 多个订单，每个都对应一个计时器用于记录当前叫车时间
1， 在下单的时候，就将定时器的起始时间存到本地中
2， 使用id来给每一个定时器命名
3， 当切换页面的时候，在componentWillUnmount中，关闭定时器，确保定时器只存在于该页面，且该页面只有一个定时器工作
