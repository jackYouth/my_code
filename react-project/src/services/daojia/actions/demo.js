import { parseSearch } from '@boluome/common-lib'
import { get } from 'business'
import { Toast } from 'antd-mobile'

export const getBusinessData = () => {
  get('/daojia/v1/brand/message').then(({ code, data, message }) => {
    if (code === 0) {
      console.log(data)
    } else {
      Toast.fail(message, 1)
    }
  })
}
