import { getStore, setStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'
import { Toast } from 'antd-mobile'

export const getGoodDetails = serviceId => dispatch => {
  const closeLoading = Loading()
  const industryCode = getStore('industryCode', 'session')
  get('/daojia/v1/service/details', { industryCode, serviceId }).then(({ code, data, message }) => {
    if (code === 0) {
      setStore('channel', data.brand.brandCode, 'session')
      dispatch({ type: 'SET_GOOD_DETAILS', goodDetails: data })
      // 清除已有的规格
      dispatch({ type: 'SET_CUREENT_SPECIFICATION', currentSpec: '' })
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}

export const getAllReserveTimes = serviceId => dispatch => {
  const closeLoading = Loading()
  get('/daojia/v1/service/time', { serviceId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_RESERVER_TIMES', allTimes: data })
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}
