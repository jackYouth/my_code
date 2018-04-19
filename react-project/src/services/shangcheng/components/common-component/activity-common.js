import React from 'react'
import { browserHistory } from 'react-router'
import LazyLoad from 'react-lazyload'

import '../../styles/comment-component/activity-common.scss'

export const BuyStep = ({ sales, total }) => {
  // sales = 90
  // total = 100
  const salePercent = Math.ceil((sales / total) * 100)
  const width = `${ salePercent }%`
  let text = `已抢${ sales }件`
  if (salePercent >= 60) text = '即将售罄'
  if (sales === total) text = '已售罄'
  return (
    <div className='activity-common-buy-step'>
      <p style={{ width }}>
        <span />
      </p>
      {
        sales !== total &&
        <span>{ width }</span>
      }
      <span style={{ width }}>{ text }</span>
    </div>
  )
}

export const Price = ({ sellPrice, originalPrice, style1 = {}, style2 = {}, spanClassName = '' }) => {
  return (
    <p className='activity-common-price'>
      <span className={ spanClassName } style={ style1 }>¥</span>
      <span className={ spanClassName } style={ style2 }>{ sellPrice }</span>
      <del>{ `¥${ originalPrice }` }</del>
    </p>
  )
}

export const ActivityCommodityItem = ({ data, isTomorrow }) => {
  const { iconUrl, commodityName, commodityDescription, commodityId, sales, total, sellPrice, originalPrice, preferentialType, value } = data
  const discountTag = (preferentialType === 2 || preferentialType === 4 || preferentialType === 24) ? `${ value }折` : '直降'
  const isSaled = sales === total
  const discountHasPoint = (preferentialType === 2 || preferentialType === 4 || preferentialType === 24) && String(value).indexOf('.') >= 0
  return (
    <div className='activity-commodity-item'>
      <dl onClick={ () => !isSaled && !isTomorrow && browserHistory.push(`/shangcheng/commodity?commodityId=${ commodityId }`) }>
        <dt>
          <LazyLoad
            throttle={ 200 }
            placeholder={ <img style={{ height: '100%', width: '100%', border: '1px solid #f5f5f6' }} alt='' /> }
          >
            <img src={ `${ iconUrl }?image&action=resize:w_200,m_1` } alt={ commodityName } />
          </LazyLoad>
          {
            isSaled &&
            <p className='saled-icon' />
          }
        </dt>
        <dd>
          <h1>{ commodityName }</h1>
          <h2 className='line-2'>{ commodityDescription }</h2>
          {
            !isTomorrow &&
            <BuyStep { ...{ sales, total } } />
          }
          <div className='bottom'>
            <Price spanClassName={ isTomorrow ? 'green-active-font' : '' } style1={ isSaled ? { color: '#666' } : {} } style2={ isSaled ? { color: '#666' } : {} } { ...{ sellPrice, originalPrice } } />
            {
              !isTomorrow &&
              <p className={ isSaled ? 'activity-btn disable' : 'activity-btn' }>{ isSaled ? '抢光了' : '马上抢' }</p>
            }
          </div>
        </dd>
      </dl>
      {
        !isTomorrow &&
        <p className={ discountHasPoint ? 'discount-tag small' : 'discount-tag' }>{ discountTag }</p>
      }
    </div>
  )
}
