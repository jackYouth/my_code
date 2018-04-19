import { get, getStore, setStore }  from '@boluome/common-lib'
import { Loading }        from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'

export const handleAreaInfo = (v, channel, airportId, type) => dispatch => {
  const handleClose = Loading()
  const serverType = v === '1' ? 'lounge' : 'aisle'
  setStore('serverType', serverType, 'session')
  get('/dengjifuwu/v1/search/area/info/id', { serverType, channel, airportId, type })
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      dispatch({
        type:       'AREA_INFO',
        areaInfo:   data,
        firstFetch: false,
      })
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log(err)
  })
}

export const handleAirport = (v, channel, props) => dispatch => {
  console.log('props', props)
  const handleClose = Loading()
  const geopoint = getStore('geopoint', 'session')
  const serverType = v === '1' ? 'lounge' : 'aisle'
  const postData = { serverType, channel, ...geopoint, mapType: 'gaode' }
  get('/dengjifuwu/v1/recent/dengjifuwu/info', postData)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      const { airportId, type } = data
      if (airportId && type) {
        dispatch(handleAreaInfo(v, channel, airportId, type))
        dispatch({
          type:        'AIRPORT_INFO',
          airportInfo: data,
        })
        const localAirport = getStore('localAirport', 'session')
        if (!localAirport) {
          setStore('localAirport', data, 'session')
        }
      } else {
        setStore('serverType', 'aisle', 'session')
        dispatch({
          type:     'AREA_INFO',
          areaInfo: [],
        })
      }
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log(err)
  })
}

export const handleChooseAirport = (result, channel) => dispatch => {
  dispatch({
    type:        'AIRPORT_INFO',
    airportInfo: result,
  })
  const { airportId, type } = result
  const v = getStore('serverType', 'session') === 'lounge' ? '1' : '2'
  console.log('v22222222222222', v)
  dispatch(handleAreaInfo(v, channel, airportId, type))
}

export const handleChooseTerminal = chooseTerminal => {
  return {
    type: 'CHOOSE_TERMINAL',
    chooseTerminal,
  }
}

export const handleChooseInternational = chooseInternational => {
  return {
    type: 'CHOOSE_INTERNATIONAL',
    chooseInternational,
  }
}

export const handleThisData = thisData => {
  setStore('thisData', thisData, 'session')
  browserHistory.push('/dengjifuwu/Detail')
  return {
    type: 'THIS_DATA',
    thisData,
  }
}

export const getAllData = () => dispatch => {
  const serverTypeArr = ['lounge', 'aisle']
  serverTypeArr.forEach((i, idx) => {
    get('/dengjifuwu/v1/search/area/info', { serverType: i, channel: 'trvok' })
    .then(({ code, data = [], message }) => {
      if (code === 0) {
        console.log('data======>', data)
        if (idx === 0) {
          dispatch({
            type:      'AREA_INFO',
            loungeArr: data,
          })
        } else {
          dispatch({
            type:     'AREA_INFO',
            aisleArr: data,
          })
        }
      } else {
        console.log(message)
      }
      // handleClose()
    }).catch(err => {
      console.log(err)
      // handleClose()
    })
  })
}
