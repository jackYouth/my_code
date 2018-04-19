import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/baoyang' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='orderDetails/:id' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
      <Route path=':shopId' component={ require('react-router?name=info!./components/info') }>
        <Route path='detail' component={ require('react-router?name=detail!./containers/detail') } />
        <Route path='license' component={ require('react-router?name=license!./components/license') } />
        <Route path='service' component={ require('react-router?name=info!./components/info') } >
          <Route path='description' component={ require('react-router?name=description!./components/description') } />
          <Route path='confirm' component={ require('react-router?name=confirm!./containers/confirm') } />
        </Route>
        <Route path='map' component={ require('react-router?name=map!./components/map') } />
      </Route>
    </Route>
  </Router>
)
export default Routes
