import React      from 'react'
import { render } from 'react-dom'
import { setServerUrl } from '@boluome/common-lib'
import Root       from './root'

import '../../styles/index.scss'

setServerUrl(/192.168.|localhost/.test(location.hostname)
                ? 'https://dev-api.otosaas.com'
                : `${ location.origin }/api`)

render(<Root />, document.querySelector('#root'))
