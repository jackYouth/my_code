import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap, Mask, Loading } from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'
import { getLocationGaode } from 'business'


import Searchcomponent from '../components/search'
import { IndexListData, CityData, fetchScenics } from '../actions/app.js'

const { AMap = '' } = window
const mapStateToProps = state => {
  // console.log('menpiao-------',app,'----state',state);
  const { app, search } = state
  const { IndexListDatas, selectedCIty,
    city, citydata, lat, lng, offset, prov, theme,
    level, sort, width, height,
  } = app
  const { keywordArr } = search
  // const { offset } = state
  return {
    IndexListDatas,
    IndexListData,
    CityData,
    citydata,
    selectedCIty,
    city,
    lat,
    lng,
    prov,
    theme,
    offset,
    sort,
    level,
    keywordArr,
    width,
    height,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleGoDetails: id => {
      setStore('itemId', id, 'session')
      dispatch({ type: 'OFFSET', offset: 0 })
      browserHistory.push(`/menpiao/details?id=${ id }`)
    },
    handleCityname: res => {
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
            }
          } else {
            // 获取经纬度失败
            console.log('Amap getLocation fail')
          }
        })
      })
      if (latOrlng) {
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
      } else {
        console.log('KJin--我是定位失败')
      }
    },
    handleSearch: (fetchData, keyword, onSuccess, handleSearchHistory) => {
      console.log('search', fetchData, keyword)
      fetchScenics({
        channel:     'lvmama',
        ...fetchData,
        queryText:   keyword,
        pageSize:    100,
        currentPage: 1,
      }, data => {
        onSuccess(null, data.scenicList)
      })
      handleSearchHistory(keyword)
    },
    // 处理搜索记录
    handleSearchHistory: keyword => {
      const customerHistory = getStore('customerHistory', 'session')
      const test = customerHistory.filter(i => keyword !== i)
      test.unshift(keyword)
      setStore('customerHistory', test, 'session')
      dispatch({ type: 'KEYWORD_ARR', keywordArr: test })
    },
    // 当点击搜索的时候应该关闭弹出窗口
    handleSearchOnclick: () => {
      // Popup.hide();
    },
    // 删除历史记录
    handleDeleteHistorry: () => {
      setStore('customerHistory', [], 'session')
      dispatch({ type: 'KEYWORD_ARR', keywordArr: [] })
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => { // alert('componentWillMount')
    if (getStore('customerLocation', 'session')) {
      const customerLocation = getStore('customerLocation', 'session')
      const latOrlng  = getStore('geopoint', 'session')
      dispatch({
        type:         'CHANGE_SELECTED_CITY',
        selectedCIty: customerLocation.localCity,
        prov:         customerLocation.province,
        lat:          latOrlng.latitude,
        lng:          latOrlng.longitude,
        city:         customerLocation.localCity,
      })
      setStore('mySelfpoint', latOrlng, 'session')
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
          setStore('mySelfpoint', { latitude: '31.2303700000', longitude: '121.4737000000' }, 'session')
          Mask.closeAll()
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
          setStore('mySelfpoint', { latitude: latOrlng.latitude, longitude: latOrlng.longitude }, 'session')
        }
        Mask.closeAll()
        handleClose()
      })
    }
    const customerHistory = getStore('customerHistory', 'session')
    dispatch({ type: 'KEYWORD_ARR', keywordArr: customerHistory })
    Mask.closeAll()
  },
  componentDidMount: () => {
    dispatch(CityData())
  },
  componentWillUnmount: () => {
    //  alert('componentWillUnmount');
  },
  componentWillReceiveProps: () => {
    // alert('componentWillReceiveProps')
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Searchcomponent)
)
