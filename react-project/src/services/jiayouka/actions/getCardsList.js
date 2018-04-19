import { getStore } from '@boluome/common-lib'
import { get } from 'business'
import { Loading }   from '@boluome/oto_saas_web_app_component'
// import { browserHistory } from 'react-router'
import { fetchOilPrice } from './getOilPrice'

export const fetchCardsList = () => dispatch => {
  let urls = '/jiayouka/v1/:categoryId/cards/:customerUserId'
  urls = urls.replace(/:categoryId/g, sessionStorage.categoryId)
  urls = urls.replace(/:customerUserId/g, sessionStorage.customerUserId)
  const handleClose = Loading()
  get(urls)
  .then(({ code, data = [], message }) => {
    if (code === 0) {
      // if (data.length === 0) {
      //   // browserHistory.push('/jiayouka')
      //   // window.history.back(-1)
      //   return false
      // } else {
      dispatch({
        type:      'GET_CARDS',
        cardsList: data,
      })
      dispatch(fetchOilPrice({ categoryId: getStore('categoryId', 'session') }))
      // }
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    console.log(err)
  })
}
