import React from 'react'
import { afterOrdering } from 'business'
import { List, WhiteSpace } from 'antd-mobile'
import { moment } from '@boluome/common-lib'
import { OrderDetail, OrderPreferential } from '@boluome/oto_saas_web_app_component'

// import '../style/orderDetails.scss'
import logo from '../images/logo.png'
import tel from '../images/tel.png'

const { customer = {} } = window.OTO_SAAS
const { bridge = {}, isSpecialPhoneCall = false } = customer
const { specialPhoneCall } = bridge
const Item = List.Item
const orderDetails = props => {
  const { params, goBackIndex } = props
  console.log('od---', props, params)
  const orderId = params ? params.id : ''
  return (
    <div className='orderDetailsWrap'>
      <OrderDetail
        content={ <OrderComponent goBackIndex={ goBackIndex } /> }
        id={ orderId }
        orderType='baoyang'
        goPay={ () => afterOrdering({ id: orderId }) }
      />
    </div>
  )
}

export default orderDetails

// 订单详情页面的主要内容
const OrderComponent = ({ goBackIndex, orderDetailInfo }) => {
  console.log('test---', orderDetailInfo)
  const { shop, servers = {}, createdAt, id, platformActivity = {}, coupon = {},
    realPrice = 0, orderPrice = 0, consumerCode, expiredTime, services,
  } = orderDetailInfo
  const { price, title } = platformActivity
  const { phone = '' } = services ? services[0] : {}
  const creatComponentLFn = (
    isSpecialPhoneCall ? (
      <div onClick={ () => {
        if (isSpecialPhoneCall && specialPhoneCall && typeof specialPhoneCall === 'function') {
          specialPhoneCall(phone)
        } else {
          console.log('定制电话方法', isSpecialPhoneCall, specialPhoneCall)
        }
      } }
      >
        <img src={ tel } alt='' /><span style={{ marginLeft: '15px' }}>联系商家</span>
      </div>
    ) : (<div><a href={ `tel:${ phone }` } style={{ color: 'ffab00' }}><img src={ tel } alt='' /><span style={{ marginLeft: '15px' }}>联系商家</span></a></div>)
  )
  const proCouponObj = {
    topTitle:              servers.serviceName,
    platformActivityPrice: price,
    couponPrice:           coupon.price,
    realPayPrice:          realPrice.toFixed(2),
    sumPrice:              orderPrice.toFixed(2),
    atitle:                title,
    ctitle:                coupon.title,
    creatComponentL:       creatComponentLFn,
    realPayTitle:          '实付金额',
  }
  return (
    <div className='menpiaoOrderDetails'>
      <WhiteSpace size='lg' />
      {
        shop && servers ? (<Detailsinfo goBackIndex={ goBackIndex } shop={ shop } servers={ servers } proCouponObj={ proCouponObj } />) : ('')
      }
      {
        consumerCode && expiredTime ? (<OrderCode expiredTime={ expiredTime } consumerCode={ consumerCode } />) : ''
      }
      <WhiteSpace size='lg' />
      <OrderTimeCom id={ id } createdAt={ createdAt } />
      <WhiteSpace />
    </div>
  )
}

// 详情展示部分
const Detailsinfo = ({ goBackIndex, shop, proCouponObj }) => {
  const { shopName } = shop
  return (
    <div className='orderDetailsinfo'>
      <List>
        <Item arrow='horizontal' onClick={ () => { goBackIndex(shop) } }><span><img src={ logo } alt='' /></span> { shopName }</Item>
      </List>
      <OrderPreferential propsObj={ proCouponObj } />
    </div>
  )
}
// <Item extra={ <span>¥ { price }</span> }>{ serviceName }<span style={{ marginLeft: '70%' }}>x1</span></Item>
// 订单编号和下单时间
const OrderCode = ({ consumerCode, expiredTime }) => {
  return (
    <List>
      <Item extra={ <span style={{ color: '#999', fontSize: '28px' }}>{ consumerCode }</span> }>兑换码</Item>
      <Item extra={ `${ expiredTime }` }>有效时间</Item>
    </List>
  )
}

// 订单编号和下单时间
const OrderTimeCom = ({ id, createdAt }) => {
  const itemcom = {
    padding:      '26px 32px',
    borderBottom: '1px solid #f5f5f6',
    background:   '#fff',
    color:        '#333',
  }
  const rItem = {
    float: 'right',
  }
  return (
    <div className='OrderTimeCom'>
      <div style={ itemcom }><span>订单编号</span><span style={ rItem }>{ id }</span></div>
      <div style={ itemcom }><span>下单时间</span><span style={ rItem }>{ `${ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }` }</span></div>
    </div>
  )
}
