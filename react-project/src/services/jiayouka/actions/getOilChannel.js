import { getStore, setStore } from '@boluome/common-lib'
import { get } from 'business'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { fetchCardsList } from './getCardsList'

export const fetchOilChannel = () => dispatch => {
  const handleClose = Loading()
  get('/jiayouka/v1/list')
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      const categoryIds = sessionStorage.getItem('categoryId')
      if (!categoryIds) {
        setStore('categoryId', '1', 'session')
      }
      dispatch({
        type:       'GET_OILCHANNEL',
        tabList:    data,
        categoryId: data[0].categoryId,
      })
      dispatch(fetchCardsList({ customerUserId: getStore('customerUserId', 'session'), categoryId: data[0].categoryId }))
      handleClose()
    } else {
      console.log(message)
    }
  })
}
