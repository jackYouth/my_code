// import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
// import { merge } from 'ramda'
import { send } from './ajax'
import { getOrderList } from './user-center/order-list'

export const handleDelOrder = (orderType, orderId, filter) => dispatch => {
  const closeLoading = Loading()
  send('/mall/v1/order/remove', { orderType, orderId }, 'DELETE').then(({ code, message }) => {
    if (code === 0) {
      dispatch(getOrderList(filter))
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const handleCancelOrder = (paras, filter) => dispatch => {
  const closeLoading = Loading()
  send('/order/v1/cancel', paras).then(({ code, message }) => {
    if (code === 0) {
      dispatch(getOrderList(filter))
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const handleConfirmOrder = (id, orderType, filter) => dispatch => {
  const closeLoading = Loading()
  send(`/order/v1/update/${ id }/orderStatus`, { orderType }).then(({ code, message }) => {
    if (code === 0) {
      dispatch(getOrderList(filter))
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
