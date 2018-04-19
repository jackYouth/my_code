import React        from 'react'
import { render }   from 'react-dom'
import Routes       from './routes'

// 定义根组件
const Root  = () => (
  <Routes />
)
render(<Root />, document.querySelector('#root'))
