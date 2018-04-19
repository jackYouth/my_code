import React from 'react'
import { Empty, Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { Picker, List } from 'antd-mobile'

import ExpressInfo from '../common-component/express-info'

import '../../styles/user-center/order-list.scss'

const OrderList = ({
  handleTabClick, filters, currentFilter, orderList,
  handleDelOrder, handlePayOrder,
  handleCancelOrder, cancelReason, currentReason,
  handleConfirmOrder, handleEvaluateOrder,
  handleOrderClick,
}) => {
  if (!filters || !orderList) return <div />
  if (!currentReason) currentReason = cancelReason[0].value
  return (
    <div className='order-list-container'>
      <ul className='fitlers'>
        {
          filters.map(o => (
            <li className={ currentFilter === o.id ? 'active' : '' } onClick={ () => handleTabClick(o.id) } key={ o.id }>{ o.title }</li>
          ))
        }
      </ul>
      {
        orderList.length === 0 ?
          <Empty imgUrl={ require('../../img/no_order.png') } title='您还没有相关的订单' message='“可以看看有哪些想买的~”' /> :
          <ul className='order-list'>
            {
              orderList.map(oo => <OrderItem { ...{ currentFilter, handleDelOrder, handlePayOrder, cancelReason, handleCancelOrder, currentReason, handleConfirmOrder, handleEvaluateOrder, handleOrderClick } } data={ oo } key={ oo.id } />)
            }
          </ul>
      }
    </div>
  )
}

export default OrderList


const OrderItem = ({
  data, currentFilter, handleDelOrder, handlePayOrder,
  cancelReason, handleCancelOrder, currentReason,
  handleConfirmOrder, handleEvaluateOrder,
  handleOrderClick,
}) => {
  const { name, price, orderType, id, status, commodityStatus, displayStatus, express = {}, icon, commodityList, canAppraise, channel } = data
  const expressPrice = express.expressPrice ? express.expressPrice : 0
  let goodNum = 0
  console.log('commodityList', commodityList)
  return (
    <li className='order-item'>
      <div className='order-item-title' onClick={ () => handleOrderClick(orderType, id) }>
        <p><img src={ icon } alt='business_img' /></p>
        <p>{ name }</p>
        <p>{ displayStatus }</p>
      </div>
      {
        commodityList &&
        commodityList.map(o => {
          const { commodityName, specificationName, specificationId, unitPrice, originalPrice, purchaseQuantity, specificationStatus } = o
          goodNum += purchaseQuantity
          return (
            <div key={ `${ specificationId }${ commodityName }` } className='order-item-info' onClick={ () => handleOrderClick(orderType, id) }>
              <p><img src={ o.icon } alt='business_img' /></p>
              <p>
                <span>{ commodityName }</span>
                {
                  specificationName &&
                  <span>{ `已选择 ${ specificationName }` }</span>
                }
              </p>
              <p>
                <span>{ `￥${ unitPrice }` }</span>
                {
                  originalPrice !== unitPrice &&
                  <del>{ `￥${ originalPrice }` }</del>
                }
                <span>{ `X${ purchaseQuantity }` }</span>
                {
                  specificationStatus &&
                  <span>{ specificationStatus }</span>
                }
              </p>
            </div>
          )
        })
      }
      <p className='order-item-num'>
        <span>{ `共${ goodNum }件商品  合计：¥` }</span>
        <span>{ price }</span>
        <span>{ `（含运费 ¥ ${ expressPrice }）` }</span>
      </p>
      {
        status === 2 &&
        <div className='order-item-edit'>
          <Picker
            data={ cancelReason }
            title='取消原因'
            value={ currentReason }
            cols={ 1 }
            onOk={ v => handleCancelOrder(v, orderType, id, currentFilter, channel) }
          >
            <List.Item className='cancel-order-picker'>取消订单</List.Item>
          </Picker>
          <p className='high-light' onClick={ () => handlePayOrder(data) }>立即支付</p>
        </div>
      }
      {
        status === 9 && commodityStatus === 1 &&
        <div className='order-item-edit'>
          <p onClick={ () => Mask(<SlidePage showClose={ '' } target='express-slide'><ExpressInfo orderId={ id } /></SlidePage>) } >查看物流</p>
          <p onClick={ () => handleConfirmOrder(orderType, id, currentFilter) }>确认收货</p>
        </div>
      }
      {
        status === 4 && Boolean(canAppraise) &&
        <div className='order-item-edit'>
          <p onClick={ () => handleDelOrder(orderType, id, currentFilter) }>删除订单</p>
          <p onClick={ () => handleEvaluateOrder(orderType, id) }>评价</p>
        </div>
      }
      {
        (status === 8 || (status === 4 && !canAppraise)) &&
        <div className='order-item-edit'>
          <p onClick={ () => handleDelOrder(orderType, id, currentFilter) }>删除订单</p>
        </div>
      }
    </li>
  )
}
