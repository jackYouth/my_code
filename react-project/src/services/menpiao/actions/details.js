import { getStore, parseQuery } from '@boluome/common-lib' // get,
import { get } from 'business'
import { Loading } from '@boluome/oto_saas_web_app_component'

export const DetailsListData = () => dispatch => {
  const handleClose = Loading()
  let id = getStore('itemId', 'session')
  if (!id) {
    const search = location.search
    const IDsearch = parseQuery(search)
    id = IDsearch.id
  }
  const detailsUrl = `/menpiao/v1/scenic/${ id }`
  const sendData = {
    channel: 'lvmama',
    id,
  }
  get(detailsUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) { // console.log('详情数据',data)
      dispatch({
        type:             'KJIN_DETAILSLISTDATA',
        DetailsListDatas: data,
      })
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}
// 根据ID获取商品列表
export const DetailsListFn = () => dispatch => {
  const handleClose = Loading()
  let id = getStore('itemId', 'session')
  if (!id) {
    const search = location.search
    const IDsearch = parseQuery(search)
    id = IDsearch.id
  }
  const detailsUrl = `/menpiao/v1/scenic/${ id }/goods`
  const sendData = {
    channel: 'lvmama',
    placeId: id,
  }
  get(detailsUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      dispatch({
        type:        'KJIN_DETAILSLIS',
        DetailsList: data.goodsGroups,
      })
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}

// 根据Id获取商品详情
export const DetailsIntroducedFn = () => dispatch => {
  const handleClose = Loading()
  let id = getStore('itemId', 'session')
  if (!id) {
    const search = location.search
    const IDsearch = parseQuery(search)
    id = IDsearch.id
  }
  const detailsUrl = `/menpiao/v1/scenic/${ id }/intro`
  const sendData = {
    channel: 'lvmama',
    id,
  }
  get(detailsUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) { // console.log('DetailsIntroduced------',data)
      dispatch({
        type:              'KJIN_DETAILSINTRODUCED',
        DetailsIntroduced: data,
      })
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}
