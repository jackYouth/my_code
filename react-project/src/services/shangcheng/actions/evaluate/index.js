// import { browserHistory } from 'react-router'
import { getStore, setStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get, send } from '../ajax'

export const getOrderInfo = (id, orderType) => dispatch => {
  const closeLoading = Loading()
  get(`/order/v1/${ orderType }/${ id }/info`).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_EVALUATE_ORDER_INFO', orderInfo: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const placeEvaluate = paras => () => {
  const closeLoading = Loading()
  send('/mall/v1/commodity/comment', paras).then(({ code }) => {
    if (code === 0) {
      Toast.info('发表成功')
      window.history.back()
      // browserHistory.push(`/shangcheng/refundInfo/refund/${ data.id }`)
    } else {
      Toast.info('发表失败')
    }
    closeLoading()
  })
}

export const updateImg = paras => {
  const closeLoading = Loading()
  const userid = getStore('customerUserId', 'session')
  const token = getStore('accessToken', 'session')
  const appcode = getStore('customerCode', 'session')
  const getUrl = 'https://upload.otosaas.com/new'
  const headers = {
    appcode,
    userid,
    token,
  }
  fetch(getUrl, { body: paras.imgs, method: 'post', headers })
  .then(response => response.json())
  .then(json => {
    const { code, data } = json
    if (code === 0) {
      Toast.info('上传成功 !', 2, null, false)
      paras.imgs = data.map(o => o.md5)
      placeEvaluate(paras)
    } else {
      Toast.info('图片上传失败 !', 2, null, false)
      setStore('paotui_imgSrc', [], 'session')
    }
    closeLoading()
  })
  .catch(error => {
    console.log('request failed: ', error)
    closeLoading()
  })
}
