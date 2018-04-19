import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { get, login } from 'business'
import { selReset } from '../actions/select.js'
import Select from '../components/select'

let filming = ''
const mapStateToProps = state => {
  const { select } = state
  return {
    ...select,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    callback: d => {
      dispatch(
        selReset({
          keys: d.dateStr,
        })
      )
    },

    goAddr: cinemaInfo => {
      dispatch({ type: 'ADDR_INIT' })
      browserHistory.push(`/dianying/addr/${ cinemaInfo.name }/${ cinemaInfo.address }/${ cinemaInfo.longitude }/${ cinemaInfo.latitude }`)
    },

    goDetail: (detail, keys, filmInfo, flag) => {
      const { routeParams } = props
      const { channel } = routeParams
      setStore('filmInfo', JSON.stringify(filmInfo), 'session')
      setStore('filmId', filmInfo.id, 'session')
      setStore('filmDate', keys, 'session')
      setStore('flag', flag, 'session')
      dispatch({ type: 'DET_INIT' })
      browserHistory.push(`/dianying/${ channel }/detail/${ detail.id }/${ detail.isOnShow }`)
    },

    goGetseat: (plan, selData, filmInfo, keys) => {
      const loginAfter = () => {
        setStore('cinemaInfo', JSON.stringify(selData.cinemaInfo), 'session')
        setStore('plan', JSON.stringify(plan), 'session')
        setStore('filmInfo', JSON.stringify(filmInfo), 'session')
        setStore('filmDate', keys, 'session')
        setStore('filmId', filmInfo.id, 'session')
        const { routeParams } = props
        const { channel } = routeParams
        const cinemaId = getStore('cinemaId', 'session')
        dispatch({ type: 'GET_INIT' })
        browserHistory.push(`/dianying/${ channel }/getseat/${ cinemaId }/${ plan.planId }/${ plan.hallId }`)
      }
      if (getStore('customerUserId', 'session')) {
        loginAfter()
      } else {
        login(err => {
          if (err) {
            Toast.info('未登录', 1)
          } else {
            loginAfter()
          }
        }, true)
      }
    },

    handleFilm: (info, keys) => {
      const { routeParams } = props
      const { channel } = routeParams
      const cinemaId = getStore('cinemaId', 'session')
      if (info) {
        dispatch(
          selReset({
            filmInfo: info,
            filmData: '',
          })
        )
        const filmId = info.id
        filming = filmId
        // 获取影片场次
        get(`/dianying/v1/cinema/${ cinemaId }/film/${ filmId }/plans`, { channel, cinemaId, filmId, cityId: getStore('cityId', 'session') })
        .then(({ code, data, message }) => {
          if (code === 0 && filming === filmId) {
            if (keys) {
              keys = data.some(e => e.dateStr === keys) ? keys : data[0].dateStr
            } else {
              keys = data[0].dateStr
            }
            console.log(keys)
            dispatch(
              selReset({
                filmData: data,
                keys,
              })
            )
          } else {
            console.log(message)
          }
        })
      }
    },
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {
    componentWillMount: () => {
      document.title = '影院详情'
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { customize = {} } = customer
      if (customize.default.type === 'banner')  document.getElementById('root').firstChild.firstChild.firstChild.lastChild.innerHTML = '影院详情'
      const { routeParams } = state
      const { channel } = routeParams
      const cinemaId = getStore('cinemaId', 'session')
      const filmId = getStore('filmId', 'session')
      const keys = getStore('filmDate', 'session')
      // 获取影院列表
      get(`/dianying/v1/cinema/${ cinemaId }/films`, { channel, cinemaId, cityId: getStore('cityId', 'session') }).then(({ code, data, message }) => {
        if (code === 0) {
          let initNum = 0
          if (filmId) {
            for (let i = 0; i < data.films.length; i++) {
              if (`${ data.films[i].id }` === filmId) {
                initNum = i
              }
            }
          }
          dispatch(
            selReset({
              selData: data,
              initNum,
              keys,
            })
          )
        } else {
          console.log(message)
        }
      })
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Select)
  )
