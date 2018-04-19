
import React      from 'react'
import { render } from 'react-dom'
import Root       from './root'

// 加载全局公共样式
import '../../styles/index.scss'

// var FastClick = require('../../fastclick.js');
// FastClick.attach(document.body);

render(<Root />, document.querySelector('#root'))
