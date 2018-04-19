import { browserHistory } from 'react-router'
import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get, send } from 'business'
import { Toast } from 'antd-mobile'

export const getOngoing = () => dispatch => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  get('/daijia/v1/ongoing_orders', { userId }).then(({ code, data, message }) => {
    if (code === 0) {
      if (data) {
        dispatch({ type: 'SHOW_ONGOING_MODAL', showOngoing: true, onGoingOrder: data.id })
      }
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const getCarNum = paras => dispatch => {
  paras.channel = 'e'
  paras.gpsType = 'google'
  paras.mapType = 'gaode'
  get('/daijia/v1/drivers', paras).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'GET_CAR_NUM', carNum: data.driverCount })
    } else {
      Toast.fail(message)
    }
  })
}

export const toOrder = orderParas => {
  const closeLoading = Loading()
  orderParas.channel = 'e'
  orderParas.gpsType = 'google'
  orderParas.mapType = 'gaode'
  orderParas.userPhone = getStore('userPhone', 'session')
  orderParas.customerUserId = getStore('customerUserId', 'session')
  send('/daijia/v1/order', orderParas).then(({ code, data, message }) => {
    if (code === 0) {
      browserHistory.push(`/daijia/orderDetails/${ data.id }`)
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
