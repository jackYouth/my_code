import React from 'react'
import { Icon } from 'antd-mobile'

import IndexSearch from '../common-component/index-search'
import CommodityList from '../../containers/common-component/commodity-list'
import BrandCategoriesIcon from './brand-categories'

import '../../styles/brand/index.scss'

const Brand = ({ brandInfo, handleChangeAttention, isAttention }) => {
  if (!brandInfo) return <div />
  const { brandName, brandId, smallLogoImg, publicityImg, servicePhone, attentionCount } = brandInfo
  if (isAttention === undefined) isAttention = brandInfo.isAttention
  return (
    <div className='brand-container'>
      <IndexSearch placeholder='搜索' categoryLevel={ -1 } brandId={ brandId } defaultRightComponent={ <BrandCategoriesIcon /> } />
      <div className='brand'>
        <div className='brand-header-container'>
          <div className='brand-header-mask' style={{ background: `url(${ publicityImg }) no-repeat center center` }} />
          <div className='brand-header'>
            <p className='brand-header-left'><span style={{ background: `url(${ smallLogoImg }) no-repeat center center` }} /></p>
            <div className='brand-header-mid'>
              <p>{ brandName }</p>
              <a href={ `tel:${ servicePhone }` }>
                <Icon type={ require('svg/shangcheng/contact_ff.svg') } size='md' />
                <span>客服</span>
              </a>
            </div>
            <div className='brand-header-right'>
              <p>
                <span>{ attentionCount }</span>
                <span>粉丝数</span>
              </p>
              {
                isAttention &&
                <p onClick={ () => handleChangeAttention(brandInfo, !isAttention) }>已关注</p>
              }
              {
                !isAttention &&
                <p className='attention-false'>
                  <Icon type={ require('svg/shangcheng/attention_ff.svg') } size='xxs' />
                  <span onClick={ () => handleChangeAttention(brandInfo, !isAttention) }>关注</span>
                </p>
              }
            </div>
          </div>
        </div>
        <CommodityList isBrand={ 1 } />
        <p className='footer-tips'>已经全部加载完毕</p>
      </div>
    </div>
  )
}

export default Brand
