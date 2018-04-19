import React from 'react'
import { Mask, SlidePage, CitySearch } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { Icon } from 'antd-mobile'

import '../styles/no-support-city.scss'

const NoSupportCity = ({ handleReloadCity, handleChangeCity, currentname, getLocationErr }) => {
  const uls = [
    {
      icon: require('svg/yongche/location.svg'),
      text: '重新定位',
    },
    {
      icon: require('svg/yongche/city.svg'),
      text: '切换城市',
    },
  ]
  const handleChangeCityClick = () => {
    const channel = location.pathname.split('/')[2]
    const localCity = getStore('localCity', 'session')
    Mask(
      <SlidePage showClose={ false }>
        <CitySearch localCity={ localCity } categoryCode='yongche' handleCityData={ handleChangeCity } api={ `/basis/v1/zhuanche/${ channel }/cities` } />
      </SlidePage>
    )
  }
  return (
    <div className='no-support-city'>
      <img src={ require('../img/no-support-city.png') } alt='没有支持的的城市' />
      <p className='text'>{ getLocationErr ? '定位失败，请确认定位授权与位置信息是否开启' : `抱歉，您所在的城市「${ currentname }」暂未开通该服务` }</p>
      <ul>
        {
          uls.map((item, index) => (
            <li key={ item.icon } onClick={ index === 0 ? handleReloadCity : handleChangeCityClick }>
              <h1>
                <Icon type={ item.icon } size='md' />
              </h1>
              <p>{ item.text }</p>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
export default NoSupportCity
