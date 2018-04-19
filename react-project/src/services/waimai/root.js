import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk        from 'redux-thunk'
import reducers     from './reducers'

// 由Reducers创建状态树
const store = createStore(reducers, applyMiddleware(thunk))
// 定义根组件
const Root = () => (<Provider store={ store }><Routes /></Provider>)

export default Root

// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='waimai' component={ require('react-router?name=app!./containers/app') } >
      <IndexRoute component={ require('react-router?name=index!./containers/index') } />
      <Route path='Filter' component={ require('react-router?name=Filter!./containers/Filter') } />
      <Route path='Search' component={ require('react-router?name=Search!./containers/Search') } />
      <Route path='RestaurantDetail' component={ require('react-router?name=RestaurantDetail!./containers/RestaurantDetail') } />
      <Route path='order' component={ require('react-router?name=order!./containers/order') } />
      <Route path='orderDetails/:id' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
    </Route>
  </Router>
)
