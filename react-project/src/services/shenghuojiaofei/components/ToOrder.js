import React from 'react'
import '../styles/toOrder.scss'

const ToOrder = ({ discountPrice, resultPrice, isSubmit, handleToOrder }) => {
  return (
    <div className='footer'>
      {
        Boolean(discountPrice) &&
        <p className='real-price'>{ `已优惠¥${ discountPrice }` }</p>
      }
      <p className='pay-price'>
        实付：¥
        <span className='cur-price'>{ `${ resultPrice.split('.')[0] }.` }</span>
        { resultPrice.split('.')[1] }
      </p>
      <p className={ isSubmit ? 'button active' : 'button' } onClick={ handleToOrder }>立即下单</p>
    </div>
  )
}

export default ToOrder
