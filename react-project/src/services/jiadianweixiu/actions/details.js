// import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'
import { browserHistory } from 'react-router'
import { get } from 'business'


export const getDetailsData = (datas1, Id, cityId) => dispatch => {
  // console.log('data-----------', datas1)
  const detailsUrl = `/jiadianweixiu/v1/category/${ datas1.Id }`
  const datas = {
    channel: 'zmn',
    cityId:  datas1.cityId,
    source:  '2',
  }
  get(detailsUrl, datas).then(reply => {
    const { code, data } = reply
    data.cityId = datas1.cityId
    if (code === 0) {
      dispatch({
        type:        'KJIN_DETAILSHOW',
        detailsData: data,
      })
      setStore('detailsData1', data, 'session')
      browserHistory.push(`/jiadianweixiu/details?categoryId=${ Id }&cityId=${ cityId }`)
    } else {
      console.log('数据加载失败')
    }
    // handleClose()
  }).catch(err => console.log('message', err))
}
