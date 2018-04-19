import React from 'react'
import { Icon, Picker, List, WhiteSpace } from 'antd-mobile'
import { Mask, SlidePage, Calendar }    from '@boluome/oto_saas_web_app_component'
// import Picselect from './picselect'
import '../style/change.scss'
import '../style/air.scss'

const Item = List.Item

const Change = change => {
  console.log(change)
  const { changeRule, nextflightData, preflightData, showflightData, handleTime, passengers, refundCauseId, changeArr, handleTuigai, handleChangeflight, handlerefundCauseId, handleChoose, handleSubmit } = change
  const timesplit = preflightData ? preflightData.departureDate.split('-') : []
  const nowDate = preflightData ? new Date(preflightData.departureDate.replace(/-/g, '/')) : ''
  const nowShow = timesplit.length > 0 ? `${ timesplit[1] }-${ timesplit[2] }  周${ ['日', '一', '二', '三', '四', '五', '六'][nowDate.getDay()] }` : ''
  return (
    <div className='change'>
      <div className='change_main'>
        <p className='top'>选择改签乘客<span onClick={ () => { handleTuigai(changeRule) } }>退改签规则</span></p>
        <div>
          {
            passengers && passengers.map((e, i) => <div key={ `id${ e.credentialCode }` } style={ e.isChange ? {} : { display: 'none' } } className='passenger_list' onClick={ () => handleChoose(i, passengers) }><span className={ e.choose ? 'choose' : '' }><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span><p>乘客<span>{ e.name }</span><span>{ `${ e.credentialCode.slice(0, 4) } ******** ${ e.credentialCode.slice(-3) }` }</span></p></div>)
          }
        </div>

        <WhiteSpace size='lg' />

        <Picker title={ '改签原因' } data={ changeArr } cols={ 1 } onChange={ res => { handlerefundCauseId(res) } } value={ refundCauseId }>
          <Item arrow='horizontal'>改签原因</Item>
        </Picker>

        <WhiteSpace size='lg' />

        <p className='top'>选择改签航班</p>
        <div className='flights'>
          { preflightData && <div className='pre' onClick={ () => Mask(
            <SlidePage target='right' showClose={ false } >
              <Selecttime handleChangeflight={ handleChangeflight } handleTime={ handleTime } />
            </SlidePage>,
            { mask: false, style: { position: 'absolute' } }
          )
          }
          ><p><span style={ nextflightData ? { color: '#666666', border: '.01rem solid #666666' } : {} }>原航班</span>{ nowShow } { preflightData.carrierName } { preflightData.cabinType }</p><Icon type={ require('svg/jipiao/arrowrightd.svg') } /></div> }
          { nextflightData && <div className='pre'><p><span>改签至</span>{ nextflightData.departureDate } { `${ nextflightData.carrierName }  ${ nextflightData.flightNum }` } { nextflightData.cabinType }</p></div> }
        </div>
        { showflightData && <Card info={ nextflightData || showflightData } /> }
      </div>
      <div className='change_btn' onClick={ () => handleSubmit(passengers, nextflightData, changeArr) }>提交改签申请</div>
    </div>
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

// 改签查询组件
export const Changeinfo = props => {
  console.log(props)
  const { handleContainerClose, data, sub, credentialCodes, changeArr } = props
  const { changeFees, upgradeFee, barePrice } = data
  return (
    <div className='changeInfo'>
      <div className='changeCard'>
        <h2>确认改签</h2>
        <h3>改签费用明细</h3>
        <div className='pricelist'>
          <p><span>升舱费</span><span>¥{ upgradeFee * credentialCodes.length }</span></p>
          <p><span>改签手续费</span><span>¥{ changeFees * credentialCodes.length }</span></p>
        </div>
        <p>需支付金额<span>¥{ barePrice * credentialCodes.length }</span></p>
        <p className='tip'>温馨提示：确认改签后将无法取消，请您谨慎操作；改签成功后您之前购买的保险将自动退保，退款会在1-5个工作日内退回您的支付账户。</p>
        <div className='changebtn'>
          <div className='cancel' onClick={ () => { handleContainerClose() } }>取消</div>
          <div className='sure' onClick={ () => { sub(credentialCodes, data, changeArr); handleContainerClose() } }>确定</div>
        </div>
      </div>
    </div>
  )
}

// 日历取消组件
const Selecttime = props => {
  const { handleContainerClose, handleTime, calenderdata, handleChangeflight } = props
  return (
    <Calendar pricearr={ calenderdata || [] } onChange={ res => { handleTime(res.date, handleContainerClose, handleChangeflight) } } />
  )
}

export default Change
