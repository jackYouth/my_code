import React from 'react'
import { Icon, WhiteSpace } from 'antd-mobile'
import { Mask, SlidePage }    from '@boluome/oto_saas_web_app_component'
// import '../style/change.scss'
import '../style/changeord.scss'

// const Item = List.Item

const Changeord = changeord => {
  console.log(changeord)
  const { changeRule, nextflightData, preflightData, passengers, handleTuigai, handleSubmit } = changeord
  const ft = dt => {
    const timesplit = dt.split('-')
    const nowDate = new Date(dt.replace(/-/g, '/'))
    return timesplit.length > 0 ? `${ timesplit[1] }-${ timesplit[2] }  周${ ['日', '一', '二', '三', '四', '五', '六'][nowDate.getDay()] }` : ''
  }
  if (passengers) {
    const { changeReson, totalFee, endorseOrderId } = passengers[0]
    return (
      <div className='changeord'>
        <div className='change_main'>
          <p className='top'>已选乘客<span onClick={ () => { handleTuigai(changeRule) } }>退改签规则</span></p>
          <div>
            {
              passengers && passengers.map(e => <div key={ `id${ e.credentialCode }` } className='passenger_list'><p><span>{ e.name }</span><span>{ `${ e.credentialCode.slice(0, 4) } ******** ${ e.credentialCode.slice(-3) }` }</span></p></div>)
            }
          </div>

          <WhiteSpace size='lg' />

          <p className='change_bec'><span>改签原因</span><span>{ changeReson }</span></p>

          <WhiteSpace size='lg' />

          <div className='flights'>
            <div className='pre'><p><span style={{ border: '1px solid #999999', color: '#999999' }}>原航班</span>{ ft(preflightData.departureDate) } { preflightData.carrierName } { preflightData.cabinType }</p></div>
            <div className='pre'><p><span>改签至</span>{ ft(nextflightData.departureDate) } { `${ nextflightData.carrierName }  ${ nextflightData.flightNum }` } { nextflightData.cabinType }</p></div>
          </div>
          <Card info={ nextflightData } />
          <p className='tip'>温馨提示：请您在15分钟内完成支付</p>
        </div>
        <div className='change_btn'>
          <div className='orderPrice'>
            <div>
              <p>需付款：<i>¥{ totalFee.toFixed(2) }</i></p>
            </div>
            <p onClick={ () => {
              Mask(
                <SlidePage target='right' type='root' showClose={ false }>
                  <Pridetail pasdata={ passengers } />
                </SlidePage>, { mask: false }
              )
            } }
            >明细<Icon type={ require('svg/jipiao/mingxi.svg') } /></p>
          </div>
          <span className='orderbtn' onClick={ () => { handleSubmit(endorseOrderId) } }>
            立即支付
          </span>
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}

// 卡片式
const Card = ({ info }) => {
  const { departureTime, departureAirport, arrivalTime, arrivalAirport, duration, isStop } = info
  return (
    <div className='detailCart'>
      <div className='cart_main'>
        <div>
          <h3>{ departureTime }</h3>
          <p>{ departureAirport }</p>
        </div>
        <div className='cart_mainmid'>
          <p>{ duration }</p>
          <p>{ isStop ? '停' : ''}</p>
        </div>
        <div>
          <h3>{ arrivalTime }</h3>
          <p>{ arrivalAirport }</p>
        </div>
      </div>
    </div>
  )
}

// 费用明细
const Pridetail = props => {
  const { handleContainerClose, pasdata } = props
  const { changeFee, upgradeFee, totalFee } = pasdata[0]
  return (
    <div className='pridetail'>
      <fieldset>
        <legend>费用明细</legend>
      </fieldset>
      <h2>¥{ (totalFee * pasdata.length).toFixed(2) }</h2>
      <div className='main_pri'>
        <p><span>升舱费</span><span>¥{ upgradeFee } <i>x { pasdata.length }人</i></span></p>
        <p><span>改签手续费</span><span>¥{ changeFee } <i>x { pasdata.length }人</i></span></p>
      </div>
      <div className='closebtn'>
        <p><Icon onClick={ () => { handleContainerClose() } } type={ require('svg/jipiao/close.svg') } /></p>
      </div>
    </div>
  )
}

export default Changeord
