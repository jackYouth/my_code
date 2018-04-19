import React from 'react'
import { Icon } from 'antd-mobile'

import './index.scss'

// title: 左侧标题，
export const ListItem = ({ title, onClick, style, className }) => {
  return (
    <div className={ className ? `${ className } s-list-item` : 's-list-item' } onClick={ onClick } style={ style }>
      <span className='s-list-item-title'>{ title }</span>
      <Icon className='s-list-item-right-icon' type='right' size='md' style={{ color: '#ccc' }} />
    </div>
  )
}
