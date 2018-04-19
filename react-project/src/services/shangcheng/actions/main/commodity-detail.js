import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get, send } from '../ajax'

export const getCommodityDetail = commodityId => dispatch => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  get('/mall/v1/commodity/detail', { commodityId, userId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_COMMODITY_DETAIL', commodityDetail: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}


export const getCollectList = () => dispatch => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  get('/mall/v1/own/collections', { userId }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_COLLECT_LIST', collectList: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

// brandId: 商家Id， isCollect: 关注还是取消关注，isList：是否是关注列表页面
export const handleChangeCollect = (commodityId, isCollect, isList) => dispatch => {
  // const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  const api = isCollect ? '/mall/v1/commodity/collection' : '/mall/v1/own/collection'
  const method = isCollect ? 'POST' : 'DELETE'
  send(api, { commodityId, userId }, method).then(({ code, message }) => {
    if (code === 0) {
      if (!isList) dispatch({ type: 'SET_COMMODITY_COLLECT', isCollect })
      if (isList) dispatch(getCollectList())
      if (isCollect) Toast.info('收藏成功', 1)
      if (!isCollect) Toast.info('已取消收藏', 1)
    } else {
      Toast.fail(message)
    }
    // closeLoading()
  })
}
