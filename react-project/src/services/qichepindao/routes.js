import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/qichepindao' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='carType' component={ require('react-router?name=carType!./containers/carType') } />
      <Route path='addCar' component={ require('react-router?name=addCar!./containers/addCar') } />
      <Route path='editCar' component={ require('react-router?name=editCar!./containers/editCar') } />
      <Route path='CarDetails' component={ require('react-router?name=CarDetails!./components/CarDetails') } />
    </Route>
  </Router>
)
export default Routes
