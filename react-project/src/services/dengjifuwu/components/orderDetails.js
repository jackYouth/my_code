import React from 'react'
import { OrderDetail, Loading } from '@boluome/oto_saas_web_app_component'
import { afterOrdering } from 'business'
import { moment } from '@boluome/common-lib'
// import vconsole from 'vconsole'
import '../style/orderDetails.scss'
import '../style/order.scss'
import jian from '../image/jian.png'
import hui from '../image/hui.png'

const OrderDetails = props => {
  // console.log('OrderDetails props', props)
  const { getOrderInfo, orderId = '' } = props
  return (
    <div className='orderDetails-container'>
      <OrderDetail
        content={ <Content /> }
        id={ orderId }
        orderType='dengjifuwu'
        goPay={ () => {
          const closeLoading = Loading()
          afterOrdering({ id: orderId })
          closeLoading()
        } }
        handleOrderInfo={ i => getOrderInfo(i) }
      />
    </div>
  )
}

export default OrderDetails

const CommonItemStyle = {
  borderBottom: '.01rem solid #e5e5e5',
  fontSize:     '.28rem',
  color:        '#333',
  height:       '.8rem',
  lineHeight:   '.8rem',
}

const CommonBoxStyle = {
  backgroundColor: '#fff',
  padding:         '0 30px',
}

// const MarginTop2Box = {
//   marginTop: '.2rem',
//   ...CommonBoxStyle,
// }

const Content = ({ orderDetailInfo }) => {
  // console.log('orderDetailInfo', orderDetailInfo)
  const { id = '', createdAt, name, price = 0, quantity = 1, remainingCount, coupon = {}, platformActivity = {} } = orderDetailInfo
  return (
    <div className='orderDetails-content-container'>
      <div className='order-info-container'>
        <div className='main-info-box'>
          <span>{ name }</span>
          <span>{ `¥ ${ price * quantity }` }</span>
        </div>
        <div className='inTimes'>
          <span>有效时间</span>
          <span>三个月</span>
        </div>
        <div className='times'>
          <span>使用次数</span>
          <span>{ remainingCount }</span>
        </div>
      </div>
      <div className='price-info-container' style={ CommonBoxStyle }>
        <div style={ CommonItemStyle }>
          <span>订单编号</span>
          <span style={{ float: 'right', marginLeft: '.37rem' }}>{ id }</span>
        </div>
        <div style={ CommonItemStyle }>
          <span>订单总额</span>
          <span style={{ float: 'right', marginLeft: '.37rem' }}>{ `¥${ price }` }</span>
        </div>
        <div style={ CommonItemStyle }>
          <img src={ hui } alt='红' style={{ width: '.32rem', height: '.32rem', verticalAlign: 'middle', marginRight: '.15rem' }} />
          <span>{ !coupon.title ? '红包优惠' : coupon.title }</span>
          <span style={{ float: 'right', color: '#ff4848' }}>{ `- ¥${ !coupon.price ? 0 : coupon.price }` }</span>
        </div>
        <div style={ CommonItemStyle }>
          <img src={ jian } alt='红' style={{ width: '.32rem', height: '.32rem', verticalAlign: 'middle', marginRight: '.15rem' }} />
          <span>{ !platformActivity.title ? '平台活动' : platformActivity.title }</span>
          <span style={{ float: 'right', color: '#ff4848' }}>{ `- ¥${ !platformActivity.price ? 0 : platformActivity.price }` }</span>
        </div>
        <div style={ CommonItemStyle }>
          <div style={{ float: 'right', marginLeft: '.37rem' }}>
            <span>实付金额： </span>
            <span style={{ color: '#ff4848' }}>{ ` ¥${ price }` }</span>
          </div>
        </div>
        <div style={ CommonItemStyle }>
          <div style={{ float: 'right', marginLeft: '.37rem' }}>
            <span>下单时间：</span>
            <span style={{ float: 'right' }}>{ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }</span>
          </div>
        </div>
      </div>
    </div>
  )
}
