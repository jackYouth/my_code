import { browserHistory } from 'react-router'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get, send } from '../ajax'

export const getRefundInfo = () => dispatch => {
  const closeLoading = Loading()
  const orderType = location.pathname.split('/')[3]
  const id = location.pathname.split('/')[4]
  get(`/order/v1/${ orderType }/${ id }/info`).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_CURRENT_REFUND_INFO', currentRefundInfo: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const refundCancel = (id, originId, originOrderType) => () => {
  const closeLoading = Loading()
  get(`/order/v1/refund/${ id }/cancel`).then(({ code, message }) => {
    if (code === 0) {
      browserHistory.push(`/shangcheng/order/${ originOrderType }/${ originId }`)
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const getExpressInfo = expressId => dispatch => {
  const closeLoading = Loading()
  get('/mms/v1/express/enterprise', { expressId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_CURRENT_EXPRESS_INFO', expressInfo: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const placeExpress = paras => dispatch => {
  const closeLoading = Loading()
  send('/order/v1/logistics/submit', paras).then(({ code, message }) => {
    if (code === 0) {
      dispatch(getRefundInfo())
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const getExpressList = (orderId, callback) => {
  const closeLoading = Loading()
  get('/mall/v1/pay/express', { orderId }).then(({ code, data, message }) => {
    if (code === 0) {
      callback(data)
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
