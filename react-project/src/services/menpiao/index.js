import React      from 'react'
import { render } from 'react-dom'
import { setServerUrl } from '@boluome/common-lib'
import { customerCode } from 'business'
import '../../styles/index.scss'
import './style/self_common.scss'
import Root       from './root'

(() => {
  // 是否是农行 并且 是否是安卓
  const isIOS = () => /iPhone|iPad|iPod|iOS/.test(navigator.userAgent)
  const Code = customerCode
  if (!isIOS() && (Code === 'abchina')) {
    require('./style/nonghang.scss')
  } else if (isIOS() && (Code === 'abchina')) {
    require('./style/Iosnonghang.scss')
  }
})()

setServerUrl(/192.168.|localhost/.test(location.hostname)
                ? 'https://dev-api.otosaas.com'
                : `${ location.origin }/api`)

render(<Root />, document.querySelector('#root'))
