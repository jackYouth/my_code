import React from 'react'
import { browserHistory } from 'react-router'
import { Icon, Toast } from 'antd-mobile'

import '../../styles/comment-component/cart-commodity-item.scss'

const CartCommodityItem = ({
  data, index, handleCommoditySelect, canEdit, handleDelCommdity, currentNum, isOrderPage,
  changeCartNum,
}) => {
  const { isSelectCommodity, banners, commodityName, commodityDescription, buyNum, checkNum, currentPriceInfo } = data
  const { sellPrice, originalPrice, inventory, canService, description } = currentPriceInfo
  const priceL = Number(sellPrice).toFixed(2).split('.')[0]
  const priceR = Number(sellPrice).toFixed(2).split('.')[1]
  if (!currentNum) currentNum = buyNum
  const noDo = true
  const handleToCommodity = () => browserHistory.push(`/shangcheng/commodity?commodityId=${ data.commodityId }`)
  return (
    <li className={ isOrderPage ? 'cart-commodity-item is-order-page' : 'cart-commodity-item' }>
      {
        !canService &&
        <p className='invalid-mask' onClick={ handleToCommodity } />
      }
      {
        !isOrderPage && isSelectCommodity && canService &&
        <Icon className='select-icon' onClick={ () => handleCommoditySelect(index, false) } type={ require('svg/shangcheng/selected.svg') } size='md' />
      }
      {
        !isOrderPage && !isSelectCommodity && canService &&
        <span onClick={ () => handleCommoditySelect(index, true) } className='not-select-icon' />
      }
      {
        !canService &&
        <span className='invalid-text'>失效</span>
      }
      <div className='cart-commodity-info' style={ isOrderPage ? { paddingLeft: '.3rem' } : {} }>
        <p className='cart-commodity-info-left'>
          <img src={ banners[0] } alt={ commodityName } onClick={ handleToCommodity } />
        </p>
        {
          canEdit &&
          <div className='cart-commodity-info-edit' onClick={ e => e.stopPropagation() }>
            <div className='cart-commodity-edit-left'>
              <p>
                <span onClick={ () => currentNum > 1 && changeCartNum(index, -1) }>-</span>
                <span>{ currentNum }</span>
                <span onClick={ () => {
                  if (currentNum >= inventory) {
                    Toast.info('已达到库存上限', 1)
                    if (currentNum > inventory) changeCartNum(index, inventory - currentNum)
                    return
                  }
                  if (checkNum && currentNum >= checkNum) {
                    Toast.info('已达到限购数量', 1)
                    if (checkNum && currentNum > checkNum) changeCartNum(index, checkNum - currentNum)
                    return
                  }
                  changeCartNum(index, 1)
                } }
                >+</span>
              </p>
              <p style={{ visibility: noDo ? 'hidden' : 'unset' }}>
                <span>没有使用接口返回的数据</span>
                <Icon className='arrow-icon' type='down' size='md' />
              </p>
            </div>
            <div className='cart-commodity-edit-right' onClick={ () => handleDelCommdity(index, buyNum) }>删除</div>
          </div>
        }
        {
          !canEdit &&
          <div className='cart-commodity-info-right' onClick={ () => !isOrderPage && browserHistory.push(`/shangcheng/commodity?commodityId=${ data.commodityId }`) }>
            <div className='cart-commodity-title'>
              <p className='line-2'>{ `${ commodityName } ${ commodityDescription }` }</p>
              {
                currentPriceInfo.specificationName && canService &&
                <p className='specification line-2'>{ `已选择 ${ currentPriceInfo.specificationName }` }</p>
              }
              {
                !canService &&
                <p className='specification'>{ description }</p>
              }
              {
                Boolean(!isOrderPage) && Boolean(checkNum) && Boolean(canService) &&
                <p className='limit-buyNum'>{ `限购${ checkNum }件` }</p>
              }
            </div>
            <p>
              ￥
              <span>{ priceL }</span>
              { `.${ priceR }` }
              <del>{ `￥${ originalPrice.toFixed(2) }` }</del>
              <span>{ `x${ buyNum }` }</span>
            </p>
          </div>
        }
      </div>
    </li>
  )
}

export default CartCommodityItem
