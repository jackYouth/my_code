/*
  industryCode: 商品的code
  channel：     商家的code
*/


import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore, setStore } from '@boluome/common-lib'
import { wrap, Mask, Loading } from '@boluome/oto_saas_web_app_component'
import { getLocationGaode, login } from 'business'

import App from '../components/app'

import { getCategories, getSeverBusiness, getSeverTimes } from '../actions/app'

const closeLoading = Loading()

const mapStateToProps = ({ app }) => {
  return {
    ...app,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleGoodClick(goodInfo) {
      const { serviceId, isCanService } = goodInfo
      const industryCode = getStore('industryCode', 'session')
      browserHistory.push(`/daojia/${ industryCode }/detail?serviceId=${ serviceId }&supportThisCity=${ isCanService }`)
    },
    handleSearchClick() {
      browserHistory.push('/daojia/search')
    },
  }
}

// 根据经纬度获取城市信息，主要是county
// const getLocationAddress = () => dispatch => {
//   const currentPosition = getStore('currentPosition', 'session')
//   const { city, district } = currentPosition
//   const address = getStore('currentAddress', 'session')
//   const geopoint = getStore('geopoint', 'session')
//   // 将定位城市名保存到本地
//   const localCity = city.replace('市', '')
//   setStore('localCity', localCity, 'session')
//   // 将定位的 longitude, latitude, city, county 作为默认的selectedCity保存到本地
//   const selectedCity = { city, address, county: district, ...geopoint }
//   setStore('selectedCity', selectedCity, 'session')
//   dispatch({ type: 'SET_SELECTED_ADDRESS', selectedCity })
// }

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      // mock
      // setStore(`daojia${ channel }_searchHistorys`, ['手机', '苹果', '鲜花'])

      // const industryCode = `mms_daojia${ location.pathname.split('/')[2] }`
      const industryCode = location.pathname.split('/')[2]
      setStore('industryCode', industryCode, 'session')
      dispatch({ type: 'SET_INDUSTRY_CODE', industryCode })

      getLocationGaode(() => {
        // dispatch(getLocationAddress())
        const address = getStore('currentAddress', 'session')
        const geopoint = getStore('geopoint', 'session')
        const currentPosition = getStore('currentPosition', 'session')
        const { city, district } = currentPosition
        const selectedCity = { city, address, county: district, ...geopoint }
        setStore('selectedCity', selectedCity, 'session')
        dispatch({ type: 'SET_SELECTED_ADDRESS', selectedCity })

        dispatch(getCategories())
        // dispatch(getGoods({}))
        dispatch(getSeverBusiness())
        dispatch(getSeverTimes())

        closeLoading()
      })
      login(err => {
        if (err) {
          console.log('login error')
        } else {
          console.log('login sucess')
        }
      })
    },
    componentWillUnmount() {
      Mask.closeAll()
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(App))
