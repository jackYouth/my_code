import React from 'react'
import { OrderDetail } from '@boluome/oto_saas_web_app_component'
import { afterOrdering } from 'business'
import { List } from 'antd-mobile'
import { browserHistory } from 'react-router'
import { moment } from '@boluome/common-lib'
// import vconsole from 'vconsole'
import '../style/orderDetails.scss'
import jian from '../img/jian.png'
import hui from '../img/hui.png'
import tel from '../img/tel.png'
import tou from '../img/tou.jpg'

const Item = List.Item
const orderDetails = props => {
  console.log('orderDetails props~~~', props)
  const { orderId = '', handleAftermarket, orderInfo = {} } = props
  const { phone, buttonUrl } = orderInfo
  return (
    <div className='orderDetails-container'>
      <OrderDetail
        content={ <Content /> }
        id={ orderId }
        orderType='waimai'
        handleAftermarket={ () => handleAftermarket(phone, buttonUrl) }
        goPay={ () => afterOrdering({ id: orderId, saasUrl: window.location.href }) }
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

const noCommonItemStyle = {
  fontSize:   '.28rem',
  color:      '#333',
  height:     '.8rem',
  lineHeight: '.8rem',
  padding:    '0 .3rem',
}

const specialCommonItem = {
  borderBottom: '.01rem solid #e5e5e5',
  fontSize:     '.28rem',
  color:        '#333',
  padding:      '.2rem .3rem',
  overflow:     'hidden',
}

const CommonBoxStyle = {
  backgroundColor: '#fff',
}

const MarginTop2Box = {
  marginTop: '.2rem',
  ...CommonBoxStyle,
}

const ellipsis = {
  width:     '100%',
  textAlign: 'right',
  display:   'inline-block',
}

// <span style={{ height: '100%', display: 'inline-block', verticalAlign: 'top', lineHeight: '.8rem', marginLeft: '.3rem' }}>当前订单由商家配送，无法获取配送员信息</span>

const Content = ({ orderDetailInfo }) => {
  console.log('orderDetailInfo', orderDetailInfo)
  const { createdAt, pic, restaurantName, restaurantId, platformActivity = [], coupon = [], price = 0, phone, partnerId,
          deliveryTimeShow = '', isVipDelivery = 1, contact = {}, isOnlinePaid = 1, food = {}, restaurantPhone, description = '',
          buttonUrl = '', buttonCode = 0, buttonText = '', buttonTextDesc = '',
        } = orderDetailInfo
  const { group = [], extra = [] } = food
  const discountExtra = []
  const { customer } = window.OTO_SAAS
  const { bridge, isSpecialPhoneCall = false } = customer
  const { specialPhoneCall } = bridge
  if (extra.length > 0) {
    extra.forEach(items => {
      if (items.price < 0) {
        discountExtra.push(items)
      }
    })
  }
  return (
    <div className='orderDetails-content-container'>
      {
        (status !== 8 && orderDetailInfo.deliveryman_phone) || (status !== 4 && orderDetailInfo.deliveryman_phone) ?
          <div style={{ height: '1.2rem', backgroundColor: '#fff', padding: '.2rem .3rem', marginTop: '.2rem' }}>
            <img src={ tou } style={{ width: '.8rem' }} alt='tou' />
            <div style={{ display: 'inline-block', height: '100%', verticalAlign: 'top', marginLeft: '.3rem' }}>
              <span>配送员</span><br />
              <span style={{ display: 'inline-block', marginTop: '.2rem' }}>{ orderDetailInfo.deliveryman_name }</span>
            </div>
            {
              isSpecialPhoneCall ?
                <span style={{ height: '100%', verticalAlign: 'middle', float: 'right', lineHeight: '.8rem' }} onClick={ () => {
                  if (isSpecialPhoneCall && specialPhoneCall && typeof specialPhoneCall === 'function') {
                    specialPhoneCall(orderDetailInfo.deliveryman_phone)
                  } else {
                    console.log('isSpecialPhoneCall else', isSpecialPhoneCall, specialPhoneCall)
                  }
                } }
                >
                  <img src={ tel } style={{ width: '.5rem', verticalAlign: 'middle', marginRight: '.2rem' }} alt='tel' />
                  <span style={{ verticalAlign: 'middle', color: '#ffab00' }}>联系小哥</span>
                </span>
              :
                <a href={ `tel:${ orderDetailInfo.deliveryman_phone }` } style={{ height: '100%', verticalAlign: 'middle', float: 'right', lineHeight: '.8rem' }}>
                  <img src={ tel } style={{ width: '.5rem', verticalAlign: 'middle', marginRight: '.2rem' }} alt='tel' />
                  <span style={{ verticalAlign: 'middle', color: '#ffab00' }}>联系小哥</span>
                </a>
            }
          </div>
        : ''
      }
      <div className='food-container' style={ MarginTop2Box }>
        <Item arrow='horizontal' thumb={ pic } onClick={ () => {
          if (orderDetailInfo.timeline_new.length > 0) {
            browserHistory.push(`/waimai/RestaurantDetail?restaurantId=${ restaurantId }`)
          }
        } }
        >{ restaurantName }</Item>
        {
          group.length > 0 ?
            <div className='group-box'>
              {
                group.map(item => {
                  return (
                    <div className='group-item-box' key={ Math.random() }>
                      <span style={{ display: 'inline-block', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ item.name }</span>
                      <span style={{ float: 'right', minWidth: '.5rem', textAlign: 'right' }}>{ `¥${ (item.quantity * item.price).toFixed(2) }` }</span>
                      <span style={{ float: 'right', marginRight: '.4rem', color: '#999' }}>{ `x${ item.quantity }` }</span>
                      <p>
                        {
                          item.attrs.map(({ value }) => {
                            return (
                              <span className='group-item-attrs-box' style={{ fontSize: '.24rem', color: '#999' }} key={ value }>{ value }</span>
                            )
                          })
                        }
                      </p>
                    </div>
                  )
                })
              }
            </div>
          : ''
        }
        {
          extra.length > 0 ?
            <div className='extra-box'>
              {
                extra.map(i => {
                  return (
                    i.price > 0 ?
                      <div style={ noCommonItemStyle } key={ i.id }>
                        <span>{ i.name }</span>
                        <span style={{ float: 'right' }}>{ `¥${ i.price }` }</span>
                      </div>
                    : ''
                  )
                })
              }
            </div>
          : ''
        }
        {
          discountExtra.length > 0 ?
            <div>
              {
                discountExtra.map(it => {
                  return (
                    <div style={ noCommonItemStyle } key={ it.id }>
                      <span>{ it.name }</span>
                      <span style={{ float: 'right', color: '#ff4848' }}>{ `- ¥${ Math.abs(it.price) }` }</span>
                    </div>
                  )
                })
              }
            </div>
          : ''
        }

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
          <img src={ tel } style={{ width: '.5rem', verticalAlign: 'middle', marginRight: '.2rem' }} alt='tel' />
          {
            isSpecialPhoneCall ?
              <span style={{ verticalAlign: 'middle', color: '#ffab00' }} onClick={ () => {
                if (isSpecialPhoneCall && specialPhoneCall && typeof specialPhoneCall === 'function') {
                  specialPhoneCall(restaurantPhone)
                } else {
                  console.log('isSpecialPhoneCall else', isSpecialPhoneCall, specialPhoneCall)
                }
              } }
              >联系商家</span>
            :
              <a href={ `tel:${ restaurantPhone }` } style={{ verticalAlign: 'middle', color: '#ffab00' }}>联系商家</a>
          }
          <span style={{ float: 'right' }}>{ `实付：¥${ price }` }</span>
        </div>
      </div>

      {
        buttonUrl && buttonCode > 1 ?
          <Item arrow='horizontal' style={{ marginTop: '.2rem' }} extra={ buttonTextDesc } onClick={ () => { location.href = buttonUrl } }>{ buttonText }</Item>
        : ''
      }

      <div className='contact-container' style={ MarginTop2Box }>
        <div style={ CommonItemStyle }>
          <span>送达时间</span>
          <span style={{ float: 'right' }}>{ deliveryTimeShow }</span>
        </div>
        <div style={ specialCommonItem }>
          <span>收货地址</span>
          <div style={{ float: 'right', display: 'inline-block', width: '70%' }}>
            <span style={{ float: 'right' }}>{ `${ contact.name } ${ phone }` }</span><br />
            <span style={ ellipsis }>{ contact.address }</span>
          </div>
        </div>
        <div style={ CommonItemStyle }>
          <span>配送方式</span>
          <span style={{ float: 'right' }}>{ isVipDelivery ? '蜂鸟专送' : '商家配送' }</span>
        </div>
      </div>
      {
        description ?
          <div style={ MarginTop2Box }>
            <div style={ CommonItemStyle }>
              <span>订单备注</span>
              <span style={{ float: 'right', maxWidth: '70%', overflow: 'hidden' }}>{ description }</span>
            </div>
          </div>
        : ''
      }
      <div className='order-container' style={ MarginTop2Box }>
        <div style={ CommonItemStyle }>
          <span>订单编号</span>
          <span style={{ float: 'right' }}>{ partnerId }</span>
        </div>
        <div style={ CommonItemStyle }>
          <span>下单时间</span>
          <span style={{ float: 'right' }}>{ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }</span>
        </div>
        <div style={ CommonItemStyle }>
          <span>支付方式</span>
          <span style={{ float: 'right' }}>{ isOnlinePaid ? '在线支付' : '线下付款' }</span>
        </div>
      </div>
    </div>
  )
}
