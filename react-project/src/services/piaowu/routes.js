import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/piaowu' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='detail' component={ require('react-router?name=detail!./containers/detail') } />
      <Route path='addr' component={ require('react-router?name=addr!./containers/addr') } />
      <Route path='select' component={ require('react-router?name=select!./containers/select') } />
      <Route path='order' component={ require('react-router?name=order!./containers/order') } />
      <Route path='orderDetails/:orderNo' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
    </Route>
  </Router>
)
export default Routes
