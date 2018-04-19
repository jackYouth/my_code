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

    <Route path='/liuliang' component={ require('react-router?name=root!./components/rooter') }>
      <IndexRoute component={ require('react-router?name=liuliang!./containers/Liuliang') } />
      <Route path='orderDetails/:orderId' component={ require('react-router?name=order-details!./components/order-details') } />
    </Route>

  </Router>
)
