import { connect } from 'react-redux'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import { setStore, getStore, stringifyQuery } from '@boluome/common-lib'
import { get } from 'business'
import { senReset } from '../actions/searchcin.js'
import Searchcin from '../components/searchcin'

const mapStateToProps = state => {
  const { searchcin } = state
  return {
    ...searchcin,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    goSelect: id => {
      if (id) {
        setStore('cinemaId', id, 'session')
        setStore('filmId', '', 'session')
        setStore('filmDate', '', 'session')
        dispatch({ type: 'SEL_INIT' })
        browserHistory.push(`/dianying/${ getStore('channel', 'session') }/select`)
      }
    },

    handleFilter: (data, myKey, cb) => {
      const patt = new RegExp(myKey, 'i')
      const dataList = data.filter(e => patt.test(e.name))
      dispatch(
        senReset({
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
      const { filmId, channel } = routeParams
      const handleClose = Loading()
      const sendURL = `/dianying/v1/film/${ filmId }/cinemas`
      const sendData = {
        channel,
        regionId:  '',
        userId:    getStore('customerUserId', 'session'),
        cityId:    getStore('cityId', 'session'),
        latitude:  getStore('geopoint', 'session') ? getStore('geopoint', 'session').latitude : '',
        longitude: getStore('geopoint', 'session') ? getStore('geopoint', 'session').longitude : '',
      }
      const urldata = getStore(`${ sendURL }${ stringifyQuery(sendData) }`, 'session')
      if (urldata) {
        const d = urldata.reduce((p, n) => {
          const t = n.cinemas.filter(e => !p.some(f => f.id === e.id))
          return [...p, ...t]
        }, [])
        handleClose()
        dispatch(
          senReset({
            data: d,
          })
        )
      } else {
        get(sendURL, sendData)
        .then(({ code, data, message }) => {
          handleClose()
          if (code === 0) {
            setStore(`${ sendURL }${ stringifyQuery(sendData) }`, data, 'session')
            const d = data.reduce((p, n) => {
              const t = n.cinemas.filter(e => !p.some(f => f.id === e.id))
              return [...p, ...t]
            }, [])
            dispatch(
              senReset({
                data: d,
              })
            )
          } else {
            console.log(message)
          }
        })
        .catch(error => {
          handleClose()
          console.log(error)
        })
      }
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Searchcin)
  )
