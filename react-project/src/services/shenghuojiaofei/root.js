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
    <Route path='/shenghuojiaofei(/:jiaofeifangshi)' component={ require('react-router?name=root!./components/rooter') }>
      <IndexRoute component={ require('react-router?name=app!./containers/App') } />
      <Route path='selectCity' component={ require('react-router?name=selectCity!./containers/SelectCity') } />
      <Route path='selectOrg' component={ require('react-router?name=selectOrg!./containers/selectOrg') } />
      <Route path='addUser' component={ require('react-router?name=addUser!./containers/AddUser') } />
      <Route path='billInfo' component={ require('react-router?name=billInfo!./containers/BillInfo') } />
      <Route path='homeManege' component={ require('react-router?name=homeManege!./containers/HomeManege') } />
      <Route path='editHome' component={ require('react-router?name=editHome!./containers/EditHome') } />
      <Route path='editAddress' component={ require('react-router?name=editAddress!./containers/EditAddress') } />
      <Route path='addHome' component={ require('react-router?name=addHome!./containers/AddHome') } />
      <Route path='billList' component={ require('react-router?name=bill-list!./components/price-input') } />
      <Route path=':orderId' component={ require('react-router?name=order-details!./components/order-details') } />
    </Route>
  </Router>
)

//  <Route path='bill' component={ require('react-router?name=bill!./containers/Bill') } />
//  <Route path='order' component={ require('react-router?name=order!./containers/Order') } />
