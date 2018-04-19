import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from '../ajax'

export const getMarketCategories = () => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/market/categories').then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_MARKET_CATEGORIES', marketCategories: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const getMarketCommoditys = (categoryLevel = 0) => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/market', { categoryLevel }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_MARKET_GOODS', marketCommoditys: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
