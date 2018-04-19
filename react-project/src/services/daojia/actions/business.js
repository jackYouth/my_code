import { parseQuery, getStore, setStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from 'business'
import { merge } from 'ramda'

export const getBusinessData = () => dispatch => {
  const closeLoading = Loading()
  const brandId = parseQuery(location.search).brandId
  let paras = {
    brandId,
    limit:  1,
    offset: 10,
  }
  const selectedCity = getStore('selectedCity', 'session')
  const { longitude, latitude, city, county } = selectedCity
  paras = merge(paras)({ longitude, latitude, city, county })
  get('/daojia/v1/brand/message', paras).then(({ code, data, message }) => {
    if (code === 0) {
      setStore('channel', data.brandCode, 'session')
      const businessData = data
      businessData.industryCategoryBoList.unshift({ industryCategoryId: 0, industryCategoryName: '全部服务' })
      dispatch({ type: 'SET_BUSINESS_DATA', businessData })
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}

export const getBrandGoods = currentIndustryCategoryId => dispatch => {
  const closeLoading = Loading()
  const brandId = parseQuery(location.search).brandId
  let paras = {
    brandId,
    limit:              1,
    offset:             10,
    industryCategoryId: currentIndustryCategoryId,
  }
  const selectedCity = getStore('selectedCity', 'session')
  const { longitude, latitude, city, county } = selectedCity
  paras = merge(paras)({ longitude, latitude, city, county })
  get('/daojia/v1/brand/services', paras).then(({ code, data, message }) => {
    if (code === 0) {
      const currentServiceVoList = data.serviceVoList
      dispatch({ type: 'SET_CURRENT_SERVICE', currentServiceVoList })
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}
