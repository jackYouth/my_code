import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { setStore, getStore, parseQuery } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { merge } from 'ramda'

import SelectCity from '../components/SelectCity.js'
import { changeCity } from '../actions'

window.browserHistory = browserHistory

const mapStateToProps = () => {
  const localCity = getStore('localCity', 'session')
  return {
    localCity,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleCityData(res) {
      const { id, name } = res
      console.log('res', res)
      const currentBillInfo = getStore('currentBillInfo', 'session') ? getStore('currentBillInfo', 'session').currentBillInfo : {}
      merge(currentBillInfo, { cityId: id, cityName: name })
      setStore('currentBillInfo', { currentBillInfo }, 'session')

      const search = location.search // ?a=1&b=2
      if (parseQuery(search).flag === '1') {    // 是从选择org页跳转过来的
        //  改变本地中存储的selectedCity
        setStore('selectedCity', { selectedCity: res }, 'session')
        //  改变本地中存储的getOrgsPara中的cityId
        const orgsPara = getStore('getOrgsPara', 'session').getOrgsPara
        orgsPara.cityId = id
        console.log('orgsPara', orgsPara)
        setStore('getOrgsPara', { getOrgsPara: orgsPara }, 'session')
        //  改变本地中存储的currentServer中的cityId
        const currentServer = getStore('currentServer', 'session').currentServer
        currentServer.cityId = id
        setStore('currentServer', { currentServer }, 'session')
        // 因为传入了handleClose，所以在公共组件内，选择城市后，会自动执行一次hanldeClose，故无需写history.back
      } else {
        const handleClose = Loading()
        dispatch(changeCity(res, handleClose, true))
      }
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCity)
