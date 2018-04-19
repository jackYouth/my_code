import React from 'react'
// import { Empty } from '@boluome/oto_saas_web_app_component'
import { Icon } from 'antd-mobile'

import IndexSearch from '../common-component/index-search'
import CommodityItem from '../common-component/commodity-item'

import '../../styles/main/specialty.scss'

const Specialty = ({
  specialtyCommoditys, handleAddCommodity,
  cartCommoditys,
  handleChangeMenu,
  specialtyProvince, handleChangeProvince,
  handleToCommodityList,
}) => {
  if (!specialtyCommoditys) return <div />
  // handleAddCommodityMid: handleAddCommodity的中间函数，给handleAddCommodity多加一个参数
  const handleAddCommodityMid = data => {
    handleAddCommodity(data, cartCommoditys)
  }
  return (
    <div className='specialty'>
      <IndexSearch { ...{ showCart: 1, categoryLevel: 2, cartNum: cartCommoditys.totalNum, handleChangeMenu, specialtyProvince, handleChangeProvince, placeholder: '请输入商家，商品名称' } } />
      <div className='sc-ad'>
        <img src={ require('../../img/carousel_1.png') } alt='ad' />
        <p>广告</p>
      </div>
      {
        specialtyCommoditys.map(o => {
          const { commodityCategoryName, simpleCommodityVos } = o
          if (simpleCommodityVos.length === 0) return false
          return (
            <div className='spacialty-category' key={ commodityCategoryName }>
              <div className='specialty-list-title'>
                <span>{ commodityCategoryName }</span>
                <p>
                  <span onClick={ () => handleToCommodityList(o) } style={{ visibility: simpleCommodityVos.length > 3 ? 'visible' : 'hidden' }}>查看全部</span>
                  <Icon style={{ visibility: simpleCommodityVos.length > 3 ? 'visible' : 'hidden' }} type='right' size='md' />
                </p>
              </div>
              <div className='specialty-list'>
                {
                  simpleCommodityVos.length >= 1 &&
                  simpleCommodityVos.map((oo, i) => {
                    if (i >= 3) return false
                    return <CommodityItem data={ oo } key={ oo.commodityId } showCart={ 1 } handleAddCommodity={ handleAddCommodityMid } />
                  })
                }
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
export default Specialty
