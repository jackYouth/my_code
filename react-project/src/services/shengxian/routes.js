import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/shengxian' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='city' component={ require('react-router?name=city!./containers/city') } />
      <Route path=':channel/detail/:areaId/:commodityCode' component={ require('react-router?name=detail!./containers/detail') } />
      <Route path=':channel/order/:contactId' component={ require('react-router?name=order!./containers/order') } />
      <Route path=':channel/addr/:contactId' component={ require('react-router?name=addr!./containers/addr') } />
      <Route path=':channel/sear' component={ require('react-router?name=sear!./containers/sear') } />
      <Route path='orderDetails/:orderNo' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
    </Route>
  </Router>
)
export default Routes
