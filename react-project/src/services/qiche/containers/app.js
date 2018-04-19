import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { get, getStore, setStore, removeStore, parseLocName } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { getLocationGaode, login } from 'business'
import { Toast } from 'antd-mobile'
import { appReset } from '../actions/app.js'
import App from '../components/app'

const mapStateToProps = ({ app }) => ({ ...app })

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    handlefromCity: loc => {
      dispatch(appReset({
        fromCity: loc.name,
      }))
    },

    handletoCity: loc => {
      dispatch(appReset({
        toCity: loc.name,
      }))
    },

    handleSwitch: (fromCity, toCity) => {
      dispatch(appReset({
        fromCity: toCity,
        toCity:   fromCity,
      }))
    },

    handleTime: calendar => {
      setStore('qiche_date', calendar.date, 'session')
      dispatch(appReset({
        date: calendar.date,
      }))
    },

    handleClearhistory: () => {
      removeStore('qicheHistory')
      dispatch(appReset({
        qicheHistory: [],
      }))
    },

    handleSubmit: (fromCity, toCity, date, fromCityobj) => {
      console.log(fromCity, toCity, date)
      setStore('qiche_fromCity', fromCity)
      setStore('qiche_toCity', toCity)
      setStore('qiche_date', date, 'session')
      setStore('qiche_fromCityobj', fromCityobj, 'session')
      const qicheHistory = getStore('qiche_History') || []
      const arr = qicheHistory.filter(e => {
        if (e.fromCity === fromCity && e.toCity === toCity) {
          return true
        }
        return false
      })
      if (arr.length === 0 && qicheHistory.length > 4) {
        qicheHistory.splice(0, 1)
        qicheHistory.push({
          fromCity,
          toCity,
        })
      } else if (arr.length === 0) {
        qicheHistory.push({
          fromCity,
          toCity,
        })
      }
      setStore('qiche_History', qicheHistory)
      dispatch({ type: 'AIR_INIT' })
      browserHistory.push('/qiche/air')
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentDidMount: () => {
    setStore('channel', 'tongcheng', 'session')
    const qicheHistory = getStore('qiche_History') || []
    // 登录
    login(err => {
      if (err) {
        Toast.info('未登录', 1)
      }
    })
    // 定位
    const getcity = ctnm => {
      // 城市列表
      get('/qiche/v1/city/list', {
        channel:  getStore('channel', 'session'),
        cityType: 1,
      })
      .then(({ code, data, message }) => {
        if (code === 0) {
          const bl = data.some(a => a.name === ctnm)
          const yy = data.filter(e => e.name === (bl ? ctnm : state.fromCity))
          setStore('qiche_fromCity', yy[0].name)
          dispatch(appReset({
            fromCity:    yy[0].name,
            fromCityobj: yy[0],
            cityArr:     data,
          }))
        } else {
          console.log(message)
        }
      })
      .catch(err => console.log(err))
    }
    if (getStore('fromCity')) {
      const fromCity = getStore('qiche_fromCity')
      const toCity = getStore('qiche_toCity')
      const date = getStore('qiche_date', 'session') || state.date
      getcity(fromCity)
      dispatch(appReset({
        fromCity,
        toCity,
        date,
        qicheHistory,
      }))
      getLocationGaode(() => {})
    } else {
      getLocationGaode(err => {
        const fromCity = err ? state.fromCity : parseLocName(getStore('currentPosition', 'session').city)
        dispatch(appReset({
          qicheHistory,
        }))
        getcity(fromCity)
      })
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
