//加载服务样式
import './style/index.scss'
//加载全局公共样式
import '../../styles/index.scss'

import React      from 'react'
import { render } from 'react-dom'
import { setServerUrl } from '@boluome/common-lib'
import Root       from './root'

setServerUrl(/192.168.|localhost/.test(location.hostname)
                ? 'https://dev-api.otosaas.com'
                : `${location.origin}/api`)

render(<Root />, document.querySelector('#root'))
