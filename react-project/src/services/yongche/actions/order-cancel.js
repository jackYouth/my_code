import { getStore } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { send } from './'

import { cancelOrder } from './order-id'

export const putCancleReason = reason => dispatch => {
  const id = location.pathname.split('/')[3]
  send('/order/v1/cancel_reason', { orderType: 'yongche', id, reason }).then(({ code, message }) => {
    if (code === 0) {
      const channel = getStore('channel', 'session')
      // status等于2表示是从cancel页面执行的cancelOrder命令
      dispatch(cancelOrder(2, channel, reason))
    } else {
      Toast.fail(message)
    }
  })
}
