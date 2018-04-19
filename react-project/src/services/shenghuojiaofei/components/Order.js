//  引入react， antd中对应组件， 其它默认组件
import React from 'react'
import { List } from 'antd-mobile'
import { NewPromotion } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'

import ToOrder from './ToOrder.js'
import ServerHeader from './ServerHeader'
import '../styles/order.scss'

const customerUserId = sessionStorage.customerUserId
const userPhone = getStore('userPhone', 'session')

const Order = ({
  currentServer, currentOrg, orderInfo, queryInfo,
  handlePromotionChange,
  curDiscountData = { discount: 0, coupon: '', activity: '' },
  handleOrder,
}) => {
  const billPrice = orderInfo.price
  const { date, billId, barcode } = orderInfo
  const { orgName, typeName, orgId, type, backResv1 } = currentOrg
  const { billNo, billPwd } = queryInfo
  const orderInfoTop = [
    { left: '缴费单位', right: orgName },
    { left: typeName, right: billNo },
    { left: '账单金额', right: `¥${ billPrice }` },
  ]
  const orderParas = {
    userId:       customerUserId,
    date:         date.replace(/[^0-9]/ig, ''),
    couponId:     curDiscountData.coupon ? curDiscountData.coupon.id : '',
    activityId:   curDiscountData.activities ? curDiscountData.activities.id : '',
    channel:      'chinaums',
    writeOffType: '01',
    price:        billPrice,
    type,
    billNo,
    orgId,
    userPhone,
    billPwd,
    backResv1,
    billId,
    barcode,
    orgName,
  }

  const Item = List.Item
  if (curDiscountData && !curDiscountData.discount) curDiscountData.discount = 0
  const resultPrice = (billPrice - curDiscountData.discount).toFixed(2)
  return (
    <div className='my-order-container'>
      <div className='my-order-middle'>
        <div className='my-order'>
          <ServerHeader currentServer={ currentServer } />
          <Item className='bill-price' extra={ `¥ ${ Number(billPrice).toFixed(2) }` }>缴费金额</Item>
          <ul className='order-info-list'>
            {
              orderInfoTop.map(o => (
                <li key={ o.left }>
                  <span>{ o.left }</span>
                  <span>{ o.right }</span>
                </li>
              ))
            }
          </ul>
          <NewPromotion handleChange={ handlePromotionChange } orderType='shenghuojiaofei' channel='chinaums' amount={ parseFloat(billPrice) } count={ 1 } />
        </div>
      </div>
      <ToOrder { ...{ resultPrice, discountPrice: curDiscountData.discount, isSubmit: true, handleToOrder: () => handleOrder(orderParas) } } />
    </div>
  )
}

export default Order
