import React from 'react'
import { UserCenter } from '@boluome/oto_saas_web_app_component'

import Huafei from '../../huafei/containers/Huafei.js'
import Liuliang from '../../liuliang/containers/Liuliang.js'

import '../styles/app.scss'


  // <NoticeBar style={{ background: '#fffad8' }} icon={<Icon type={ require('svg/chongzhi/notice.svg') } size="md" />} marqueeProps={{ style: { color: '#333333', marginLeft: '.19rem' } }}>
  //   服务商维护如遇无法充值，请稍后再试
  // </NoticeBar>

const App = ({ handleCZClick, currentCZ = 0, curPhone, prevPhone }) => {
  const activeStyle = {
    borderColor: '#ffab00',
    color:       '#ffab00',
  }
  // const
  return (
    <div>
      <UserCenter categoryCode='chongzhi' orderTypes='huafei,liuliang' />
      <ul className='title'>
        <li style={ currentCZ === 0 ? activeStyle : {} } onClick={ () => currentCZ === 1 && handleCZClick([0, curPhone]) }>话费</li>
        <li style={ currentCZ === 1 ? activeStyle : {} } onClick={ () => currentCZ === 0 && handleCZClick([1, curPhone]) }>流量</li>
      </ul>
      <div>
        {
          currentCZ === 0 && <Huafei prevPhone={ prevPhone } />
        }
        {
          currentCZ === 1 && <Liuliang prevPhone={ prevPhone } />
        }
      </div>
    </div>
  )
}

export default App
