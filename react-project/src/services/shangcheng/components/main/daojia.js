import React from 'react'
import { Mask, SlidePage, AddressSearchGaode } from '@boluome/oto_saas_web_app_component'
import { Icon, Carousel } from 'antd-mobile'
import { splitEvery } from 'ramda'

import IndexSearch from '../common-component/index-search'
import CommodityItem from '../common-component/commodity-item'

import '../../styles/main/daojia.scss'

const Daojia = ({
  daojiaInfo,
  handleServiceClick,
  selectedCity, handleSelectCity,
}) => {
  if (!daojiaInfo) return <div />
  let { industryData, serviceData, bannerData } = daojiaInfo
  bannerData = bannerData.map((o, i) => {
    o.id = i
    return o
  })
  industryData = industryData.map(o => ({
    text: o.industryName,
    icon: o.industryIcon,
    code: o.industryCode,
    id:   o.industryId,
  }))
  industryData = splitEvery(8)(industryData)
  serviceData = serviceData.map(o => ({
    commodityId:          o.serviceId,
    serviceId:            o.serviceId,
    banners:              [o.serviceThumbnailImg],
    commodityName:        o.serviceName,
    brandName:            o.brandName,
    sellPrice:            o.sellPrice,
    originalPrice:        o.originalPrice,
    goodComment:          o.goodCommentCount,
    commodityDescription: '',
    industryCode:         o.industryCode,
    unitName:             o.unitName,
  }))
  return (
    <div className='daojia'>
      <div className='daojia-header'>
        <p
          onClick={ () => Mask(
            <SlidePage showClose={ false }>
              <AddressSearchGaode { ...{ selectedCity, onSuccess: handleSelectCity } } />
            </SlidePage>)
          }
        >
          <Icon type={ require('svg/shangcheng/location_fill.svg') } size='md' />
          <span className='line-1'>{ selectedCity.address }</span>
          <Icon type={ require('svg/shangcheng/push.svg') } size='xxs' />
        </p>
        <Icon onClick={ () => Mask(<SlidePage showClose={ false }><IndexSearch fixed={ 1 } /></SlidePage>) } type={ require('svg/shangcheng/search.svg') } size='md' />
      </div>
      <div className='sc-ad'>
        <Carousel className='ad-carousel' infinite>
          {
            bannerData.map(o => <img src={ o.bannerIcon } alt='icon' key={ o.id } />)
          }
        </Carousel>
        <p>广告</p>
      </div>
      <Carousel className='daojia-service-carousel'>
        {
          industryData.map(o => <IndustryItem data={ o } key={ o[0].id } handleServiceClick={ handleServiceClick } />)
        }
      </Carousel>
      <div className='recommend-service'>
        <h1 className='recommend-service-header'>
          <span>推荐服务</span>
          <span />
        </h1>
        {
          serviceData.map(o => <CommodityItem data={ o } key={ o.commodityId } isDaojia={ 1 } />)
        }
      </div>
    </div>
  )
}
export default Daojia

const IndustryItem = ({ data, handleServiceClick }) => {
  return (
    <ul className='industry-item'>
      {
        data.map(o => (
          <li key={ o.id } onClick={ () => handleServiceClick(o) }>
            <div className='industry-item-container'>
              <p><img src={ o.icon } alt='icon' /></p>
              <span className='line-1'>{ o.text }</span>
            </div>
          </li>
        ))
      }
    </ul>
  )
}
