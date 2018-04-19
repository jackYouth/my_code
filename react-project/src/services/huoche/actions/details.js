import { setStore, getStore } from '@boluome/common-lib' // get
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

// 通过经纬度定位商家，在展示一系列数据请求
export const seatsDataFn = (chooseTime, chooseCity, ticketDetails) => dispatch => {
  const handleClose = Loading()
  const schedulesUrl = '/huoche/v1/seats'
  const { from, to } = chooseCity
  const { date } = chooseTime
  const { number } = ticketDetails
  const channel = getStore('huoche_channel', 'session')
  const sendData = {
    from,
    to,
    date,
    channel,
    train_number: number,
  }
  get(schedulesUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      console.log('indexDatalist', data)
      let noSeats = true
      if (data.length === 0) {
        noSeats = false
      } else {
        noSeats = true
      }
      console.log('---test---noSeats', noSeats)
      dispatch({
        type:      'KJIN_SEATSDATA',
        seatsData: data,
        noSeats,
      })
      setStore('huoche_seatsData', data, 'session')
      // handleClose()
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}
