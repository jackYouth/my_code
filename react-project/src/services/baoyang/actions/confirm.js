import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { afterOrdering, send } from 'business'

export const saveOrder = postData => () => {
  const handleClose = Loading()
  send('/baoyang/v2/order', postData)
  .then(({ code, data, message }) => {
    if (code === 0) {
      afterOrdering(data)
    } else {
      Toast.info(message, 1)
    }
    handleClose()
  })
}
