import React from 'react'
import { browserHistory } from 'react-router'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { Icon } from 'antd-mobile'

import { ListItem } from 's-component'

import { getBrandCategories } from '../../actions/brand'

import '../../styles/brand/brand-categories.scss'

const BrandCategoriesIcon = () => {
  return (
    <div className='categories-icon' onClick={ () => Mask(<SlidePage target='brand-categories-slide right' showClose={ '' }><BrandCategories /></SlidePage>) }>
      <Icon type={ require('svg/shangcheng/categories.svg') } size='md' />
      <span>分类</span>
    </div>
  )
}

export default BrandCategoriesIcon

class BrandCategories extends React.Component {
  constructor(props) {
    super(props)
    const brandId = window.location.pathname.split('/')[2]
    this.state = {
      brandCategoriesInfo: [],
      brandId,
    }
    this.getBrandCategories()
  }
  getBrandCategories() {
    const { brandId } = this.state
    const callback = data => {
      this.setState({ brandCategoriesInfo: data })
    }
    getBrandCategories(brandId, callback)
  }
  handleToList(brandSortId) {
    const { brandId } = this.state
    const { handleContainerClose } = this.props
    browserHistory.push(`/shangcheng/commodityList/${ brandId }?isBrandCategories=1&brandSortId=${ brandSortId }`)
    handleContainerClose()
  }

  render() {
    const { brandCategoriesInfo } = this.state
    return (
      <div className='brand-categories'>
        <ListItem title='全部宝贝' className='all-commodity' onClick={ () => this.handleToList('') } />
        <ul className='brand-categories-list'>
          {
            brandCategoriesInfo.map(o => {
              const { subBrandSortVos, brandSortName, brandSortId } = o
              const hasSub = subBrandSortVos.length > 0
              return (
                <li key={ brandSortId }>
                  <div className='list-header' onClick={ () => this.handleToList(brandSortId) }>
                    <span>{ brandSortName }</span>
                    {
                      hasSub ?
                        <span>查看全部</span> :
                        <Icon type={ require('svg/shangcheng/categories.svg') } size='md' />
                    }
                  </div>
                  <div className='list-content'>
                    {
                      subBrandSortVos.map(oo => (
                        <p key={ oo.brandSortId } onClick={ () => this.handleToList(oo.brandSortId) }><span>{ oo.brandSortName }</span></p>
                      ))
                    }
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
