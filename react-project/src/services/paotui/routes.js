import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/paotui' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='textarea' component={ require('react-router?name=textarea!./components/textarea') } />
      <Route path='Carousel' component={ require('react-router?name=Carousel!./components/Carousel') } />
      <Route path='usertips' component={ require('react-router?name=usertips!./components/usertips') } />
      <Route path='order' component={ require('react-router?name=order!./containers/order') } />
      <Route path='tipsprice' component={ require('react-router?name=tipsprice!./components/tipsprice') } />
      <Route path='writetext' component={ require('react-router?name=writetext!./components/writetext') } />
      <Route path='changeimg' component={ require('react-router?name=changeimg!./components/changeimg') } />
      <Route path='tel' component={ require('react-router?name=tel!./components/tel') } />
      <Route path='orderDetails/:id' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
      <Route path='cannotorder' component={ require('react-router?name=cannotorder!./components/cannotorder') } />
    </Route>
  </Router>
)
export default Routes
