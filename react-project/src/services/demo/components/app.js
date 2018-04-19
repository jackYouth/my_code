import React from 'react'
import { Link } from 'react-router'
import { UserCenter } from '@boluome/oto_saas_web_app_component'
import customize from 'customize'

const App = ({ children, title = '' }) => (
  <div>
    <h2>{ title }</h2>
    <div>
      <Link to='/demo' >首页123</Link>
      <Link to='/demo/page1' >异步测试</Link>
      <Link to='/demo/page2' >各种测试</Link>
    </div>

    <div>
      { children }
    </div>
    <UserCenter categoryCode='dianying' />
  </div>
)

export default customize(App)
