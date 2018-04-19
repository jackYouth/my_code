import React from 'react'
// import 'vconsole'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk        from 'redux-thunk'
import reducers     from './reducers'

// import Home from "./containers/home.js"
// import Mycar from "./containers/mycar.js"

// 由Reducers创建状态树
const store = createStore(reducers, applyMiddleware(thunk))
// 定义根组件
const Root = () => (<Provider store={ store }><Routes /></Provider>)

export default Root

// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/weizhang' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=home!./containers/Home') } />
      <Route path='mycar' component={ require('react-router?name=mycar!./containers/mycar') } />
      <Route path='addFlate' component={ require('react-router?name=addFlate!./containers/addFlate') } />
      <Route path='peccancy' component={ require('react-router?name=peccancy!./containers/peccancy') } />
      <Route path='condition' component={ require('react-router?name=condition!./containers/condition') } />
      <Route path='order' component={ require('react-router?name=order!./containers/order') } />
      <Route path='second' component={ require('react-router?name=second!./containers/second') } />
      <Route path='orderDetails/:orderNo' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
    </Route>
  </Router>
)
