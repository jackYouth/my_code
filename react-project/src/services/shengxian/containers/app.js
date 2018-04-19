import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap, Loading }    from '@boluome/oto_saas_web_app_component'
import { get, send, parseLocName, setStore, getStore } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { getLocationGaode, login } from 'business'
import { appReset, getCategorie, getCategorieAfter } from '../actions/app.js'
import App from '../components/app'

const mapStateToProps = state => {
  const { app } = state
  return {
    ...app,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    handleTip: () => {
      dispatch(appReset({
        tip: false,
      }))
    },

    handleCity: loc => {
      setStore('cityName', loc.name, 'session')
      dispatch(appReset({
        cityName: loc.name,
      }))
      dispatch(getCategorieAfter(getStore('channel', 'session'), loc.channelCityId))
    },

    goSear: () => {
      browserHistory.push(`/shengxian/${ getStore('channel', 'session') }/sear`)
    },
    goOrder: () => {
      const handleClose = Loading()
      const cartdata = getStore('cartdata') || []
      const commodityList = cartdata.reduce((arr, item) => {
        arr.push({
          areaId:        item.cityId,
          commodityId:   item.commodityId,
          commodityCode: item.commodityCode.split(',')[0],
          number:        item.buyQuantity,
        })
        return arr
      }, [])
      send('/shengxian/v2/commodity/status', { channel: getStore('channel', 'session'), commodityList }).then(({ code, data, message }) => {
        handleClose()
        if (code === 0) {
          const noBuy = data.filter(e => {
            if (e.isBuy) {
              return true
            }
            return false
          })
          if (getStore('customerUserId', 'session') && !noBuy.length) {
            browserHistory.push(`/shengxian/${ getStore('channel', 'session') }/order/defined`)
          } else if (!noBuy.length) {
            Toast.info('未登录', 1)
          } else {
            for (let i = 0; i < noBuy.length; i++) {
              for (let j = 0; j < cartdata.length; j++) {
                if ((cartdata[j].commodityCode).split(',')[0] === (noBuy[i].commodityCode).split(',')[0]) {
                  cartdata[j].isBuy = false
                  break
                }
              }
            }
            setStore('cartdata', cartdata)
            dispatch(
              appReset({
                cartdata,
              })
            )
            Toast.info('购物车中有无效商品', 1)
          }
        } else {
          console.log(message)
        }
      })
    },

    setBuycart: (e, infoData, way) => {
      e.stopPropagation()
      const cartdata = getStore('cartdata') || []
      let index = 'string'
      for (let i = 0; i < cartdata.length; i++) {
        if ((cartdata[i].commodityCode).split(',')[0] === (infoData.commodityCode).split(',')[0]) {
          index = i
          break
        }
      }
      if (typeof index === 'number') {
        const numb = cartdata[index].buyQuantity
        switch (way) {
          case 'add':
            if (numb === 20) {
              Toast.info('最多购买20件', 1)
            } else {
              cartdata[index].buyQuantity = numb + 1
            }
            break
          case 'sub':
            if (numb === 1) {
              cartdata.splice(index, 1)
            } else {
              cartdata[index].buyQuantity = numb - 1
            }
            break
          default:
            console.log('参数错误')
        }
      } else if (way === 'add') {
        infoData.buyQuantity = 1
        infoData.isBuy = true
        cartdata.push(infoData)
      }
      setStore('cartdata', cartdata)
      dispatch(
        appReset({
          cartdata,
        })
      )
    },

    delBuycart: way => {
      const cartdata = getStore('cartdata') || []
      let newCartdata = []
      if (way === 'clear') {
        newCartdata = cartdata.filter(el => {
          if (el.isBuy) {
            return true
          }
          return false
        })
      }
      setStore('cartdata', newCartdata)
      dispatch(
        appReset({
          cartdata: newCartdata,
        })
      )
    },

    goDetail: (areaId, detail) => {
      dispatch({ type: 'DET_INIT' })
      browserHistory.push(`/shengxian/${ getStore('channel', 'session') }/detail/${ areaId }/${ detail.commodityCode }/`)
    },

    callback: (key, categoriesData) => {
      let subcategoriesData = []
      for (let i = 0; i < categoriesData.length; i++) {
        if (categoriesData[i].areaId === key) {
          subcategoriesData = categoriesData[i].subcategoryList
          break
        }
      }
      dispatch(
        appReset({
          subcategoriesData,
          keys: key,
        })
      )
    },

    handleSelectsub: data => {
      dispatch(
        appReset({
          categoryIdList: data.idList,
          offset:         0,
        })
      )
    },

    // 查询商品
    getCommodities: (limit, offset, fetchData, onSuccess) => {
      const { channel, areaId, categoryIdList } = fetchData
      send('/shengxian/v2/commodities',
        { channel, areaId, categoryIdList, limit, offset },
        { 'Content-Type': 'application/json' }
      ).then(({ code, data, message }) => {
        if (code === 0) {
          onSuccess(data)
          if (data.length > 0) {
            dispatch(
              appReset({
                offset: offset + data.length,
              })
            )
          }
        } else {
          console.log(message)
        }
      })
    },
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {

    componentWillMount: () => {
      // 登录
      login(err => {
        if (err) {
          Toast.info('未登录', 1)
        }
      })
      // 购物车数据
      const cartdata = getStore('cartdata') || []
      dispatch(
        appReset({
          cartdata,
        })
      )

      const afterGetlocation = () => {
        // 获取区域
        get(`/basis/v1/shengxian/${ getStore('channel', 'session') }/cities`).then(({ code, data, message }) => {
          if (code === 0) {
            const cityArr = data
            dispatch(
              appReset({
                cityArr,
              })
            )
            dispatch(getCategorie(getStore('channel', 'session'), getStore('cityName', 'session'), cityArr))
          } else {
            console.log(message)
          }
        })
      }
      // 定位
      setStore('channel', 'yiguo', 'session')
      if (getStore('cityName', 'session')) {
        dispatch(appReset({
          cityName: getStore('cityName', 'session'),
        }))
        if (!state.categoryId) {
          afterGetlocation()
        }
      } else {
        getLocationGaode(err => {
          let cityName
          if (err) {
            cityName = state.cityName
          } else {
            cityName = parseLocName(getStore('currentPosition', 'session').city)
          }
          dispatch(appReset({
            cityName,
          }))
          setStore('cityName', cityName, 'session')
          afterGetlocation()
        })
      }
    },
  }
}

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
