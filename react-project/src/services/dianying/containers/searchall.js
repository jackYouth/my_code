import { connect } from 'react-redux'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import { setStore, getStore, stringifyQuery } from '@boluome/common-lib'
import { get } from 'business'
import { serReset } from '../actions/searchall.js'
import Searchall from '../components/searchall'

const mapStateToProps = state => {
  const { searchall } = state
  return {
    ...searchall,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    goDetail: (detail, flag) => {
      setStore('flag', flag, 'session')
      dispatch({ type: 'DET_INIT' })
      browserHistory.push(`/dianying/${ getStore('channel', 'session') }/detail/${ detail.id }/${ detail.isOnShow }`)
    },

    goCinema: detail => {
      dispatch({ type: 'CIN_INIT' })
      browserHistory.push(`/dianying/${ getStore('channel', 'session') }/cinema/${ detail.id }/`)
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

    handleFilter: (data, myKey, cb) => {
      const patt = new RegExp(myKey, 'i')
      const dataList = {
        '影片': data.films.filter(e => patt.test(e.name)),
        '影院': data.cinemas.filter(e => patt.test(e.name)),
      }
      dispatch(
        serReset({
          myKey,
          dataList,
        })
      )
      cb(null, dataList)
    },
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {
    componentWillMount: () => {
      document.title = '搜索'
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { customize = {} } = customer
      if (customize.default.type === 'banner')  document.getElementById('root').firstChild.firstChild.firstChild.lastChild.innerHTML = '搜索'
      const { routeParams } = state
      const { cityId, channel } = routeParams
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
        showing: () => {
          return getURL('/dianying/v1/film/showing', { channel, cityId })
        },
        coming: () => {
          return getURL('/dianying/v1/film/coming', { channel, cityId })
        },
        cinemas: () => {
          return getURL('/dianying/v2/cinemas', {
            channel,
            cityId,
            latitude:  getStore('geopoint', 'session') ? getStore('geopoint', 'session').latitude : '',
            longitude: getStore('geopoint', 'session') ? getStore('geopoint', 'session').longitude : '',
            userId:    getStore('customerUserId', 'session'),
            mapType:   'gaode',
          })
        },
      }
      const main = () => {
        return Promise.all([request.showing(), request.coming(), request.cinemas()])
      }
      // 运行示例
      main().then(value => {
        handleClose()
        const s = value[1].filmsGroupByMonth ? value[1].filmsGroupByMonth.reduce((a, b) => {
          return [...a, ...b.films]
        }, []) : []
        const d = s.filter(e => !value[0].some(f => f.id === e.id))
        console.log(d)
        const data = {
          films:   [...value[0], ...d],
          cinemas: value[2],
        }
        dispatch(
          serReset({
            data,
          })
        )
        console.log(data)
      }).catch(error => {
        handleClose()
        console.log(error)
      })
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
    wrap(mapFunToComponent)(Searchall)
  )
