import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { get, parseLocName, setStore, getStore } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { keys } from 'ramda'
import { getLocationGaode, login } from 'business'
import App from '../components/app'
import { appReset, resetData, getActivityCategory } from '../actions/app.js'

const mapStateToProps = porps => {
  console.log(porps)
  const { app } = porps
  return {
    ...app,
  }
}

const mapDispatchToProps = dispatch => ({

  addfun: (limit, offset, fetchData, onSuccess, datalist) => {
    const a = keys(fetchData).reduce((arr, p) => {
      if (fetchData[p]) arr[p] = fetchData[p]
      return arr
    }, {})
    get('/piaowu/queryActivityList', {
      channel:  getStore('piaowu_channel', 'session'),
      cityCode: getStore('piaowu_cityCode', 'session'),
      limit,
      offset,
      ...a,
    }).then(({ code, data, message }) => {
      if (code === 0) {
        onSuccess(data)
        dispatch(appReset({ offset: datalist.length + data.length }))
      } else {
        console.log(message)
      }
    })
    .catch(err => {
      console.log(err)
    })
  },

  search: (searchKey, cb) => {
    if (searchKey) {
      get('/piaowu/queryActivityList', {
        channel:  getStore('piaowu_channel', 'session'),
        cityCode: getStore('piaowu_cityCode', 'session'),
        search:   searchKey,
      }).then(({ code, data, message }) => {
        if (code === 0) {
          cb(null, data)
        } else {
          console.log(message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    } else {
      cb('searchKey is undefined')
    }
  },

  goDetail: activityCode => {
    dispatch({ type: 'DEL_INIT' })
    browserHistory.push(`/piaowu/detail?channel=${ getStore('piaowu_channel', 'session') }&activityCode=${ activityCode }`)
  },

  handleSelct: (cityArr, categoryArr, cityName, filtered) => {
    dispatch(resetData(cityArr, categoryArr, cityName, filtered))
  },

  handleChannel: (result, cityArr, categoryArr, channel, cityName) => {
    console.log(result)
    // if (result.brandCode !== channel) {
    setStore('piaowu_channel', result.brandCode, 'session')
    // if (getStore('currentPosition', 'session')) {
    //   if (!cityName) cityName = parseLocName(getStore('currentPosition', 'session').city)
    //   dispatch(getActivityCategory(cityArr, categoryArr, cityName))
    // } else {
    getLocationGaode(
      err => {
        if (err && !cityName) {
          cityName = '上海'
        } else if (!cityName) {
          cityName = parseLocName(getStore('currentPosition', 'session').city)
        }
        dispatch(getActivityCategory(cityArr, categoryArr, cityName))
      }
    )
    // }
    // } else {
    //   dispatch(appReset({ filtering: false }))
    // }
  },

  handlePush: (pro, filtering) => {
    console.log(pro, filtering)
    if (pro === filtering) filtering = false
    dispatch(appReset({ filtering }))
  },
  dispatch,
})

const mapFunToComponent  = () => ({
  componentWillMount: () => {
    login(err => {
      if (err) {
        Toast.info('未登录', 1)
      }
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
