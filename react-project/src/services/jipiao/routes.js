import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/jipiao' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='air' component={ require('react-router?name=air!./containers/air') } />
      <Route path='detail/:flightNum/:flightTimes/:flightTypeFullName' component={ require('react-router?name=detail!./containers/detail') } />
      <Route path='order/:flightNum/:flightTimes/:flightTypeFullName/:index' component={ require('react-router?name=order!./containers/order') } />
      <Route path='refund/:orderNo/:ticketNo' component={ require('react-router?name=refund!./containers/refund') } />
      <Route path='refundup/:orderNo/:ticketNo' component={ require('react-router?name=refundup!./containers/refundup') } />
      <Route path='change/:orderNo/:orderId/:ticketNo' component={ require('react-router?name=change!./containers/change') } />
      <Route path='changeord/:orderNo/:ticketNo' component={ require('react-router?name=changeord!./containers/changeord') } />
      <Route path='changeup/:orderNo/:ticketNo' component={ require('react-router?name=changeup!./containers/changeup') } />
      <Route path='remail/:orderNo' component={ require('react-router?name=remail!./containers/remail') } />
      <Route path='orderDetails/:orderNo' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
    </Route>
  </Router>
)
export default Routes
