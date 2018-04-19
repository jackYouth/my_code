import { browserHistory } from 'react-router'
import { Toast, Modal } from 'antd-mobile'
import { getStore, setStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { merge } from 'ramda'
import { afterOrdering } from 'business'
import coordtransform from 'coordtransform'

import { get, send } from './'

// 创建订单
export const createOrder = orderPara => dispatch => {
  const closeLoading = Loading()
  const userPhone = getStore('userPhone', 'session')
  const customerUserId = getStore('customerUserId', 'session')
  const channel = location.pathname.split('/')[2]
  // const imei = getStore('imei', 'session')
  const isSinglePrice = getStore('isSinglePrice', 'session')
  orderPara = merge(orderPara)({ userPhone, customerUserId, channel })
  // 如果productType是14，但是不是现在出发，就将productType换成13, 该表达式要放在改变departureTime之前
  if (orderPara.departureTime.length !== 2 && orderPara.productType === 14) orderPara.productType = 13
  if (orderPara.departureTime.length === 2) orderPara.departureTime = 'instant'
  // if (orderPara.departureTime.length === 2) orderPara.departureTime = moment('YYYY-MM-DD HH:mm')(new Date())
  if (!orderPara.contactPhone) {
    orderPara.contactPhone = userPhone
  }
  if (orderPara.flightNo && channel === 'shenzhou') orderPara.departureTime = ''
  const originPoint = coordtransform.gcj02tobd09(orderPara.origin.longitude, orderPara.origin.latitude)
  const destinationPoint = coordtransform.gcj02tobd09(orderPara.destination.longitude, orderPara.destination.latitude)
  orderPara.origin.longitude = originPoint[0]
  orderPara.origin.latitude = originPoint[1]
  orderPara.destination.longitude = destinationPoint[0]
  orderPara.destination.latitude = destinationPoint[1]
  orderPara.mapType = 'baidu'
  send('/yongche/v1/order', orderPara).then(({ code, data, message }) => {
    if (code === 0) {
      const { id } = data
      // 将下单成功的时间存到本地，不管是在首页下单，还是在详情页通过继续叫车下的单
      // setStore(`startTime_${ id }`, moment('YYYY-MM-DD HH:mm:ss')(new Date()))

      // 如果是一口价模式，不跳转页面，显示支付footer
      if (isSinglePrice) {
        afterOrdering(data)
        setTimeout(() => closeLoading(), 2000)
        return
      }
      // 如果是一口价模式，跳转到订单详情页
      browserHistory.push(`/yongche/order/${ id }`)
    } else if (code === 1000) {
      // 将已有的预估价格和时间清除
      if (orderPara.flightNo) {
        dispatch({ type: 'SET_FLIGHTNO_ERROR_INFO', flightNoError: true, flightNoErrorMessage: message })
        closeLoading()
        return
      }
      Toast.fail(message, 1)
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}

// 获取预估接驾时间
export const getEstimate = estimatePara => dispatch => {
  const closeLoading = Loading()
  const channel = location.pathname.split('/')[2]
  const { flightNo } = estimatePara
  let { departureTime, productType } = estimatePara
  // 如果productType是14，但是不是现在出发，就将productType换成13, 该表达式要放在改变departureTime之前
  if (departureTime.length !== 2 && departureTime !== 'instant' && productType === 14) productType = 13
  // 将productType保存到本地，供price-rules中，判断当前预估价的计价规则时使用
  setStore('productType', productType, 'session')
  // if (departureTime.length === 2) departureTime = moment('YYYY-MM-DD HH:mm')(new Date())
  if (departureTime.length === 2) departureTime = 'instant'
  if (flightNo && channel === 'shenzhou') departureTime = ''

  estimatePara = merge(estimatePara)({ channel, departureTime, productType })
  // 坐标转换：高德 -> 百度 (如果是切换类型请求的，这时保存的坐标就已经是转换之后的了)
  if (!estimatePara.mapType) {
    const startPoint = coordtransform.gcj02tobd09(estimatePara.startLongitude, estimatePara.startLatitude)
    const endPoint = coordtransform.gcj02tobd09(estimatePara.endLongitude, estimatePara.endLatitude)
    estimatePara.startLongitude = startPoint[0]
    estimatePara.startLatitude = startPoint[1]
    estimatePara.endLongitude = endPoint[0]
    estimatePara.endLatitude = endPoint[1]
    estimatePara.mapType = 'baidu'
  }
  get('/yongche/v1/estimate', estimatePara).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_ESTIMATA', estimate: data, [`estimatePara${ productType }`]: estimatePara })
      // 显示底部支付框
      dispatch({ type: 'SET_PAY_FOOTER_VISIBLE', payFooterShow: true })
    } else if (code === 1000) {
      // 将已有的预估价格和时间清除
      dispatch({ type: 'SET_ESTIMATA', estimate: '', [`estimatePara${ productType }`]: estimatePara })
      if (flightNo) {
        dispatch({ type: 'SET_FLIGHTNO_ERROR_INFO', flightNoError: true, flightNoErrorMessage: message })
      } else {
        Toast.fail(message, 1)
      }
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}


// 检查是否有带支付或行程中订单
export const checkOrder = () => dispatch => {
  const channel = getStore('channel', 'session')
  const phone = getStore('userPhone', 'session')
  const isSinglePrice = getStore('isSinglePrice', 'session')
  dispatch({ type: 'SET_ORDER_STATUE', hasUnpay: false, hasInStroke: false })
  get('/yongche/v1/order/ongoing', { channel, phone }).then(({ code, data, message }) => {
    if (code === 0) {
      // data = [{ status: 2, id: '898' }]        // mock
      if (data.length > 0) {
        const { status, id } = data.pop()
        if (status === 2 && !isSinglePrice) {
          const hasUnpay = true
          dispatch({ type: 'SET_ORDER_STATUE', hasUnpay, orderId: id })
        }
        if (status === 2 && isSinglePrice) {
          // 如果有行程中的订单，弹出确认框
          Modal.alert('您有一个待支付的订单，是否进入？', '', [
            { text: '否', onPress: () => console.log('cancel') },
            { text: '是', onPress: () => browserHistory.push(`/yongche/order/${ id }`) },
          ])
        }
        if (status === 9 && isSinglePrice) {
          // 如果有行程中的订单，弹出确认框
          Modal.alert('您有一个行程中的订单，是否进入？', '', [
            { text: '否', onPress: () => console.log('cancel') },
            { text: '是', onPress: () => browserHistory.push(`/yongche/order/${ id }`) },
          ])
        }
        if (status === 9 && !isSinglePrice) {
          dispatch({ type: 'SET_ORDER_STATUE', hasInStroke: true, orderId: id })
        }
      }
    } else {
      Toast.fail(message, 1)
    }
  })
}


// 获取附近车型（接口版）    (只有在选择起、始地和切换类型至送机模式时默认已有起始地的情况下)
export const getNearbyCar = estimatePara => dispatch => {
  const channel = location.pathname.split('/')[2]
  const closeLoading = Loading()
  const { startLatitude, startLongitude, productType } = estimatePara
  const paras = {
    channel,
    productType,
    latitude:  startLatitude,
    longitude: startLongitude,
  }
  get('/yongche/v1/ride/types', paras).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_NEARBY_CAR', [`nearbyCarInfo${ productType }`]: data, [`currentCarInfo${ productType }`]: data[0] })
      estimatePara.rideType = data[0].rideType
      dispatch(getEstimate(estimatePara))
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}

// // 获取附近车型（写死版）
// export const getNearbyCar = () => dispatch => {
//   const channel = location.pathname.split('/')[2]
//   let nearbyCarInfo = [
//     { name: '舒适型', rideType: 'compact' },
//     { name: '商务型', rideType: 'premium' },
//     { name: '豪华型', rideType: 'luxury' },
//   ]
//   // 如果channel等于shenzhou，将将附近车型写死为神州对应的车型
//   if (channel === 'shenzhou') {
//     nearbyCarInfo = [
//       { rideType: 2, name: '公务轿车' },
//       { rideType: 3, name: '商务7座' },
//       { rideType: 4, name: '豪华轿车' },
//     ]
//   }
//   dispatch({ type: 'SET_NEARBY_CAR', nearbyCarInfo })
// }

// 根据城市信息获取经纬度
const cityDataToPoint = (address, cityName, callBack) => {
  const geocoder = new window.AMap.Geocoder()
  geocoder.getLocation(address, callBack)
  // geocoder.getPoint(address, callBack, cityName)
}

// 根据经纬度获取城市信息
const pointToCityData = (point, callBack) => {
  window.AMap.service('AMap.Geocoder', () => {
    const geocoder = new window.AMap.Geocoder({
      radius:     1000,
      extensions: 'all',
    })
    geocoder.getAddress(point, callBack)
  })
}

// 根据城市名获取经纬度，再根据经纬度去获取当前城市的信息, cityData: 当前城市的名称和id，type设置出发点还是到达点，productType设置产品类型
export const setDefaultPoint = cityData => dispatch => {
  const cTpCallback = (status, res) => {
    if (status === 'complete') {
      // 获得了有效的地址信息:
      const longitude = res.geocodes[0].location.lng
      const latitude = res.geocodes[0].location.lat

      const pTcCallback = (sta, data) => {
        if (sta === 'complete') {
          const { regeocode } = data
          const title = regeocode.pois.length > 0 ? regeocode.pois[0].name : '附近无可选上车地点'
          const detail = regeocode.pois.length > 0 ? regeocode.pois[0].address : '附近无可选上车地点'
          const pointData = merge(cityData)({ title, detail, latitude, longitude })
          // 需求：选择接、送机时，终、起点默认为当前城市的中心，所以有此操作
          setStore('defaultCityCenterObj', pointData, 'session')
          setStore('defaultPointObj', pointData, 'session')
          dispatch({ type: 'SET_START_POINT_OBJ', defaultCityCenterObj: pointData, defaultPointObj: pointData })
        } else {
          // 获取地址失败
          console.log('经纬度转化城市名失败')
        }
      }

      pointToCityData([longitude, latitude], pTcCallback)
    } else {
      // 获取地址失败
      console.log('城市名转化经纬度失败')
    }
  }
  cityDataToPoint(cityData.name, cityData.name, cTpCallback)
}


// 根据经纬度，解析出对应地址，作为默认的地址
export const setStartPointInLocation = (point, productType, cityData) => dispatch => {
  const closeLoading = Loading()
  // 获取附近地标，作为上车地点
  const callback = (status, reply) => {
    if (status === 'complete') {
      const title = reply.regeocode.pois.length > 0 ? reply.regeocode.pois[0].name : '附近无可选上车地点'
      const detail = reply.regeocode.pois.length > 0 ? reply.regeocode.pois[0].address : '附近无可选上车地点'
      const startPointObj = merge(cityData)({ title, detail, ...point })
      setStore('defaultPointObj', startPointObj, 'session')
      setStore(`startPointObj${ productType }`, startPointObj, 'session')
      setStore(`start_selectedCity${ productType }`, startPointObj, 'session')
      dispatch({ type: 'SET_START_POINT_OBJ', [`startPointObj${ productType }`]: startPointObj, defaultPointObj: startPointObj })
      dispatch({ type: 'SET_START_POINT_STR', [`startPointStr${ productType }`]: title })
      closeLoading()
      if (window.closeLoading) {
        window.closeLoading()
        delete window.closeLoading
      }
    } else {
      // 获取地址失败
      console.log('经纬度转化城市名失败')
    }
  }
  pointToCityData([Number(point.longitude), Number(point.latitude)], callback)
}

// 获取机场列表, type: 当前是起点还是终点
export const setStartPointInAirport = (type, productType, cityData) => dispatch => {
  const closeLoading = Loading()
  const channel = getStore('channel', 'session')
  // 如果session中保存有选中的地址，就使用地址里的id，如果没有，就使用start_selecctedCity的id，因为初始化时肯定保存了start_selecctedCity，不然会重新选择城市
  let cityId = cityData.id
  if (channel === 'didi') cityId = cityData.name

  get('/yongche/v1/city/airport', { channel, cityId }).then(({ code, data, message }) => {
    if (code === 0) {
      const { name, terminalCode } = data[0]
      const longitude = coordtransform.bd09togcj02(data[0].longitude, data[0].latitude)[0]
      const latitude = coordtransform.bd09togcj02(data[0].longitude, data[0].latitude)[1]
      let { address = '' } = data[0]
      if (!address) address = name
      // 将机场坐标获取详细地址，用于地图时，搜索驾车路径
      const airportCallback = (status, res) => {
        const title = res.regeocode.pois.length > 0 ? res.regeocode.pois[0].name : '附近无可选上车地点'
        const detail = res.regeocode.pois.length > 0 ? res.regeocode.pois[0].address : '附近无可选上车地点'
        const startPointObj = merge(cityData)({ latitude, longitude, title, detail, code: data[0].code, terminalCode })
        setStore(`${ type }PointObj${ productType }`, startPointObj, 'session')
        setStore(`${ type }_selectedCity${ productType }`, startPointObj, 'session')
        dispatch({ type: `SET_${ type.toUpperCase() }_POINT_OBJ`, [`${ type }PointObj${ productType }`]: startPointObj })
        dispatch({ type: `SET_${ type.toUpperCase() }_POINT_STR`, [`${ type }PointStr${ productType }`]: name })
        if (type === 'end') {
          // 因为默认起点是defaultPointObj，终点也默认了，这时就需要获取预估价格了,又因为这个只会在初始化时才会执行，所有所有参数都是默认
          const defaultPointObj = getStore('defaultPointObj', 'session')
          setStore(`startPointObj${ productType }`, defaultPointObj, 'session')
          setStore(`start_selectedCity${ productType }`, defaultPointObj, 'session')
          dispatch({ type: 'SET_START_POINT_OBJ', [`startPointObj${ productType }`]: defaultPointObj })
          dispatch({ type: 'SET_START_POINT_STR', [`startPointStr${ productType }`]: defaultPointObj.title })
          const estimatePara = {
            startLatitude:  defaultPointObj.latitude,
            startLongitude: defaultPointObj.longitude,
            startAddress:   defaultPointObj.detail,
            endLatitude:    latitude,
            endLongitude:   longitude,
            endAddress:     address,
            rideType:       channel === 'shenzhou' ? 2 : 'compact',
            departureTime:  channel === 'didi' && getStore('isSinglePrice', 'session') ? getStore('firstReverseTime', 'session') : ['今天', '现在'],
            airCode:        data[0].code,
            productType,
          }
          dispatch(getNearbyCar(estimatePara))
        }
      }
      pointToCityData([Number(longitude), Number(latitude)], airportCallback)
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
    if (window.closeLoading) {
      window.closeLoading()
      delete window.closeLoading
    }
  })
}

// 根据当前productType，来设置startPoint相关信息
export const setStartPoint = (point, productType, cityData) => dispatch => {
  if (productType === 'jieji' || productType === 7) {
    dispatch(setStartPointInAirport('start', productType, cityData))
    dispatch(setDefaultPoint(cityData))
  } else {
    dispatch(setStartPointInLocation(point, productType, cityData))
  }
}

// 检查当前城市，是否存在与城市列表中, 并根据productType来设置startPointObj
export const checkSupportThisCity = (point, city, productType) => dispatch => {
  let supportThisCity = false
  const channel = getStore('channel', 'session')
  const api = '/yongche/v1/cities'
  const body = { channel, type: 'start', productType }
  // 先获取定位城市对应的id
  get(api, body).then(({ code, data, message }) => {
    if (code === 0) {
      let cityData = data.filter(item => item.name === city)
      if (cityData.length === 1) {
        supportThisCity = true
        // 将找到的城市信息保存到本地
        cityData = cityData[0]
        // 如果当前是didi接口返回的城市列表，那么字段中就没有id，而是channelCityId，这就要进行一个转换
        if (!cityData.id) cityData.id = cityData.channelCityId
      }
      // 设置该城市的支持信息
      dispatch({ type: 'SET_PRODUCT_SUPPORT_THIS_CITY', supportThisCity })
      dispatch(setStartPoint(point, productType, cityData))
    } else {
      Toast.fail(message, 1)
    }
  })
}

// 获取附近支持产品类型
export const getNearbyProduct = (city, point) => dispatch => {
  const channel = location.pathname.split('/')[2]
  const transformPoint = coordtransform.gcj02tobd09(point.longitude, point.latitude)
  const paras = merge({ longitude: transformPoint[0], latitude: transformPoint[1] })({ channel })
  paras.mapType = 'baidu'
  get('/yongche/v1/product/types', paras).then(({ code, data, message }) => {
    if (code === 0) {
      const currentProductCode = getStore('currentProduct', 'session') ? getStore('currentProduct', 'session').code : ''
      let products = data
      if (products.length >= 0) {
        // 如果是神州，13和14合并成一个专车，默认使用的是14立即叫车，后期如果不是立即叫车，再把code改成13
        if (channel === 'shenzhou') {
          products = []
          data.forEach(item => {
            if (item.code === 7 || item.code === 8) {
              products.push(item)
            }
            if (item.code === 14) {
              item.name = '专车'
              products.unshift(item)
            }
          })
        }
        // 当当前链接中的product在列表中时，不改变currenProduct
        let currentProduct = products[0]
        products.forEach(item => {
          if (currentProductCode === item.code) {
            currentProduct = item
            return true
          }
        })
        dispatch({ type: 'SET_CURRENT_PRODUCT', currentProduct, products })
        setStore('currentProduct', currentProduct, 'session')
        dispatch(checkSupportThisCity(point, city, currentProduct.code))
      }
      // 如果附近没有服务，使用默认值
      // if (data.length === 0) {
      //   return
      // }
      // 如果附近有服务，默认使用第一个服务，然后去获取附近对应的车型
      // const nearCarPara = merge(point)({ productType: data[0].code })
      // dispatch(getNearbyCar(nearCarPara))
    } else {
      Toast.fail(message, 1)
    }
  })
}


// 获取首页初始化配置
export const getIndexInit = (name, point) => dispatch => {
  window.closeLoading = Loading()
  dispatch(getNearbyProduct(name, point))
  // dispatch(getNearbyCar())
}
