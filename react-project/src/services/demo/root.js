import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

// 由Reducers创建状态树
const store = createStore(reducers, applyMiddleware(thunk))
// 定义根组件
const Root = () => (<Provider store={ store }><Routes /></Provider>)

export default Root

// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/demo' component={ require('react-router?name=app!./containers/app') } >
      <Route path='page1' component={ require('react-router?name=page1!./containers/page1') } />
      <Route path='page2' component={ require('react-router?name=page2!./containers/page2') } />
    </Route>
  </Router>
)
