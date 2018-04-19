import React from 'react'
import { moment } from '@boluome/common-lib'
import { InputItem, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { merge } from 'ramda'

import Order from '../containers/Order'
import ServerHeader from './ServerHeader'

import '../styles/price-input.scss'

class PriceInput extends React.Component {
  constructor(props) {
    super(props)
    const { orderParas } = props
    this.state = {
      moneyfocused: false,
      showOrder:    false,
      orderParas,
    }
  }
  handleNextClick() {
    let { orderParas } = this.state
    const value = this.iptNode.props.value
    if (value === undefined || value === '') {
      Toast.info('请输入缴费金额')
      return
    }
    if (value < 1) {
      Toast.info('缴费金额必须大于1元')
      return
    }
    orderParas = merge(orderParas)({ orderInfo: { price: value, barcode: '', billId: '', date: moment('YYYYMM')(new Date()) } })
    this.setState({ showOrder: true, orderParas })
  }
  render() {
    const { form, currentServer, orderInfoTop } = this.props
    const { showOrder, orderParas } = this.state
    const { getFieldProps } = form
    return (
      <div className='price-input-container'>
        {
          !showOrder &&
          <div className='price-input bill-info'>
            <ServerHeader currentServer={ currentServer } />
            <div className='ipt-container'>
              <InputItem
                {
                  ...getFieldProps('money2', {
                    normalize: (v, prev) => {
                      if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                        if (v === '.') {
                          return '0.'
                        }
                        return prev
                      }
                      return v
                    },
                  })
                }
                type='money'
                placeholder='请输入缴费金额'
                onFocus={
                  () => {
                    this.setState({
                      moneyfocused: false,
                    })
                  }
                }
                ref={ node => this.iptNode = node }
                focused={ this.state.moneyfocused }
              />
            </div>
            <ul className='order-info-list'>
              {
                orderInfoTop.map(o => (
                  <li key={ o.left }>
                    <span>{ o.left }</span>
                    <span>{ o.right }</span>
                  </li>
                ))
              }
            </ul>
            <p className='next-button' onClick={ () => this.handleNextClick() }>下一步</p>
          </div>
        }
        {
          showOrder &&
          <Order { ...orderParas } />
        }
      </div>
    )
  }
}

export default createForm()(PriceInput)
