import { setStore, getStore } from '@boluome/common-lib'
import customer from './customer'

let getLocationCallback

const { BMap } = window

// 根据坐标通过百度SDK获取当前地址
const getCurrentPosition = point => {
  const BPoint = new BMap.Point(point.longitude, point.latitude)
  const BCoder = new BMap.Geocoder()
  BCoder.getLocation(BPoint, ({ address, addressComponents }) => {
    setStore('currentAddress', address, 'session')
    setStore('currentPosition', addressComponents, 'session')
    getLocationCallback()
  })
}

// 用车临时将91ala定位用的高德坐标值转化百度坐标值
const transformLocation = point => {
  console.log(11111, point)
  if (BMap) {
    const { longitude, latitude } = point
    const { Convertor, Point } = BMap
    const convertor  = new Convertor()
    const baiduPoint = new Point(longitude, latitude)
    convertor.translate([baiduPoint], 3, 5, ({ points }) => {
      if (Array.isArray(points) && points.length > 0) {
        const { lat, lng } = points[0]
        getCurrentPosition({ latitude: lat, longitude: lng })
      }
    })
  } else {
    console.log('no BMap')
  }
}

// 处理坐标
const processingPoint = point => {
  setStore('geopoint', point, 'session')
  transformLocation(point)
}
// 百度获取坐标需更新
const baiduLocation = () => {
  new BMap.Geolocation().getCurrentPosition(reply => {
    const { lat, lng } = reply.point
    processingPoint({ latitude: lat, longitude: lng })
  })
}
export default (
  callback => {
    getLocationCallback = callback
    const geopoint = getStore('geopoint', 'session')
    if (geopoint !== null && typeof geopoint !== 'undefined') {
      processingPoint(geopoint)
    } else {
      const { getLocation = () => {} } = customer('bridge')
      getLocation((err, point) => {
        if (err) {
          // console.log(err)
          baiduLocation()
        } else if (!(point && point.latitude && point.longitude)) {
          baiduLocation()
        } else {
          processingPoint(point)
        }
      })
    }
  }
)
