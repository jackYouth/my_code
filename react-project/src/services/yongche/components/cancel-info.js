/*
  待支付、取消、异常的订单都会跳到该页面
*/


import React from 'react'
import { moment } from '@boluome/common-lib'
import { Icon } from 'antd-mobile'
import { afterOrdering } from 'business'

import OrderItem from '../common-components-self/order-item'
import '../styles/cancel-info.scss'

const CancelInfo = ({ handleToIndex, currentOrderInfo, isSinglePrice, handleCancelClick }) => {
  if (currentOrderInfo) {
    const { orderPrice, price, createdAt, channel, id, displayStatus, origin, destination, status, flightNo, flightDelayTime, contactPhone, userPhone, paidList, productType } = currentOrderInfo
    const start = origin.name
    const end = destination.name
    const time = moment('YYYY-MM-DD HH:mm')(createdAt)
    // 是不是待支付订单，因为引用该组件时，已经判断过是一口价了
    const isNoPay = status === 2

    // 支付处理中，需显示价格，所以将其改成paidList
    const isPaying = status === 12

    let { departureTime } = currentOrderInfo
    if (departureTime === 'instant') departureTime = time
    if (flightDelayTime) departureTime = `航班到达后${ flightDelayTime }分钟上车`
    return (
      <div className='cancel-info'>
        <div className='cancel-info-header'>
          <div className='order-number'>
            <div className='left'>
              <p>
                <span className='left'>订单编号</span>
                <span className='left'>{ id }</span>
              </p>
              {
                isNoPay &&
                <p>订单将于15分钟后自动取消</p>
              }
            </div>
            { isSinglePrice && <span className={ isNoPay ? 'right active' : 'right' }>{ displayStatus }</span> }
          </div>
          {
            isNoPay && flightNo &&
            <div className='common-item'>
              <Icon type={ require('svg/yongche/plane.svg') } size='xxs' />
              <span>航班号</span>
              <span>{ flightNo }</span>
            </div>
          }
          <OrderItem { ...{ start, end } } />
          {
            isNoPay &&
            <div className='common-item'>
              <Icon type={ require('svg/yongche/time.svg') } size='xxs' />
              <span>出发时间</span>
              <span>{ departureTime }</span>
            </div>
          }
          {
            isNoPay &&
            <div className='common-item'>
              <Icon type={ require('svg/yongche/passenger.svg') } size='xxs' />
              <span>乘车人</span>
              <span>{ contactPhone === userPhone ? '换乘车人' : contactPhone }</span>
            </div>
          }
          <div className='cancel-info-bottom'>
            <div className='top'>
              <p className='price'>{ isNoPay ? '车费：' : '已支付：' }<span>{`￥${ (!isNoPay && !paidList && !isPaying) ? '0' : price }`}</span></p>
              <p className='time'>{ time }</p>
              {
                Boolean(orderPrice - price) && price !== 0 &&
                <p className='discount'>{ `已优惠：¥${ (orderPrice - price).toFixed(2) }` }</p>
              }
            </div>
            {
              !isNoPay && !isPaying &&
              <Icon type={ require('svg/yongche/exclamation.svg') } size='lg' />
            }
            {
              isPaying &&
              <Icon type={ require('svg/yongche/paying.svg') } size='lg' />
            }
            {
              !isNoPay &&
              <p className='order-status'>
                {
                  isPaying ? '支付处理中' : '订单已取消'
                }
              </p>
            }
          </div>
        </div>
        <div className='cancel-info-footer'>
          {
            isNoPay &&
            <p className='footer-item left' onClick={ () => handleCancelClick(1, channel) }>取消订单</p>
          }
          {
            !isNoPay &&
            <a className='footer-item left' href='tel:4000000999'>联系客服</a>
          }
          <p className='footer-item right' onClick={ isNoPay ? () => afterOrdering(currentOrderInfo) : () => handleToIndex(channel, productType) }>{ isNoPay ? '立即支付' : '返回首页'}</p>
        </div>
      </div>
    )
  }
  return (<div />)
}

export default CancelInfo
