import React        from 'react'
import { render }   from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk        from 'redux-thunk'
import reducers     from './reducers'
import Routes       from './routes'

// 定义根组件
const Root  = () => (
  <Provider store={ createStore(reducers, applyMiddleware(thunk)) }>
    <Routes />
  </Provider>
)
render(<Root />, document.querySelector('#root'))
