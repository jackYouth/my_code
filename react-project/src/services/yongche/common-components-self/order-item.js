import React from 'react'
import { Icon, Flex } from 'antd-mobile'

import '../styles/order-item.scss'

const OrderItem = ({
  date, start = '没有传入起点', end = '没有传入终点',
  index, invoiceInfoArr, handleinvoiceInfoClick, hasLeft = false,
}) => {
  const FlexItem = Flex.Item
  return (
    <div className='order-item'>
      <Flex className='order-item-header'>
        {
          hasLeft &&
          <h1 className='order-item-left'>
            <Icon onClick={ () => handleinvoiceInfoClick(index, invoiceInfoArr) } type={ invoiceInfoArr[index] ? require('svg/yongche/circle.svg') : require('svg/yongche/no-select.svg') } size='md' />
          </h1>
        }
        <FlexItem className='order-item-right'>
          {
            date &&
            <div className='order-item-top'>
              <Icon type={ require('svg/yongche/time.svg') } size='xxs' />
              <span>{ date }</span>
            </div>
          }
          <div className='order-item-middle'>
            <p />
            <span>{ start }</span>
          </div>
          <div className='order-item-bottom'>
            <p />
            <span>{ end }</span>
          </div>
        </FlexItem>
      </Flex>
    </div>
  )
}

export default OrderItem
