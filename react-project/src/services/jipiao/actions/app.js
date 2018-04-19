import { getStore } from '@boluome/common-lib'
import { get } from 'business'

export const appReset = data => ({
  type: 'ADD_RESET',
  ...data,
})

export const getPri = (departure, arrive) => dispatch => {
  // 日期低价
  get('/jipiao/v1/priceCalender', {
    channel: getStore('channel', 'session'),
    departure,
    arrive,
  })
  .then(({ code, data, message }) => {
    if (code === 0) {
      dispatch(appReset({
        calenderdata: data,
      }))
    } else {
      console.log(message)
    }
  })
}
