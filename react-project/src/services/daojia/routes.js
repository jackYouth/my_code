import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/daojia' component={ require('react-router?name=root!./components/root') } >
      <Route path='user-comment' component={ require('react-router?name=userComment!./components/user-comment.js') } />
      <Route path='comment-info' component={ require('react-router?name=commentInfo!./components/comment-info') } />
      <Route path='search' component={ require('react-router?name=search!./components/index-search') } />
      <Route path=':orderType/orderDetails/:orderId' component={ require('react-router?name=order-details!./components/order-details') } />
      <Route path=':industryCode'>
        <IndexRoute component={ require('react-router?name=app!./containers/app') } />
        <Route path='detail' component={ require('react-router?name=detail!./components/detail-container') }>
          <IndexRoute component={ require('react-router?name=detail!./containers/detail') } />
        </Route>
        <Route path='business' component={ require('react-router?name=business!./components/business-container') }>
          <IndexRoute component={ require('react-router?name=business!./containers/business') } />
        </Route>
        <Route path='order' component={ require('react-router?name=order!./containers/order') } />
        <Route path='comment' component={ require('react-router?name=comment!./containers/comment') } />
      </Route>
    </Route>
  </Router>
)
export default Routes

/*
  评论页面的路由设计：
  /daojia/user-comment?orderId&orderType&brandImage&serviceId
*/
