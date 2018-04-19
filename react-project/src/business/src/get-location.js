/* eslint-disable */
import { setStore, getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import customer from './customer'

let getLocationCallback

const { AMap } = window

const closeLoading = Loading()

// 根据坐标通过高德SDK获取当前地址
const getCurrentPosition = point => {
  console.log('in getCurrentPosition')
  let geocoder
  AMap.service('AMap.Geocoder', () => {
    geocoder = new AMap.Geocoder()
  })
  console.log('geocoder', geocoder)
  const doIt = () => {
    console.log('in doIt')
    geocoder.getAddress([point.longitude, point.latitude], (status, result) => {
      if (status === 'complete') {
        const { regeocode } = result
        const { formattedAddress, addressComponent } = regeocode
        if (!addressComponent.city) {
          addressComponent.city = addressComponent.province
        }
        setStore('currentAddress', formattedAddress, 'session')
        setStore('currentPosition', addressComponent, 'session')
      }
      console.log('Amap getLocation success result', result)
      getLocationCallback(null, result)
      closeLoading()
    })
  }
  if (!geocoder) {
    console.log('no geocoder', geocoder)
    setTimeout(() => {
      doIt()
    }, 500)
  } else {
    console.log('in else')
    doIt()
  }
}
// 处理坐标
const processingPoint = point => {
  setStore('geopoint', point, 'session')
  console.log('point', point)
  getCurrentPosition(point)
}
// 高德获取坐标需更新
const gaodeLocation = () => {
  console.log('in gaodeLocation')
  const { AMap } = window
    console.log('in gaodeLocation', AMap)
    if (AMap) {
      console.log('has AMap')
      const node = document.createElement('div')
      node.id = 'iCenter'
      document.body.appendChild(node)
      const mapObj = new window.AMap.Map('iCenter')
      let geolocation
      mapObj.plugin('AMap.Geolocation', () => {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout:            10000,
          showButton:         true,
          zoomToAccuracy:     true,
        })
        mapObj.addControl(geolocation)
        if (geolocation) {
          console.log('has geolocation')
          geolocation.getCurrentPosition((status, result) => {
            console.log('定位:', status, result)
            if (status === 'complete') {
              const { lat, lng } = result.position
              console.log('AMap getCurrentPosition Success', lat, lng)
              getLocationCallback(null, { latitude: lat, longitude: lng })
            } else {
              console.log('AMap err', status)
            }
          })
        } else {
          console.log('no geolocation')
        }
      })
    } else {
      getLocationCallback('no AMap')
      console.log('has not AMap')
    }
  // const node = document.createElement('div')
  // node.id = 'iCenter'
  // document.body.appendChild(node)
  // console.log('node111', node)
  // console.log('AMap111', window.AMap)
  // mapObj = new window.AMap.Map('iCenter');
  // console.log('geolocation111', geolocation)
  // let geolocation
  // mapObj.plugin('AMap.Geolocation', function () {
  //   geolocation = new AMap.Geolocation({
  //       enableHighAccuracy: true,//是否使用高精度定位，默认:true
  //       timeout: 10000,          //超过10秒后停止定位，默认：无穷大
  //       showButton: true,        //显示定位按钮，默认：true
  //       zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
  //   });
  //   mapObj.addControl(geolocation)
  //   // geolocation.getCurrentPosition()
  // })
  // console.log('geolocation222', geolocation)
  // geolocation.getCurrentPosition((status, result) => {
  //   console.log('定位:', status, result)
  //   closeLoading()
  // })
  // const test = new window.AMap.Geolocation()
  // console.log('test', test)
  // test.getCurrentPosition((status, reply) => {
  //   console.log('in AMap.Geolocation()')
  //   if (status === 'complete') {
  //     console.log('AMap complete', status)
  //     const { lat, lng } = reply.position
  //     // console.log('reply.position', reply.position)
  //     console.log('AMap complete2', lat, lng)
  //     processingPoint({ latitude: lat, longitude: lng })
  //   } else {
  //     console.log('AMap err', status)
  //   }
  // })
  const node = document.createElement('div')
  node.id = 'iCenter'
  document.body.appendChild(node)
  const mapObj = new window.AMap.Map('iCenter')
  let geolocation
  mapObj.plugin('AMap.Geolocation', () => {
    geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout:            10000,
      showButton:         true,
      zoomToAccuracy:     true,
    })
    mapObj.addControl(geolocation)
    if (geolocation) {
      console.log('has geolocation')
      geolocation.getCurrentPosition((status, result) => {
        console.log('定位:', status, result)
        if (status === 'complete') {
          const { lat, lng } = result.position
          console.log('AMap getCurrentPosition Success', lat, lng)
          processingPoint({ latitude: lat, longitude: lng })
          // getLocationCallback(null, { latitude: lat, longitude: lng })
        } else {
          getLocationCallback('AMap err')
          console.log('AMap err in getCurrentPosition', status)
        }
      })
    } else {
      console.log('no geolocation')
    }
  })
}
export default (
  callback => {
    console.log('in getLocation```````')
    getLocationCallback = callback
    const geopoint = getStore('geopoint', 'session')
    if (geopoint !== null && typeof geopoint !== 'undefined') {
      console.log('in getLocation``````` if')
      processingPoint(geopoint)
    } else {
      console.log('in getLocation``````` else')
      const { getLocation = () => {} } = customer('bridge')
      const handleClose = Loading()
      getLocation((err, point) => {
        if (err) {
          // console.log(err)
          console.log('in getLocation``````` else1')
          gaodeLocation()
        } else if (!(point && point.latitude && point.longitude)) {
          console.log('in getLocation``````` else2')
          gaodeLocation()
        } else {
          processingPoint(point)
        }
      })
      handleClose()
    }
  }
)
