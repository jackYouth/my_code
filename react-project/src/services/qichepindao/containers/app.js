import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { parseLocName, getStore, stringifyQuery, removeStore, setStore } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
// import { get, getLocationGaode, login } from 'business'
import { getLocationGaode, login } from 'business'
import { getData, fetchShop } from '../actions/app.js'
import { getListData, appReset } from '../actions/addCar'
import { SubmitOrder } from '../actions/editCar'
import App from '../components/app'

const mapStateToProps = state => {
  const { app, addCar } = state
  console.log('--addCar--', addCar)
  return {
    ...app,
    ...addCar,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    handleAddCar: () => {
      browserHistory.push('/qichepindao/addCar')
    },

    goWeizhang: data => {
      setStore('dataAll', data, 'session')
      window.location.href = `${ location.protocol }//${ location.host }/weizhang/peccancy/${ location.search }`
    },

    goViewAll: () => {
      window.location.href = `${ location.protocol }//${ location.host }/baoyang/${ location.search }`
    },

    goNav: industryCode => {
      window.location.href = `${ location.protocol }//${ location.host }/${ industryCode }/${ location.search }`
    },

    goDetail: (industryCode, serviceId, supportThisCity) => {
      const search = { serviceId, supportThisCity }
      window.location.href = `${ location.protocol }//${ location.host }/baoyang/${ industryCode }/detail/${ stringifyQuery(search) }`
    },

    refData: locationData => {
      // console.log('-locationData-', locationData)
      const { name, city, district, location } = locationData
      const geopoint = { latitude: location.lat, longitude: location.lng }
      dispatch(getData(name, city, district, geopoint))
      dispatch(fetchShop(geopoint))
    },

    handlePlateNumberCar: (from, to, platData) => {
      console.log(from, to)
      if (platData && platData.length > 0) {
        // dispatch(getWeizhangData(platData[0]))
      }
    },
    handleTimevalue: (time, appdata) => {
      console.log('--appdata----', appdata)
      if (appdata) {
        const { carPhone, cityId, cityName, plateNumber, vin, engineNo, logo, model, id, chexi, chexing } = appdata
        dispatch(SubmitOrder(carPhone, cityId, cityName, plateNumber.split(''), vin, engineNo, logo, model, time, chexi, chexing, id, true))
      }
      dispatch(appReset({
        time,
      }))
    },
    handleEditPlate: plateNumber => {
      console.log('--plateNumber--', plateNumber)
      removeStore('qichepindao_edit_data', 'session')
      removeStore('qiche_chegu', 'session')
      removeStore('qiche_chegu_chexing', 'session')
      removeStore('qiche_chegu_chexi', 'session')
      browserHistory.push(`/qichepindao/editCar/?plateNumber=${ plateNumber }`)
    },
  }
}

const mapFunToComponent  = dispatch => {
  return {
    componentWillMount: () => {
      // handleGetlocation(dispatch);
      login(err => {
        if (err) {
          Toast.info('未登录', 1)
        }
      })
      getLocationGaode(
        err => {
          let name
          let cityName
          let geopoint
          let district
          if (err) {
            name = '上海'
            cityName = '上海'
            geopoint = { latitude: '31.230449', longitude: '121.473609' }
            district = '黄浦区'
          } else {
            name = getStore('currentAddress', 'session')
            cityName = parseLocName(getStore('currentPosition', 'session').city)
            geopoint = getStore('geopoint', 'session')
            district = getStore('currentPosition', 'session').district
          }
          dispatch(getData(name, cityName, district, geopoint))
          dispatch(fetchShop(geopoint))
          dispatch(getListData())
        }
      )
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(App)
  )
