import React from 'react'
import { OrderDetail } from '@boluome/oto_saas_web_app_component'
import { afterOrdering } from 'business'
import { moment } from '@boluome/common-lib'
import jian from './img/jian.png'
import hui from './img/hui.png'


const orderDetails = props => {
  // console.log('orderDetails props~~~', props)
  const { orderId = '' } = props
  return (
    <div className='orderDetails-container'>
      <OrderDetail
        content={ <Content /> }
        id={ orderId }
        orderType='jiayouka'
        goPay={ () => afterOrdering({ id: orderId, saasUrl: window.location.href, orderType: 'jiayouka' }) }
      />
    </div>
  )
}

export default orderDetails

const CommonItemStyle = {
  borderBottom: '.01rem solid #e5e5e5',
  fontSize:     '.28rem',
  color:        '#333',
  height:       '.8rem',
  lineHeight:   '.8rem',
  padding:      '0 .3rem',
}

const CommonBoxStyle = {
  backgroundColor: '#fff',
}

const MarginTop2Box = {
  marginTop: '.2rem',
  ...CommonBoxStyle,
}

const Content = ({ orderDetailInfo }) => {
  // console.log('orderDetailInfo', orderDetailInfo)
  const { createdAt, platformActivity = [], coupon = [], id, cardId = '', isp = '', orderTypeName = '加油卡', facePrice = '', price = '' } = orderDetailInfo
  return (
    <div className='orderDetails-container'>
      <div className='food-container' style={ MarginTop2Box }>
        <div style={ CommonItemStyle }>
          <span>充值号码</span>
          <span style={{ float: 'right', color: '#333' }}>{ `${ cardId } ${ isp }` }</span>
        </div>
        <div style={ CommonItemStyle }>
          <span>{ `${ orderTypeName } 面值${ facePrice }元` }</span>
          <span style={{ float: 'right', color: '#333' }}>{ `¥ ${ facePrice }` }</span>
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
          <span style={{ float: 'right', color: '#333' }}>{ `实付 ¥ ${ price.toFixed(2) }` }</span>
        </div>
      </div>
      <div className='order-container' style={ MarginTop2Box }>
        <div style={ CommonItemStyle }>
          <span>订单编号</span>
          <span style={{ float: 'right' }}>{ id }</span>
        </div>
        <div style={ CommonItemStyle }>
          <span>下单时间</span>
          <span style={{ float: 'right' }}>{ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }</span>
        </div>
      </div>
    </div>
  )
}
