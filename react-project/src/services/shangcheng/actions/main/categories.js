import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get } from '../ajax'

export const getSubCategories = categoryId => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/subcategories', { categoryId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_SUB_CATEGORIES', subCategoriesData: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const getTopCategories = () => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/categories').then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_TOP_CATEGORIES', topCategoriesData: data })
      // 只执行一次，所以顺便默认请求一下二级分类
      dispatch(getSubCategories(data[0].categoryId))
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
