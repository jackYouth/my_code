import React from 'react'
import { Icon, List } from 'antd-mobile'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
// import { vconsole } from 'vconsole' // <vconsole />
import TextareaCom from './textarea.js'
import CarouselCom from './Carousel.js'
import UserTips from './usertips.js'

import '../style/index.scss'
import my from '../img/my.svg'
import logo from '../img/logo.png'

const Item = List.Item
const App = props => {
  const { quickItem, goOrder, textareaStr, files = [],
    handleGoOrderList, changeText, CUSTOMER, // GoOrderDetails,
  } = props
  // console.log('appc---', props)
  const handleUserTip = () => {
    Mask(
      <SlidePage target='right' type='root' >
        <UserTips />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  //  onClick={ () => GoOrderDetails() }
  if (quickItem) {
    return (
      <div className='paotuiWrap'>
        <div className='header'>
          <div />
          <div className='title'>
            <img src={ logo } alt='' />
            <span>邻趣</span>
          </div>
          {
            CUSTOMER ? (
              <div className='title_icon' onClick={ () => handleGoOrderList() }><Icon type={ my } /></div>) :
              (<div className='title_icon' />)
          }
        </div>
        <TextareaCom textareaStr={ textareaStr } files={ files } changeText={ changeText } />
        <Item className='tipsWrap' extra={ <span className='tips' onClick={ () => handleUserTip() }>使用说明</span> }>例如：阿莫西林1盒及打火机1个</Item>
        <CarouselCom quickItem={ quickItem } />
        <div className='nextBtn' onClick={ () => goOrder() }>下一步</div>
      </div>
    )
  }
  return (<div />)
}

export default App
