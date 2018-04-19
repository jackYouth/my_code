import React      from 'react'
import { render } from 'react-dom'
// import initReactFastclick from 'react-fastclick'
// import FastClick from '../../fastclick.js'
import Root       from './root'
import '../../styles/index.scss'

// initReactFastclick()
// const FastClick = require('../../fastclick.js')
// FastClick.attach(document.body)

render(<Root />, document.querySelector('#root'))
