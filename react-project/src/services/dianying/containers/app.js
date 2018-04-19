import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { parseLocName, setStore, getStore } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { getLocationGaode, login } from 'business'
import App from '../components/app'
import { mcitydata } from '../actions/mcitydata'
import { kcitydata } from '../actions/kcitydata'
import { appReset, handleGetlocation, handleGetdata, getMovie } from '../actions/app.js'


const mapStateToProps = state => {
  const { app } = state
  return {
    ...app,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    goSearchall: channel => {
      dispatch({ type: 'SER_INIT' })
      browserHistory.push(`/dianying/${ channel }/searchall/${ getStore('cityId', 'session') }`)
    },

    goLitelist: cb => {
      if (getStore('customerUserId', 'session')) {
        cb()
      } else {
        login(err => {
          if (err) {
            Toast.info('未登录', 1)
          } else {
            cb()
          }
        }, true)
      }
    },

    goSelect: cinema => {
      if (cinema) {
        setStore('cinemaId', cinema.id, 'session')
        setStore('filmId', '', 'session')
        setStore('filmDate', '', 'session')
        dispatch({ type: 'SEL_INIT' })
        browserHistory.push(`/dianying/${ getStore('channel', 'session') }/select`)
      }
    },

    callback: (keys, channel, cityId, regionCon) => {
      const regionId = regionCon ? regionCon.id : ''
      dispatch(
       appReset({
         keys,
       })
      )
      handleGetdata(dispatch, keys, channel, cityId, regionId)
      setStore('keys', keys, 'session')
    },

    handleChangeMonth: (month, comMonthDate) => {
      if (month !== comMonthDate) {
        dispatch(
          appReset({
            comMonthDate: month,
          })
        )
      }
    },

    handleCity: (cityData, keys) => {
      setStore('cityName', cityData.name, 'session')
      setStore('cityId', cityData.channelCityId, 'session')
      dispatch(
        appReset({
          cityName:  cityData.name,
          cityId:    cityData.channelCityId,
          regionCon: '',
        })
      )
      handleGetdata(dispatch, keys, getStore('channel', 'session'), cityData.channelCityId)
    },

    goDetail: (detail, flag) => {
      setStore('flag', flag, 'session')
      dispatch({ type: 'DET_INIT' })
      browserHistory.push(`/dianying/${ getStore('channel', 'session') }/detail/${ detail.id }/${ detail.isOnShow }`)
    },

    goCinema: detail => {
      dispatch({ type: 'CIN_INIT' })
      browserHistory.push(`/dianying/${ getStore('channel', 'session') }/cinema/${ detail.id }/`)
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
        appReset({
          regionWrap: !regionWrap,
        })
      )
    },

    handleRegion: (regionCon, defindcinemaData) => {
      let cinemaData = []
      if (regionCon) {
        cinemaData = defindcinemaData.filter(e => e.districtId === regionCon.id)
      } else {
        cinemaData = JSON.parse(JSON.stringify(defindcinemaData))
      }
      dispatch(
        appReset({
          cinemaData,
          regionCon,
          regionWrap: false,
        })
      )
      // handleGetdata(dispatch, keys, channel, cityId, regionCon.id)
    },
    getLct: () => {
      dispatch(
       appReset({
         location: { load: true },
       })
      )
      handleGetlocation(dispatch, true)
    },

    handleChannel: (result, cityN, channel) => {
      if (channel === result.brandCode) {
        return false
      }
      const keys = getStore('keys', 'session') || 'hot'
      let ctdt = []
      if (result.brandCode === 'maoyan') {
        ctdt = mcitydata
      } else {
        ctdt = kcitydata
      }
      dispatch(
        appReset({
          regionCon: '',
          cityArr:   ctdt,
          channel:   result.brandCode,
        })
      )
      const filterCity = citynm => {
        const d = ctdt.filter(e => e.name === citynm)
        return d.length ? d[0].channelCityId : ''
      }
      setStore('channel', result.brandCode, 'session')
      if (getStore('currentPosition', 'session')) {
        const cityName = getStore('cityName', 'session') || parseLocName(getStore('currentPosition', 'session').city)
        setStore('cityName', cityName, 'session')
        dispatch(appReset({
          location: { ...getStore('currentPosition', 'session'), currentAddress: getStore('currentAddress', 'session'), load: false },
          cityName,
        }))
        const cityId = filterCity(cityName)
        if (cityId) {
          setStore('cityId', cityId, 'session')
          handleGetdata(dispatch, keys, result.brandCode, cityId)
        } else {
          dispatch(getMovie(result.brandCode, cityName))
        }
      } else {
        const closeLoading = Loading()
        getLocationGaode(
          err => {
            closeLoading()
            let cityName
            if (err) {
              cityName = cityN
              dispatch(appReset({
                location: { currentAddress: '定位失败...', load: false },
                cityName,
              }))
            } else {
              cityName = parseLocName(getStore('currentPosition', 'session').city)
              dispatch(appReset({
                location: { ...getStore('currentPosition', 'session'), currentAddress: getStore('currentAddress', 'session'), load: false },
                cityName,
              }))
            }
            setStore('cityName', cityName, 'session')
            const cityId = filterCity(cityName)
            if (cityId) {
              setStore('cityId', cityId, 'session')
              handleGetdata(dispatch, keys, result.brandCode, cityId)
            } else {
              dispatch(getMovie(result.brandCode, cityName))
            }
          }
        )
      }

      // get(`https://f1.otosaas.com/static/dianying/${ result.brandCode }/citys.json`, {}).then(data => {
      //   console.log(data)

      // })
    },

  }
}

const mapFunToComponent  = () => {
  return {
    componentWillMount: () => {
      // handleGetlocation(dispatch);
      document.title = '首页'
      const closeLoading = Loading()
      login(err => {
        closeLoading()
        if (err) {
          Toast.info('未登录', 1)
        }
      })
    },

    componentDidMount: () => {
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { customize = {} } = customer
      if (customize.default.type === 'banner' && (location.host.indexOf('tccb') < 0))  document.getElementById('root').firstChild.firstChild.firstChild.lastChild.innerHTML = '首页'
    },

    componentWillUnmount: () => {
      const num = document.getElementsByClassName('mask-container').length
      for (let i = 0; i < num; i++) {
        document.getElementsByClassName('mask-container')[0].parentNode.remove()
      }
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(App)
  )
