import React from 'react'
import { Carousel, Icon } from 'antd-mobile'
import { splitEvery } from 'ramda'

import Sc2Commodity from '../common-component/sc-2-commodity'
import IndexSearch from '../common-component/index-search'

import '../../styles/main/index.scss'

const Main = ({
  columnList, handleColumnClick,
  mockAdList, newCommodityList, categorySecondatys, recommendList,
  handleCommodityClick, handleCategoryClick,
}) => {
  const nodo = false
  return (
    <div className='main'>
      <IndexSearch { ...{ placeholder: '搜索商品、店铺' } } />
      <div className='main-list'>
        {
          mockAdList &&
          <div className='sc-ad'>
            <Carousel className='ad-carousel' infinite>
              {
                mockAdList.map(o => <img src={ o.img } alt='icon' key={ o.id } />)
              }
            </Carousel>
            {
              nodo &&
              <p>广告</p>
            }
          </div>
        }
        <ul className='columns'>
          {
            columnList &&
            columnList.map(o => (
              <li key={ o.categoryName } onClick={ () => handleColumnClick(o) }>
                <p><img src={ o.icon } alt={ o.categoryName } /></p>
                <span>{ o.categoryName }</span>
              </li>
            ))
          }
        </ul>
        {
          newCommodityList && newCommodityList.length >= 5 &&
          <div className='new-commoditys'>
            <p className='sc-title'>
              <span />
              <Icon type={ require('svg/shangcheng/new_commodity.svg') } size='xxs' />
              <span>新品上市</span>
              <span />
            </p>
            <div className='commoditys-list-container'>
              <ul className='commoditys-list'>
                {
                  newCommodityList.map(o => (
                    <li className='sc-4-commodity' key={ o.commodityId } onClick={ () => handleCommodityClick(o.commodityId) }>
                      <img src={ o.banners[0] } alt='new_commodity' />
                      <p>{ `${ o.commodityName } ${ o.commodityDescription }` }</p>
                      <p>{ `￥${ o.sellPrice }` }</p>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        }
        <div className='category-secondary'>
          {
            categorySecondatys &&
            categorySecondatys.map(o => (
              <p key={ o.id }>
                <span>{ o.title }</span>
                <span>{ o.text }</span>
                <img src={ o.img } alt='category-secondary' onClick={ () => handleCategoryClick(o.url) } />
              </p>
            ))
          }
        </div>
        <ul className='recommend-list'>
          <p className='recommend-list-title'>
            <img src={ require('../../img/like.png') } alt='like' />
          </p>
          {
            recommendList &&
            splitEvery(2)(recommendList).map(commodities => <Sc2Commodity { ...{ commodities } } key={ commodities[0].commodityId } />)
          }
        </ul>
        <p className='load-complete'>已经全部加载完毕</p>
      </div>
    </div>
  )
}

export default Main
