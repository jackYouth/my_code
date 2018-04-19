import { get } from 'business'
import { Loading }   from '@boluome/oto_saas_web_app_component'

export const fetchOilPrice = datas => dispatch => {
  let urls = '/jiayouka/v1/:categoryId/payments'
  urls = urls.replace(/:categoryId/g, datas.categoryId)
  const handleClose = Loading()
  get(urls)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      dispatch({
        type:     'GET_OILPRICE',
        oilPrice: data,
      })
    } else {
      console.log(message)
    }
    handleClose()
  })
}
