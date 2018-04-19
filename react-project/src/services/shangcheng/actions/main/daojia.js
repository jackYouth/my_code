import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from '../ajax'

export const getDaojiaInfo = paras => dispatch => {
  const closeLoading = Loading()
  paras.mapType = 'gaode'
  get('/daojia/v1/home', paras).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_DAOJIA_INFO', daojiaInfo: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
