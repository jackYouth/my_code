import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { getCustomerConfig, getLocationGaode, login } from 'business'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { setStore, getStore } from '@boluome/common-lib'

import App from '../components/app'

import { chooseCity , dateChange , distanceChange , showCurrentCity, showInfo } from '../actions'
import { feachCarPrice } from '../actions/result'

export const customerCode = location.host.replace(/(.test.otosaas.com|.otosaas.com)/, '')

const mapStateToProps = ({ app , firstDate, carType } , state) => {
  console.log('445665456', app)
  const { city , distance , currentCity, chooseHistory } = app
  const { date } = firstDate
  const { chooseResult } = carType

  return{
    city, date, distance, currentCity, chooseResult, chooseHistory
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  chooseCity: result => dispatch(chooseCity(result)),
  dateChange: val => dispatch(dateChange(val)),
  distanceChange: val => dispatch(distanceChange(val)),
  check: (data) => {
    console.log('data-------',data);
    const { distance } = data
    const reg = new RegExp('^[0-9]*$')
    if(distance && reg.test(distance)){
      dispatch(feachCarPrice(data))
    } else {
      Toast.info('请输入正确的行驶里程',2)
    }
  }
})

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    const handleClose = Loading()
    const checkPosition = () =>{
      console.log('sessionStorage.currentPosition', sessionStorage.currentPosition)
      if (!sessionStorage.currentPosition){
        getLocationGaode(err => {
          if (err) {
            console.log('getLocationGaode err------>', err)
            setStore('geopoint', { 'latitude': 31.297493, 'longitude': 121.441354 }, 'session')
            setStore('currentPosition', {"citycode":"021","adcode":"310106","businessAreas":[{"name":"共和新路","id":"310108","location":{"O":31.289891128630693,"M":121.45289018109088,"lng":121.45289,"lat":31.289891}},{"name":"汶水路","id":"310108","location":{"O":31.288940008976667,"M":121.42672900538605,"lng":121.426729,"lat":31.28894}},{"name":"场中路","id":"310108","location":{"O":31.305415909897366,"M":121.45060286834712,"lng":121.450603,"lat":31.305416}}],"neighborhoodType":"","neighborhood":"","building":"","buildingType":"","street":"江场西路","streetNumber":"321号","province":"上海市","city":"上海市","district":"静安区","township":""}, 'session')
            setStore('localCity', '上海', 'session')
            dispatch(showInfo())
            handleClose()
          } else {
            dispatch(showInfo())
            handleClose()
          }
        })
      } else {
        dispatch(showInfo())
        handleClose()
      }
    }
    if(!sessionStorage.customerUserId){
      login(err => {
        if(err){
          console.log(err);
        } else {
          checkPosition()
        }
      })
    } else {
      checkPosition()
    }
  }
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(App)
  )
