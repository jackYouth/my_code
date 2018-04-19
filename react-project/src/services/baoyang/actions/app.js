import { log } from '@boluome/common-lib'
import { get } from 'business'

export const fetchShop = (postData, cb) => {
  get('/baoyang/v1/near/shop', postData)
  .then(({ code, message, data = [] }) => {
    if (code === 0) {
      cb(data)
    } else {
      log(message)
    }
  })
}

export const changeAddress = data => {
  return {
    type: 'CHANGE_ADDRESS',
    ...data,
  }
}
