import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get, send } from 'business'

export const getOrderInfo = id => dispatch => {
  const orderType = 'daijia'
  console.log(2222222)
  get(`/order/v1/${ orderType }/${ id }/info`).then(({ code, data, message }) => {
    if (code === 0) {
      const { status } = data
      dispatch({ type: 'GET_ORDER_INFO', orderInfo: data })
      if (window.orderTimer && (status === 4 || status === 8)) {
        clearInterval(window.orderTimer)
        delete window.orderTimer
      }
    } else {
      Toast.fail(message)
    }
  }).catch(message => console.log('getOrderInfo+', message))
}

export const cancelOrder = id => dispatch => {
  const closeLoading = Loading()
  const orderType = 'daijia'
  const channel = 'e'
  const paras = { channel, orderType, id }
  send('/order/v1/cancel', paras).then(({ code, message }) => {
    if (code === 0) {
      dispatch(getOrderInfo(id))
    } else {
      Toast.fail(message)
    }
    closeLoading()
  }).catch(message => console.log('cancelOrder', message))
}

