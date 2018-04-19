import { send, getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { keys } from 'ramda'

export const airReset = data => ({
  type: 'AIR_RESET',
  ...data,
})

export const fliterdata = (filiterObjing, defineQcdata) => {
  const obj = {}
  keys(filiterObjing).forEach(o => {
    const a = filiterObjing[o].filter(e => e.choose)
    obj[o] = a.length > 0 ? a[0].name : ''
  })
  const arr = defineQcdata.filter(e => {
    if ((obj.fromArr ? e.departureStation === obj.fromArr : true) &&
    (obj.toArr ? e.arriveStation === obj.toArr : true)) {
      if (obj.dptTime) {
        const timearr = obj.dptTime.split('-')
        const pro = parseInt(timearr[0].replace(':', ''), 10)
        const next = parseInt(timearr[1].replace(':', ''), 10)
        const startime = parseInt(e.departureTime.replace(':', ''), 10)
        if (startime >= pro && startime <= next) {
          return true
        }
        return false
      }
      return true
    }
    return false
  })
  return arr
}


export const getqcdata = filiterObjed => dispatch => {
  const handleClose = Loading()
  const timeLimit = [
    '0:00-6:00',
    '6:00-12:00',
    '12:00-18:00',
    '18:00-24:00',
  ]
  send('/qiche/v1/schedules', {
    channel:       getStore('channel', 'session'),
    departureCity: getStore('qiche_fromCity'),
    arriveCity:    getStore('qiche_toCity'),
    departureDate: getStore('qiche_date', 'session'),
    cityCode:      getStore('qiche_fromCityobj', 'session').cityCode,
    mapType:       'gaode',
    latitude:      '31.56588500',
    longitude:     '121.07500000',
  })
  .then(({ code, data, message }) => {
    handleClose()
    if (code === 0) {
      const { station = '' } = data
      const dptTime = timeLimit.map(e => ({ name: e, choose: false }))
      const fromArr = data.departureStation.map(e => ({ name: e, choose: false }))
      const toArr = data.arriveStation.map(e => ({ name: e, choose: false }))
      const filiterObj = {
        dptTime: filiterObjed ? Object.assign(dptTime, filiterObjed.dptTime) : dptTime,
        fromArr: filiterObjed ? Object.assign(fromArr, filiterObjed.fromArr) : fromArr,
        toArr:   filiterObjed ? Object.assign(toArr, filiterObjed.toArr) : toArr,
      }
      const arr = filiterObjed ? fliterdata(filiterObj, data.schedules) : data.schedules
      dispatch(airReset({
        date:         getStore('qiche_date', 'session'),
        defineQcdata: arr,
        qcdata:       arr,
        defiliterObj: JSON.parse(JSON.stringify(filiterObj)),
        filiterObj,
        station,
      }))
    } else {
      dispatch(airReset({
        defineQcdata: [],
        qcdata:       [],
        defiliterObj: '',
        filiterObj:   '',
        station:      '',
        date:         getStore('qiche_date', 'session'),
      }))
      console.log(message)
    }
  })
}
