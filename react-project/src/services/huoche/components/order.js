import React from 'react'
import { WhiteSpace, InputItem, List, Switch, Icon } from 'antd-mobile'
import { NewPromotion, Mask } from '@boluome/oto_saas_web_app_component'

import Cardtime from './cardtime'
import Ordernotice from './ordernotice'
import AddTouristCom from './addtourist'
import InvoiceDetails from './InvoiceDetails'
import AccidentRistMask from './AccidentRistMask'
import NoticeMask from './NoticeMask'

import '../style/order.scss'
import detailIcon from '../img/detailIcon.svg'
import tipsIcon from '../img/tips.svg'

const Item = List.Item
const Brief = Item.Brief

const Order = props => {
  const {
    seatsChoose, accidentData, ticketDetails, changeTouristNumer,
    chooseTime, handleNeedAccident, haschecked, handleChangeTourNum, checkAccient,
    handlePromotion, promotion, handlePhone, phone, name, handleName,
    ChangeSign, details, propsObj, passengersChoose = '', seats, partnerId, isBsb, channel,
  } = props
  console.log('--channel--', channel)
  let { withoutDiscountedPrice = 0 } = props
  let { touristNumer } = props
  const { trainNumber, trains } = propsObj
  const handleShowDetail = isShow => {
    if (ChangeSign && seats && ChangeSign.indexOf('ChangeSign') > -1) {
      seatsChoose.price = seats.price
      seatsChoose.name = seats.name
    }
    Mask(<InvoiceDetails seatsChoose={ seatsChoose } promotion={ promotion } touristNumer={ touristNumer } withoutDiscountedPrice={ withoutDiscountedPrice } checkAccient={ checkAccient } haschecked={ haschecked } ChangeSign={ ChangeSign } isShow={ isShow } />, { mask: false, style: { position: 'absolute' } })
  }
  const handleAccidentRist = () => {
    Mask(<AccidentRistMask accidentData={ accidentData } />, { mask: false, style: { position: 'absolute' } })
  }
  const handleNoticeMask = () => {
    Mask(<NoticeMask />, { mask: false, style: { position: 'absolute' } })
  }
  let sumPromotionPrice = 0
  let numberSum = 0
  // 是否显示红包
  let isShow = true
  // 改签不要手续费
  if (ChangeSign && ChangeSign.indexOf('ChangeSign') > 0) {
    withoutDiscountedPrice = 0
  }
  if (passengersChoose && passengersChoose.length > 0 && ChangeSign && ChangeSign.indexOf('ChangeSign') > -1) {
    touristNumer = passengersChoose
    seatsChoose.parentId = partnerId
    seatsChoose.price = seats.price
    seatsChoose.name = seats.name
    if (passengersChoose[0].ticketPrice >= seats.price) {
      isShow = false
    }
  }
  if (touristNumer && touristNumer.length !== 0 && seatsChoose.price) {
    sumPromotionPrice = touristNumer.length * seatsChoose.price
    numberSum = touristNumer.length
    if (checkAccient && haschecked && isBsb) {
      const { price } = checkAccient
      sumPromotionPrice += touristNumer.length * price
    }
    const extraPrice = Number(withoutDiscountedPrice) * numberSum
    sumPromotionPrice += extraPrice
  }
  const defaultClass = {
    backgroundColor: '#fffbf2',
  }
  const { seatName } = trains
  const { date, weed } = chooseTime
  // const isShow = true  // 这里是暂时隐藏意外险
  // 高价改低价不用红包--不展示红包，支付只有保险的时候不用红包
  if (passengersChoose && passengersChoose.length > 0 && ChangeSign && ChangeSign.indexOf('ChangeSign') > -1) {
    if (passengersChoose[0].ticketPrice >= seats.price) {
      isShow = false
      sumPromotionPrice = 0
      if (checkAccient && haschecked && isBsb) {
        const { price } = checkAccient
        sumPromotionPrice += touristNumer.length * price
      }
      // console.log('--------sssss-----------------------', passengersChoose[0].ticketPrice, seats.price)
    } else {
      // console.log('-------------------------------', passengersChoose[0].ticketPrice, seats.price)
      if (channel === 'tongcheng') {
        sumPromotionPrice = seats.price - passengersChoose[0].ticketPrice
      } else {
        sumPromotionPrice = seats.price
      }
      if (checkAccient && haschecked && isBsb) {
        const { price } = checkAccient
        sumPromotionPrice += touristNumer.length * price
      }
    }
  }
  // 判断是否是唯品金融
  let isVipjinrong = false
  const host = location.host
  if (host.indexOf('vipjinrong') > -1 && !ChangeSign) {
    isVipjinrong = true
  }
  return (
    <div className='orderWrap'>
      <div className='orderMain'>
        {
          ChangeSign && ChangeSign.indexOf('ChangeSign') > 0 ? (<List>
            <Item extra={ <span style={{ color: '#ffab00' }} onClick={ () => handleNoticeMask() }>预定须知</span> }>{ `${ date } ${ weed }开` }</Item>
            {
              details ? (<Cardtime UserComponent={ <ChoosePeople passengersChoose={ passengersChoose } seats={ seats } /> } ticketDetails={ details } chooseTime={ chooseTime } defaultClass={ defaultClass } />) : ('')
            }
            {
              details ? (<div style={{ height: '26px', backgroundColor: '#f5f5f6' }} />) : ('')
            }
            <Item extra={ `(${ trainNumber }/${ seatName })` }>原始车票</Item>
          </List>) : (<div>
            {
              ticketDetails && seatsChoose ? (<Cardtime UserComponent={ <Ordernotice seatsChoose={ seatsChoose } /> } ticketDetails={ ticketDetails } chooseTime={ chooseTime } />) : ''
            }
            {
              seatsChoose && (seatsChoose.name === '硬卧' || seatsChoose.name === '软卧') ? (<div className='NoticeBar'>上中下铺随机出票，暂收下铺价格。出票成功后，根据实际出票铺位退还差价</div>) : ('')
            }
          </div>)
        }
        <WhiteSpace size='lg' />
        {
          ChangeSign && ChangeSign.indexOf('ChangeSign') > -1 ? ('') : (<AddTouristCom touristNumer={ touristNumer } handleChangeTourNum={ handleChangeTourNum } changeTouristNumer={ res => changeTouristNumer(res) } />)
        }
        {
          ChangeSign && ChangeSign.indexOf('ChangeSign') > -1 ? ('') : (<WhiteSpace size='lg' />)
        }
        <PhoneCom handlePhone={ handlePhone } phone={ phone } handleName={ handleName } name={ name } />
        <WhiteSpace size='lg' />
        {
          accidentData && isBsb ? (<div><AccidentRist
            handleAccidentRist={ handleAccidentRist }
            touristNumer={ touristNumer }
            accidentData={ accidentData }
            haschecked={ haschecked }
            handleNeedAccident={ handleNeedAccident }
          />
            <WhiteSpace size='lg' /></div>) : ('')
        }
        {
          ChangeSign && ChangeSign.indexOf('ChangeSign') > -1 && isShow === false ? ('') : (touristNumer && touristNumer.length > 0 ? (<NewPromotion orderType='huoche' channel={ channel } amount={ sumPromotionPrice } count={ numberSum } handleChange={ reply => handlePromotion(reply) } />) : '')
        }
        {
          isVipjinrong && touristNumer && touristNumer.length > -1 ? (<div><p style={{ color: '#ffab00', fontSize: '0.24rem', paddingLeft: '0.3rem', paddingTop: '20px' }}>*另收取出票手续费5元/张，如出票失败，将全额退回。</p>
            <WhiteSpace size='lg' /></div>) : (<WhiteSpace size='lg' />)
        }
      </div>
      <FooterCom
        handleShowDetail={ handleShowDetail }
        sumPromotionPrice={ sumPromotionPrice }
        propsData={ props }
        touristNumer={ touristNumer }
        isShow={ isShow }
      />
    </div>
  )
}
// touristNumer={ touristNumer }
// promotion={ promotion }
// seatsChoose={ seatsChoose }
// ticketDetails={ ticketDetails }
// handleOrderSave={ handleOrderSave }
// phone={ phone }
// chooseTime={ chooseTime }
// withoutDiscountedPrice={ withoutDiscountedPrice }
// name={ name }
// checkAccient={ checkAccient }
export default Order

// 填写手机号码组件
const PhoneCom = ({ handlePhone, phone, name, handleName }) => {
  return (
    <List>
      <InputItem
        type='text'
        placeholder='请输入联系人姓名'
        value={ name }
        defaultValue={ name }
        onChange={ v => handleName(v) }
      >联系人</InputItem>
      <InputItem
        type='phone'
        placeholder='请输入联系人手机号'
        value={ phone }
        defaultValue={ phone }
        onChange={ v => handlePhone(v) }
      >联系手机</InputItem>
    </List>
  )
}
// 火车意外险组件
const AccidentRist = ({ handleAccidentRist, touristNumer, accidentData, handleNeedAccident, haschecked }) => {
  console.log(accidentData, haschecked)
  const { name, brief, price } = accidentData
  return (
    <Item
      className='accidenRist'
      extra={ <Switch
        checked={ haschecked }
        onClick={ checked => { handleNeedAccident(checked, accidentData) } }
      /> }
    >
      { name }
      <Icon onClick={ () => { handleAccidentRist() } } type={ tipsIcon } />
      <Brief>{ brief }</Brief>
      <span className='accidenPrice'>¥{ price } <i>x{ touristNumer.length }</i></span>
    </Item>
  )
}

// 改签的乘客信息展示
const ChoosePeople = ({ passengersChoose, seats }) => {
  const { name, price } = seats
  return (
    <div>
      {
        passengersChoose && passengersChoose.map(o => (
          <Item key={ o.credentialCode + o.name } multipleLine extra={ <span style={{ marginRight: '0px' }}>{ name } ¥{ price }</span> }>
            <span style={{ marginRight: '20px' }}>{ o.name }</span><span style={{ color: '#999' }}>{ o.ticketType }</span> <Brief><span style={{ color: '#333' }}>{ `${ o.credentialCode.slice(0, 4) } ******** ${ o.credentialCode.slice(-3) }` }</span></Brief>
          </Item>
        ))
      }
    </div>
  )
}

// 底部footer部分
const FooterCom = ({ propsData, handleShowDetail, sumPromotionPrice, touristNumer, isShow }) => {
  const { handleOrderSave, name, checkAccient, promotion, seatsChoose, ticketDetails, haschecked,
    phone, chooseTime, ChangeSign, details } = propsData
  let { discount = 0 } = promotion
  let sum = Number(sumPromotionPrice)
  sum -= discount
  if (sum < 0) {
    sum = 0.01
  }
  if (discount === '0.00') {
    discount = 0
  }
  let isNameTel = false
  if (name && phone && (/^.{11}$/.test(phone.replace(/\s/g, '')))) {
    isNameTel = true
  }
  // console.log('propsObj--name---', name, phone, isNameTel)
  return (
    <div className='footerWrap'>
      {
        touristNumer.length === 0 ? (<div className='footerL' />) : (
          <div className='footerL'><span className={ `priceSum ${ discount === 0 ? 'promotion' : '' }` }>实付: ¥{ sum.toFixed(2) }</span>{ discount === 0 ? ('') : (<span className='pricePro'>已优惠¥{ `${ discount.toFixed(2) }` }</span>) }</div>
        )
      }
      {
        touristNumer.length === 0 || (isShow === false && sumPromotionPrice === 0) ? ('') : (
          <div className='detailWrap' onClick={ () => { handleShowDetail(isShow) } }>
            <span className='detail'>明细</span><Icon type={ detailIcon } />
          </div>
        )
      }
      {
        touristNumer.length === 0 || !isNameTel ? (<div className='footerR footerSpan'>立即下单</div>) :
        (<div className='footerR' onClick={ () => handleOrderSave(promotion, touristNumer, seatsChoose, ticketDetails, phone, chooseTime, name, checkAccient, ChangeSign, details, haschecked) }>立即下单</div>)
      }
    </div>
  )
}
