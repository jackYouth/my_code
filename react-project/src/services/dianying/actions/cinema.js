import { getStore, setStore, stringifyQuery } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

export const cinReset = data => ({
  type: 'CIN_RESET',
  ...data,
})
export const handleGetcindata = (channel, filmId, cityId, regionCon) => dispatch => {
  dispatch(
    cinReset({
      regionLoading: false,
      regionCon,
      regionWrap:    false,
    })
  )
  // const regionId = regionCon ? regionCon.id : ''
  const handleClose = Loading()
  const sendURL = `/dianying/v1/film/${ filmId }/cinemas`
  const sendData = {
    channel,
    regionId:  '',
    userId:    getStore('customerUserId', 'session'),
    cityId:    cityId || getStore('cityId', 'session'),
    latitude:  getStore('geopoint', 'session') ? getStore('geopoint', 'session').latitude : '',
    longitude: getStore('geopoint', 'session') ? getStore('geopoint', 'session').longitude : '',
  }
  const urldata = getStore(`${ sendURL }${ stringifyQuery(sendData) }`, 'session')
  if (urldata) {
    handleClose()
    dispatch(
      cinReset({
        channel,
        defindcinemasData:   urldata,
        cinemasData:         urldata,
        keys:                urldata.length ? urldata[0].date : '',
        regionLoading:       true,
        location:            { ...getStore('currentPosition', 'session'), currentAddress: getStore('currentAddress', 'session'), load: false },
      })
    )
  } else {
    get(sendURL, sendData).then(({ code, data, message }) => {
      handleClose()
      if (code === 0) {
        setStore(`${ sendURL }${ stringifyQuery(sendData) }`, data, 'session')
        dispatch(
          cinReset({
            channel,
            cinemasData:       data,
            defindcinemasData: data,
            keys:              data.length ? data[0].date : '',
            regionLoading:     true,
            location:          { ...getStore('currentPosition', 'session'), currentAddress: getStore('currentAddress', 'session'), load: false },
          })
        )
      } else {
        console.log(message)
      }
    })
  }
}
