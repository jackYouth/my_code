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
    <Route path='/jiayouka' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=Home!./components/Home') } />
      <Route path='CardsList' component={ require('react-router?name=CardsList!./containers/CardsList') } />
      <Route path='AddNewCard' component={ require('react-router?name=AddNewCard!./containers/AddNewCard') } />
      <Route path='orderDetails/:id' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
    </Route>
  </Router>
)
