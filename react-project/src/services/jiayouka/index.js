// 加载服务样式
// import './style/index.scss'
// 加载全局公共样式
import React      from 'react'
import { render } from 'react-dom'
import { setServerUrl } from '@boluome/common-lib'
import Root       from './root'
import '../../styles/index.scss'

setServerUrl(/192.168.|localhost/.test(location.hostname)
                ? 'https://dev-api.otosaas.com'
                : `${ location.origin }/api`)

// setStore('customerUserId','test_long','session')
// setStore('userPhone','13222222222','session')

render(<Root />, document.querySelector('#root'))
