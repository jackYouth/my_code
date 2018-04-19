import { setStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

export const getGoodsMessage = () => dispatch => {
  const handleClose = Loading()
  const goodsListUrl = '/paotui/quickItem'
  // const { latitude, longitude } = point
  const sendData = {}
  get(goodsListUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      // console.log('quickItem', data)
      dispatch({
        type:      'KJIN_GOODSLIST',
        quickItem: data,
      })
      setStore('paotuiData', data, 'session')
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}
