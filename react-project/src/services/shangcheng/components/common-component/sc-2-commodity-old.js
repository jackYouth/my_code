import React from 'react'
import { browserHistory } from 'react-router'

import '../../styles/main/sc-2-commodity.scss'

const Sc2Commodity = ({ commodity, index }) => {
  const { banners, commodityName, commodityDescription, sellPrice, purchasesCount, commodityId } = commodity
  return (
    <li onClick={ () => browserHistory.push(`/shangcheng/commodity?commodityId=${ commodityId }`) } className='sc-2-commodity' style={ index % 2 === 0 ? { paddingRight: '5px' } : { paddingLeft: '5px' } }>
      <div className='sc-2-commodity-container'>
        <p><img src={ banners[0] } alt='commodity_data' /></p>
        <p>{ `${ commodityName } ${ commodityDescription }` }</p>
        <p>
          <span>￥</span>
          <span>{ sellPrice }</span>
          <span>{ `${ purchasesCount }人付款` }</span>
        </p>
      </div>
    </li>
  )
}

export default Sc2Commodity
