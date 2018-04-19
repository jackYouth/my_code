import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from '../ajax'

export const getSpecialtyCommoditys = (province = 0) => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/specialty', { province }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_SPECIALTY_GOODS', specialtyCommoditys: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const getProvince = () => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/provinces').then(({ code, data, message }) => {
    if (code === 0) {
      data.unshift({ id: 0, name: '全国' })
      dispatch({ type: 'SET_SPECIALTY_PROVINCE', specialtyProvince: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
