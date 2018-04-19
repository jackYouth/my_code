import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

export const airReset = data => ({
  type: 'AIR_RESET',
  ...data,
})

export const getAirdata = () => dispatch => {
  const handleClose = Loading()
  const timeLimit = [
    '0:00-6:00',
    '6:00-12:00',
    '12:00-18:00',
    '18:00-24:00',
  ]
  get('/jipiao/v1/flights', {
    channel:   getStore('channel', 'session'),
    departure: getStore('fromCity'),
    arrive:    getStore('toCity'),
    date:      getStore('date', 'session'),
  })
  .then(({ code, data, message }) => {
    handleClose()
    if (code === 0 && data.length === 0) {
      dispatch(airReset({
        defineAirdata: [],
        date:          getStore('date', 'session'),
      }))
    } else if (code === 0) {
      const filiterObj = {
        airline: data.airlines.map(e => ({ name: e, choose: false })),
        dptTime: timeLimit.map(e => ({ name: e, choose: false })),
        fromArr: data.dptAirport.map(e => ({ name: e, choose: false })),
        toArr:   data.arrAirport.map(e => ({ name: e, choose: false })),
      }
      dispatch(airReset({
        date:          getStore('date', 'session'),
        timeSort:      '',
        priceSort:     '',
        defineAirdata: data.flights,
        airdata:       data.flights,
        defiliterObj:  JSON.parse(JSON.stringify(filiterObj)),
        filiterObj,
      }))
    } else {
      dispatch(airReset({
        defineAirdata: [],
        date:          getStore('date', 'session'),
      }))
      console.log(message)
    }
  })
}
