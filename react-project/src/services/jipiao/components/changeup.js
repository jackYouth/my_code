import React from 'react'
import { WhiteSpace } from 'antd-mobile'
// import { Mask, SlidePage }    from '@boluome/oto_saas_web_app_component'
// import '../style/change.scss'
import Picselect from './picselect'
import '../style/changeup.scss'

// const Item = List.Item

const Changeup = changeup => {
  console.log(changeup)
  const { files = [], changeRule, nextflightData, preflightData, passengers, handleChangefiles, handleTuigai, handleSubmit } = changeup
  const ft = dt => {
    const timesplit = dt.split('-')
    const nowDate = new Date(dt.replace(/-/g, '/'))
    return timesplit.length > 0 ? `${ timesplit[1] }-${ timesplit[2] }  周${ ['日', '一', '二', '三', '四', '五', '六'][nowDate.getDay()] }` : ''
  }
  if (passengers) {
    const { changeReson, endorseOrderId } = passengers[0]
    return (
      <div className='changeup'>
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

          <p className='tip'>* 选择的原因属于非自愿退票，需要上传证明材料</p>

          <Picselect files={ files } onChangeimg={ fs => { handleChangefiles(fs) } } />
        </div>
        <div className='change_btn' onClick={ () => { handleSubmit(passengers, files, endorseOrderId) } }>
            提交改签申请
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

export default Changeup
