import React from 'react'
import { Icon } from 'antd-mobile'

import '../styles/estimate-price.scss'
import DetailList from './detail-list'

const EstimatePrice = ({ handleContainerClose, handelRulesClick, estimate }) => {
  const { charges, price } = estimate
  const detailText = charges.map(o => ({ left: o.name, right: o.amount }))
  return (
    <div className='estimate-price-component'>
      <DetailList title='价格预估' price={ price } detailText={ detailText } titleBg='#f8f8f8' />
      <Icon className='close-icon' type={ require('svg/yongche/close.svg') } size='lg' onClick={ handleContainerClose } />
      <div className='price-rules'>
        <p onClick={ handelRulesClick }>
          <span>计价规则</span>
          <Icon type={ require('svg/yongche/problem.svg') } size='md' />
        </p>
      </div>
    </div>
  )
}

export default EstimatePrice
