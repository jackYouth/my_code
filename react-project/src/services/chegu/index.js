import React      from 'react'
import { render } from 'react-dom'
import Root       from './root'
import { setServerUrl } from '@boluome/common-lib'

setServerUrl(/192.168.|localhost/.test(location.hostname)
                ? 'https://dev-api.otosaas.com'
                : `${location.origin}/api`)

render(<Root />, document.querySelector('#root'))
