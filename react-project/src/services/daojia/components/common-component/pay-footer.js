import React from 'react'
import { Toast } from 'antd-mobile'
import { merge } from 'ramda'

const pStyle = {
  fontSize:    '.28rem',
  lineHeight:  '1rem',
  float:       'left',
  color:       '#ff4848',
  paddingLeft: '.3rem',
}

const spanStyle = {
  fontSize:    '.20rem',
  lineHeight:  '1rem',
  color:       '#999',
  paddingLeft: '.13rem',
}

const disableBtn = {
  background: '#e5e5e5',
  width:      '3rem',
  height:     '1rem',
  fontSize:   '.36rem',
  lineHeight: '1rem',
  textAlign:  'center',
  float:      'right',
  color:      '#fff',
}
const activeBtn = merge(disableBtn)({ background: '#ffab00' })
const footerStyle = {
  background: '#fff',
  height:     '1rem',
  width:      '100%',
}

const PayFooter = ({ sellPrice, discount = 0, handlePlaceClick = '', orderParas, mustOptions, text = '立即缴费' }) => {
  discount = Number(discount)
  let payPrice = sellPrice - discount
  if (payPrice <= 0) payPrice = 0.01
  payPrice = payPrice.toFixed(2)

  // canplace 表示当前可不可以提交，默认可以, reason 表示不可提交的原因
  let canplace = true
  let reason = ''
  mustOptions.forEach(item => {
    if (!item.status) {
      canplace = false
      reason = item.title
    }
  })
  return (
    <div className='pay-footer' style={ footerStyle }>
      <p style={ pStyle }>
        实付：¥
        <span style={{ fontSize: '.36rem' }}>{ payPrice.split('.')[0] }</span>
        { `.${ payPrice.split('.')[1] }` }
        {
          Boolean(discount) &&
          <span style={ spanStyle }>{ `优惠${ discount.toFixed(2) }` }元</span>
        }
      </p>
      <p style={ canplace ? activeBtn : disableBtn } onClick={ canplace ? () => handlePlaceClick(orderParas) : () => Toast.info(`请选择${ reason }`, 1) }>{ text }</p>
    </div>
  )
}

export default PayFooter
