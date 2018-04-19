import React from 'react'
import { Flex, Icon } from 'antd-mobile'
// import vconsole from 'vconsole'

import '../styles/app.scss'

const menus = [
  { menuName: '首页', type: 'main', url: require('svg/shangcheng/main.svg'), selectedUrl: require('svg/shangcheng/main_a.svg') },
  // { menuName: '消息', type: 'message', url: require('svg/shangcheng/message.svg'), selectedUrl: require('svg/shangcheng/message_a.svg') },
  { menuName: '购物车', type: 'cart', url: require('svg/shangcheng/cart.svg'), selectedUrl: require('svg/shangcheng/cart_a.svg') },
  { menuName: '我的', type: 'userCenter', url: require('svg/shangcheng/userCenter.svg'), selectedUrl: require('svg/shangcheng/userCenter_a.svg') },
]

const App = ({ children, currentMenu, handleChangeMenu, cartCommoditys, showMenus = false, totalUnreadNum }) => {
  let totalNum = 0
  if (cartCommoditys && cartCommoditys.totalNum) totalNum = cartCommoditys.totalNum
  if (totalNum > 99) totalNum = '99+'
  if (totalUnreadNum > 99) totalUnreadNum = '99+'
  return (
    <div className='app-container'>
      <div className='app'>{ children }</div>
      <Flex style={ showMenus ? {} : { display: 'none' } } className='menus' onTouchMove={ e => e.preventDefault() }>
        {
          menus.map((o, i) => (
            <Flex.Item className={ currentMenu === o.type ? 'active' : '' } key={ o.menuName } onClick={ () => handleChangeMenu(o.type) }>
              <Icon type={ currentMenu === o.type ? o.selectedUrl : o.url } size='md' />
              <span>{ o.menuName }</span>
              {
                i === 4 && Boolean(totalUnreadNum) &&
                <span className='sc-badge-icon'>{ totalUnreadNum }</span>
              }
              {
                i === 1 && Boolean(totalNum) &&
                <span className='sc-badge-icon'>{ totalNum }</span>
              }
            </Flex.Item>
          ))
        }
      </Flex>
    </div>
  )
}

export default App
