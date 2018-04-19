import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from './ajax'

export const getMenus = () => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/menus').then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_MAIN_MENUS', menus: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
