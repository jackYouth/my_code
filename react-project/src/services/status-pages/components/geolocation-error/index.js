/*
* 需要在queryString中添加参数：
*   1, cityApi, 用于请求城市列表的接口地址
*   2，channel，当前服务的channel
*
*
*/




import React from 'react'
import { setStore, parseQuery } from '@boluome/common-lib'
import { Mask, SlidePage, CitySearch, Loading } from '@boluome/oto_saas_web_app_component'
import { Icon, Toast } from 'antd-mobile'
import { getLocationGaode } from 'business'

import './index.scss'

const handleChangeAddress = data => {
  const { history } = window
  if (data) {
    console.log('data', data)
    const { addressComponent, location, formattedAddress } = data
    const { city } = addressComponent
    setStore('geopoint', { latitude: location.lat, longitude: location.lng }, 'session')
    setStore('currentAddress', formattedAddress, 'session')
    setStore('currentPosition', { city, tips: '通过选择城市逆地址解析出的经纬度信息' }, 'session')
  }
  history.back()
}

export default class NoSupportCity extends React.Component {
  constructor(props) {
    super(props)
    this.cityApi = parseQuery(window.location.search).cityApi
    this.channel = parseQuery(window.location.search).channel
    this.handleReloadCityMid = this.handleReloadCityMid.bind(this)
    this.handleChangeCity = this.handleChangeCity.bind(this)
  }
  handleReloadCityMid() {
    const closeLoading = Loading()
    getLocationGaode(err => {
      if (err) {
        Toast.info('定位失败')
        closeLoading()
        return
      }
      handleChangeAddress()
      closeLoading()
    })
  }
  handleChangeCity(cityObj) {
    const cityName = cityObj.name
    window.AMap.service('AMap.Geocoder', () => {
      // 地址 <-> 经纬度
      const geocoder = new window.AMap.Geocoder({
        radius:     1000,
        extensions: 'all',
      })
      geocoder.getLocation(cityName, (status, result) => {
        console.log('handleAddressToPoint', status, result)
        if (status === 'complete' && result.info === 'OK') {
          //获得了有效的地址信息:
          handleChangeAddress(result.geocodes[0])
        } else {
          //获取地址失败
          Toast.info(`${ address }转换成经纬度失败`)
        }
      })
    })
  }
  render() {
    const uls = [
      {
        icon: require('./location.svg'),
        text: '重新定位',
      },
      {
        icon: require('./city.svg'),
        text: '切换城市',
      },
    ]
    const handleChangeCityClick = () => {
      Mask(
        <SlidePage showClose={ false }>
          <CitySearch categoryCode={ this.channel } handleCityData={ this.handleChangeCity } api={ this.cityApi } />
        </SlidePage>
      )
    }
    return (
      <div className='no-support-city'>
        <img src={ require('./no-support-city.png') } alt='没有支持的的城市' />
        <p className='text'>定位失败，请确认定位授权与位置信息是否开启</p>
        <ul>
          {
            uls.map((item, index) => (
              <li key={ item.icon } onClick={ index === 0 ? this.handleReloadCityMid : handleChangeCityClick }>
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
}
