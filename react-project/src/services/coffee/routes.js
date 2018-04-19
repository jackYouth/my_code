import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/coffee' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='details' component={ require('react-router?name=details!./containers/details') } />
      <Route path='cart' component={ require('react-router?name=cart!./components/cart') } />
      <Route path='attribute' component={ require('react-router?name=attribute!./components/attribute') } />
      <Route path='order' component={ require('react-router?name=order!./containers/order') } />
      <Route path='editcontact' component={ require('react-router?name=editcontact!./components/editcontact') } />
      <Route path='listadddown' component={ require('react-router?name=listadddown!./components/listadddown') } />
      <Route path='contactlist' component={ require('react-router?name=contactlist!./components/contactlist') } />
      <Route path='goodslist' component={ require('react-router?name=goodslist!./components/goodslist') } />
      <Route path='cartpopup' component={ require('react-router?name=cartpopup!./components/cartpopup') } />
      <Route path='orderDetails/:id' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
    </Route>
  </Router>
)
export default Routes
