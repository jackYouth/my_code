import { get, getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'

export const secReset = data => ({
  type: 'SEC_RESET',
  ...data,
})

export const getData = (activityCode, eventId) => dispatch => {
  const closeLoading = Loading()
  get('/piaowu/queryTicketList', {
    channel: getStore('piaowu_channel', 'session'),
    activityCode,
    eventId,
  }).then(({ code, data, message }) => {
    closeLoading()
    if (code === 0) {
      console.log(data)
      dispatch(secReset({
        ticketList: data,
        datali:     data[0] || '',
        num:        0,
      }))
    } else {
      console.log(message)
    }
  })
  .catch(err => {
    closeLoading()
    console.log(err)
  })
}
