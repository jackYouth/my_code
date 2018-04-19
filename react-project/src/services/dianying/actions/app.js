import { setStore, getStore, stringifyQuery } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get, getLocationGaode } from 'business'

export const appReset = data => ({
  type: 'ADD_RESET',
  ...data,
})

export const handleGetlocation = (dispatch, bool) => {
  let handleClose = false
  let tm = false
  if (bool) {
    handleClose = Loading()
    tm = new Date()
  }
  getLocationGaode(
    err => {
      let timer = ''
      const road = () => {
        if (handleClose) handleClose()
        if (timer) clearTimeout(timer)
        if (err) {
          dispatch(appReset({
            location: { currentAddress: '定位失败...', load: false },
          }))
        } else {
          dispatch(appReset({
            location: { ...getStore('currentPosition', 'session'), currentAddress: getStore('currentAddress', 'session'), load: false },
          }))
        }
      }
      if (tm) {
        const tms = new Date()
        if ((tms.getTime() - tm.getTime()) < 1500) {
          timer = setTimeout(() => road(), 1000)
        } else {
          road()
        }
      } else {
        road()
      }
    }
  )
}


export const handleGetdata = (dispatch, key, channel, cityId) => {
  dispatch(
   appReset({
     cityId,
   })
  )
  const hotData = getStore(`/dianying/v1/film/showing${ stringifyQuery({ channel, cityId }) }`, 'session')
  const cData = getStore(`/dianying/v1/film/coming${ stringifyQuery({ channel, cityId }) }`, 'session')
  switch (key) {
    case 'hot':
      if (hotData) {
        dispatch(
         appReset({
           hotData,
         })
        )
      } else {
        const handleClose = Loading()
        get('/dianying/v1/film/showing', { channel, cityId }).then(({ code, data, message }) => {
          handleClose()
          if (code === 0) {
            setStore(`/dianying/v1/film/showing${ stringifyQuery({ channel, cityId }) }`, data, 'session')
            dispatch(
             appReset({
               hotData: data,
             })
            )
          } else {
            console.log(message)
          }
        }).catch(re => { handleClose(); console.log(re.message) })
      }

      break
    case 'coming':
      if (cData) {
        dispatch(
         appReset({
           comData:      cData.filmsGroupByDate,
           comMonthData: cData.filmsGroupByMonth,
           comMonthDate: cData.filmsGroupByMonth[0].month,
         })
        )
      } else {
        const handleClose = Loading()
        get('/dianying/v1/film/coming', { channel, cityId }).then(({ code, data, message }) => {
          handleClose()
          if (code === 0) {
            setStore(`/dianying/v1/film/coming${ stringifyQuery({ channel, cityId }) }`, data, 'session')
            dispatch(
             appReset({
               comData:      data.filmsGroupByDate,
               comMonthData: data.filmsGroupByMonth,
               comMonthDate: data.filmsGroupByMonth[0].month,
             })
            )
          } else {
            console.log(message)
          }
        })
      }
      break
    case 'cinema': {
      const cinemaUrl = '/dianying/v2/cinemas'
      const cinemaData = {
        channel,
        cityId,
        latitude:  getStore('geopoint', 'session') ? getStore('geopoint', 'session').latitude : '',
        longitude: getStore('geopoint', 'session') ? getStore('geopoint', 'session').longitude : '',
        userId:    getStore('customerUserId', 'session'),
        mapType:   'gaode',
      }
      const disUrl = '/dianying/v1/regions'
      const disData = { channel, cityId }
      const cgetData = getStore(`${ cinemaUrl }${ stringifyQuery(cinemaData) }`, 'session')
      const dgetData = getStore(`${ disUrl }${ stringifyQuery(disData) }`, 'session')
      if (cgetData && dgetData) {
        dispatch(
          appReset({
            districts:        dgetData,
            cinemaData:       cgetData,
            defindcinemaData: cgetData,
          })
        )
      } else {
        const handleClose = Loading()
        const getURL = (sendURL, sendData) => {
          const urldata = getStore(`${ sendURL }${ stringifyQuery(sendData) }`, 'session')
          return new Promise((resolve, reject) => {
            if (urldata) {
              resolve(urldata)
            } else {
              get(sendURL, sendData).then(({ code, data, message }) => {
                if (code === 0) {
                  setStore(`${ sendURL }${ stringifyQuery(sendData) }`, data, 'session')
                  resolve(data)
                } else {
                  reject(new Error(message))
                }
              })
            }
          })
        }
        const request = {
          districts: () => {
            return getURL(disUrl, disData)
          },
          cinemas: () => {
            return getURL(cinemaUrl, cinemaData)
          },
        }
        const main = () => {
          return Promise.all([request.districts(), request.cinemas()])
        }
        // 运行示例
        main().then(value => {
          handleClose()
          dispatch(
            appReset({
              districts:        value[0],
              cinemaData:       value[1],
              defindcinemaData: value[1],
            })
          )
        }).catch(error => {
          handleClose()
          console.log(error)
        })
      }


      break
    }
    default:
      console.log('onChangesafdsdfsdfsd', key)
  }
}


export const getMovie = (channel, city, closeLoading) => dispatch => {
  if (closeLoading) closeLoading()
  const handleClose = Loading()
  get(`/dianying/v1/cities/${ city }/id`, { channel }).then(({ code, data, message }) => {
    handleClose()
    if (code === 0) {
      dispatch(
       appReset({
         cityId: data,
         channel,
       })
      )
      setStore('cityId', data, 'session')
      const keys = getStore('keys', 'session') || 'hot'
      handleGetdata(dispatch, keys, channel, data)
    } else {
      console.log(message, city)
    }
  })
  .catch(() => {
    handleClose()
  })
}
