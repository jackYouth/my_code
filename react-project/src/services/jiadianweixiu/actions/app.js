import { Loading } from '@boluome/oto_saas_web_app_component'
// import { get } from '@boluome/common-lib'
import { get } from 'business'

// Project interface
export const getListDataFn = datas => dispatch => {
  const handleClose = Loading({ mask: false, maskClosable: false })
  const listUrl = '/jiadianweixiu/v1/categories'
  get(listUrl, { city: datas, source: 2 }).then(reply => {
    const { code, data } = reply
    if (code === 0) {
      dispatch({
        type:     'KJIN_LISTSHOW',
        listData: data,
      })
    } else {
      console.log('数据加载失败')
    }
    handleClose()
  }).catch(err => console.log('message', err))
}
