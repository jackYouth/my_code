import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/qiche' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='air' component={ require('react-router?name=air!./containers/air') } />
      <Route path='order' component={ require('react-router?name=order!./containers/order') } />
      <Route path='orderDetails/:orderNo' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
    </Route>
  </Router>
)
export default Routes
