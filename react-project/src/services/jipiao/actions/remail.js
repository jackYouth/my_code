import { getStore } from '@boluome/common-lib'
import { get } from 'business'

export const remReset = data => ({
  type: 'REM_RESET',
  ...data,
})

export const getremail = orderNo => dispatch => {
  get(`/jipiao/v1/reimburse/${ orderNo }`, { channel: getStore('channel', 'session') })
  .then(({ code, data, message }) => {
    if (code === 0) {
      dispatch(remReset({
        remailData: data,
      }))
    } else {
      console.log(message)
    }
  })
}
