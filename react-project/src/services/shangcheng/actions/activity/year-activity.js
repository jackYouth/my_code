import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from 'business'

export const getActivities = () => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/activities').then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'GET_ACTIVITIES', activities: data.activities })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  }).catch(message => console.log('getActivities', message))
}
