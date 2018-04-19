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
    <Route path='/menpiao' component={ require('react-router?name=app!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path='details' component={ require('react-router?name=details!./containers/details') } />
      <Route path='picshow' component={ require('react-router?name=picshow!./containers/picshow') } />
      <Route path='order' component={ require('react-router?name=order!./containers/order') } />
      <Route path='addrBumap' component={ require('react-router?name=addrBumap!./components/addrBumap') } />
      <Route path='moreDate' component={ require('react-router?name=moreDate!./components/moreDate') } />
      <Route path='AddTouristUse' component={ require('react-router?name=AddTouristUse!./components/AddTouristUse') } />
      <Route path='search' component={ require('react-router?name=search!./containers/search') } />
      <Route path='orderDetails/:id' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
    </Route>
  </Router>
)
