import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/shangcheng' component={ require('react-router?name=app!./containers/app') } >
      <IndexRoute component={ require('react-router?name=main!./containers/main') } />
      <Route path='main' component={ require('react-router?name=main!./containers/main') } />
      <Route path='market' component={ require('react-router?name=market!./containers/main/market') } />
      <Route path='daojia' component={ require('react-router?name=daojia!./containers/main/daojia') } />
      <Route path='specialty' component={ require('react-router?name=specialty!./containers/main/specialty') } />
      <Route path='categories' component={ require('react-router?name=categories!./containers/main/categories') } />
      <Route path='commodityList/:categoryId' component={ require('react-router?name=commodity-list!./containers/common-component/commodity-list') } />
      <Route path='commodity' component={ require('react-router?name=commodity!./containers/main/commodity-detail') } />
      <Route path='cart' component={ require('react-router?name=cart!./containers/cart') } />
      <Route path='userCenter' component={ require('react-router?name=user-center!./containers/user-center') } />
      <Route path='address' component={ require('react-router?name=address!./components/user-center/address') } />
      <Route path='activity' component={ require('react-router?name=activity!./components/activity') }>
        <Route path='year' component={ require('react-router?name=year!./containers/activity/year-activity') } />
        <Route path='ttth' component={ require('react-router?name=ttth!./containers/activity/ttth') } />
      </Route>
      <Route path='order'>
        <IndexRoute component={ require('react-router?name=order!./containers/user-center/order') } />
        <Route path=':orderType/:orderId' component={ require('react-router?name=order-detail!./components/user-center/order-detail') } />
      </Route>
      <Route path='orderList' component={ require('react-router?name=order-list!./containers/user-center/order-list') } />
      <Route path='collectList' component={ require('react-router?name=collect-list!./containers/user-center/collect-list') } />
      <Route path='attentionList' component={ require('react-router?name=attention-list!./containers/user-center/attention-list') } />
      <Route path='evaluate/:orderType/:orderId' component={ require('react-router?name=attention-list!./containers/evaluate') } />
      <Route path='evaluateList/:commodityId' component={ require('react-router?name=attention-list!./containers/evaluate/evaluate-list') } />
      <Route path='refundList' component={ require('react-router?name=refund-list!./containers/user-center/refund-list') } />
      <Route path='refund/:orderType/:orderId' component={ require('react-router?name=refund!./containers/refund') } />
      <Route path='refundInfo/:orderType/:orderId' component={ require('react-router?name=refundInfo!./containers/refund/refund-info') } />
      <Route path='message'>
        <IndexRoute component={ require('react-router?name=message!./containers/message') } />
        <Route path='dialog' component={ require('react-router?name=message-dialog!./containers/message/message-dialog') } />
      </Route>
      <Route path=':brandId' component={ require('react-router?name=brand!./containers/brand') } />
    </Route>
  </Router>
)
export default Routes


/*
  commodity:    /shangcheng/commodity?commodityId=${ commodityId }
  orderList:    /shangcheng/orderList?filter=${ filter }
  orderDetail:  /shangcheng/order/${ orderType }/${ orderId }
  evaluate:     /shangcheng/evaluate/${ orderType }/${ orderId }
  evaluateList: /shangcheng/evaluateList/${ orderId }
  refund:       /shangcheng/refund/:orderType/:orderId?specificationId=${ specificationId }
  messageDialog: /shangcheng/dialog?brandId=132&brandName=132
  brand:         /shangcheng/${ brandId }
*/
