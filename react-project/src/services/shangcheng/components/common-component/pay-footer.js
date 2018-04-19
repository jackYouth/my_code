import React from 'react'
import { merge } from 'ramda'

const PayFooter = ({ price, num, handlePayClick }) => {
  const pStyle = {
    fontSize:    '.28rem',
    lineHeight:  '.98rem',
    color:       '#333',
    paddingLeft: '.30rem',
    background:  '#fff',
    width:       '100%',
    borderTop:   '1px solid #e5e5e5',
    boxSizing:   'border-box',
  }
  const span1 = {
    color: '#ff4848',
  }
  const span2 = {
    color:    '#ff4848',
    fontSize: '.36rem',
  }
  let span3 = {
    float:     'right',
    width:     '2.6rem',
    height:    '1rem',
    color:     '#fff',
    textAlign: 'center',
    fontSize:  '.34rem',
  }
  if (price) {
    span3 = merge(span3)({ background: '#ffab00' })
  } else {
    span3 = merge(span3)({ background: '#ccc' })
  }
  if (price === 0 || price === '0') price = '0.00'
  return (
    <p className='pay-footer' style={ pStyle }>
      合计：
      <span style={ span1 }>¥</span>
      <span style={ span2 }>{ price.split('.')[0] }</span>
      <span style={ span1 }>.{ price.split('.')[1] }</span>
      <span style={ span3 } onClick={ handlePayClick }>{ `结算(${ num })` }</span>
    </p>
  )
}

export default PayFooter
