/* eslint-disable */
import { setStore, getStore } from '@boluome/common-lib'
// import { Loading } from '@boluome/oto_saas_web_app_component'
import customer from './customer'

let getLocationCallback
let geoLocationTimer
// const closeLoading = Loading()
const { AMap } = window

// 处理高德返回的地址信息
const saveAddressInfo = (geopoint, formattedAddress, addressComponent) => {
  console.log('需解析的地址信息', geopoint, formattedAddress, addressComponent)
  if (!addressComponent.city) {
    addressComponent.city = addressComponent.province
  }
  setStore('geopoint', geopoint, 'session')
  setStore('currentAddress', formattedAddress, 'session')
  setStore('currentPosition', addressComponent, 'session')
  getLocationCallback(null, addressComponent)
}

// 根据坐标通过高德SDK解析出当前地址
const pointToAddress = point => {
  AMap.service('AMap.Geocoder', () => {
    const geocoder = new AMap.Geocoder()
    console.log('in geocoder：', geocoder)
    geocoder.getAddress([point.longitude, point.latitude], (status, result) => {
      console.log('geocoder result：', status, result)
      if (status === 'complete') {
        const { formattedAddress, addressComponent } = result.regeocode
        saveAddressInfo(point, formattedAddress, addressComponent)
      } else {
        getLocationCallback('geocoder error!')
      }
    })
  })
}

// 高德获取坐标需更新
const gaodeLocation = () => {
  console.log('in gaodeLocation', '调用高德地位方法')
  const { Map } = window.AMap
  const node = document.createElement('div')
  const mapObj = new Map(node)
  mapObj.plugin('AMap.Geolocation', () => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout:            500,
      showButton:         true,
      zoomToAccuracy:     true,
    })
    if (geolocation) {
      const test = (times = 1) => {
        console.log('调用getCurrentPosition方法')
        geolocation.getCurrentPosition((status, result) => {
          console.log('getCurrentPosition result:', status, result)
          if (status === 'complete') {
            const { position, formattedAddress, addressComponent } = result
            const { lat, lng } = position
            saveAddressInfo({ latitude: lat, longitude: lng }, formattedAddress, addressComponent)
          } else if (status !== 'complete' && times < 10) {
            console.log('geolocation filed---->', times)
            times++
            geoLocationTimer = setInterval(test(times), 2000)
          } else {
            clearInterval(geoLocationTimer)
            getLocationCallback('AMap err')
          }
        })
      }
      test()
    } else {
      getLocationCallback('no geolocation')
      console.log('no geolocation')
    }
  })
}


export default (
  callback => {
    console.log('in getLocation---->', '进入business中getLocation方法')
    getLocationCallback = callback
    const geopoint = getStore('geopoint', 'session')
    const currentPosition = getStore('currentPosition', 'session')
    if (geopoint !== null && typeof geopoint !== 'undefined' && currentPosition) {
      console.log('in getLocation if ----->', '本地已有地址信息，不执行定位')
      getLocationCallback(null, currentPosition)
    } else {
      const { getLocation = () => {} } = customer('bridge')
      console.log('in getLocation else0 ----->', '进入customize中getLocation方法')
      getLocation((err, point) => {
        console.log('customize中getLocation方法返回的定位信息：', err, point)
        if (err || !(point && point.latitude && point.longitude)) {
          console.log('in getLocation else1 ----->', 'customize中getLocation方法中没有返回可用的经纬度，执行高德地位')
          gaodeLocation()
        } else {
          console.log('in getLocation else2 ----->', 'customize中getLocation方法成功，使用返回经纬度，解析出地址信息')
          pointToAddress(point)
        }
      })
    }
  }
)
