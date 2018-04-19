import { getStore, setStore } from '@boluome/common-lib'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import { get } from 'business'

export const fetchCategories = choosePoint => dispatch => {
  // console.log('choosePoint-------->', choosePoint)
  let mapType = 'gaode'
  if (choosePoint !== undefined && choosePoint.mapType) {
    mapType = choosePoint.mapType
  }
  const geopoint = !choosePoint ? getStore('geopoint', 'session') : choosePoint
  // const mapType = choosePoint && !choosePoint.mapType ? 'gaode' : choosePoint.mapType
  get('/waimai/v1/categories', { channel: 'ele', ...geopoint, mapType })
  .then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({
        type:       'GET_CATEGORY',
        categories: data,
      })
    } else {
      console.log('fetchCategories', message)
    }
  }).catch(err => {
    console.log('fetchCategories catch', err)
  })
}

export const fetchResturants = (postdata, callback) => {
  // console.log('postdata', postdata)
  get('/waimai/v1/restaurants', postdata)
  .then(({ code, data = [], message }) => {
    if (code === 0) {
      callback(data)
    } else {
      console.log('fetchResturants', message)
    }
  }).catch(err => {
    console.log('fetchResturants catch', err)
  })
}

export const goFilter = categoryId => {
  browserHistory.push(`/waimai/Filter?categoryId=${ categoryId }`)
  return {
    type: 'GO_FILTER',
    categoryId,
  }
}

export const handleScrollTop = () => {
  const oldScrollTop = document.querySelector('.wrap').scrollTop
  return {
    type: 'OLD_SCROLLTOP',
    oldScrollTop,
  }
}

export const fetchBestContact = () => dispatch => {
  const handleClose = Loading()
  const geopoint = getStore('geopoint', 'session')
  const userId = getStore('customerUserId', 'session')
  get('/user/v1/contact', { userId, ...geopoint, mapType: 'gaode' }, {}, true)
  .then(({ code, data, message }) => {
    if (code === 0 && data.distance <= 3) {
      let choosePoint
      if (data && data.latitude && data.longitude) {
        choosePoint = {}
        choosePoint.latitude = data.latitude
        choosePoint.longitude = data.longitude
        choosePoint.mapType = data.mapType
      }
      dispatch({
        type:          'BEST_CONTACT',
        addressResult: data,
        choosePoint,
      })
      dispatch(fetchCategories(choosePoint))
    } else {
      // 用户没有可用地址返回code === 1001，不太科学
      console.log('fetch best contact code !== 0', message)
      dispatch({
        type:        'BEST_CONTACT',
        choosePoint: getStore('geopoint', 'session'),
      })
      dispatch(fetchCategories())
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log('fetchBestContact catch', err)
  })
}

export const handleAddress = (addressResult, flag) => dispatch => {
  if (addressResult) {
    if (flag === 'addedAddress') {
      // console.log('选择已有地址')
      let choosePoint
      const chooseContact = addressResult
      if (addressResult && addressResult.latitude && addressResult.longitude) {
        choosePoint = {}
        choosePoint.latitude = addressResult.latitude
        choosePoint.longitude = addressResult.longitude
        choosePoint.mapType = addressResult.mapType
      }
      // setStore('geopoint', choosePoint, 'session')
      setStore('choosepoint', choosePoint, 'session')
      dispatch(fetchCategories(choosePoint))
      dispatch({
        offset:      0,
        type:        'HANDLE_ADDRESS',
        beLocation:  false,
        locationErr: false,
        addressResult,
        choosePoint,
        chooseContact,
      })
    } else if (flag === 'newAddress') {
      // console.log('选择搜索地址')
      let choosePoint
      const chooseContact = addressResult
      if (addressResult && addressResult.location) {
        choosePoint = {}
        choosePoint.latitude = addressResult.location.lat
        choosePoint.longitude = addressResult.location.lng
      }
      // setStore('geopoint', choosePoint, 'session')
      setStore('choosepoint', choosePoint, 'session')
      dispatch(fetchCategories(choosePoint))
      dispatch({
        offset:        0,
        type:          'HANDLE_ADDRESS',
        addressResult: '',
        beLocation:    true,
        locationErr:   false,
        choosePoint,
        chooseContact,
      })
    } else {
      // console.log('定位当前位置')
      dispatch({
        offset:        0,
        type:          'HANDLE_ADDRESS',
        addressResult: '',
        chooseContact: {},
        choosePoint:   getStore('geopoint', 'session'),
        beLocation:    true,
      })
    }
  }
}

export const handleCheckdInvoice = (invoice, isVipDelivery) => {
  console.log('invoice, isVipDelivery', invoice, isVipDelivery)
  return {
    type:         'HANDLE_COMMENDFILTER',
    invoice,
    isVipDelivery,
    offset:       0,
    bInvoice:     invoice,
    bVipDelivery: isVipDelivery,
  }
}
