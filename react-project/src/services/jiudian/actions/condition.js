import { get }  from 'business'
import { Loading }        from '@boluome/oto_saas_web_app_component'
// import { browserHistory } from 'react-router'

export const handleFilterConditions = (channel, cityId) => dispatch => {
  const handleClose = Loading()
  console.log('cityId', cityId)
  get('/jiudian/v1/filterConditions', { channel, cityId })
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      console.log('data', data)
      dispatch({
        type:             'FILTER_CONDITIONS',
        filterConditions: data,
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

export const handleZones = (channel, cityId) => dispatch => {
  const handleClose = Loading()
  get(`/jiudian/v1/city/${ cityId }/zones`, { channel, cityId })
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      console.log('data', data)
      dispatch({
        type:        'FILTER_ZONES',
        filterZones: data,
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

export const handleShowContent = showIndex => {
  return {
    type: 'SHOW_INDEX',
    showIndex,
  }
}

export const chooseFilterCondition = chooseConditions => {
  // browserHistory.push('/jiudian')
  window.history.go(-1)
  return {
    type:      'CHOOSE_CONDITIONS',
    chooseConditions,
    PageIndex: 1,
    offset:    0,
  }
}
