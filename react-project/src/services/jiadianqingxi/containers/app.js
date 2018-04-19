// common
import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'
import { login, getLocationGaode } from 'business'
// import { browserHistory } from 'react-router'
// self
import { getListDataFn } from '../actions/app.js'
import { getDetailsData } from '../actions/details.js'

import App from '../components/app'

const mapStateToProps = state => { // 给组建、件添加属性
  // console.log('state==========', state)
  const { markId, getListData } = state
  const { listData, selectedCIty } = getListData
  return {
    markId,
    listData,
    selectedCIty,
  }
}
const mapDispatchToProps = dispatch => { // 添加方法
  return {
    dispatch,
    getListDataHandle: res => {
      console.log('res', res)
      dispatch({ type: 'CHANGE_SELECTED_CITY', selectedCIty: res.name })
      dispatch(getListDataFn(res.name))
    },
    goDetails: (cityId, Id) => {
      const markId = {
        cityId,
        Id,
      }
      dispatch({ type: 'CHANGE_SELECTED_GOODS', markId })
      setStore('markId', markId, 'session')
      console.log('markId--------', markId)
      dispatch(getDetailsData(markId, Id, cityId))
      // browserHistory.push(`/jiadianqingxi/details?categoryId=${ Id }&cityId=${ cityId }`)
    },
    // goListcustomer: () => {
    //   // browserHistory.push('/jiadianqingxi/list?customerUserId='+ getStore('customerUserId') );
    //   window.location.href = `/jiadianqingxi/list?customerUserId=${ getStore('customerUserId', 'session') }`
    // },
  }
}
const mapFunToComponent = dispatch => { // 整个生命周期只执行一次
  return {
    componentWillMount: () => {
      login(err => {
        if (err) {
          console.log(err)
        } else {
          console.log('我是用户绑定')
        }
      })
      getLocationGaode(err => {
        let localCity = '上海'
        if (err) {
          console.log('定位失败')
        } else {
          localCity = getStore('currentPosition', 'session').city.replace(/['省', '市', '县', '区']/, '')
        }
        dispatch({ type: 'CHANGE_SELECTED_CITY', selectedCIty: localCity })
        console.log(getStore)
        dispatch(getListDataFn(localCity))
      })
    },
  }
}

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
