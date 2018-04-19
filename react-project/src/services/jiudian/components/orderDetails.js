import React from 'react'
import { List } from 'antd-mobile'
import { browserHistory } from 'react-router'
import { moment } from '@boluome/common-lib'
import { OrderDetail, Mask, SlidePage, Loading } from '@boluome/oto_saas_web_app_component'
import { afterOrdering } from 'business'
// import vconsole from 'vconsole'
import RatePlansLayer from './ratePlansLayer'
import HotelMap      from './hotelMap'
import '../style/orderDetails.scss'
import '../style/order.scss'
import tel from '../image/tel.png'
import jian from '../image/jian.png'
import hui from '../image/hui.png'

const Item = List.Item

const OrderDetails = props => {
  console.log('OrderDetails props', props)
  const { getOrderInfo, orderId = '' } = props
  return (
    <div className='orderDetails-container'>
      <OrderDetail
        content={ <Content /> }
        id={ orderId }
        orderType='jiudian'
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

const MarginTop2Box = {
  marginTop: '.2rem',
  ...CommonBoxStyle,
}

const Content = ({ orderDetailInfo }) => {
  // console.log('orderDetailInfo', orderDetailInfo)
  const { HotelName, HotelAddr = '', RoomName = '', NumberOfRooms = 1, ArrivalDate = '', DepartureDate = '', nightlyRates = [],
          RoomInfo = '', orderPrice = 0, price = 0, coupon = {}, platformActivity = {}, OrderRooms = [], cityId = '',
          LatestArrivalTime, id, createdAt, IsGuarantee, HotelTel, HotelId, Contact = {}, RoomDetail = {}, partnerId = '', services = [],
        } = orderDetailInfo
  const { Mobile = '' } = Contact
  const nameArr = []
  const hotelDetail = {
    name:      orderDetailInfo.name,
    latitude:  orderDetailInfo.lat,
    longitude: orderDetailInfo.lng,
  }
  const test = {
    hotelDetail,
    ...orderDetailInfo,
  }
  OrderRooms.forEach(i => { nameArr.push(i.Customers[0].Name) })
  return (
    <div className='orderDetails-content-container'>
      <div className='hotel-info-container'>
        <Item arrow='horizontal' style={ CommonItemStyle } onClick={ () => {
          if (orderDetailInfo.timeline_new.length > 0) {
            browserHistory.push(`/jiudian/details?id=${ HotelId }&orderCityId=${ cityId }`)
          }
        } }
        >{ HotelName }</Item>
        <Item arrow='horizontal' style={ CommonItemStyle } onClick={ () =>
          Mask(
            <SlidePage target='right' showClose={ false }>
              <HotelMap data={ test } />
            </SlidePage>
          )
        }
        >{ `酒店地址：${ HotelAddr }` }</Item>
        {
          HotelTel ?
            <div style={ CommonItemStyle }>
              <span>联系酒店</span>
              <a href={ `tel:${ HotelTel }` }><img src={ tel } alt='tel' style={{ float: 'right' }} /></a>
            </div>
          : ''
        }
      </div>
      <div className='room-info-container'>
        <div className='room-info-box'>
          <p className='room-info-line-one'>
            <span>{ RoomName }</span>
            <span>{ `${ NumberOfRooms }间` }</span>
          </p>
          <p className='room-info-line-two'>
            <span>{ `入住：${ !ArrivalDate.split('-')[1] ? '' : ArrivalDate.split('-')[1] }月${ !ArrivalDate.split('-')[2] ? '' : ArrivalDate.split('-')[2] }日` }</span>
            <span>{ `离店：${ !DepartureDate.split('-')[1] ? '' : DepartureDate.split('-')[1] }月${ !DepartureDate.split('-')[2] ? '' : DepartureDate.split('-')[2] }日` }</span>
            {
              nightlyRates.length > 0 ?
                <span>{ `${ nightlyRates.length }晚` }</span>
              : ''
            }
            {
              RoomDetail.ext ?
                <span className='room-detail-btn' onClick={ () =>
                    Mask(
                      <div>
                        <RatePlansLayer datas={ RoomDetail } images={ RoomDetail.ext.images } showBtn={ false } />
                      </div>
                    )
                  }
                >房间详情</span>
              : ''
            }
          </p>
          <p className='room-info-line-three'>
            <span>{ RoomInfo }</span>
          </p>
        </div>
      </div>
      <div className='price-info-container' style={ CommonBoxStyle }>
        <div style={ CommonItemStyle }>
          <span>房间总价</span>
          <span style={{ float: 'right', marginLeft: '.4rem' }}>{ `¥${ orderPrice.toFixed(2) }` }</span>
          {
            nightlyRates.length > 0 ?
              <span style={{ color: '#ffab00', float: 'right' }} onClick={ () =>
                Mask(
                  <SlidePage target='right' showClose={ false }
                    closeComponent={ <div className='closeMe' /> }
                    style={{ opacity: '0.95' }}
                  >
                    <div className='price-detail-container'>
                      <i className='cross' style={{ top: '.2rem' }} />
                      <h3>费用明细</h3>
                      <div className='price-detail-box'>{ `¥${ price }` }</div>
                      <i className='cross' />
                      {
                        nightlyRates.map(({ date, member }) => {
                          return (
                            <div className='main-box'>
                              <span>{ date }</span>
                              <span>{ `¥${ member }*${ NumberOfRooms }间` }</span>
                            </div>
                          )
                        })
                      }
                      <div className='closeMe' onClick={ () => window.history.go(-1) } />
                    </div>
                  </SlidePage>
                , { mask: false })
              }
              >明细</span>
            : ''
          }
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
          <span style={{ float: 'right', marginLeft: '.37rem' }}>{ `¥${ price.toFixed(2) }` }</span>
          <span style={{ float: 'right' }}>订单总额</span>
        </div>
      </div>
      <div className='contact-info-container' style={ MarginTop2Box }>
        {
          nameArr.length > 0 ?
            <div style={ CommonItemStyle }>
              <span>入住人</span>
              <span style={{ float: 'right', width: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ nameArr.join() }</span>
            </div>
          : ''
        }
        {
          Mobile ?
            <div style={ CommonItemStyle }>
              <span>手机号</span>
              <span style={{ float: 'right' }}>{ Mobile }</span>
            </div>
          : ''
        }
        <div style={ CommonItemStyle }>
          <span>到店时间</span>
          <span style={{ float: 'right' }}>{ LatestArrivalTime }</span>
        </div>
      </div>
      <div className='order-info-container' style={ MarginTop2Box }>
        {
          services.length > 0 ?
            <div style={ CommonItemStyle }>
              <span>{ `${ services[0].name }订单编号` }</span>
              <span style={{ float: 'right' }}>{ partnerId }</span>
            </div>
          : ''
        }
        <div style={ CommonItemStyle }>
          <span>订单编号</span>
          <span style={{ float: 'right' }}>{ id }</span>
        </div>
        <div style={ CommonItemStyle }>
          <span>下单时间</span>
          <span style={{ float: 'right' }}>{ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }</span>
        </div>
        <div style={ CommonItemStyle }>
          <span>担保情况</span>
          <span style={{ float: 'right' }}>{ IsGuarantee ? '担保' : '非担保' }</span>
        </div>
      </div>
    </div>
  )
}
