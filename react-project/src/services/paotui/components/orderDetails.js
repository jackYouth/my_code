import React from 'react'
import { afterOrdering, login } from 'business'
import { List, WhiteSpace } from 'antd-mobile'
import { moment } from '@boluome/common-lib'
import { OrderDetail, OrderPreferential } from '@boluome/oto_saas_web_app_component'

import CancelOrder from './cannotorder'
import '../style/orderDetails.scss'
import tou from '../img/tou.jpg'
import phoneIcon from '../img/tel.png'


const { customer = {} } = window.OTO_SAAS
const { bridge = {}, isSpecialPhoneCall = false } = customer
const { specialPhoneCall } = bridge

const Item = List.Item
const Brief = Item.Brief
const orderDetails = props => {
  console.log('od---', props)
  const { params } = props
  console.log(params)
  const orderId = params ? params.id : ''
  // const handleCannotCode = (orderDetailInfo, propsFn) => {
  //   Mask(<CancelOrder { ...orderDetailInfo } propsFn={ propsFn } />, { mask: true, style: { position: 'absolute' } })
  // }
  return (
    <div className='orderDetailsWrap'>
      <OrderDetail
        content={ <OrderComponent /> }
        login={ login }
        id={ orderId }
        orderType='paotui'
        goPay={ () => afterOrdering({ id: orderId }) }
        CancelOrder={ <CancelOrder /> }
      />
    </div>
  )
}

export default orderDetails

// 订单详情页面的主要内容
const OrderComponent = ({ orderDetailInfo }) => {
  console.log('test---', orderDetailInfo)
  const { tipFee = 0, createdAt, id,
    platformActivity = {}, coupon = {}, realPayPrice = 0,
    receiverName, receiverPhone, receiverAddress, deliverTime, receiverSex, deliverFee = 0,
    senderAddress, name, deliveryManName, deliveryManMobile,
  } = orderDetailInfo
  const { price, title } = platformActivity
  const proCouponObj = {
    topTitle:              '小费',
    platformActivityPrice: price,
    couponPrice:           coupon.price,
    realPayPrice:          realPayPrice.toFixed(2),
    sumPrice:              tipFee.toFixed(2),
    atitle:                title,
    ctitle:                coupon.title,
  }

  return (
    <div className='paotuiOrderDetails'>
      {
        deliveryManName && deliveryManMobile ? (<Peopleinfo deliveryManName={ deliveryManName } deliveryManMobile={ deliveryManMobile } />) : ('')
      }
      <WhiteSpace size='lg' />
      <ShoppingShow senderAddress={ senderAddress } name={ name } />
      <List><Item extra={ `¥ ${ deliverFee.toFixed(2) }` }>配送费</Item></List>
      {
        realPayPrice ? (<OrderPreferential propsObj={ proCouponObj } />) : ''
      }
      <PersonalInfo receiverName={ receiverName } receiverPhone={ receiverPhone } receiverAddress={ receiverAddress } deliverTime={ deliverTime } receiverSex={ receiverSex } />
      <WhiteSpace size='lg' />
      <OrderTimeCom id={ id } createdAt={ createdAt } />
    </div>
  )
}

// 配送员信息展示部分
// <Item extra={ <div className='peopleIcon'><span><img src={ phoneIcon } alt='' /></span><span>联系小哥</span></div> } align='middle' thumb={ <img className='imgIcon' src={ tou } alt='' /> } multipleLine>
//   配送员 <Brief>{ `${ deliveryManName }` }</Brief>
// </Item>
const Peopleinfo = ({ deliveryManName = 'XXX', deliveryManMobile }) => {
  return (
    <div className='orderDetailsPeople'>
      <List>
        <Item extra={
          isSpecialPhoneCall ?
            <div className='peopleIcon' style={{ height: '100%', verticalAlign: 'middle', float: 'right', lineHeight: '.8rem' }} onClick={ () => {
              if (isSpecialPhoneCall && specialPhoneCall && typeof specialPhoneCall === 'function') {
                specialPhoneCall(deliveryManMobile)
              } else {
                console.log('定制电话方法', isSpecialPhoneCall, specialPhoneCall)
              }
            } }
            >
              <img src={ phoneIcon } style={{ width: '.5rem', verticalAlign: 'middle', marginRight: '.2rem' }} alt='' />
              <span style={{ verticalAlign: 'middle', color: '#ffab00' }}>联系小哥</span>
            </div>
          :
            <div className='peopleIcon'>
              <a href={ `tel:${ deliveryManMobile }` } style={{ verticalAlign: 'middle', float: 'right', lineHeight: '.8rem' }}>
                <img src={ phoneIcon } style={{ width: '.5rem', verticalAlign: 'middle', marginRight: '.2rem' }} alt='' />
                <span style={{ verticalAlign: 'middle', color: '#ffab00' }}>联系小哥</span>
              </a>
            </div>
        } align='middle'
          thumb={ <img className='imgIcon' src={ tou } alt='' /> }
          multipleLine
        >
          配送员 <Brief>{ `${ deliveryManName }` }</Brief>
        </Item>

      </List>
    </div>
  )
}

// 购买商品信息展示
const ShoppingShow = ({ senderAddress, name }) => {
  return (
    <List>
      <Item multipleLine>所购商品 <Brief><div className='briefDiv'>{ name }</div></Brief></Item>
      {
        senderAddress ? (<Item>购买地 <Brief><div className='briefDiv'>{ senderAddress }</div></Brief></Item>) : ''
      }
    </List>
  )
}

// 收货地址，送达时间展示
const PersonalInfo = ({ receiverName, receiverPhone, receiverAddress, deliverTime, receiverSex }) => {
  let six = '女士'
  if (receiverSex === 0) {
    six = '先生'
  }
  return (
    <div className='PersonalInfoWrap'>
      <List>
        <Item className='time' extra={ `${ deliverTime }` }>送达时间</Item>
        <Item>
          <div className='orderContact'>收货地址</div>
          <div className='cantactMain'>
            <div className='oto'><span>{ receiverName }</span><span>{ six }</span><span>{ receiverPhone }</span></div>
            <div className='oto'>{ `${ receiverAddress } ` }</div>
          </div>
        </Item>
      </List>
    </div>
  )
}

// 订单编号和下单时间
const OrderTimeCom = ({ id, createdAt }) => {
  return (
    <div>
      <List className='OrderTimeCom'>
        <Item extra={ id }>订单编号</Item>
        <Item extra={ `${ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }` }>下单时间</Item>
      </List>
      <WhiteSpace size='lg' />
    </div>
  )
}
