import { getStore, parseLocName, setStore } from '@boluome/common-lib'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import moment from 'moment'
import { get } from 'business'

export const chooseCity = (result) => {
  return {
    type: 'GET_CITIES',
    city: result
  }
}

export const dateChange = (val) => {
  return {
    type: 'DATE_CHANGE',
    date: val
  }
}

export const distanceChange = (val) => {
  return {
    type: 'DISTANCE_CHANGE',
    distance: val
  }
}

export const showCurrentCity = (city) => dispatch => {
  const handleClose = Loading()
  get( '/basis/v1/chegu/cheth/cities' )
  .then(({ code, data = {}, message }) => {
    if(code === 0) {
      if (data.length > 0){
        data.forEach(i => {
          if (city === i.name){
            dispatch({
              type: 'CURRENT_CITY',
              currentCity: i
            })
          }
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

export const showInfo = () => dispatch => {
  const handleClose = Loading()
  let city = parseLocName(getStore('currentPosition','session').city)
  get( '/chegu/v1/user/car/info', { userId: getStore('customerUserId','session') } )
  .then(({ code, data, message }) => {
    if(code === 0 && data) {
      console.log('data--------',data);
      const { cityName, regDate, mile, title, chooseResult, cityId } = data
      if(chooseResult){
        dispatch({
          type: 'CHOOSE_HISTORY',
          chooseHistory: JSON.parse(chooseResult)
        })
      }
      if(cityName){
        setStore('cityId',cityId,'session')
        dispatch(showCurrentCity(cityName))
      } else {
        dispatch(showCurrentCity(city))
      }
      if(regDate){
        console.log('dddd',moment(regDate));
        dispatch({
          type: 'DATE_CHANGE',
          date: moment(regDate)
        })
      }
      if(mile){
        console.log('mail------', (Number(mile)*10000).toFixed(0))
        dispatch({
          type: 'DISTANCE_CHANGE',
          distance: (Number(mile)*10000).toFixed(0)
        })
      }
    } else {
      console.log('else');
      dispatch(showCurrentCity(city))
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log(err)
  })
}
