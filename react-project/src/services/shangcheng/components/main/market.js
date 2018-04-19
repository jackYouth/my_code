import React from 'react'
import { Tabs } from 'antd-mobile'

import IndexSearch from '../common-component/index-search'
import CommodityItem from '../common-component/commodity-item'

import '../../styles/main/market.scss'

const TabPane = Tabs.TabPane

const Market = ({
  marketCategories, handleTabClick,
  marketCommoditys, handleAddCommodity,
  cartCommoditys,
  handleChangeMenu,
}) => {
  if (!marketCategories || !marketCommoditys) return <div />
  // handleAddCommodityMid: handleAddCommodity的中间函数，给handleAddCommodity多加一个参数
  const handleAddCommodityMid = data => {
    handleAddCommodity(data, cartCommoditys)
  }
  return (
    <div className='market'>
      <IndexSearch { ...{ showCart: 1, categoryLevel: 1, cartNum: cartCommoditys.totalNum, handleChangeMenu, placeholder: '请输入商家，商品名称' } } />
      <Tabs pageSize={ 5 } onTabClick={ handleTabClick }>
        {
          marketCategories.map(o => (
            <TabPane tab={ <IconText icon={ o.commodityCategoryIcon } text={ o.commodityCateogryName } /> } key={ o.commodityCategoryId } />
          ))
        }
      </Tabs>
      <div className='main-list'>
        {
          marketCommoditys.map(o => (
            <CommodityItem data={ o } key={ o.commodityId } showCart={ 1 } handleAddCommodity={ handleAddCommodityMid } />
          ))
        }
      </div>
    </div>
  )
}
export default Market


const IconText = ({ icon, text }) => {
  const imgStyle = {
    height:  '.5rem',
    display: 'block',
    margin:  '0 auto .16rem',
  }
  const ddStyle = {
    fontSize:   '.26rem',
    lineHeight: '.26rem',
    color:      '#666',
    textAlign:  'center',
  }
  return (
    <dl>
      <dt>
        <img style={ imgStyle } src={ icon } alt={ text } />
      </dt>
      <dd style={ ddStyle }>{ text }</dd>
    </dl>
  )
}
