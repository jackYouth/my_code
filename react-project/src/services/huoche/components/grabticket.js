import React from 'react'
import { WhiteSpace, List, Toast } from 'antd-mobile'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component' // , Calendar

import SeatTime from './SeatTime'
// import StopTime from './stoptime'
import AlternativeSpeed from './alternativespeed'

import '../style/grabticket.scss'
import '../style/card.scss'
import timeline from '../img/lineline.png'
import help from '../img/help.png'

const Item = List.Item
const Grabticket = props => {
  const { handleSelectTrain,
    chooseCity, chooseTime, handleSpeedName, chooseSpeedname,
    choosePrice, maxprice, detailsTrick = '', endDate, seatsDataGrab,
    haveChooseZuo, chooseTrain, // chooseZuowei, chooseSeat, startTime,
    searchgoGrab,
  } = props
  console.log('searchgoGrab---', searchgoGrab)
  // 加速套餐
  const handleAlternativeSpeed = () => {
    // console.log('test--handleAlternativeSpeed-', choosePrice, maxprice, haveChooseZuo, chooseTrain)
    if (haveChooseZuo.length === 0 && searchgoGrab) {
      Toast.info('请选择备选坐席', 2, null, false)
      return
    }
    Mask(
      <SlidePage target='left' showClose={ false }>
        <AlternativeSpeed maxPrice={ maxprice } choosePriceprops={ choosePrice } handleSpeedName={ (name, price) => handleSpeedName(name, price) } />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  const handleGrabText = () => {
    Mask(<GrabText />, { mask: true, style: { position: 'absolute' } })
  }
  // 截止时间
  // const handleStopTime = () => {
  //   Mask(<StopTime />, { mask: true, style: { position: 'absolute' } })
  // }
  const colorClass = { color: '#333' }
  return (
    <div className='grabTicket'>
      {
        chooseCity ? (<CardShow chooseCity={ chooseCity } chooseTime={ chooseTime } detailsTrick={ detailsTrick } endDate={ endDate } seatsDataGrab={ seatsDataGrab } />) : ('')
      }
      <WhiteSpace />
      <SeatTime propsObj={ props } colorClass={ colorClass } />
      <WhiteSpace />
      <List>
        <Item arrow='horizontal' onClick={ () => handleAlternativeSpeed() }>抢票提速<span className='itemoto'>{ chooseSpeedname ? `${ chooseSpeedname }` : `闪电抢票¥（${ maxprice > 50 ? '50' : '30' }/份）` }</span></Item>
      </List>
      <Item className='helpTips' onClick={ () => handleGrabText() }><img src={ help } alt='' /><span className='helptip'>抢票规则说明</span></Item>
      <div className='okGrabticket' onClick={ () => handleSelectTrain(choosePrice, haveChooseZuo, chooseTrain, searchgoGrab) }>立即抢票</div>
    </div>
  )
}

// <WhiteSpace />
// <List>
//   <Item arrow='horizontal' onClick={ () => handleStopTime() }>截止日期<span className='itemoto2'>2017-10-17 13:00</span></Item>
// </List>

export default Grabticket

const CardShow = ({ chooseCity, chooseTime, detailsTrick, endDate = {}, seatsDataGrab }) => {
  // console.log('chooseTime--', chooseTime, detailsTrick)
  const { from, to } = chooseCity
  if (detailsTrick) {
    const { endTime, number, startTime } = detailsTrick
    const { dateShow, weed } = endDate
    const { name } = seatsDataGrab
    return (
      <div>
        <div className='cardWrap'>
          <div className='cardItem'>
            <span className='title'>{ detailsTrick.from }</span>
            <span className='time'>{ startTime }</span>
            <span className='title checi'>{ chooseTime.dateShow }{ chooseTime.weed }</span>
          </div>
          <div className='cardItem'>
            <span className='title checi'>{ number }</span>
            <span><img src={ timeline } alt='' /></span>
            <span className='title checi'>{ name }</span>
          </div>
          <div className='cardItem'>
            <span className='title'>{ detailsTrick.to }</span>
            <span className='time'>{ endTime }</span>
            <span className='title checi'>{ dateShow }{ weed }</span>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className='cardWrap cardWrapnoUse'>
        <div className='cardItem'>
          <span className='from'>{ from }</span>
        </div>
        <div className='cardItem'>
          <span className='from'><img src={ timeline } alt='' /></span>
        </div>
        <div className='cardItem'>
          <span className='from'>{ to }</span>
        </div>
      </div>
    </div>
  )
}

const GrabText = ({ handleContainerClose }) => {
  const jiao = '->'
  return (
    <div className='GrabTextWrap'>
      <div className='gTitle'>抢票规则说明</div>
      <div className='gMain'>
        <p className='pTitle'>1. 如何抢票？</p>
        <p className='text texthe'>
          { `点击“抢票 ${ jiao } 填写抢票信息 ${ jiao } 开始抢票”，系统会自动为您刷票，
          一直刷到发车时间的前一个小时。已开售车次无票座席与未开售车次的所有座席均可抢。` }
        </p>
        <p className='pTitle'>2. 无票座席与未开售车次的所有座席均可抢。</p>
        <p className='text'>与平常购票几乎没有差别，卧铺先收取下铺价格，儿童票收取全票，抢票成功后系统会自动核算并退还差价。</p>
        <p className='text'>{ `流程二：抢票 ${ jiao } 选择指定日期 ${ jiao } 填写抢票信息 ${ jiao } 支付 ${ jiao } 开始抢票` }</p>
        <p className='pTitle'>3. 为什么需要先付款？</p>
        <p className='text'>抢票高峰时段票源紧张，排队人数过多，为避免抢票成功后因没有及时支付，错失车票。</p>
        <p className='pTitle'>4. 支付后一定能抢到票吗？</p>
        <p className='text'>不一定。选择抢票加速套餐，可以极大地提高抢票成功率。加速套餐是一种付费抢票套餐，成功率高于普通抢票。加速套餐根据票价不同，所需的费用也有所不同。</p>
        <p className='pTitle'>5. 抢票可以取消吗？抢不到是否会退款？</p>
        <p className='text'>抢票中的订单随时可以取消，取消后全额退款，退款预计2~15个工作日按原渠道退回。抢票失败后，也将全额退款。</p>
        <p className='pTitle'>6. 抢票的退款在哪儿可以查到？</p>
        <p className='text'>{ `可进入“我的订单 ${ jiao } 选择抢票失败的订单 ${ jiao } 订单有退款”中查看您的退款信息。` }</p>
        <p className='pTitle'>7. 预约抢票什么时候开始抢？</p>
        <p className='text'>火车票开售后立即开始，会持续抢到截止时间为止。</p>
        <p className='pTitle'>8. 如何知道抢票成功？</p>
        <p className='text'>抢票成功后，系统会发送通知短信到您所填的手机号码上，也可以进入app查看，抢票成功后订单状态会更新为“抢票成功”并显示已抢车票的车次与座席等信息。</p>
      </div>
      <div className='gBtn' onClick={ () => { handleContainerClose() } }>
        我知道了
      </div>
    </div>
  )
}
