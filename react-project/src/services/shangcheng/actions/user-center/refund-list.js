import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from '../ajax'

export const getRefundList = () => dispatch => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  get(`/order/v1/${ userId }/refunds`).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_REFUND_LIST', refundList: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
