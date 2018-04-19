import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/service/:channel' component={ require('react-router?name=app!./containers/app') } />
  </Router>
)
export default Routes
