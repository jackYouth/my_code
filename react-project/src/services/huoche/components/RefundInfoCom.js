import React from 'react'
import { Toast } from 'antd-mobile'
import { getStore } from '@boluome/common-lib'
import { Loading, Mask } from '@boluome/oto_saas_web_app_component'
import { get, send } from 'business'

import '../style/RefundInfoCom.scss'

import closeIcon from '../img/close.png'
// const Item = List.Item
const timeOut = ''
class RefundInfoCom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
    this.handleRefundText = this.handleRefundText.bind(this)
    this.handleRefundDetails()
    console.log('------props-props-props-------', props)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  componentWillUnmount() {
    clearTimeout(timeOut)
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  }
  onChange() {
    console.log('onChange')
  }
  handleRefundText() {
    const handleClose = Loading()
    const { orderId, ChooseCredentialarr = [], type, peoplearr, partnerId } = this.props
    console.log('handleRefundText----type', type, 'ChooseCredentialarr---', ChooseCredentialarr, 'orderId--', orderId)
    console.log(this.state)
    const channel = getStore('huoche_channel', 'session')
    if (type && type === 'CHANGE') {
      const refundtextUrl = '/huoche/v1/change/refund/apply'
      const sendData = {
        id:              orderId,
        credentialCodes: ChooseCredentialarr,
        channel,
      }
      send(refundtextUrl, sendData).then(reply => {
        const { code, data, message } = reply
        if (code === 0) {
          console.log('handleRefundText-改签', data)
          Mask.closeAll()
          location.hash = ''
          window.location.reload()
        } else {
          Toast.info(message, 3)
        }
        handleClose()
      })
    } else {
      const refundtextUrl = '/huoche/v1/ticket/refund'
      const sendData = {
        partnerId,
        channel,
        passengerIds: peoplearr.map(item => item.id),
      }
      send(refundtextUrl, sendData).then(reply => {
        const { code, data, message } = reply
        if (code === 0) {
          console.log('handleRefundText-正常退票', data)
          Mask.closeAll()
          location.hash = ''
          window.location.reload()
        } else {
          Toast.info(message, 3)
        }
        handleClose()
      })
    }
  }
  // 退款明细 查明
  handleRefundDetails() {
    const handleClose = Loading()
    const { orderId, peoplearr } = this.state
    const channel = getStore('huoche_channel', 'session')
    const refundtextUrl = `/huoche/v1/refund/${ orderId }/info`
    const passengerCount = peoplearr.length
    const passengerIds = peoplearr.map(e => e.id)
    // console.log('handleRefundDetails-退款明细-', peoplearr, passengerIds)
    const sendData = {
      channel,
      passengerCount,
      passengerIds,
    }
    get(refundtextUrl, sendData).then(reply => {
      const { code, data, message } = reply
      if (code === 0) {
        this.setState({
          refundData: data,
        })
      } else {
        Toast.info(message, 3)
      }
      handleClose()
    })
  }
  render() {
    const { handleContainerClose, refund, ChooseCredentialarr, passengers = [], refundData } = this.state
    console.log('RefundInfoCom-passengers--', passengers, refundData, refund, ChooseCredentialarr)
    if (refundData) {
      const { coupon, estimatedAmount, facePrice, platformActivity, refundFee, withoutDiscountedPrice } = refundData
      return (
        <div className='refundinfoWrap'>
          <div className='main'>
            <div className='title'>{ refund ? '退款明细' : '确认退票' }</div>
            {
              refund ? (<p className='miniPrice'><i>¥</i>{ facePrice }</p>) : (<p className='miniTitle'>退票费用明细</p>)
            }
            <p><span>车票价</span><span className='spanR'>¥{ facePrice }</span></p>
            <p className='thoughSpan'><span>手续费不可退</span><span className='spanR'>¥{ withoutDiscountedPrice }</span></p>
            <p><span>预计退票手续费</span><span className='hongColor'>¥{ refundFee }</span></p>
            <p><span>优惠券</span><span className='hongColor'>-¥{ coupon }</span></p>
            <p><span>平台活动</span><span className='hongColor'>-¥{ platformActivity }</span></p>
            <p><span>预计退款金额:</span><span className='sumPrice'><i>¥</i>{ estimatedAmount }</span></p>
            {
              refund ? ('') : (<div className='textTips'>温馨提示：确认退票后将无法取消，请您谨慎操作；退票成功后退款会在1-5个工作日退回您的支付账户</div>)
            }
          </div>
          {
            !refund ? (<div className='closeBtn'>
              <div onClick={ () => { handleContainerClose(); location.hash = '' } }>取消</div>
              <div onClick={ () => this.handleRefundText() }>确定</div>
            </div>) : (<div className='closeBtnImg'><img onClick={ () => handleContainerClose() } src={ closeIcon } alt='' /></div>)
          }
        </div>
      )
    }
    return (<div />)
  }
}

export default RefundInfoCom

// {
//   !refund ? (<div className='closeBtn'>
//     <div onClick={ () => handleContainerClose() }>取消</div>
//     <div onClick={ () => this.handleConfirmRefund(handleContainerClose, ChooseCredentialarr, passengers) }>确定</div>
//   </div>) : (<div className='closeBtnImg'><img onClick={ () => handleContainerClose() } src={ closeIcon } alt='' /></div>)
// }
