import { connect } from 'react-redux'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import { setStore, getStore, parseLocName } from '@boluome/common-lib'
import { get, getLocationGaode } from 'business'
import { mcitydata } from '../actions/mcitydata'
import { kcitydata } from '../actions/kcitydata'
import { cinReset, handleGetcindata } from '../actions/cinema.js'
import Cinema from '../components/cinema'

const mapStateToProps = state => {
  const { cinema } = state
  return {
    ...cinema,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    goSearchcin: () => {
      const { routeParams } = props
      const { filmId, channel } = routeParams
      dispatch({ type: 'SEN_INIT' })
      browserHistory.push(`/dianying/${ channel }/searchcin/${ filmId }`)
    },

    callback: key => {
      dispatch(
        cinReset({
          keys: key,
        })
      )
    },

    getLct: () => {
      // const { routeParams } = props
      // const { filmId, channel } = routeParams
      const handleClose = Loading()
      dispatch(
       cinReset({
         location: { load: true },
       })
      )
      const tm = new Date()
      getLocationGaode(err => {
        let timer = ''
        const road = () => {
          if (timer) clearTimeout(timer)
          handleClose()
          if (err) {
            dispatch(cinReset({
              location: { currentAddress: '定位失败...', load: false },
            }))
          } else {
            dispatch(cinReset({
              location: { ...getStore('currentPosition', 'session'), currentAddress: getStore('currentAddress', 'session'), load: false },
            }))
            // dispatch(handleGetcindata(channel, filmId, cityId, regionCon))
          }
        }
        const tms = new Date()
        if ((tms.getTime() - tm.getTime()) < 1500) {
          timer = setTimeout(() => road(), 1000)
        } else {
          road()
        }
      })
    },

    goSelect: (cinemaId, keys) => {
      const { routeParams } = props
      const { filmId, channel } = routeParams
      setStore('cinemaId', cinemaId, 'session')
      setStore('filmId', filmId, 'session')
      setStore('filmDate', keys, 'session')
      dispatch({ type: 'SEL_INIT' })
      browserHistory.push(`/dianying/${ channel }/select`)
    },

    handleCity: cityData => {
      setStore('cityName', cityData.name, 'session')
      setStore('cityId', cityData.channelCityId, 'session')
      dispatch(
        cinReset({
          cityName: cityData.name,
        })
      )
      const { routeParams } = props
      const { filmId, channel } = routeParams
      dispatch(handleGetcindata(channel, filmId, cityData.channelCityId))
      // 获取城市区域
      get('/dianying/v1/regions', { channel, cityId: getStore('cityId', 'session') }).then(({ code, data, message }) => {
        if (code === 0) {
          dispatch(
           cinReset({
             regionData: data,
           })
          )
        } else {
          console.log(message)
        }
      })
    },

    handleFilter: regionWrap => {
      if (!regionWrap) {
        window.document.body.style.width = '100%'
        window.document.body.style.overflowX = 'hidden'
      } else {
        window.document.body.style.width = ''
        window.document.body.style.overflowX = ''
      }
      dispatch(
        cinReset({
          regionWrap: !regionWrap,
        })
      )
    },

    handleRegion: (regionCon, defindcinemasData) => {
      let cinemasData = []
      if (regionCon) {
        const s = JSON.parse(JSON.stringify(defindcinemasData))
        cinemasData = s.map(o => {
          o.cinemas = o.cinemas.filter(e => e.districtId === regionCon.id)
          return o
        })
      } else {
        cinemasData = JSON.parse(JSON.stringify(defindcinemasData))
      }
      dispatch(
        cinReset({
          cinemasData,
          regionCon,
          regionWrap: false,
        })
      )
      // const { routeParams } = props
      // const { filmId, channel } = routeParams
      // if (regionCon) {
      //   dispatch(handleGetcindata(channel, filmId, cityId, regionCon))
      // } else {
      //   dispatch(handleGetcindata(channel, filmId, cityId))
      // }
    },
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {
    componentWillMount: () => {
      document.title = '选择影院'
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { customize = {} } = customer
      if (customize.default.type === 'banner')  document.getElementById('root').firstChild.firstChild.firstChild.lastChild.innerHTML = '选择影院'

      const { routeParams } = state
      const { filmId, channel, regionCon = '' } = routeParams

      const getData = d => {
        d()
        dispatch(handleGetcindata(channel, filmId, getStore('cityId', 'session')), regionCon)
           // 获取城市区域
        get('/dianying/v1/regions', { channel, cityId: getStore('cityId', 'session') }).then(({ code, data, message }) => {
          if (code === 0) {
            dispatch(
              cinReset({
                regionData: data,
              })
            )
          } else {
            console.log(message)
          }
        })
      }


      // 获取城市列表
      let ctdt = []
      if (channel === 'maoyan') {
        ctdt = mcitydata
      } else {
        ctdt = kcitydata
      }
      dispatch(
        cinReset({
          cityArr: ctdt,
        })
      )
      const filterCity = citynm => {
        const d = ctdt.filter(e => e.name === citynm)
        return d.length ? d[0].channelCityId : ''
      }
      const handleClose = !state.cinemasData ? Loading() : () => {}
      // 定位
      if (getStore('currentPosition', 'session') && !state.cinemasData) {
        const cityName = getStore('cityName', 'session') || parseLocName(getStore('currentPosition', 'session').city)
        setStore('cityName', cityName, 'session')
        getData(handleClose)
        dispatch(cinReset({
          location: { ...getStore('currentPosition', 'session'), currentAddress: getStore('currentAddress', 'session'), load: false },
          cityName,
        }))
      } else if (!state.cinemasData) {
        getLocationGaode(err => {
          let cityName
          if (err) {
            cityName = getStore('cityName', 'session') || state.cityName
            dispatch(cinReset({
              location: { currentAddress: '定位失败...', load: false },
              cityName,
            }))
          } else {
            cityName = parseLocName(getStore('currentPosition', 'session').city)
            dispatch(cinReset({
              location: { ...getStore('currentPosition', 'session'), currentAddress: getStore('currentAddress', 'session'), load: false },
              cityName,
            }))
          }
          setStore('cityName', cityName, 'session')
          const cityId = filterCity(cityName)
          if (cityId) {
            setStore('cityId', cityId, 'session')
            getData(handleClose)
          } else {
            handleClose()
          }
          // get(`/dianying/v1/cities/${ cityName }/id`, { channel }).then(({ code, data, message }) => {
          //   if (code === 0) {
          //     setStore('cityId', data, 'session')
          //     getData(handleClose)
          //   } else {
          //     handleClose()
          //     console.log(message, cityName)
          //   }
          // })
        })
      }


      // get(`/basis/v1/dianying/${ channel }/cities`, { channel }).then(({ code, data, message }) => {
      //   if (code === 0) {
      //     dispatch(
      //       cinReset({
      //         cityArr: data,
      //       })
      //     )
      //   } else {
      //     console.log(message)
      //   }
      // })
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Cinema)
  )
