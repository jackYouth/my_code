import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { parseQuery, getStore, setStore } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { Popup, Toast } from 'antd-mobile'
import { login } from 'business'

import Detail from '../components/detail'

import { getGoodDetails, getAllReserveTimes } from '../actions/detail'

const mapStateToProps = ({ detail }) => {
  const selectedCity = getStore('selectedCity', 'session')
  const currentAddress = `${ selectedCity.city }${ selectedCity.county }`
  return {
    ...detail,
    currentAddress,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleMoreCommentClick() {
      const serviceId = parseQuery(location.search).serviceId
      browserHistory.push(`/daojia/comment-info?serviceId=${ serviceId }`)
    },
    handleBusinessNameClick(brandId) {
      const channel = getStore('channel', 'session')
      browserHistory.push(`/daojia/${ channel }/business?brandId=${ brandId }`)
    },
    handleSpecClick(currentSpec) {
      dispatch({ type: 'SET_CUREENT_SPECIFICATION', currentSpec })
    },
    // btnDisable： 为true时，表示当前商品是多规格且未选中
    handleBtnClick(goods) {
      login(err => {
        if (err) {
          Toast.info('未登录', 1)
        } else {
          Popup.hide()
          const channel = getStore('channel', 'session')
          const industryCode = getStore('industryCode', 'session')
          setStore(`selectGood_${ industryCode }`, goods, 'session')
          browserHistory.push(`/daojia/${ channel }/order`)
        }
      }, true)
    },
  }
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      const industryCode = location.pathname.split('/')[2]
      setStore('industryCode', industryCode, 'session')
      const serviceId = parseQuery(location.search).serviceId
      dispatch(getGoodDetails(serviceId))
      dispatch(getAllReserveTimes(serviceId))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(Detail))
