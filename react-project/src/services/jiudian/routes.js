import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/jiudian' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='condition' component={ require('react-router?name=condition!./containers/condition') } />
      <Route path='hotelList' component={ require('react-router?name=hotelList!./containers/hotelList') } />
      <Route path='details' component={ require('react-router?name=details!./containers/details') } />
      <Route path='imgList' component={ require('react-router?name=imgList!./components/imgList') } />
      <Route path='order' component={ require('react-router?name=order!./containers/order') } />
      <Route path='guarantee' component={ require('react-router?name=guarantee!./containers/guarantee') } />
      <Route path='orderDetails/:id' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
      <Route path='hotelDetailPage' component={ require('react-router?name=hotelDetailPage!./components/hotelDetailPage') } />
    </Route>
  </Router>
)
export default Routes
