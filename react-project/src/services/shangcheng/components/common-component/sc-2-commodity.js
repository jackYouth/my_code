import React from 'react'
import { browserHistory } from 'react-router'

import '../../styles/main/sc-2-commodity.scss'

const Sc2Commodity = ({ commodities }) => {
  console.log('commodities', commodities)
  return (
    <li className='sc-2-commodity-container'>
      {
        commodities.map((o, i) => {
          const { banners, commodityName, commodityDescription, sellPrice, purchasesCount, commodityId } = o
          return (
            <div className='sc-2-commodity' key={ commodityId } onClick={ () => browserHistory.push(`/shangcheng/commodity?commodityId=${ commodityId }`) } style={ i % 2 === 0 ? { paddingRight: '5px' } : { paddingLeft: '5px' } }>
              <div className='bg-container'>
                <p><img src={ banners[0] } alt='commodity_data' /></p>
                <p>{ `${ commodityName } ${ commodityDescription }` }</p>
                <p>
                  <span>￥</span>
                  <span>{ sellPrice }</span>
                  <span>{ `${ purchasesCount }人付款` }</span>
                </p>
              </div>
            </div>
          )
        })
      }
    </li>
  )
}

export default Sc2Commodity
