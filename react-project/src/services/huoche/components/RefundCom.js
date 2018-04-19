import React from 'react'
import { List, Icon, WhiteSpace } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'

import RefundInfoCom from './RefundInfoCom'
import Ordernotice from './ordernotice'

import noChooseIcon from '../img/noChoose.svg'
import successIcon from '../img/success.svg'

const Item = List.Item
class RefundCom extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    // const arrChoose = [this.props.ChooseCredential]
    this.state = {
      ...props,
      ChooseCredentialarr: [this.props.ChooseCredential],
      refundpeople:        [this.props.refundpeople],
    }
    this.handleRefundInfo = this.handleRefundInfo.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  componentWillUnmount() {
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[1].remove()
      node[0].remove()
    }
    // Mask.closeAll()
  }
  // 退票乘客选择
  handleRefundChecked(code, arr) {
    const { passengers } = this.state
    const filter = arr.filter(item => { return item === code })
    if (filter.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === code) {
          arr.splice(i, 1)
        }
      }
    } else {
      arr.push(code)
    }
    const peoplearr = passengers.filter(e => arr.some(o => o === e.id))
    this.setState({
      ChooseCredentialarr: arr,
      refundpeople:        peoplearr,
    })
  }
  // 退票确认弹窗
  handleRefundInfo() {
    // Toast.info('确认退票--', 2)
    const { passengers, ChooseCredentialarr, orderId, type, refundpeople, partnerId } = this.state
    console.log('--test---type', type, passengers, 'orderId---', orderId)
    Mask(<RefundInfoCom
      ChooseCredentialarr={ ChooseCredentialarr }
      passengers={ passengers }
      orderId={ orderId }
      type={ type }
      peoplearr={ refundpeople }
      partnerId={ partnerId }
    />
    , { mask: true, style: { position: 'absolute' } })
  }
  render() {
    const { passengers, ChooseCredentialarr, status } = this.state
    console.log('RefundCom--state-sss', this.state)
    const endersarr = []
    for (let i = 0; i < passengers.length; i++) {
      if (passengers[i].isRefund) {
        endersarr.push(passengers[i])
      }
    }
    console.log('endersarr', endersarr, ChooseCredentialarr, this.handleRefundChecked, this.handleRefundInfo)
    return (
      <div className='refundWrap'>
        <Item>选择退票乘客</Item>
        <List className='refundList'>
          {
            endersarr.map(o => (
              <Item key={ o.id } thumb={ <Icon onClick={ () => this.handleRefundChecked(o.id, ChooseCredentialarr) } type={ ChooseCredentialarr.filter(i => { return i === o.id }).length > 0 ? successIcon : noChooseIcon } /> }>
                <span>乘客</span><span>{ o.name }</span><span className='numStr'>{ `${ o.credentialCode.slice(0, 4) } ******** ${ o.credentialCode.slice(-3) }` }</span>
              </Item>
            ))
          }
          <WhiteSpace size='lg' />
          <Ordernotice status={ status } />
        </List>
        {
          ChooseCredentialarr && ChooseCredentialarr.length > 0 ? (<div className='refundFooter' onClick={ () => this.handleRefundInfo() }>提交退票申请</div>) : (<div className='refundFooter refundFooterNouse'>提交退票申请</div>)
        }
      </div>
    )
  }
}

export default RefundCom
