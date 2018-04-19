import React from 'react'
import { WhiteSpace, InputItem, List, Switch, Icon } from 'antd-mobile'
import { NewPromotion, Mask } from '@boluome/oto_saas_web_app_component'

import AddTouristCom from './addtourist'
import InvoiceDetails from './InvoiceDetails'
import AccidentRistMask from './AccidentRistMask'
import SeatTime from './SeatTime'

import '../style/order.scss'
import '../style/grabticket.scss'
import detailIcon from '../img/detailIcon.svg'
import tipsIcon from '../img/tips.svg'
import xiangyou from '../img/xiangyou.png'

const Item = List.Item
const Brief = Item.Brief

const Ordergrab = props => {
  const {
    touristNumer, accidentData, changeTouristNumer, seatsChoose = '',
    handleNeedAccident, haschecked, handleChangeTourNum, handlePromotion,
    promotion, handlePhone, phone, handleName, name,
    withoutDiscountedPrice = 0, maxprice, chooseCity, checkAccient = 0, maxpriceObj,
    chooseSpeedname, packagePrice, ticketDetails, seatsDataGrab, isBsb, channel,
  } = props
  // console.log('--ticketDetails--', ticketDetails, seatsDataGrab)
  const handleShowDetail = () => {
    // console.log('handleShowDetail---', checkAccient, haschecked)
    Mask(<InvoiceDetails seatsChoose={ seatsChoose } promotion={ promotion } touristNumer={ touristNumer } withoutDiscountedPrice={ withoutDiscountedPrice } checkAccient={ checkAccient } haschecked={ haschecked } maxpriceObj={ maxpriceObj } packagePrice={ packagePrice } />, { mask: false, style: { position: 'absolute' } })
  }
  const handleAccidentRist = () => {
    Mask(<AccidentRistMask accidentData={ accidentData } />, { mask: false, style: { position: 'absolute' } })
  }
  let sumPromotionPrice = 0
  if (maxprice) {
    sumPromotionPrice = maxprice * touristNumer.length
  }
  const numberSum = touristNumer.length
  const packagePriceSumP = packagePrice * numberSum
  if (checkAccient && haschecked && isBsb) {
    const { price } = checkAccient
    sumPromotionPrice += touristNumer.length * price
  }
  sumPromotionPrice += packagePriceSumP
  const extraPrice = Number(withoutDiscountedPrice) * numberSum
  sumPromotionPrice += extraPrice
  const colorClass = { color: '#333' }
  // 判断是否是唯品金融
  let isVipjinrong = false
  const host = location.host
  if (host.indexOf('vipjinrong') > -1) {
    isVipjinrong = true
  }
  return (
    <div className='orderWrap'>
      <div className='orderMain'>
        <StationCom chooseCity={ chooseCity } details={ ticketDetails } seatsDataGrab={ seatsDataGrab } />
        <SeatTime propsObj={ props } colorClass={ colorClass } />
        <List>
          <Item arrow='empty'>抢票提速<span className='itemoto' style={{ color: '#333' }}>{ chooseSpeedname ? `${ chooseSpeedname }` : `闪电抢票¥（${ packagePrice }/份）` }</span></Item>
        </List>
        <WhiteSpace size='lg' />
        <AddTouristCom touristNumer={ touristNumer } handleChangeTourNum={ handleChangeTourNum } changeTouristNumer={ res => changeTouristNumer(res) } />
        <WhiteSpace size='lg' />
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
          sumPromotionPrice && touristNumer && touristNumer.length > 0 ? (<NewPromotion orderType='huoche' channel={ channel } amount={ sumPromotionPrice } count={ numberSum } handleChange={ reply => handlePromotion(reply) } />) : ''
        }
        {
          isVipjinrong && touristNumer && touristNumer.length > 0 ? (<div><p style={{ color: '#ffab00', fontSize: '0.24rem', paddingLeft: '0.3rem', paddingTop: '20px' }}>*另收取出票手续费5元/张，如出票失败，将全额退回。</p>
            <WhiteSpace size='lg' /></div>) : (<WhiteSpace size='lg' />)
        }
      </div>
      <FooterCom
        propsObj={ props }
        handleShowDetail={ handleShowDetail }
        sumPromotionPrice={ sumPromotionPrice }
      />
    </div>
  )
}

export default Ordergrab

// 抢票展示---订单确认页面的
const StationCom = ({ chooseCity, details = '', seatsDataGrab }) => {
  const { from = '', to = '' } = chooseCity
  // console.log('---test-seatsDataGrab-', details, seatsDataGrab)
  return (
    <div className='StationWrap'>
      <div className='from otoft'>{ from }</div>
      {
        details && seatsDataGrab ? (<div className='myimgDetails'><span>{ details.number }</span><img src={ xiangyou } alt='' /><span>{ seatsDataGrab.name }</span></div>) : (<div className='myimg'><img src={ xiangyou } alt='' /></div>)
      }
      <div className='to otoft'>{ to }</div>
    </div>
  )
}

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

// 底部footer部分
const FooterCom = ({ propsObj, handleShowDetail, sumPromotionPrice }) => {
  const {
    touristNumer, handleOrderSave, chooseCity, checkAccient,
    promotion, phone, chooseTime, name, timearr, chooseSeat, chooseArrtime, haveChooseZuo,
    startTime, haschecked,
  } = propsObj
  const { discount = 0 } = promotion
  let sum = Number(sumPromotionPrice)
  sum -= discount
  if (sum < 0) {
    sum = 0.01
  }
  let isNameTel = false
  if (name && phone && (/^.{11}$/.test(phone.replace(/\s/g, '')))) {
    isNameTel = true
  }
  return (
    <div className='footerWrap'>
      {
        touristNumer.length === 0 ? (<div className='footerL' />) : (
          <div className='footerL'><span className={ `priceSum ${ discount === 0 || discount === '0.00' ? 'promotion' : '' }` }>实付: ¥{ sum.toFixed(2) }</span>{ discount === 0 || discount === '0.00' ? ('') : (<span className='pricePro'>已优惠¥{ `${ discount.toFixed(2) }` }</span>) }</div>
        )
      }
      {
        touristNumer.length === 0 ? ('') : (
          <div className='detailWrap' onClick={ () => { handleShowDetail() } }>
            <span className='detail'>明细</span><Icon type={ detailIcon } />
          </div>
        )
      }
      {
        touristNumer.length === 0 || !isNameTel ? (<div className='footerR footerSpan'>立即下单</div>) :
        (<div className='footerR' onClick={ () => handleOrderSave(promotion, touristNumer, phone, chooseTime, name, chooseCity, checkAccient, timearr, chooseSeat, chooseArrtime, haveChooseZuo, startTime, haschecked) }>立即下单</div>)
      }
    </div>
  )
}
