import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get, send } from './ajax'

export const getBrandInfo = brandId => dispatch => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  get('/mall/v1/commodity/brand', { brandId, userId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_BRAND_INFO', brandInfo: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}


export const getBrandCommodityList = brandId => dispatch => {
  const closeLoading = Loading()
  get('/mall/v1/commodity/list', { brandId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_BRAND_COMMODITY_LIST', brandCommodityList: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const getAttentionList = () => dispatch => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  get('/mall/v1/own/attentions', { userId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_ATTENTION_LIST', attentionList: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

// brandId: 商家Id， isAttention: 关注还是取消关注，isList：是否是关注列表页面
export const handleChangeAttention = (brandInfo, isAttention, isList) => dispatch => {
  // const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  const api = isAttention ? '/mall/v1/commodity/attention' : '/mall/v1/own/attention'
  const method = isAttention ? 'POST' : 'DELETE'
  const { brandId, brandCode } = brandInfo
  console.log('brandInfo', brandInfo)
  send(api, { brandId, userId, brandCode }, method).then(({ code, message }) => {
    if (code === 0) {
      if (!isList) dispatch({ type: 'SET_BRAND_Attention', isAttention })
      if (isList) dispatch(getAttentionList())
      if (isAttention) {
        brandInfo.attentionCount++
        dispatch({ type: 'SET_BRAND_INFO', brandInfo })
        Toast.info('关注成功', 1)
      }
      if (!isAttention) {
        brandInfo.attentionCount--
        dispatch({ type: 'SET_BRAND_INFO', brandInfo })
        Toast.info('已取消关注', 1)
      }
    } else {
      Toast.fail(message)
    }
    // closeLoading()
  })
}

// 商家分类
export const getBrandCategories = (brandId, callback) => {
  const closeLoading = Loading()
  get('/mall/v1/brand/sort', { brandId }).then(({ code, data, message }) => {
    if (code === 0) {
      callback(data)
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
