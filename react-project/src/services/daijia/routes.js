import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/daijia' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='price-rules'  component={ require('react-router?name=price-rules!./containers/price-rules') } />
      <Route path='orderDetails/:orderId'  component={ require('react-router?name=order!./containers/order') } />
    </Route>
  </Router>
)
export default Routes

/*
*订单列表的链接格式：lite-list/huafei?customerUserId=blm_test
*<Route path='lite-list'  component={ require('react-router?name=lite-list!./containers/lite-list') } />
*/
