import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from '../ajax'


export const getCommodityList = (url, paras) => dispatch => {
  const closeLoading = Loading()
  get(url, paras).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_GOOD_LIST', commodityList: data, commodityListParas: { url, paras } })
    } else {
      // dispatch({ type: 'SET_GOOD_LIST', commodityList: [], commodityListParas: { url, paras } })
      Toast.fail(message)
    }
    closeLoading()
  })
}
