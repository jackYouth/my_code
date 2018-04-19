import React from 'react'
import { Empty } from '@boluome/oto_saas_web_app_component'
import { Icon } from 'antd-mobile'
import { splitEvery } from 'ramda'

import CommodityItem from './commodity-item'
import IndexSearch from './index-search'
import Sc2Commodity from './sc-2-commodity'

import '../../styles/comment-component/commodity-list.scss'

export default class CommodityList extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  render() {
    const {
      handleChangeCommodityList, commodityList,
      filters, currentFilter = { name: '销量', code: 'sales' },
      commodityListParas,
      handleChangeMode, isBrand,
    } = this.props
    let {
      model,
    } = this.props

    if (!commodityList) return <div />
    if (model === undefined) {
      if (isBrand) {
        model = 'double'
      } else {
        model = 'single'
      }
    }
    return (
      <div className='commodity-list-container'>
        {
          !isBrand &&
          <IndexSearch />
        }
        <div className={ isBrand ? 'commodity-list-container-bottom commodity-list-brand' : 'commodity-list-container-bottom' }>
          <div className='commodity-list-header'>
            <ul className='filter-list'>
              {
                filters.map(o => (
                  <li style={ isBrand ? { justifyContent: 'center' } : {} } key={ o.name } className={ o.name === currentFilter.name ? 'active' : '' }>
                    <span onClick={ () => {
                      if (currentFilter.name === '价格' && currentFilter.name === o.name) {
                        handleChangeCommodityList(currentFilter, commodityListParas)
                        return
                      }
                      if (currentFilter.name !== o.name) {
                        handleChangeCommodityList(o, commodityListParas)
                      }
                    } }
                    >
                      { o.name }
                    </span>
                    {
                      o.name === '价格' &&
                      <Icon className={ currentFilter.code === 'priceASC' ? 'rotate180' : '' } type={ currentFilter.name === '价格' ? require('svg/shangcheng/sort_a.svg') : require('svg/shangcheng/sort.svg') } size='md' />
                    }
                    <p className='bottom-line' />
                  </li>
                ))
              }
            </ul>
            {
              !isBrand &&
              <Icon
                className='commodity-list-search'
                type={ model === 'double' ? require('svg/shangcheng/double-list.svg') : require('svg/shangcheng/single-list.svg') }
                size='md'
                onClick={ () => handleChangeMode(model === 'double' ? 'single' : 'double') }
              />
            }
          </div>
          <ul className='commodity-list'>
            {
              commodityList.length === 0 &&
              <Empty imgUrl={ require('../../img/no-commodities.png') } message='暂无商品' style={{ height: 'calc(100% - 2.02rem)', background: 'none' }} />
            }
            {
              model === 'single' &&
              commodityList.map(o => (
                <CommodityItem data={ o } key={ o.commodityId } />
              ))
            }
            {
             model === 'double' && commodityList.length > 0 &&
              splitEvery(2)(commodityList).map((o, i) => (
                <Sc2Commodity commodities={ o } index={ i } key={ o[0].commodityId } />
              ))
            }
          </ul>
        </div>
      </div>
    )
  }
}
