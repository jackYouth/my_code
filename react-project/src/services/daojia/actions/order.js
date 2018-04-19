import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { merge } from 'ramda'
import { afterOrdering, get, send } from 'business'

export const checkAddressAvail = paras => dispatch => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  paras.userId = userId
  if (!paras.mapType) {
    paras.mapType = 'baidu'
  }
  send('/daojia/v1/order/address', paras).then(({ code, message }) => {
    if (code === 0) {
      const addressAvail = true
      dispatch({ type: 'SET_ADDRESS_AVAIL', addressAvail })
    } else {
      dispatch({ type: 'SET_ADDRESS_AVAIL', addressAvail: false })
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}

export const getBestAddress = () => dispatch => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  const selectedCity = getStore('selectedCity', 'session')
  const { longitude, latitude } = selectedCity
  const paras = { userId, longitude, latitude }
  const industryCode = getStore('industryCode', 'session')
  const goodDetails = getStore(`selectGood_${ industryCode }`, 'session').goodDetails
  const { serviceId } = goodDetails
  paras.mapType = 'gaode'
  get('/user/v1/contact', paras).then(({ code, data, message }) => {
    if (code === 0) {
      if (data) {
        dispatch({ type: 'SET_CURRENT_ADDRESS', contact: data })
        const checkParas = {
          serviceId,
          contactId: data.contactId,
        }
        dispatch(checkAddressAvail(checkParas))
      }
    } else if (code === 1001) {
      dispatch({ type: 'SET_CURRENT_ADDRESS', contact: '' })
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}

export const placeOrder = paras => () => {
  const closeLoading = Loading()
  const orderType = getStore('industryCode', 'session')
  const userId = getStore('customerUserId', 'session')
  const userPhone = getStore('userPhone', 'session')
  const channel = getStore('channel', 'session')
  paras = merge(paras)({ orderType, userId, userPhone, channel })
  send('/daojia/v1/order', paras).then(({ code, data, message }) => {
    if (code === 0) {
      afterOrdering(data)
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}

export const getPersonality = () => dispatch => {
  const closeLoading = Loading()
  const industryCode = getStore('industryCode', 'session')
  const goodDetails = getStore(`selectGood_${ industryCode }`, 'session').goodDetails
  const { serviceId } = goodDetails
  get('/daojia/v1/service/personality', { serviceId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_PERSONALITY', personality: data })
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}
