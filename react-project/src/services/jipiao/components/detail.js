import React from 'react'
import { Icon } from 'antd-mobile'
import '../style/detail.scss'

const Detail = detail => {
  // console.log(detail)
  const { info, handlePricing, goOrder } = detail
  if (info) {
    return (
      <div className='detail'>
        <Card info={ info } />
        <div className='carbinlistWrap'>
          {
            info.priceList.map((e, i) => <Carbin key={ `${ e.cabinType }${ i + 1 }` } carbinInfo={ e } handlePricing={ handlePricing } index={ i } goOrder={ goOrder } info={ info } />)
          }
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}

const Card = ({ info }) => {
  const { flightTypeFullName, departureTime, depAirport, depTerminal, departureDate, flightTimes, arriveTime, arrAirport, arrTerminal, arriveDate, airlineName, flightNum, correct, meal, stop } = info
  return (
    <div className='detailCart'>
      <div className='cart_main'>
        <div>
          <p>{ departureDate }</p>
          <h3>{ departureTime }</h3>
          <p>{ depAirport }{ depTerminal }</p>
        </div>
        <div className='cart_mainmid'>
          <p>{ flightTimes }</p>
          <p>{ stop ? '停' : ''}</p>
        </div>
        <div>
          <p>{ arriveDate }</p>
          <h3>{ arriveTime }</h3>
          <p>{ arrAirport }{ arrTerminal }</p>
        </div>
      </div>
      <p>{ `${ airlineName }${ flightNum }   ${ flightTypeFullName }  准点率${ correct }  ${ meal ? '提供餐食' : '' }` }</p>
    </div>
  )
}

const Carbin = ({ carbinInfo, handlePricing, info, goOrder, index }) => {
  const { bkParams, cabinType, discount } = carbinInfo
  return (
    <div className='carbin_list'>
      <div>
        <h3>¥{ bkParams.barePrice }</h3>
        <p><span style={{ marginRight: '0.2rem' }}>{ cabinType }{ discount ? `${ discount }折` : '' }</span><span onClick={ () => { handlePricing(info, carbinInfo) } }>退改签规则</span><Icon type={ require('svg/jipiao/arrowRight.svg') } /></p>
      </div>
      <div className='btn' onClick={ () => { goOrder(info, carbinInfo, index) } }>
        预订
      </div>
    </div>
  )
}

export const Tuigaiqian = props => {
  const { handleContainerClose, data } = props
  console.log(data)
  const { signText, discription, changeFee = [], refundFee = [] } = data
  return (
    <div className='Tuigaiqian'>
      <h1>退改签规则</h1>
      <h2>成人退改签说明</h2>
      <div className='tuigaili'>
        <div>
          改签费
        </div>
        <div>
          {
            changeFee.map(e => <p key={ `${ e.time }${ e.fee }` }><span>{ e.time }</span><span>{ e.fee }</span></p>)
          }
        </div>
      </div>
      <div className='tuigaili'>
        <div>
          退票费
        </div>
        <div>
          {
            refundFee.map(e => <p key={ `${ e.time }${ e.fee }` }><span>{ e.time }</span><span>{ e.fee }</span></p>)
          }
        </div>
      </div>
      <div className='tuigaili'>
        <div>
          详情
        </div>
        <div>
          <p dangerouslySetInnerHTML={{ __html: discription }} />
        </div>
      </div>
      <div className='tuigaili'>
        <div>
          签转
        </div>
        <div>
          <p style={{ whiteSpace: 'nowrap' }}>{ signText }</p>
        </div>
      </div>
      <p>以上均为乘客资源退改签规则，非自愿退改签规则以可适用法律及航空公司规定为准。航空公司规定以各航空公司官方网站的公式为准。</p>
      <p>折扣说明：经济舱折扣以标准经济舱全价为基础计算得出。</p>
      <p>申请改签：同舱位变更时，如变更前后的票面价之间存在差价，需不足差价；如同时存在改期手续费和升舱费，则需同时收取改期手续费和仓位差额。</p>
      <div className='closebtn'>
        <p><Icon onClick={ () => { handleContainerClose() } } type={ require('svg/jipiao/close.svg') } /></p>
      </div>
    </div>
  )
}

export default Detail
