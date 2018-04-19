import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore } from '@boluome/common-lib'
import { wrap, Loading }    from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { getLocationGaode, login } from 'business'

import App         from '../components/app'

import { getOngoing, getCarNum, toOrder } from '../actions/index'

const closeLoading = Loading()

const mapStateToProps = ({ app }) => {
  console.log('app', app)
  return {
    ...app,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeStartPoint(data) {
      const { name, address, location, city } = data
      const latitude = location.lat
      const longitude = location.lng
      const startPoint = { name, address, latitude, longitude, city }
      dispatch({ type: 'SET_START_POINT', startPoint })
      dispatch(getCarNum({ latitude, longitude }))
    },
    handleInputChange(phone) {
      dispatch({ type: 'SET_START_POINT', phone })
    },
    handleToOrder(orderParas) {
      toOrder(orderParas)
    },
    changeAddressComponentSelect(isAddressComopnentSelect) {
      dispatch({ type: 'CHANGE_ADDRESS_COMPONENT_SELECT', isAddressComopnentSelect })
    },
    handleToPriceRules(startPoint) {
      const paras = window.encodeURIComponent(JSON.stringify(startPoint))
      browserHistory.push(`/daijia/price-rules/?paras=${ paras }`)
    },
    handleOngoingModalClick(onGoingOrder) {
      browserHistory.push(`/daijia/orderDetails/${ onGoingOrder }`)
    },
  }
}

const mapFunToComponent  = (dispatch, props) => ({
  componentWillMount() {
    const { startPoint } = props
    // 如果是从其他也返回的，这时就不需要再次定位了
    if (!startPoint.latitude) {
      getLocationGaode(err => {
        if (err) {
          Toast.info('定位失败：', err)
          const { location } = window
          location.href = `${ location.origin }/status-pages/geolocation-error?cityApi=/basis/v1/daijia/e/cities&channel=daijia`
          return
        }
        const { city } = getStore('currentPosition', 'session')
        const point = getStore('geopoint', 'session')
        dispatch({ type: 'SET_START_POINT', startPoint: { city, ...point } })
      })
      login(err => {
        if (err) {
          Toast.info('绑定用户失败')
          return
        }
        dispatch(getOngoing())
        closeLoading()
      })
    } else {
      dispatch({ type: 'SET_START_POINT', startPoint })
      dispatch(getOngoing())
      closeLoading()
    }
  },
  componentWillUnmount() {
    dispatch({ type: 'SHOW_ONGOING_MODAL', showOngoing: false })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
