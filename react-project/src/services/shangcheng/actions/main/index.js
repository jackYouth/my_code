import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from '../ajax'

export const getColumns = () => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/columns').then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_MAIN_COLUMNS', columnList: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const getNewCommoditys = () => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/commoditys').then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_MAIN_NEW_COMMODITYS', newCommodityList: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const getRecommends = () => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/recommendation').then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_MAIN_RECOMMENDATION', recommendList: data.commodityData })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
