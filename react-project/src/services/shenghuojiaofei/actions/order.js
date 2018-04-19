import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { send, afterOrdering } from 'business'

export const changeOrder = paras => () => {
  const handleClose = Loading()
  send('/shenghuojiaofei/v1/order', paras, 'POST').then(({ code, data, message }) => {
    if (code === 0) {
      // window.location.href = `/cashier/${ data.id }`  // needChange_edit to pro
      afterOrdering(data)
    } else {
      handleClose()
      Toast.fail(message, 1)
    }
  }).catch(({ message }) => {
    console.log(message)
  })
}
