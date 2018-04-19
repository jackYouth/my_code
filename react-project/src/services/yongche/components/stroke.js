import React from 'react'
import { List } from 'antd-mobile'
import { Empty } from '@boluome/oto_saas_web_app_component'

import OrderItem from '../common-components-self/order-item'
import '../styles/stroke.scss'

const Stroke = ({ orderList, handleOrderClick, channel }) => {
  if (orderList) {
    if (orderList.length <= 0) {
      return (
        <Empty imgUrl={ require('../img/noStroke.png') } message='目前您还没有订单哦～' />
      )
    }
    return (
      <div className='stroke'>
        {
          orderList.map(item => {
            const { id, date, price, status, start, end } = item
            let { displayStatus } = item
            if (displayStatus === '无司机应答') displayStatus = '已取消'
            return (
              <div className='stroke-item' key={ id } onClick={ () => handleOrderClick(id) }>
                <List.Item className={ status === 2 ? 'stroke-header active' : 'stroke-header' } extra={ displayStatus } arrow='horizontal'>
                  <img src={ channel === 'didi' ? require('../img/didi.png') : require('../img/shenzhou.png') } alt={ channel } />
                </List.Item>
                <OrderItem { ...{ date, start, end } } />
                <p className='price'>{ status === 8 ? '预估' : '付款' }金额：<span>{ `￥${ price }` }</span></p>
              </div>
            )
          })
        }
      </div>
    )
  }
  return (
    <div />
  )
}

export default Stroke
