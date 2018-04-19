import React from 'react'
import { render } from 'react-dom'
// 加载服务样式
import './style/index.scss'
// 加载全局公共样式
import '../../styles/index.scss'
import Root from './root'

render(<Root />, document.querySelector('#root'))
