import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore, setStore, removeStore, parseLocName } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { get, getLocationGaode, login } from 'business'
import { Toast } from 'antd-mobile'
import { appReset, getPri } from '../actions/app.js'
import App         from '../components/app'

const mapStateToProps = ({ app }) => ({ ...app })

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

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

    handlefromCity: (loc, toCity) => {
      dispatch(appReset({
        fromCity: loc.name,
      }))
      dispatch(getPri(loc.name, toCity))
    },

    handletoCity: (loc, fromCity) => {
      dispatch(appReset({
        toCity: loc.name,
      }))
      dispatch(getPri(fromCity, loc.name))
    },

    handleSwitch: (fromCity, toCity) => {
      dispatch(appReset({
        fromCity: toCity,
        toCity:   fromCity,
      }))
    },

    handleTime: calendar => {
      setStore('date', calendar.date, 'session')
      dispatch(appReset({
        date: calendar.date,
      }))
    },

    handleClearhistory: () => {
      removeStore('airticHistory')
      dispatch(appReset({
        airticHistory: [],
      }))
    },

    handleSubmit: (fromCity, toCity, date) => {
      console.log(fromCity, toCity, date)
      setStore('fromCity', fromCity)
      setStore('toCity', toCity)
      // setStore('cabin', cabin)
      setStore('date', date, 'session')
      const airticHistory = getStore('airticHistory') || []
      const arr = airticHistory.filter(e => {
        if (e.fromCity === fromCity && e.toCity === toCity) {
          return true
        }
        return false
      })
      if (arr.length === 0 && airticHistory.length > 4) {
        airticHistory.splice(0, 1)
        airticHistory.push({
          fromCity,
          toCity,
        })
      } else if (arr.length === 0) {
        airticHistory.push({
          fromCity,
          toCity,
        })
      }
      setStore('airticHistory', airticHistory)
      dispatch({ type: 'AIR_INIT' })
      browserHistory.push('/jipiao/air')
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentDidMount: () => {
    setStore('channel', 'qunar', 'session')
    const airticHistory = getStore('airticHistory') || []
    // 登录
    login(err => {
      if (err) {
        Toast.info('未登录', 1)
      }
    })

    // 定位
    if (getStore('fromCity')) {
      const fromCity = getStore('fromCity')
      const toCity = getStore('toCity')
      const date = getStore('date', 'session') || state.date
      dispatch(appReset({
        fromCity,
        toCity,
        date,
        airticHistory,
      }))
      getLocationGaode(() => {
        dispatch(getPri(fromCity, toCity))
        // console.log(parseLocName(getStore('currentPosition', 'session')) || state.fromCity)
      })
    } else {
      getLocationGaode(err => {
        const fromCity = err ? state.fromCity : parseLocName(getStore('currentPosition', 'session').city)
        console.log(fromCity)
        setStore('fromCity', fromCity)
        setStore('toCity', state.toCity)
        dispatch(getPri(fromCity, state.toCity))
        dispatch(appReset({
          fromCity,
          airticHistory,
        }))
      })
    }
    // 城市
    get('/jipiao/v1/city/list').then(({ code, data, message }) => {
      if (code === 0) {
        dispatch(appReset({
          cityArr: data,
        }))
      } else {
        console.log(message)
      }
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
