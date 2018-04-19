import React from 'react'
import { afterOrdering } from 'business'

import OrderDetailMall from './order-detail-mall'

// orderId, orderType, goPay, timelineShow

import '../../styles/user-center/order-detail.scss'

const OrderDetail = () => {
  const orderType = location.pathname.split('/')[3]
  const id = location.pathname.split('/')[4]
  return (
    <div className='order-detail'>
      <OrderDetailMall { ...{ orderType, id, goPay: () => afterOrdering({ id }), timelineShow: false } } />
    </div>
  )
}

export default OrderDetail
