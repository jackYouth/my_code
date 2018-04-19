import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { Grid } from 'antd-mobile'

import CommodityItem from '../../common-component/commodity-item'

export default class SearchResultBottom extends Component {
  constructor(props) {
    super(props)
    const { searchResult } = props
    let { brands } = searchResult
    brands = brands.map(item => ({ icon: item.brandLogo, text: item.brandName, brandId: item.brandId, brandType: item.brandType }))
    let filterBrands = []
    if (brands.length >= 8) {
      filterBrands = brands.splice(0, 7)
      filterBrands.push({ icon: require('svg/shangcheng/all.svg'), text: '查看全部', brandId: 'all' })
    }
    this.state = {
      currentBrands: filterBrands.length === 0 ? brands : filterBrands,
      brands,
    }
    this.handleCommodityClick = this.handleCommodityClick.bind(this)
  }
  handleBusinessClick(brandData) {
    if (brandData.brandId === 'all') {
      const { brands } = this.state
      this.setState({ currentBrands: brands })
    } else {
      const { brandId, brandType, brandCode } = brandData
      Mask.closeAll()
      if (brandType === 0) location.href = `${ location.origin }/daojia/${ brandCode }/business?brandId=${ brandId }`
      if (brandType === 1) browserHistory.push(`/shangcheng/${ brandId }`)
    }
  }
  handleCommodityClick(res) {
    const { commodityId, brandType, industryCode, isCanService } = res
    Mask.closeAll()
    if (brandType === 0) location.href = `${ location.origin }/daojia/${ industryCode }/detail?serviceId=${ commodityId }&supportThisCity=${ isCanService }`
    if (brandType === 1) browserHistory.push(`/shangcheng/commodity?commodityId=${ commodityId }`)
  }
  render() {
    const { searchResult } = this.props
    const { commoditys } = searchResult
    const { currentBrands } = this.state
    return (
      <div className='search-result'>
        {
          currentBrands.length > 0 &&
          <p className='title'>店铺</p>
        }
        {
          currentBrands.length > 0 &&
          <Grid data={ currentBrands } onClick={ r => this.handleBusinessClick(r) } />
        }
        {
          commoditys.length > 0 &&
          <p className='title'>商品</p>
        }
        {
          commoditys.length > 0 &&
          commoditys.map(item => <CommodityItem key={ item.commodityId } { ...{ data: item, onClick: this.handleCommodityClick, isDaojia: true } } />)
        }
      </div>
    )
  }
}
