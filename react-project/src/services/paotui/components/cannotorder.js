import React from 'react'
// import { browserHistory } from 'react-router'
import { List, InputItem, NoticeBar } from 'antd-mobile'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { send } from '@boluome/common-lib'

import '../style/orderDetails.scss'
import cha from '../img/x.png'

const { customer = {} } = window.OTO_SAAS
const { bridge = {}, isSpecialPhoneCall = false } = customer
const { specialPhoneCall } = bridge

class CancelOrder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
      ...props.orderDetailInfo,
      changecon: '',
      mark:      false,
    }
    console.log('CancelOrder-props--', props, ...props.orderDetailInfo)
  }
  // 获取取消码
  handleCannotOrderFn() {
    const { changecon } = this.state
    if (changecon) {
      this.handleOK()
    } else {
      this.setState({
        mark: true,
      })
    }
  }
  // 提交验证码
  handleOK() {
    const handleClose = Loading()
    const cannotorderUrl = '/paotui/cancelOrderByCode'
    const { id, changecon, handleContainerClose, propsFn, channel, orderType, partnerId } = this.state
    const sendData = {
      id,
      code: changecon,
    }
    send(cannotorderUrl, sendData).then(reply => {
      const { code, data, message } = reply
      if (code === 0) {
        handleClose()
        this.setState({
          mark: false,
        })
        if (propsFn) propsFn(id, channel, orderType, partnerId)
        handleContainerClose()
        window.location.reload()
        console.log('handleOK---', data, propsFn)
      } else {
        this.setState({
          mark: true,
        })
        console.log('数据请求失败', message)
      }
      handleClose()
    })
  }
  // 输入框内容
  handleOnChange(v) {
    this.setState({
      changecon: v,
    })
  }
  render() {
    // 取消订单的弹窗
    const { deliveryManMobile, handleContainerClose, mark } = this.state
    return (
      <div className='cannotOrder'>
        <div className='canNtitle'>
          <span onClick={ () => handleContainerClose() }><img src={ cha } alt='' /></span>
          <span>取消订单</span>
          {
            isSpecialPhoneCall ? (<span onClick={ () => { if (isSpecialPhoneCall && specialPhoneCall && typeof specialPhoneCall === 'function') { specialPhoneCall(deliveryManMobile) } } }>联系小哥</span>) : (<a href={ `tel:${ deliveryManMobile }` }><span>联系小哥</span></a>)
          }
        </div>
        {
          !mark ? ('') : (<NoticeBar className='tipspriceNotice' mode='link'>请输入正确的取消码</NoticeBar>)
        }
        <div className='canNmain'>
          <List>
            <InputItem
              placeholder='请输入4位取消码'
              maxLength={ 4 }
              type='text'
              onChange={ v => this.handleOnChange(v) }
            />
          </List>
          <div className='yesBtn' onClick={ () => this.handleCannotOrderFn() }>确定</div>
          <p>小哥接单后，取消订单需要输入取消码，请向小哥索要</p>
        </div>
      </div>
    )
  }
}

export default CancelOrder
