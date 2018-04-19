import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'
import { Toast } from 'antd-mobile'

export const getPriceRules = (paras, callback) => {
  const closeLoading = Loading()
  paras.channel = 'e'
  get('/daijia/v1/prices', paras).then(({ code, data, message }) => {
    if (code === 0) {
      if (data) {
        callback(data)
      }
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
