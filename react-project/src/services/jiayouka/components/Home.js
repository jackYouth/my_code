import React from 'react'
import { UserCenter } from '@boluome/oto_saas_web_app_component'
import NavBar from '../containers/NavBar'
// import vconsole from 'vconsole'
import './css/index.scss'

const Home = () => (
  <div style={{ width: '100%' }}>
    <NavBar />
    <UserCenter categoryCode='jiayouka' />
  </div>
)

export default Home
