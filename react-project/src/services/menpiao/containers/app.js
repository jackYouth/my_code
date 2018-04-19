import { connect } from 'react-redux'
import { wrap, Mask, Loading } from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'
import { browserHistory } from 'react-router'
import { getLocationGaode, login, customerCode } from 'business'
import { Toast } from 'antd-mobile'

import App from '../components/app'
import { CityData, fetchScenics, ThemeData } from '../actions/app'

const { AMap = '' } = window
const mapStateToProps = ({ app }) => {
  return {
    ...app,
  }
}

const mapDispatchToProps = dispatch => {
  const locationFn = (res, latOrlng) => {
    const customerLocation = { localCity: res.name, latOrlng, province: res.prov }
    setStore('customerLocation', customerLocation, 'session')
    dispatch({
      type:         'CHANGE_SELECTED_CITY',
      selectedCIty: res.name,
      city:         res.name,
      prov:         res.prov,
      offset:       0,
      levelPic:     false,
      sortPic:      false,
      themePic:     false,
      lat:          latOrlng.latitude,
      lng:          latOrlng.longitude,
    })
  }
  return {
    dispatch,
    // 测试 开个订单详情页面的入口
    goOrderDetails: () => {
      browserHistory.push('/menpiao/orderDetails')
    },
    handleGoDetails: id => {
      setStore('itemId', id, 'session')
      dispatch({ type: 'OFFSET', offset: 0 })
      browserHistory.push(`/menpiao/details?id=${ id }`)
    },
    handleCityname: res => {
      console.log('res---test', res)
      let latOrlng = getStore('geopoint', 'session')
      const cityName = res.name
      // 高德根据城市名获取坐标
      AMap.service('AMap.Geocoder', () => { // 回调函数
        // 实例化Geocoder
        const geocoder = new AMap.Geocoder()
        geocoder.getLocation(cityName, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            // console.log('高德---', result)
            const { geocodes } = result
            const { lat, lng } = geocodes[0].location
            setStore('mySelfpoint', { latitude: lat, longitude: lng }, 'session')
            if (!latOrlng) {
              latOrlng = { latitude: lat, longitude: lng }
              setStore('geopoint', { latitude: lat, longitude: lng }, 'session')
              if (latOrlng) {
                locationFn(res, latOrlng)
              }
            } else {
              console.log('--wobuxuyao--')
              locationFn(res, latOrlng)
            }
          } else {
            // 获取经纬度失败
            console.log('Amap getLocation fail')
            if (latOrlng) {
              locationFn(res, latOrlng)
            }
          }
        })
      })
      // console.log('--test----', latOrlng)
      // if (latOrlng) {
      //   const customerLocation = { localCity: res.name, latOrlng, province: res.prov }
      //   setStore('customerLocation', customerLocation, 'session')
      //   dispatch({
      //     type:         'CHANGE_SELECTED_CITY',
      //     selectedCIty: res.name,
      //     city:         res.name,
      //     prov:         res.prov,
      //     offset:       0,
      //     levelPic:     false,
      //     sortPic:      false,
      //     themePic:     false,
      //     lat:          latOrlng.latitude,
      //     lng:          latOrlng.longitude,
      //   })
      // }
      // 2017-10-31 发现城市切换没有重新请求主题
      dispatch(ThemeData(cityName))
    },
    handleSearch: (fetchData, keyword, onSuccess) => {
      Mask.closeAll()
      // console.log('search', fetchData)
      fetchScenics({
        channel:     'lvmama',
        ...fetchData,
        queryText:   keyword,
        pageSize:    100,
        currentPage: 1,
        mapType:     'gaode',
      }, data => {
        onSuccess(null, data.scenicList)
      })
    },
    handleFetchMore: (limit, offset, fetchData, onSuccess) => {
      // console.log('fetchmore', limit, offset, fetchData)
      const { prov, city, lat, lng, level, theme, sort } = fetchData
      fetchScenics({
        channel:     'lvmama',
        prov,
        city,
        lat,
        lng,
        level,
        theme,
        sort,
        pageSize:    limit,
        currentPage: Math.ceil((offset + 10) / limit),
        mapType:     'gaode',
      }, data => {
        onSuccess(data.scenicList)
        dispatch({ type: 'OFFSET', offset: offset + data.scenicList.length })
      })
    },
   // 当点击搜索的时候应该关闭弹出窗口
    handleSearchOnclick: () => {
      Mask.closeAll()
      dispatch({ type: 'FILTERING', filtering: false })
      browserHistory.push('/menpiao/search')
    },
    handlePush: (pro, filtering) => {
      console.log(pro, filtering)
      if (pro === filtering) filtering = false
      dispatch({ type: 'FILTERING', filtering })
    },
    handleSelct: (sort, level, theme) => {
      // console.log('aaaaa---', sort, level, theme)
      dispatch({ type: 'SORT', sort, offset: 0 })
      dispatch({ type: 'LEVEL', level, offset: 0 })
      dispatch({ type: 'THEME', theme, offset: 0 })
    },
    myClick: cb => {
      const customerUserId = getStore('customerUserId', 'session')
      if (customerUserId) {
        cb()
      } else {
        // 用户绑定
        login(err => {
          if (err) {
            console.log(err)
            Toast.info('登录失败，请退出重新登录', 2, null, false)
          } else {
            console.log('我是用户绑定')
            cb()
          }
        }, true)
      }
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    login(err => {
      if (err) {
        console.log(err)
      } else {
        console.log('我是用户绑定')
      }
    })
    if (getStore('customerHistory', 'session')) {
      console.log('history')
    } else {
      const customerHistory = []
      setStore('customerHistory', customerHistory, 'session')
    }
    if (getStore('customerLocation', 'session')) {
      const customerLocation = getStore('customerLocation', 'session')
      const latOrlng = getStore('geopoint', 'session')
      dispatch({
        type:         'CHANGE_SELECTED_CITY',
        selectedCIty: customerLocation.localCity,
        prov:         customerLocation.province,
        lat:          latOrlng.latitude,
        lng:          latOrlng.longitude,
        city:         customerLocation.localCity,
      })
      dispatch(ThemeData(customerLocation.localCity, ''))
      dispatch({ type: 'OFFSET', offset: 0 })
      setStore('mySelfpoint', latOrlng, 'session')
      Mask.closeAll()
    } else {
      const handleClose = Loading()
      getLocationGaode(err => {
        // 定位成功
        if (err) {
          dispatch({ type: 'GOCHOOSE_CIYTNAME', Gocity: false }) // 未启用失败补救方案
          dispatch({
            type:         'CHANGE_SELECTED_CITY',
            selectedCIty: '上海',
            prov:         '上海',
            lat:          '31.2303700000',
            lng:          '121.4737000000',
            city:         '上海',
          })
          dispatch(ThemeData('上海', ''))
          setStore('mySelfpoint', { latitude: '31.2303700000', longitude: '121.4737000000' }, 'session')
          Mask.closeAll()
          const num = document.getElementsByClassName('mask-container').length
          for (let i = 0; i < num; i++) {
            document.getElementsByClassName('mask-container')[0].parentNode.remove()
          }
        } else {
          const city = getStore('currentPosition', 'session').city ? getStore('currentPosition', 'session').city : '上海'
          const localCity = city.replace(/["省", "市", "县", "区"]/, '')
          const latOrlng  = getStore('geopoint', 'session')
          const province  = getStore('currentPosition', 'session').province.replace(/["省", "市", "县", "区"]/, '')
          const customerLocation = { localCity, latOrlng, province }
          setStore('customerLocation', customerLocation, 'session')
          dispatch({
            type:         'CHANGE_SELECTED_CITY',
            selectedCIty: localCity,
            prov:         province,
            lat:          latOrlng.latitude,
            lng:          latOrlng.longitude,
            city:         localCity,
          })
          dispatch(ThemeData(localCity, ''))
          setStore('mySelfpoint', { latitude: latOrlng.latitude, longitude: latOrlng.longitude }, 'session')
        }
        Mask.closeAll()
        handleClose()
      })
    }
  },
  componentDidMount: () => {
    // alert('componentDidMount')
    dispatch(CityData())
    const isIOS = () => /iPhone|iPad|iPod|iOS/.test(navigator.userAgent)
    const Code = customerCode
    if (!isIOS() && (Code === 'abchina')) {
      require('../style/nonghang.scss')
    } else if (isIOS() && (Code === 'abchina')) {
      require('../style/Iosnonghang.scss')
    }
  },
  componentWillUnmount: () => {
    // alert('componentWillUnmount');
    Mask.closeAll()
  },
  componentDidUpdate: () => {
    const bodyfontSize = document.documentElement.style.fontSize
    const viewportScale = window.viewportScale
    const obj1 = document.getElementsByClassName('itemPic')[0]
    if (bodyfontSize === '50px' && viewportScale === 1) {
      if (obj1) {
        dispatch({ type: 'DIV_WIDTH', width: obj1.clientWidth })
        dispatch({ type: 'DIV_HEIGHT', height: obj1.clientHeight })
        // console.log('wwwww---------obj1.clientWidth=', obj1.clientWidth, obj1)
      }
    }
  },
  componentWillReceiveProps(nextProps) {
    const { width, height }   = nextProps
    dispatch({ type: 'DIV_WIDTH', width })
    dispatch({ type: 'DIV_HEIGHT', height })
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(App)
  )
