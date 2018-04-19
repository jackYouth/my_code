// 加载服务样式

import React      from 'react'
import { render } from 'react-dom'
import Root       from './root'

import '../../styles/index.scss'

render(<Root />, document.querySelector('#root'))
