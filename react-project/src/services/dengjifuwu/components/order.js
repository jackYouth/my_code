import React from 'react'
import { NewPromotion } from '@boluome/oto_saas_web_app_component'
import '../style/order.scss'

const order = props => {
  console.log('order props-------', props)
  const { saveOrder, handleCoupon, thisData = {}, chooseTimes = ['1次'], channel, discountPrice = 0 } = props
  const { services, price = 0 } = thisData
  const quantity = chooseTimes[0].substring(0, chooseTimes[0].length - 1) || 0
  return (
    <div className='order-container'>
      <div className='order-info-container'>
        <div className='main-info-box'>
          <span>{ services }</span>
          <span>{ `¥ ${ price * quantity }` }</span>
        </div>
        <div className='inTimes'>
          <span>有效时间</span>
          <span>三个月</span>
        </div>
        <div className='times'>
          <span>使用次数</span>
          <span>{ chooseTimes }</span>
        </div>
      </div>
      <div className='promotion-container'>
        <NewPromotion orderType='dengjifuwu' channel={ channel } amount={ price * quantity } handleChange={ reply => handleCoupon(reply) } />
      </div>
      <div className='buttomBar-container'>
        <div className='price-box'>
          <span className='you-will-pay'>{ `实付：¥${ ((price * quantity) - discountPrice).toFixed(2) }` }</span>
          {
            discountPrice > 0 ?
              <span className='discount-price'>{ `优惠¥${ discountPrice }` }</span>
            : ''
          }
        </div>
        <button className='save-order' onClick={ () => saveOrder(props) }>立即下单</button>
      </div>
    </div>
  )
}

export default order
