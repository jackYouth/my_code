import React from 'react'
import { WhiteSpace, List, InputItem, Icon } from 'antd-mobile'
import { Mask, OrderDetail, SlidePage } from '@boluome/oto_saas_web_app_component'
import { moment, setStore } from '@boluome/common-lib'
import { afterOrdering } from 'business'

// import Cardtime from './cardtime'
import Ordernotice from './ordernotice'
import ShowPromotion from './ShowPromotion'
import AccidentCom from './AccidentCom'
import PassengerInformCom from './PassengerInformCom'
import OrderRefundCom from './OrderRefundCom'
import NoticeMask from './NoticeMask'

import '../style/orderdetails.scss'
import '../style/card.scss'
import timeline from '../img/timeline.png'
import xiangyou from '../img/xiangyou.png'
import zhuyiIcon from '../img/zhuyi.svg'

const Item = List.Item
const orderDetails = props => {
  console.log('orderDetails--s-', props)
  const {
    getOrderInfo, params,
  } = props
  const orderId = params ? params.id : ''
  const handleAccidentCom = insuranceDoc => {
    Mask(
      <SlidePage target='left' showClose={ false } >
        <AccidentCom insuranceDoc={ insuranceDoc } />
      </SlidePage>
    , { mask: false, style: { position: 'absolute' } })
  }
  const OrderComponent = ({ orderDetailInfo }) => {
    const {
      contactPhone = '156****7090', id, trains, passengers = [], stops, trainNumber, contactName,
      platformActivity, coupon, status, partnerId, ticketCode,
      createdAt, refundList, price, withoutDiscountedPrice, refundCountPrice, type, insuranceDoc,
      realPrice, realPayPrice, canChangeApply, isChangeShow, channel,
    } = orderDetailInfo
    console.log('orderDetailInfo---', realPayPrice, realPrice, getOrderInfo)
    if (contactName && contactPhone) {
      setStore('huoche_name', contactName, 'session')
      setStore('huoche_phone', contactPhone, 'session')
    }
    const { arriveCity, departureCity } = trains
    const handlePointTimeCom = () => {
      Mask(<PointTime stops={ stops } from={ departureCity } to={ arriveCity } />, { mask: true, style: { position: 'absolute' } })
    }
    if (orderDetailInfo) {
      return (
        <div className='orderDetailList'>
          <WhiteSpace size='lg' />
          {
            status && status === 4 && type !== 'CHANGE' ? (<div>
              <div className='qupiaohao'>
                <p className='qupiaoText'>取票号</p>
                <p className='qupiaoId'>{ ticketCode }</p>
              </div>
              <WhiteSpace size='lg' />
            </div>) : ('')
          }
          {
            type === 'ROBTICKETS' && status !== 4 ? (<GrabMessage trains={ trains } />) : ('')
          }
          {
            type === 'ROBTICKETS' && status !== 4 ? (<div><GrabPeople passengers={ passengers } /><WhiteSpace size='lg' /></div>) : ('')
          }
          {
            type === 'CHANGE' && trains && status && status === 4 ? (<div><GrabSuccess trains={ trains } trainNumber={ trainNumber } passengers={ passengers } partnerId={ partnerId } type={ type } id={ id } handlePointTimeCom={ handlePointTimeCom } canChangeApply={ canChangeApply } isChangeShow={ isChangeShow } channel={ channel } /><WhiteSpace size='lg' /></div>) : ('')
          }
          {
            type === 'ROBTICKETS' && trains && status && (status === 4) ? (<div><GrabSuccess trains={ trains } trainNumber={ trainNumber } passengers={ passengers } partnerId={ partnerId } type={ type } id={ id } handlePointTimeCom={ handlePointTimeCom } canChangeApply={ canChangeApply } channel={ channel } /><WhiteSpace size='lg' /></div>) : ('')
          }
          {
            (type === 'CHANGE' && status !== 4 && trains) || (type === 'NORMAL' && trains) ? (<div><CardtimeOrder trains={ trains } handlePointTimeCom={ handlePointTimeCom } status={ status } trainNumber={ trainNumber } /></div>) : ''
          }
          {
            type === 'ROBTICKETS' || (type === 'CHANGE' && status === 4) ? ('') : (<div><List>
              <PassengerInform passengers={ passengers } status={ status } orderId={ id } trains={ trains } partnerId={ partnerId } type={ type } canChangeApply={ canChangeApply } isChangeShow={ isChangeShow } channel={ channel } />
            </List><WhiteSpace size='lg' /></div>)
          }
          <List className='phoneList'>
            {
              contactName ? (<InputItem value={ `${ contactName }` } editable={ false }>联系人</InputItem>) : ('')
            }
            {
              contactPhone ? (<InputItem value={ `${ contactPhone.slice(0, 3) } **** ${ contactPhone.slice(-4) }` } editable={ false }>手机号</InputItem>) : ('')
            }
          </List>
          <WhiteSpace size='lg' />
          {
            insuranceDoc && insuranceDoc.length > 0 ? (<div><List><Item arrow='horizontal' onClick={ () => handleAccidentCom(insuranceDoc) }><span>{ insuranceDoc[0].insuranceName }</span><span style={{ marginLeft: '20px' }}>{ `¥${ insuranceDoc[0].price }／份 x ${ insuranceDoc[0].venders.length }` }</span></Item></List><WhiteSpace size='lg' /></div>) : ''
          }
          {
            platformActivity || coupon || status ? (<ShowPromotion passengers={ passengers } trains={ trains } realPayPrice={ realPayPrice } platformActivity={ platformActivity } coupon={ coupon } price={ price } withoutDiscountedPrice={ withoutDiscountedPrice } insuranceDoc={ insuranceDoc } />) : ''
          }
          {
            refundList && refundList.length > 0 ? (<OrderRefundCom refundList={ refundList } refundCountPrice={ refundCountPrice } withoutDiscountedPrice={ withoutDiscountedPrice } />) : ''
          }
          <List>
            <Item extra={ id }>订单编号</Item>
            <Item extra={ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }>下单时间</Item>
          </List>
          <WhiteSpace />
        </div>
      )
    }
  }
  return (
    <div className='orderDetailsWrap'>
      <OrderDetail
        content={ <OrderComponent /> }
        id={ orderId }
        orderType='huoche'
        goPay={ () => afterOrdering({ id: orderId }) }
      />
    </div>
  )
}

export default orderDetails

// 车票信息展示卡片部分
const CardtimeOrder = ({ trains, trainNumber, handlePointTimeCom, status }) => {
  const { arriveCity, arriveDate, arriveTime, departureCity, departureDate, departureTime, duration, seatName, facePrice } = trains
  const seatsChoose = {
    name:  seatName,
    price: facePrice,
  }
  const handleNoticeMask = () => {
    Mask(
      <SlidePage target='right' showClose={ false } >
        <NoticeMask />
      </SlidePage>
    , { mask: false, style: { position: 'absolute' } })
  }
  if (status === 4) {
    return (
      <div className='newcardWrap'>
        <Item extra={ <span className='grabXuzhi' onClick={ () => handleNoticeMask() }><Icon type={ zhuyiIcon } />预定须知</span> } style={{ background: 'rgba(255, 171, 0, 0.05)' }}><span style={{ color: 'rgba(255, 171, 0, 0.05)' }}>空</span></Item>
        <div className='cardWrap cardWrapsuccessNew' style={{ background: 'rgba(255, 171, 0, 0.05)' }}>
          <div className='cardItem'>
            <span className='title'>{ departureCity }</span>
            <span className='time'>{ departureTime }</span>
            <span className='title checi'>{ departureDate }</span>
          </div>
          <div className='cardItem'>
            <span className='title checi'>{ trainNumber }</span>
            <span onClick={ () => { handlePointTimeCom() } }><img src={ timeline } alt='' /></span>
            <span className='title'>{ duration }</span>
          </div>
          <div className='cardItem'>
            <span className='title'>{ arriveCity }</span>
            <span className='time'>{ arriveTime }</span>
            <span className='title checi'>{ arriveDate }</span>
          </div>
        </div>
        <Item style={{ background: 'rgba(255, 171, 0, 0.05)' }} />
      </div>
    )
  }
  return (
    <div>
      <div className='cardWrap'>
        <div className='cardItem'>
          <span className='title'>{ departureCity }</span>
          <span className='time'>{ departureTime }</span>
          <span className='title checi'>{ departureDate }</span>
        </div>
        <div className='cardItem'>
          <span className='title checi'>{ trainNumber }</span>
          <span onClick={ () => { handlePointTimeCom() } }><img src={ timeline } alt='' /></span>
          <span className='title'>{ duration }</span>
        </div>
        <div className='cardItem'>
          <span className='title'>{ arriveCity }</span>
          <span className='time'>{ arriveTime }</span>
          <span className='title checi'>{ arriveDate }</span>
        </div>
      </div>
      <Ordernotice seatsChoose={ seatsChoose } status={ status } />
      <WhiteSpace size='lg' />
    </div>
  )
}
// 车票展示的停靠站点
const PointTime = ({ stops, from, to }) => {
  return (
    <div className='pointTime'>
      <p className='title'>时刻表</p>
      <div className='menu'>
        <span>到站</span>
        <span className='menuSpanMid'>到达</span>
        <span className='menuSpanMid'>发车</span>
        <span className='menuSpanLast'>停留</span>
      </div>
      <div className='list'>
        {
          stops.map(item => (
            <div className={ `item ${ from === item.name || to === item.name ? 'itemOrgan' : '' }` } key={ `${ item.name + item.arriveTime }` }>
              <span>{ item.name }</span>
              <span className='menuSpanMid'>{ item.arriveTime }</span>
              <span className='menuSpanMid'>{ item.startTime }</span>
              <span className='menuSpanLast'>{ item.stopTime }</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}

// 待支付状态时----> 乘客信息的展示
const PassengerInform = ({ passengers = [], status, orderId, trains, partnerId, type, canChangeApply, isChangeShow, channel }) => {
  return (
    <div className='PassengerWrap'>
      {
        status && (status === 4 || status === 13 || status === 15) ? (<PassengerInformCom status={ status } passengers={ passengers } orderId={ orderId } trains={ trains } partnerId={ partnerId } type={ type } canChangeApply={ canChangeApply } isChangeShow={ isChangeShow } channel={ channel } />) : (<Item>
          <div className='passengerL'>乘客</div>
          <div className='passengerR'>
            {
              passengers.map(i => (
                <div className='passenger' key={ i.credentialCode + i.name }><span>{ i.name }</span><span>{ `${ i.credentialCode.slice(0, 4) } ******** ${ i.credentialCode.slice(-3) }` }</span></div>
              ))
            }
          </div>
        </Item>)
      }
    </div>
  )
}

// 抢票展示部分
const GrabMessage = ({ trains }) => {
  const { acceptSeat, allTrainNumber, acceptDate, arriveDate, arriveCity, departureCity } = trains
  console.log('arriveDate---', arriveDate)
  let time = ''
  if (arriveDate) {
    time = arriveDate
  }
  return (
    <div className='grabmessageWrap'>
      <div className='StationWrap'>
        <div className='from otoft'>{ departureCity }</div>
        <div className='myimg'><span className='mytext'>{ `${ time }` }</span><img src={ xiangyou } alt='' /></div>
        <div className='to otoft'>{ arriveCity }</div>
      </div>
      <div className='grabStation'>
        <div className='item_station'><span className='itemS itemS_t'>已选车次：</span>
          <div className='item_checi'>
            {
              allTrainNumber.map(i => (
                <span key={ i }>{ i }</span>
              ))
            }
          </div>
        </div>
        <div className='item_station'><span className='itemS'>已选坐席：</span>
          {
            acceptSeat.map(i => (
              <span key={ i }>{ i }</span>
            ))
          }
        </div>
        <div className='item_station'><span className='itemS itemS_t'>已选时间：</span>
          <div className='item_time'>
            {
              acceptDate.map(o => (
                <span key={ o }>{ o }</span>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
// 抢座人员
const GrabPeople = ({ passengers }) => {
  return (
    <div>
      {
        passengers && passengers.map(o => (
          <div className='grabpeopleWrap' key={ `${ o.credentialCode + o.name }` }>
            <div className='item_people'><span className='name'>{ o.name }</span><span className='type'>{ o.passengerType }</span></div>
            <div className='item_people'><span className='name'>身份证</span><span>{ `${ o.credentialCode.slice(0, 4) } ******** ${ o.credentialCode.slice(-3) }` }</span></div>
          </div>
        ))
      }
    </div>
  )
}
// 抢票成功之后展示
const GrabStationShow = ({ trains, handlePointTimeCom }) => {
  const { arriveCity, arriveTime, departureTime, trainNumber, departureCity, departureDate, arriveDate, duration } = trains
  console.log('--test---', trains)
  return (
    <div className='grabstationShow'>
      <div className='oto'><span>{ departureCity }</span><span>{ departureTime }</span><span>{ departureDate }</span></div>
      <div className='myimg'><span>{ trainNumber }</span><img className='orderImg' src={ timeline } onClick={ () => { handlePointTimeCom() } } alt='' /><span className='title'>{ duration }</span></div>
      <div className='oto'><span>{ arriveCity }</span><span>{ arriveTime }</span><span>{ arriveDate }</span></div>
    </div>
  )
}
const GrabSuccess = ({ trains, trainNumber, passengers, partnerId, type, id, handlePointTimeCom, canChangeApply, isChangeShow, channel }) => {
  console.log('---trainNumber---', trainNumber)
  const handleNoticeMask = () => {
    Mask(
      <SlidePage target='right' showClose={ false } >
        <NoticeMask />
      </SlidePage>
    , { mask: false, style: { position: 'absolute' } })
  }
  return (
    <div className='grabSuccessWrap'>
      <Item extra={ <span className='grabXuzhi' onClick={ () => handleNoticeMask() }><Icon type={ zhuyiIcon } />预定须知</span> } style={{ background: 'rgba(255, 171, 0, 0.05)' }}><span style={{ color: 'rgba(255, 171, 0, 0.05)' }}>空</span></Item>
      <GrabStationShow trains={ trains } handlePointTimeCom={ handlePointTimeCom } />
      <Item style={{ background: 'rgba(255, 171, 0, 0.05)' }} />
      <PassengerInformCom orderId={ id } passengers={ passengers } trains={ trains } trainNumber={ trainNumber } partnerId={ partnerId } type={ type } canChangeApply={ canChangeApply } isChangeShow={ isChangeShow } channel={ channel } />
    </div>
  )
}

// <div className='grabSuccessWrap'>
//   <Item extra={ <span className='grabXuzhi'><Icon type={ zhuyiIcon } />预定须知</span> } style={{ background: 'rgba(255, 171, 0, 0.05)' }}><span style={{ color: 'rgba(255, 171, 0, 0.05)' }}>空</span></Item>
//   <GrabStationShow trains={ trains } />
//   <Item style={{ background: 'rgba(255, 171, 0, 0.05)' }} />
//   <PassengerInformCom orderId={ id } passengers={ passengers } trains={ trains } trainNumber={ trainNumber } partnerId={ partnerId } type={ type } />
// </div>
