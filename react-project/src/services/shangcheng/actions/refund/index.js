import { browserHistory } from 'react-router'
import { parseQuery } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get, send } from '../ajax'

export const getOrderInfo = (id, orderType) => dispatch => {
  const closeLoading = Loading()
  get(`/order/v1/${ orderType }/${ id }/info`).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_CURRENT_ORDER_INFO', currentOrderInfo: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const placeRefundOrder = paras => () => {
  const closeLoading = Loading()
  const refundId = parseQuery(location.search).refundId
  let url = '/order/v1/refund/order'
  if (refundId) {
    url = '/order/v1/refund/update'
    paras.orderId = refundId
    paras.orderType = 'refund'
  }
  send(url, paras).then(({ code, data, message }) => {
    if (code === 0) {
      browserHistory.push(`/shangcheng/refundInfo/refund/${ data.id }`)
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
