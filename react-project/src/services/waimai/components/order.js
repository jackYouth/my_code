import React from 'react'
import { List, WhiteSpace, Picker, Toast } from 'antd-mobile'
// import { moment, addInterval } from '@boluome/common-lib'
// import { compose } from 'ramda'
// import moment from 'moment'
import { ContactShow, Mask, SlidePage, ContactNew, NewPromotion } from '@boluome/oto_saas_web_app_component'
import getCart from './getCart'
import OrderTips from './orderTips'
import '../style/order.scss'
import watch from '../img/watch.png'

// const alert = Modal.alert
const Item = List.Item
const handleSuccess = (handleChooseContact, props) => {
  const { handleCreateCart, channel, restaurantId, addressResult = {}, chooseContact = {} } = props
  // console.log('props-=-=-==--=-==--==--=', chooseContact, addressResult)
  Mask(
    <SlidePage target='right' type='root'>
      <ContactNew
        handleChange={ contact => {
          handleChooseContact(contact)
          if (contact) {
            handleCreateCart(props, contact)
          } else {
            console.log('没有收货地址')
          }
          console.log('address result ', contact)
        } }
        api='/waimai/v1/restaurant/delivery/address/info'
        postData={{ channel, restaurantId }}
        chooseContact={ chooseContact.contactId ? chooseContact : addressResult }
      />
    </SlidePage>
    , { mask: false }
  )
}

const order = props => {
  // console.log('order props------------>', props)
  const { deliveryInfo, showBottomAddress, handleOrderPageScroll, userTips, handleUserTips, saveOrder, beLocation,
    bestContact = '', chooseContact = {}, handleChooseContact, shoppingCarArray = [], restaurantInfo = {},
    restaurantId, handleArriveTime, chooseTime, cartData = {}, discountPrice = 0, handleCoupon, addressResult = {},
  } = props
  const { extra = [], deliverTime = '' } = cartData
  let cartDiscount = 0
  if (extra.length > 0) {
    const a = extra.filter(o => { return o.price < 0 })
    if (a.length > 0) {
      cartDiscount = Math.abs(extra.filter(o => { return o.price < 0 })[0].price)
    }
    // console.log('cartDiscount', cartDiscount, a)
  }
  const { deliveryTimes = [], pic = '', restaurantName = '', isVipDelivery } = restaurantInfo
  let { agentFee = 0 } = deliveryInfo
  let pakingFee = 0
  let pakingQuan = 1
  const newDeliveryTimes = []
  // console.log('bestContact--------', bestContact, 'chooseContact--------', chooseContact)
  // let deliveryTimes2
  if (!deliveryTimes[0] || (deliveryTimes[0] && deliveryTimes[0].indexOf('尽快送达') < 0)) {
    deliveryTimes.unshift(`尽快送达 预计 ${ deliverTime } 送达`)
    // moment('HH:mm')(addInterval(predictDeliverTime, 'm')(moment('x')(new Date())))
    // compose(moment('HH:mm'), addInterval(predictDeliverTime, 'm'), moment('x'))(new Date())
  } else {
    deliveryTimes[0] = `尽快送达 预计 ${ deliverTime } 送达`
  }
  deliveryTimes.forEach((item, index) => {
    if (index > 0) {
      newDeliveryTimes.push({ label: item.substring(0, 5), value: item.substring(0, 5) })
    } else {
      newDeliveryTimes.push({ label: item, value: item })
    }
  })

  if (extra.length > 0) {
    extra.forEach(item => {
      if (item.name === '餐盒') {
        pakingFee = item.quantity
        pakingQuan = item.price
      }
      if (item.name.indexOf('配送费') > -1) {
        agentFee = item.price
      }
    })
  }
  // const customerUserId = getStore('customerUserId', 'session')
  // let restaurantCart = shoppingCarArray[customerUserId][restaurantId]
  let restaurantCart = shoppingCarArray[restaurantId]
  if (!restaurantCart) {
    restaurantCart = []
  }
  const shoppingCar = getCart(restaurantCart)
  let sumPrice = 0
  if (cartData.price) {
    // console.log('cartData.price', cartData.price)
    sumPrice = cartData.price
  } else {
    shoppingCar.reduce((amount, curr) => {
      // console.log('curr', curr)
      amount += curr.realPrice ? Number(curr.realPrice) : curr.originalPrice * curr.quantity
      sumPrice = amount
      return sumPrice
    }, 0)
  }

  return (
    <div className='orderPageBox'>
      <div className='orderPage-container' onScroll={ e => handleOrderPageScroll(e.target) } style={{ height: showBottomAddress ? 'calc(100% - 1.55rem)' : '100%' }}>
        <div className='contact-container'>
          <ContactShow contact={ chooseContact.contactId && !beLocation ? chooseContact : addressResult.contactId ? addressResult : '' } handleSuccess={ () => handleSuccess(handleChooseContact, props) } />
        </div>
        <WhiteSpace />
        <div className='arriveTime-container'>
          <Picker mode='time'
            data={ newDeliveryTimes }
            value={ chooseTime }
            title='选择送达时间'
            onChange={ t => handleArriveTime(t) }
            extra={ `${ deliveryTimes[0] }` }
            cols={ 1 }
          >
            <Item arrow='horizontal' thumb={ watch }>送达时间</Item>
          </Picker>
        </div>
        <WhiteSpace />
        <div className='food-list'>
          <Item thumb={ pic }>
            { restaurantName }
            <span className={ isVipDelivery ? 'deliverySpan isVipColor' : 'deliverySpan' }>{ isVipDelivery ? '蜂鸟专送' : '商家配送' }</span>
          </Item>
          <div className='food-list-box'>
            {
              Array.isArray(cartData.group) && cartData.group.length > 0 ?
                cartData.group.map(({ foodName, price, quantity, attrs = [] }) => {
                  return (
                    <div key={ `cartDataFoodlistKey${ Math.random() }` } className='food-box'>
                      <span className='foodName'>{ foodName }</span>
                      <span className='foodLeng'>{ `x${ quantity }` }</span>
                      <span className='foodPrice'>{ `¥${ (quantity * price).toFixed(2) }` }</span>
                      <p>
                        {
                          attrs.map(({ value }) => {
                            return (
                              <span style={{ margin: '.1rem .1rem 0 0', fontSize: '.24rem', color: '#999', display: 'inline-block' }}>{ value }</span>
                            )
                          })
                        }
                      </p>
                    </div>
                  )
                })
              :
                shoppingCar.map(({ foodName, price, quantity, foodsInfo }) => {
                  // console.log('foodsInfo', foodsInfo)
                  return (
                    <div key={ `foodlistKey${ Math.random() }` } className='food-box'>
                      <span className='foodName'>
                        {
                          Array.isArray(foodsInfo.attrsArr) && foodsInfo.attrsArr.length > 0 ?
                            `${ foodName } ${ foodsInfo.attrsArr.map(i => { return i.value }) }`
                          :
                            `${ foodName }`
                        }
                      </span>
                      <span className='foodLeng'>{ `x${ quantity }` }</span>
                      <span className='foodPrice'>{ `¥${ (quantity * price).toFixed(2) }` }</span>
                    </div>
                  )
                })
            }
            {
              cartData !== undefined && pakingFee ?
                <div className='food-box' >
                  <span className='foodName'>餐盒</span>
                  <span className='foodPrice'>{ `¥${ pakingFee * pakingQuan }` }</span>
                </div>
              : ''
            }
            <div className='agentFee-container'>
              <span>配送费</span>
              <span>{ `¥${ agentFee }` }</span>
            </div>
          </div>
          {
            Array.isArray(cartData.extra) && cartData.extra.length > 0 ?
              cartData.extra.filter(o => { return o.price < 0 }).map(({ name, quantity, price }) => {
                return (
                  <div key={ `discountfoodlistKey${ Math.random() }` } className='food-box discount-box'>
                    <span className='foodName'>{ name }</span>
                    <span className='foodPrice' style={{ color: '#ff4848' }}>{ `- ¥${ Math.abs((quantity * price).toFixed(2)) }` }</span>
                  </div>
                )
              })
            : ''
          }
          {
            Array.isArray(cartData.abandonedExtra) && cartData.abandonedExtra.length > 0 ?
              <div style={{ display: 'inline-block', padding: '.25rem .3rem', fontSize: '.28rem', color: '#ff4848', width: '100%', borderTop: '.01rem solid #e5e5e5', boxSizing: 'border-box' }}>{ cartData.abandonedExtra[0].description }</div>
            : ''
          }
        </div>
        <WhiteSpace />
        <div>
          <NewPromotion orderType='waimai' channel='ele' amount={ sumPrice } handleChange={ reply => handleCoupon(reply) } />
        </div>
        <WhiteSpace />
        <div className='pay-method'>
          <Item extra='在线支付' >
            支付方式
          </Item>
        </div>
        <div className='order-tips'>
          <Item arrow='horizontal'
            extra={ userTips !== undefined ? userTips : '口味、偏好等' }
            onClick={ () =>
              Mask(
                <SlidePage target='right' type='root'>
                  <OrderTips handleTips={ tips => handleUserTips(tips) } />
                </SlidePage>
                , { mask: false }
              )
            }
          >
            订单备注
          </Item>
        </div>
      </div>
      <div className='bottomBar'>
        <div className='sub-address' style={{ display: (chooseContact.name && showBottomAddress && !beLocation) || (bestContact.name && showBottomAddress && !beLocation) || (addressResult.name && showBottomAddress && !beLocation) ? 'block' : 'none' }}>
          <span>配送至：</span>
          <p>
            { chooseContact.name ?
                `${ chooseContact.city }${ chooseContact.county }${ chooseContact.detail }${ chooseContact.houseNum }`
              :
                bestContact.name ?
                  `${ bestContact.city }${ bestContact.county }${ bestContact.detail }${ chooseContact.houseNum }`
                  : `${ addressResult.city }${ addressResult.county }${ addressResult.detail }${ addressResult.houseNum }`
            }
          </p>
        </div>
        <div className='buttomBar-container'>
          <div className='order-info-container'>
            <div className='price-box'>
              {
                discountPrice > 0 || cartDiscount > 0 ?
                  <span className='discount-price'>{ `已优惠¥${ discountPrice + cartDiscount }` }</span>
                : ''
              }
              <span className='you-will-pay'>
                <span>实付：¥</span>
                <span>{ (sumPrice - discountPrice) > 0 ? (sumPrice - discountPrice).toFixed(2) : 0.01 }</span>
              </span>
            </div>
            <button className={ (chooseContact.name && cartData.cartId) || (addressResult.name && cartData.cartId) ? 'save-order' : 'save-order cantUse' }
              onClick={ (chooseContact.name && cartData.cartId) || (addressResult.name && cartData.cartId) ? () => { saveOrder(props) } : () => Toast.info('请添加收货地址', 2) }
            >立即下单</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default order
