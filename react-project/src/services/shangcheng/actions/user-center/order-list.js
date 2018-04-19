import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from '../ajax'

export const getOrderList = (filter = '') => dispatch => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  get('/mall/v1/pay/orders', { filter, userId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_ORDER_LIST', orderList: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
