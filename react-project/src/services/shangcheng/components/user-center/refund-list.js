import React from 'react'
import { Empty } from '@boluome/oto_saas_web_app_component'
import { Icon } from 'antd-mobile'

import '../../styles/user-center/refund-list.scss'

const RefundList = ({ refundList, handleLookRefundOrder }) => {
  if (!refundList) return <div />
  return (
    <div className='refund-list-container'>
      {
        refundList.length === 0 ?
          <Empty imgUrl={ require('../../img/no_order.png') } title='' message='目前没有退款订单~”' /> :
          <ul className='refund-list'>
            {
              refundList.map(o => <RefundItem handleLookRefundOrder={ handleLookRefundOrder } data={ o } key={ o.id } />)
            }
          </ul>
      }
    </div>
  )
}

export default RefundList


const RefundItem = ({ data, handleLookRefundOrder }) => {
  const { shopLogo, shopName, displayStatus, specification = {}, amount, refundType, id, orderType } = data
  const { icon, commodityName, specificationName, purchaseQuantity } = specification
  return (
    <li className='refund-item'>
      <div className='refund-item-title'>
        <p><img src={ shopLogo } alt='business_img' /></p>
        <p>{ shopName }</p>
      </div>
      <div className='refund-item-info'>
        <p className='commodity-img'><img src={ icon } alt='business_img' /></p>
        <div className='refund-item-info-right'>
          <div className='refund-item-info-right-top'>
            <p>
              <span>{ commodityName }</span>
              {
                specificationName &&
                <span>{ `已选择 ${ specificationName }` }</span>
              }
            </p>
            <p>
              <span>{ `X${ purchaseQuantity }` }</span>
            </p>
          </div>
          <div className='refund-item-info-right-bottom'>
            { `退款金额：￥${ amount }` }
          </div>
        </div>
      </div>
      <p className='refund-status'>
        <Icon type={ require('svg/shangcheng/refund_icon.svg') } size='xs' />
        <span>{ refundType === 1 ? '仅退款' : '退货退款' }</span>
        <span>{ displayStatus }</span>
      </p>
      <div className='refund-item-edit'>
        <p onClick={ () => handleLookRefundOrder(orderType, id) }>查看详情</p>
      </div>
    </li>
  )
}
