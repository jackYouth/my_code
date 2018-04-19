import { get } from 'business'
import { Loading } from '@boluome/oto_saas_web_app_component'

export const handleFetchDetail = postData => dispatch => {
  const handleClose = Loading()
  get('/jiudian/v1/hotel/detail', postData)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      dispatch({
        type:        'HOTEL_DETAIL',
        hotelDetail: data,
        isLoaded:    true,
      })
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log('handleHotels', err)
  })
}

export const showAllRooms = showRoomID => {
  return {
    type: 'SHOW_ROOMEID',
    showRoomID,
  }
}

export const handleDateChange = dateInfo => {
  console.log('dateInfo', dateInfo)
  return {
    type: 'DATE_INFO',
    dateInfo,
  }
}
