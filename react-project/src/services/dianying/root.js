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
    <Route path='/dianying' component={ require('react-router?name=root!./components/root') } >
      <IndexRoute component={ require('react-router?name=app!./containers/app') } />
      <Route path=':channel/detail/:filmId/:isOnShow' component={ require('react-router?name=detail!./containers/detail') } />
      <Route path=':channel/cinema/:filmId' component={ require('react-router?name=cinema!./containers/cinema') } />
      <Route path=':channel/select' component={ require('react-router?name=select!./containers/select') } />
      <Route path=':channel/getseat/:cinemaId/:planId/:hallId' component={ require('react-router?name=getseat!./containers/getseat') } />
      <Route path=':channel/order' component={ require('react-router?name=order!./containers/order') } />
      <Route path='addr/:addrTitlename/:addrnameStr/:longitude/:latitude' component={ require('react-router?name=addr!./containers/addr') } />
      <Route path='orderDetails/:orderNo' component={ require('react-router?name=orderDetails!./containers/orderDetails') } />
      <Route path='picture' component={ require('react-router?name=picture!./containers/picture') } />
      <Route path=':channel/searchall/:cityId' component={ require('react-router?name=searchall!./containers/searchall') } />
      <Route path=':channel/searchcin/:filmId' component={ require('react-router?name=searchcin!./containers/searchcin') } />
    </Route>
  </Router>
)
