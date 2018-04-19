import React from 'react'
import { getStore } from '@boluome/common-lib'
import { send } from 'business'
import { Icon, Picker, List, WhiteSpace, Toast } from 'antd-mobile'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import Picselect from './picselect'
import '../style/refund.scss'

const Item = List.Item

const Refund = refund => {
  console.log(refund)
  const { files = [], isVoluntary, credentialCodes, changeRule, passengers, refundCauseId, refundArr, orderNo, handlerefundCauseId, handleChoose, handleRefund, handleTuigai, handleChangefiles } = refund
  return (
    <div className='refund'>
      <div className='refund_main'>
        <p className='top'>选择退票乘客<span onClick={ () => { handleTuigai(changeRule) } }>退改签规则</span></p>
        <div>
          {
            passengers && passengers.map((e, i) => <div key={ `id${ e.credentialCode }` } style={ e.isRefund ? {} : { display: 'none' } } className='passenger_list' onClick={ () => handleChoose(i, passengers) }><span className={ e.choose ? 'choose' : '' }><Icon type={ e.choose ? require('svg/jipiao/choose.svg') : '' } /></span><p>乘客<span>{ e.name }</span><span>{ `${ e.credentialCode.slice(0, 4) } ******** ${ e.credentialCode.slice(-3) }` }</span></p></div>)
          }
        </div>

        <WhiteSpace size='lg' />

        <Picker title={ '退票原因' } data={ refundArr } cols={ 1 } onChange={ res => { handlerefundCauseId(res, credentialCodes) } } value={ refundCauseId }>
          <Item arrow='horizontal'>退票原因</Item>
        </Picker>

        { !isVoluntary ? <p className='tip' style={{ background: '#ffffff' }}>* 选择的原因属于非自愿退票，需要上传证明材料</p> : <p className='tip'>* 选择的原因属于自愿退票，按退改签费用标准给您退款</p>}

        { !isVoluntary && <Picselect files={ files } onChangeimg={ fs => { handleChangefiles(fs) } } /> }
      </div>
      <div className='refund_btn' onClick={ () => handleRefund(passengers, refundArr, files, isVoluntary, orderNo) }>提交退票申请</div>
    </div>
  )
}

export const Refundinfo = props => {
  const { handleContainerClose, datas, passengers, refundArr, files, orderNo } = props
  const { isEffective, insurance = [], refundFee, returnRefundFee, passengerIds, ticketPrice, constructionFee, fuelTax, isVoluntary } = datas
  let imgarr = []
  if (!isVoluntary) {
    imgarr = files.reduce((arr, e) => {
      arr.push(e.url)
      return arr
    }, [])
  }
  let index = 0
  for (let i = 0; i < refundArr.length; i++) {
    if (refundArr[i].value === getStore('refundCauseId', 'session')) {
      index = i
    }
  }
  const baoxianpri = isEffective ? 0 : insurance.reduce((num, e) => {
    num += e.passengerCount * e.price
    return num
  }, 0)
  const handleSubmit = (Ids, pass, imgs, refundFees, nextRefundFees) => {
    const closeLoading = Loading()
    const credentialCodes = pass.reduce((arr, e) => {
      if (e.choose) { arr.push(e.credentialCode) }
      return arr
    }, [])
    if (credentialCodes.length > 0) {
      send('/jipiao/v1/refund/apply', {
        channel:            getStore('channel', 'session'),
        refundCauseId:      getStore('refundCauseId', 'session'),
        refundCause:        refundArr[index].label,
        passengerIds:       Ids,
        credentialCodes,
        orderNo:            getStore('refundOrderNo', 'session'),
        refundFee:          nextRefundFees,
        cancellationCharge: refundFees,
        imgs,
      })
      .then(({ code, data, message }) => {
        console.log(data)
        closeLoading()
        if (code === 0 || code === 3000) {
          handleContainerClose()
          browserHistory.push(`/jipiao/orderDetails/${ orderNo }`)
        } else {
          Toast.info(message, 1)
        }
      })
    } else {
      Toast.info('请选择乘客', 1)
    }
  }
  return (
    <div className='refundInfo'>
      <div className='refundCard'>
        <h2>确认退票</h2>
        <h3>退票费用明细</h3>
        <div className='pricelist'>
          <p><span>机票价</span><span>¥{ ticketPrice * passengerIds.length }</span></p>
          <p><span>机建+燃油</span><span>¥{ (constructionFee + fuelTax) * passengerIds.length }</span></p>
          <p><span>退票手续费</span><span>-¥{ refundFee * passengerIds.length }</span></p>
          {
            insurance.map(e => <p key={ `id${ e.insuranceName }` } style={ isEffective ? { textDecoration: 'line-through', color: '#cccccc' } : {} }><span>{ isEffective ? `${ e.insuranceName }已生效不可退` : e.insuranceName }</span><span>¥{ e.passengerCount * e.price }</span></p>)
          }
        </div>
        <p>实际退款<span>¥{ returnRefundFee + baoxianpri }</span></p>
        <p className='tip'>温馨提示：确认退票后将无法取消，请您谨慎操作；退票成功后退款会在1-5个工作日内退回您的支付账户</p>
        <div className='refundbtn'>
          <div className='cancel' onClick={ () => { handleContainerClose() } }>取消</div>
          <div className='sure' onClick={ () => { handleSubmit(passengerIds, passengers, imgarr, refundFee, returnRefundFee) } }>确定</div>
        </div>
      </div>
    </div>
  )
}

export default Refund
