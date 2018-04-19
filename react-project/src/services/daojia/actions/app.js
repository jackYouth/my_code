import { get } from 'business'
import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { merge } from 'ramda'

// 获取所有行业小类
export const getCategories = () => dispatch => {
  const closeLoading = Loading()
  const industryCode = getStore('industryCode', 'session')
  get('/daojia/v1/industry/category', { industryCode }).then(({ code, data, message }) => {
    if (code === 0) {
      data.unshift({ industryCategoryId: '0', industryCategoryName: '全部服务' })
      dispatch({ type: 'GET_CATEGORIES', categories: data })
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}


// 获取当前服务对应的时间
export const getSeverBusiness = () => dispatch => {
  const closeLoading = Loading()
  let paras = {
    industryCategoryId: 0,
  }
  const industryCode = getStore('industryCode', 'session')
  const selectedCity = getStore('selectedCity', 'session')
  const { longitude, latitude, city, county } = selectedCity
  paras = merge(paras)({ longitude, latitude, city, county, industryCode })
  get('/daojia/v1/category/brands', paras).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'GET_SERVER_BUSINESS', serverBusiness: data })
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}

// 获取当前服务对应的时间
export const getSeverTimes = () => dispatch => {
  const closeLoading = Loading()
  let paras = {
    industryCategoryId: 0,
  }
  const industryCode = getStore('industryCode', 'session')
  const selectedCity = getStore('selectedCity', 'session')
  const { longitude, latitude, city, county } = selectedCity
  paras = merge(paras)({ longitude, latitude, city, county, industryCode })
  get('/daojia/v1/category/service/time', paras).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'GET_SERVER_TIMES', serverTimes: data })
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}

// demo
// export const demo = () => dispatch => {
//   const closeLoading = Loading()
//   let paras = {
//     industryCategoryId: 0,
//   }
//   const industryCode = getStore('industryCode', 'session')
//   const selectedCity = getStore('selectedCity', 'session')
//   const { longitude, latitude, city, county } = selectedCity
//   paras = merge(paras)({ longitude, latitude, city, county, industryCode })
//   get('/daojia/v1/category/service/time', paras).then(({ code, data, message }) => {
//     if (code === 0) {
//       dispatch({ type: 'DEMO', demo: data })
//       console.log('demo', data)
//     } else {
//       Toast.fail(message, 1)
//     }
//     closeLoading()
//   })
// }
