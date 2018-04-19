import React from 'react'
import { Router, Route, browserHistory } from 'react-router'

// 由Reducers创建状态树
// const store = createStore(reducers, applyMiddleware(thunk))
// 定义根组件
const Root = () => (<Routes />)

export default Root

// 路由配置
const Routes = () => (
  <Router history={ browserHistory } >
    <Route path='/lite-list' component={ require('react-router?name=app!./components/app') } >
      <Route path=':orderType' component={ require('react-router?name=list!./components/list') } />
    </Route>
  </Router>
)
