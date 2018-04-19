import React from 'react'
import { WhiteSpace } from 'antd-mobile'
// import { Mask, SlidePage }    from '@boluome/oto_saas_web_app_component'
// import '../style/change.scss'
import Picselect from './picselect'
import '../style/refundup.scss'

// const Item = List.Item

const Refundup = refundup => {
  console.log(refundup)
  const { files = [], changeRule, passengers, handleChangefiles, handleTuigai, handleSubmit } = refundup
  if (passengers) {
    const { refundReason } = passengers[0]
    return (
      <div className='refundup'>
        <div className='change_main'>
          <p className='top'>已选乘客<span onClick={ () => { handleTuigai(changeRule) } }>退改签规则</span></p>
          <div>
            {
              passengers && passengers.map(e => <div key={ `id${ e.credentialCode }` } className='passenger_list'><p><span>{ e.name }</span><span>{ `${ e.credentialCode.slice(0, 4) } ******** ${ e.credentialCode.slice(-3) }` }</span></p></div>)
            }
          </div>

          <WhiteSpace size='lg' />

          <p className='change_bec'><span>退票原因</span><span>{ refundReason }</span></p>

          <p className='tip'>* 选择的原因属于非自愿退票，需要上传证明材料</p>

          <Picselect files={ files } onChangeimg={ fs => { handleChangefiles(fs) } } />
        </div>
        <div className='change_btn' onClick={ () => { handleSubmit(passengers, files) } }>
            提交退票申请
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}


export default Refundup
