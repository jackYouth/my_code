import React from 'react'
import { List, Picker } from 'antd-mobile'
import { getStore, setStore } from '@boluome/common-lib'
import { Mask, NewPromotion, SlidePage } from '@boluome/oto_saas_web_app_component'
import RatePlansLayer from './ratePlansLayer'
import closeMask from './closeMask'
import '../style/order.scss'

const Item = List.Item
const Order = props => {
  // console.log('order props', props)
  // 一级数据源
  const { checkInfo, handleCustomerName, isGoGuarantee, handleCustomerPhone, handleCoupon, arriveTime, handleArriveTime,
          roomQuantity, handleChooseRoomQuantity, showRoomID, hotelDetail = {}, choosenQuantity = ['1 间'], availData = {},
          choosenArriveTime = ['请选择最晚到店时间'], quantity = 1, discountPrice = 0, customerPhone = getStore('userPhone', 'session'),
          rateInfo = {}, images = [], customerName = [],
        } = props
  const dateInfo = getStore('dateInfo')
  // 二级数据源
  const { startDate, endDate, sumNight } = dateInfo
  const { cancelPolicy = '' } = availData
  const { name, rooms = [] } = hotelDetail
  const { paymentType, price = 0 } = rateInfo
  // 自定义变量
  const contactNameTest = []
  const sumPrice = Number(quantity) * Number(price)
  setStore('rateInfo', rateInfo, 'session')

  for (let i = 0; i < quantity; i++) {
    contactNameTest.push(
      <div className='customer-name' key={ i }>
        <span>入住人</span>
        <input type='text' placeholder='入住人姓名' value={ customerName[i] } className='customerNameInput' onChange={ e => handleCustomerName(i, e.target.value, customerName) } />
      </div>
    )
  }

  return (
    <div className='orderPage-container'>
      <div className='room-info-container'>
        <div className='room-info-box'>
          <p className='room-info-line-one'>
            <span>{ rooms.filter(i => { return i.id === showRoomID }).length > 0 ? rooms.filter(i => { return i.id === showRoomID })[0].name : '' }</span>
            <span>{ name }</span>
          </p>
          <p className='room-info-line-two'>
            <span>{ `入住：${ startDate.split('-')[1] }月${ startDate.split('-')[2] }日` }</span>
            <span>{ `离店：${ endDate.split('-')[1] }月${ endDate.split('-')[2] }日` }</span>
            <span>{ `${ sumNight }晚` }</span>
            <span className='room-detail-btn' onClick={ () =>
                Mask(
                  <div>
                    <RatePlansLayer datas={ rateInfo } images={ images } showBtn={ false } />
                  </div>
                )
              }
            >房间详情</span>
          </p>
          <p className='room-info-line-three'>
            {
              rateInfo.bedType ? <span>{ rateInfo.bedType }</span> : ''
            }
            {
              rateInfo.broadband ? <span>{ rateInfo.broadband }</span> : ''
            }
            {
              rateInfo.breakfast ? <span>{ rateInfo.breakfast }</span> : ''
            }
          </p>
        </div>
      </div>
      <div className='order-main-container'>
        <div className='room-quantity-box'>
          <Picker mode='time'
            data={ roomQuantity }
            title='选择房间数'
            onChange={ t => handleChooseRoomQuantity(t, price, props) }
            extra=''
            cols={ 1 }
          >
            <Item arrow='horizontal' style={{ height: '0.88rem' }}>
              <span style={{ width: '1.87rem', display: 'inline-block' }}>房间数</span>
              <span>{ choosenQuantity }</span>
            </Item>
          </Picker>
        </div>
        {
          contactNameTest.map(i => {
            return i
          })
        }
        <div className='customer-phone'>
          <span>手机号</span>
          <input type='tel' placeholder='入住人手机号' maxLength='11' value={ customerPhone } onChange={ e => handleCustomerPhone(e.target.value) } />
        </div>
        <div className='arrive-time-box'>
          <Picker mode='time'
            data={ arriveTime }
            title='选择最晚到店时间'
            onChange={ t => handleArriveTime(t, props) }
            extra=''
            cols={ 1 }
          >
            <Item arrow='horizontal' style={{ height: '0.88rem' }}>
              <span style={{ width: '1.87rem', display: 'inline-block' }}>最晚到店</span>
              <span>{ choosenArriveTime }</span>
            </Item>
          </Picker>
        </div>
        <div className='show-price-container'>
          <span>房间总价</span>
          <span>{ `¥ ${ Number(sumPrice).toFixed(2) }` }</span>
        </div>
        {
          paymentType !== 'SelfPay' ?
            <div style={{ marginTop: '0.2rem' }}>
              <NewPromotion orderType='jiudian' channel={ getStore('channel') } amount={ typeof sumPrice === 'number' || typeof sumPrice === 'string' ? sumPrice : 0 } handleChange={ reply => handleCoupon(reply) } />
            </div>
          : ''
        }
        <div className='show-cancel-container'>
          <span>取消规则：</span>
          <span>{ `${ cancelPolicy }` }</span>
        </div>
      </div>
      <div className='bottom-btn-container'>
        <div className='price-box' onClick={ () =>
          Mask(
            <SlidePage target='right' showClose={ false } style={{ opacity: '0.95' }}>
              <div className='price-detail-container'>
                <i className='cross' style={{ top: '.2rem' }} />
                <h3>费用明细</h3>
                <div className='price-detail-box'>{ `¥${ sumPrice }` }</div>
                <i className='cross' />
                <div className='main-box'>
                  <span>{ startDate }</span>
                  <span>{ `¥${ price }*${ quantity }间` }</span>
                </div>
                <div className='closeMe' onClick={ () => closeMask() } />
              </div>
            </SlidePage>
          )
        }
        >
          <span className='discount-box'>{ `已优惠¥${ Number(discountPrice).toFixed(2) }` }</span>
          <div className='sumPrice-box'>
            <span>实付：¥</span>
            <span>{ Number(sumPrice - discountPrice).toFixed(2) }</span>
          </div>
        </div>
        <button onClick={ () => { checkInfo(props) } }>{ isGoGuarantee ? '去担保' : paymentType === 'SelfPay' ? '到店付' : '立即下单' }</button>
      </div>
    </div>
  )
}

export default Order

// <div style={{ marginTop: '0.2rem' }}>
//   <Bill billBack={ res => handleBill(res) } />
// </div>
