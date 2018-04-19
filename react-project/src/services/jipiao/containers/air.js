import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore, setStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { Modal } from 'antd-mobile'
import { get } from 'business'
import { airReset, getAirdata } from '../actions/air.js'
import Air         from '../components/air'

let timeOut = ''
let reTop = 0
const alert = Modal.alert

const mapStateToProps = ({ air }) => ({ ...air })

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    handleScroll: (top, botShow) => {
      const num = top - reTop
      if (num > 0 && botShow) {
        dispatch(airReset({
          botShow: false,
        }))
      } else if (num < 0 && !botShow) {
        dispatch(airReset({
          botShow: true,
        }))
      }
      reTop = top
    },

    handleTime: date => {
      const datesplit = date.split('-')
      const nextdate = new Date(datesplit[0], (datesplit[1] * 1) - 1, datesplit[2])
      const y = nextdate.getFullYear()
      const m = nextdate.getMonth()
      const d = nextdate.getDate()
      setStore('date', `${ y }-${ m + 1 }-${ d }`, 'session')
      dispatch(getAirdata())
    },

    goDetail: (flightNum, flightTimes, flightTypeFullName) => {
      dispatch({ type: 'DET_INIT' })
      browserHistory.push(`/jipiao/detail/${ flightNum }/${ flightTimes }/${ flightTypeFullName }`)
    },

    handleFilterback: arr => {
      dispatch(airReset({
        ...arr,
      }))
    },

    handleSort: (timeSort, priceSort, nowSort, airdata) => {
      if (nowSort === 'timeSort') {
        priceSort = ''
        if (typeof timeSort === 'boolean') {
          timeSort = !timeSort
        } else {
          timeSort = true
        }
        if (timeSort) {
          for (let i = 0; i < airdata.length; i++) {
            for (let j = 0; j < airdata.length - 1 - i; j++) {
              const pro = parseInt(airdata[j].dptTime.replace(':', ''), 10)
              const next = parseInt(airdata[j + 1].dptTime.replace(':', ''), 10)
              if (pro > next) {
                const temp = airdata[j + 1]
                airdata[j + 1] = airdata[j]
                airdata[j] = temp
              }
            }
          }
        } else {
          for (let i = 0; i < airdata.length; i++) {
            for (let j = 0; j < airdata.length - 1 - i; j++) {
              const pro = parseInt(airdata[j].dptTime.replace(':', ''), 10)
              const next = parseInt(airdata[j + 1].dptTime.replace(':', ''), 10)
              if (pro < next) {
                const temp = airdata[j + 1]
                airdata[j + 1] = airdata[j]
                airdata[j] = temp
              }
            }
          }
        }
      } else if (nowSort === 'priceSort') {
        timeSort = ''
        if (typeof priceSort === 'boolean') {
          priceSort = !priceSort
        } else {
          priceSort = true
        }
        if (priceSort) {
          for (let i = 0; i < airdata.length; i++) {
            for (let j = 0; j < airdata.length - 1 - i; j++) {
              if (airdata[j].barePrice > airdata[j + 1].barePrice) {
                const temp = airdata[j + 1]
                airdata[j + 1] = airdata[j]
                airdata[j] = temp
              }
            }
          }
        } else {
          for (let i = 0; i < airdata.length; i++) {
            for (let j = 0; j < airdata.length - 1 - i; j++) {
              if (airdata[j].barePrice < airdata[j + 1].barePrice) {
                const temp = airdata[j + 1]
                airdata[j + 1] = airdata[j]
                airdata[j] = temp
              }
            }
          }
        }
      }
      dispatch(airReset({
        timeSort,
        priceSort,
        airdata,
      }))
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    timeOut = setTimeout(() => {
      alert('', '航班信息可能已过期，请重新搜索', [
        {
          text:    '确定',
          onPress: () => {
            window.location.reload()
          },
        },
      ])
    }, 600000)
    // 查询
    // console.log('air')
    if (!state.airdata) {
      dispatch(getAirdata())
      get('/jipiao/v1/priceCalender', {
        channel:   getStore('channel', 'session'),
        departure: getStore('fromCity'),
        arrive:    getStore('toCity'),
      })
      .then(({ code, data, message }) => {
        if (code === 0) {
          dispatch(airReset({
            calenderdata: data,
          }))
        } else {
          console.log(message)
        }
      })
    }
  },

  componentWillUnmount: () => {
    clearTimeout(timeOut)
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Air)
)
