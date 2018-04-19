import { send, get } from 'business'
import { setStore, parseLocName, getStore } from '@boluome/common-lib'
import { Loading }        from '@boluome/oto_saas_web_app_component'

export const fetchHotels = postData => dispatch => {
  const handleClose = Loading()
  send('/jiudian/v1/hotels', postData)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      const { hotels = [] } = data
      hotels.length = 3
      dispatch({ type: 'HOTEL_LIST', hotels })
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log('handleHotels', err)
  })
}

export const fetchScenics = datas => dispatch => {
  const handleClose = Loading()
  send('/menpiao/v1/scenics', datas)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      const { scenicList = [] } = data
      scenicList.length = 4
      dispatch({ type: 'SCENICS_LIST', scenicList })
    } else {
      console.log(message)
    }
    handleClose()
  })
}

export const handleCurrCity = city => dispatch => {
  const handleClose = Loading()
  const currentCityName = parseLocName(city)
  const { province = '' } = getStore('currentPosition', 'session')
  const prov = parseLocName(province)
  get(`/jiudian/v1/cities/${ currentCityName }/id`, { channel: 'ctrip', name: currentCityName })
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      const currentCityId = data
      const { latitude = '', longitude = '' } = getStore('geopoint', 'session')
      const postData = {
        channel: 'ctrip',
        CityId: currentCityId,
        DistanceType: 0,
        PageIndex: 1,
        PageSize: 10,
        offset: 0,
        lat: latitude,
        lng: longitude,
        mapType: 'gaode',
        StarRate: '4,5',
      }
      const datas = {
        prov,
        city: currentCityName,
        channel: 'lvmama',
        currentPage: 1,
        lat: latitude,
        lng: longitude,
        mapType: 'gaode',
        pageSize: 10,
      }
      setStore('currentCityId', currentCityId)
      dispatch({
        type: 'CURRENT_CITY',
        currentCityId,
        currentCityName,
      })
      dispatch(fetchHotels(postData))
      dispatch(fetchScenics(datas))
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log('handleCurrCity err', err)
  })
}
