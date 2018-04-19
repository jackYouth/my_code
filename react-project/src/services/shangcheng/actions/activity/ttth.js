import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from 'business'

export const getTtthData = paras => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/activities', paras).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_TTTH_DATA', activityDay: paras.date, ttthData: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
