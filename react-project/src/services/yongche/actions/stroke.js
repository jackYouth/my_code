import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from './'

// 获取订单列表
export const getOrderList = () => dispatch => {
  const userId = getStore('customerUserId', 'session')
  const channel = location.pathname.split('/')[2]
  const closeLoading = Loading()
  get('/yongche/v1/trip/list', { userId, channel }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'GET_ORDER_LIST', orderList: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
