import React from 'react'
import { afterOrdering, login } from 'business'
import { List, WhiteSpace } from 'antd-mobile'
import { moment, setStore } from '@boluome/common-lib'
import { OrderDetail, OrderPreferential } from '@boluome/oto_saas_web_app_component'

import '../style/orderDetails.scss'
import logo from '../img/logocoffees.png'

const Item = List.Item
const orderDetails = props => {
  console.log('od---', props)
  const { params, goBackIndex } = props
  const orderId = params ? params.id : ''
  return (
    <div className='orderDetailsWrap'>
      <OrderDetail
        content={ <OrderComponent goBackIndex={ goBackIndex } /> }
        login={ login }
        id={ orderId }
        orderType='coffee'
        goPay={ () => afterOrdering({ id: orderId }) }
      />
    </div>
  )
}

export default orderDetails

// 订单详情页面的主要内容
const OrderComponent = ({ goBackIndex, orderDetailInfo }) => {
  console.log('test---', orderDetailInfo)
  const { merchant, deliverFee, orderItem, contactor, createdAt, id, contact, type,
    comment, platformActivity = {}, coupon = {}, realPayPrice = 0, orderPrice = 0, deliverTime, tipFee,
  } = orderDetailInfo
  if (contact) {
    setStore('coffee_contact', contact, 'session')
  }
  const { price, title } = platformActivity
  const proCouponObj = {
    topTitle:              '小计',
    platformActivityPrice: price,
    couponPrice:           coupon.price,
    realPayPrice:          realPayPrice.toFixed(2),
    sumPrice:              orderPrice.toFixed(2),
    atitle:                title,
    ctitle:                coupon.title,
    realPayTitle:          '实付金额',
  }
  return (
    <div className='menpiaoOrderDetails'>
      <WhiteSpace size='lg' />
      {
        merchant ? (<Detailsinfo goBackIndex={ goBackIndex } merchant={ merchant } deliverFee={ deliverFee } orderItem={ orderItem } tipFee={ tipFee } />) : ('')
      }
      <WhiteSpace size='lg' />
      {
        realPayPrice && orderPrice ? (<OrderPreferential propsObj={ proCouponObj } />) : ''
      }
      <OrderTimeCom id={ id } createdAt={ createdAt } />
      <WhiteSpace size='lg' />
      {
        contactor ? (<div><PersonalInfo contactor={ contactor } comment={ comment } deliverTime={ deliverTime } type={ type } /><WhiteSpace size='lg' /></div>) : ('')
      }
    </div>
  )
}

// 详情展示部分
const Detailsinfo = ({ goBackIndex, merchant, deliverFee = 0, orderItem, tipFee = 0 }) => {
  const { name } = merchant
  return (
    <div className='orderDetailsinfo'>
      <List>
        <Item arrow='horizontal' onClick={ () => { goBackIndex() } }><span><img src={ logo } alt='' /></span> { name }</Item>
        <div className='infowrap'>
          {
            orderItem && orderItem.map(o => (
              <div className='infoitem' key={ `${ o.productId + o.attribute }` }><div className='infoname'>{ o.productName }</div><div className='infoto'><span>x{ o.count }</span><span>¥ { o.price.toFixed(2) }</span></div></div>
            ))
          }
        </div>
        <Item extra={ `¥ ${ deliverFee.toFixed(2) }` }>配送费</Item>
        {
          tipFee && tipFee !== 0 ? (<Item extra={ `¥ ${ tipFee.toFixed(2) }` }>小费</Item>) : ('')
        }
      </List>
    </div>
  )
}

// 信息展示
const PersonalInfo = ({ contactor, comment, deliverTime, type }) => {
  const { name, phone, address } = contactor
  let sxetype = '女士'
  if (type === 0) {
    sxetype = '男士'
  }
  return (
    <div className='PersonalInfoWrap'>
      <List>
        <Item extra={ '在线支付' }>支付方式</Item>
        {
          comment ? (<Item extra={ comment }>订单备注</Item>) : (<Item extra={ '无' }>订单备注</Item>)
        }
        <Item className='deliverTime' extra={ `${ deliverTime }` }>送达时间</Item>
        <Item>
          <div className='orderContact'>收货地址</div>
          <div className='cantactMain'>
            <div className='oto'><span>{ name }</span><span>{ sxetype }</span></div>
            <div className='oto'>{ phone }</div>
            <div className='oto'>{ `${ address } ` }</div>
          </div>
        </Item>
      </List>
    </div>
  )
}

// 订单编号和下单时间
const OrderTimeCom = ({ id, createdAt, partnerId }) => {
  return (
    <List className='OrderTimeCom'>
      <Item extra={ id }>订单编号</Item>
      {
        partnerId ? (<Item extra={ partnerId }>供应商订单号</Item>) : ('')
      }
      <Item extra={ `${ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }` }>下单时间</Item>
    </List>
  )
}
