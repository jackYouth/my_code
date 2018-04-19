import { connect } from 'react-redux'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import { getStore, setStore } from '@boluome/common-lib'
import { get, login } from 'business'
import { detReset } from '../actions/detail.js'
import Detail from '../components/detail'

const mapStateToProps = state => {
  const { detail } = state
  return {
    ...detail,
  }
}

const mapDispatchToProps = (dispatch, state) => {
  return {
    dispatch,

    handleMore: more => {
      dispatch(
        detReset({
          more: !more,
        })
      )
    },

    goPic: pic => {
      setStore('maoyan_pic', pic, 'session')
      browserHistory.push('/dianying/picture/')
    },

    goCinema: detailData => {
      const { routeParams } = state
      const { channel, filmId } = routeParams
      dispatch({ type: 'CIN_INIT' })
      browserHistory.push(`/dianying/${ channel }/cinema/${ detailData.id || filmId }/`)
    },
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {
    componentWillMount: () => {
      document.title = '影片详情'
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { customize = {} } = customer
      if (customize.default.type === 'banner')  document.getElementById('root').firstChild.firstChild.firstChild.lastChild.innerHTML = '影片详情'
      const flag = getStore('flag', 'session') === true || false
      console.log(flag)
      const { routeParams } = state
      const { filmId, channel, isOnShow } = routeParams
      const handleClose = Loading()
      const path = isOnShow === 1 ? 'showing' : 'coming'
      get(`/dianying/v1/film/${ path }/${ filmId }`, { channel, filmId })
      .then(({ code, data, message }) => {
        handleClose()
        if (code === 0) {
          dispatch(
           detReset({
             flag,
             channel,
             detailData: data,
           })
          )
        } else {
          console.log(message)
        }
      })
      .catch(() => {
        handleClose()
      })

      // 详情登录
      if (getStore('customerUserId', 'session')) {
        console.log('已登录')
      } else {
        login(err => {
          if (err) {
            console.log('未登录')
          }
        })
      }
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Detail)
  )
