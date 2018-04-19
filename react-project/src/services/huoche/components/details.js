import React from 'react'
import { WhiteSpace, List } from 'antd-mobile'

import Timelist from './timelist'
import Cardtime from './cardtime'

import '../style/details.scss'
import notrain from '../img/notrain.png'

const Item = List.Item
const Details = props => {
  const {
    goOrderFn, ticketDetails,
    onChangeTime, chooseTime,
    seatsData, goGrabticket,
    ChangeSign, noSeats,
  } = props
  console.log('goGrabticket---test-', goGrabticket, '--canBuyTicket--', ticketDetails, '-seatsData--', seatsData)
  let isShowBuyTicket = true
  if (ticketDetails && ticketDetails.canBuyTicket) {
    isShowBuyTicket = ticketDetails.canBuyTicket
  }
  return (
    <div className='detailsWrap'>
      <div className='details'>
        {
          ticketDetails ? (<Cardtime UserComponent={ <Timelist chooseTime={ chooseTime } onChangeTime={ onChangeTime } /> } ticketDetails={ ticketDetails } chooseTime={ chooseTime } />) : ''
        }
      </div>
      {
        isShowBuyTicket ? (<WhiteSpace />) : (<TipCom />)
      }
      {
        noSeats ? (
          <SeatsCom
            goOrderFn={ goOrderFn }
            ticketDetails={ ticketDetails }
            seatsData={ seatsData }
            goGrabticket={ goGrabticket }
            ChangeSign={ ChangeSign }
            isShowBuyTicket={ isShowBuyTicket }
          />
        ) : (<Noseatcom />)
      }

    </div>
  )
}

export default Details

// 没有坐席的时候展示
const Noseatcom = () => {
  return (
    <div className='NoseatcomWrap'><img src={ notrain } alt='' /><p className='Noseatcom'>列车运行图调整，暂停发售</p></div>
  )
}

// 停售提示
const TipCom = () => {
  const tipStyle = {
    padding:  '20px 32px',
    color:    '#ffab00',
    fontSize: '0.24rem',
  }
  return (
    <p style={ tipStyle }>距离该车次发车时间过近，已停止网络预订。如急需买票，可持有效证件去车站售票窗口办理。</p>
  )
}

const SeatsCom = ({ goOrderFn, ticketDetails, seatsData = [], goGrabticket, ChangeSign, isShowBuyTicket }) => {
  console.log('qqqq', ChangeSign, '---isShowBuyTicket--', isShowBuyTicket)
  if (ticketDetails && seatsData) {
    // const { seats, ts = '' } = ticketDetails
    // console.log(ticketDetails, seatsData)
    return (
      <List>
        {
          seatsData.map(item => (
            <Item className='seatsItem' key={ `${ item.name }` }>
              <span className='seatName'>{ item.name }</span>
              {
                item.saleDateTime ? (<span className='saleDateTime'>{ item.saleDateTime }</span>) : (<span className='seatNumber'>{ item.yupiao <= 0 ? '无票' : `${ item.yupiao }张` }</span>)
              }
              {
                isShowBuyTicket ? (
                  <IsShowBuyTicket
                    item={ item }
                    goOrderFn={ goOrderFn }
                    ticketDetails={ ticketDetails }
                    seatsData={ seatsData }
                    goGrabticket={ goGrabticket }
                    ChangeSign={ ChangeSign }
                  />
                ) : (<span className='seatOrder noChange'>停售</span>)
              }
              <span className='seatPrice'>¥{ item.price }</span>
            </Item>
          ))
        }
      </List>
    )
  }
  return (<div />)
}

// 是否可以购买
const IsShowBuyTicket = ({ item, goOrderFn, ticketDetails, goGrabticket, ChangeSign }) => {
  return (
    <div style={{ display: 'inline' }}>
      {
        item.saleDateTime ? (<span className='seatOrder' onClick={ () => goGrabticket(ticketDetails, item) }>预约</span>) : (!ChangeSign || ChangeSign.indexOf('ChangeSign') < 0 ? (item.yupiao <= 0 ? (<span className='seatOrder noSeat' onClick={ () => goGrabticket(ticketDetails, item) }>抢票</span>) :
        (<span className='seatOrder' onClick={ () => { goOrderFn(item, ChangeSign) } }>预定</span>)) : (item.yupiao <= 0 ? (<span className='seatOrder noChange'>无票</span>) :
        (<span className='seatOrder' onClick={ () => { goOrderFn(item, ChangeSign) } }>改签</span>)))
      }
    </div>
  )
}
