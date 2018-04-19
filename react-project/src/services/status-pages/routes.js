import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/status-pages' component={ require('react-router?name=root!./components/root') } >
      <Route path='geolocation-error' component={ require('react-router?name=geolocation-error!./components/geolocation-error') } />
    </Route>
  </Router>
)
export default Routes
