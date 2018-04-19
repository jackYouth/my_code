import { getStore, setStore } from '@boluome/common-lib'
import { send } from 'business'

export const refReset = data => ({
  type: 'REF_RESET',
  ...data,
})

export const getrefundCause = (refundCauseId, credentialCodes) => dispatch => {
  setStore('refundCauseId', refundCauseId[0], 'session')
  send('/jipiao/v1/refund/info', {
    channel: getStore('channel', 'session'),
    code:    getStore('refundCauseId', 'session'),
    credentialCodes,
    orderNo: getStore('refundOrderNo', 'session'),
  })
  .then(({ code, data, message }) => {
    if (code === 0) {
      console.log(data)
      dispatch(refReset({
        refundCauseId,
        isVoluntary:     data.isVoluntary,
        isUploadPicture: data.isUploadPicture,
      }))
    } else {
      console.log(message)
      dispatch(refReset({
        refundCauseId,
      }))
    }
  })
}
