import { merge } from 'ramda'
import { getStore, setStore, log } from '@boluome/common-lib'
import { get } from 'business'

export const fetchDetails = postData => dispatch => {
  get('/baoyang/v1/shop/details', postData)
  .then(({ code, message, data = [] }) => {
    if (code === 0) {
      const currentShop = merge(getStore('currentShop', 'session'), data)
      setStore('currentShop', currentShop, 'session')
      dispatch({ type: 'UPDATE_SHOP', shop: merge(currentShop, data) })
    } else {
      log(message)
    }
  })
}
