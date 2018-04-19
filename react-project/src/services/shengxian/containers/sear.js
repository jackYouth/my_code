import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { get, send, getStore, setStore } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { seaReset } from '../actions/sear.js'
import Sear from '../components/sear'

const mapStateToProps = state => {
  const { sear } = state
  return {
    ...sear,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    goBack: () => {
      browserHistory.go(-1)
    },
    goDetail: (areaId, detail) => {
      dispatch({ type: 'DET_INIT' })
      browserHistory.push(`/shengxian/${ getStore('channel', 'session') }/detail/${ areaId }/${ detail.commodityCode }/`)
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
          console.log(data)
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
              seaReset({
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
    handleSwitchmask: detMask => {
      dispatch(
        seaReset({
          detMask: !detMask,
        })
      )
    },
    handleSelectspec: specData => {
      dispatch(
        seaReset({
          specData,
        })
      )
    },
    search: (searchKey, cb) => {
      if (searchKey) {
        const handleClose = Loading()
        get('/shengxian/v2/search', { channel: getStore('channel', 'session'), areaId: getStore('areaId', 'session'), keyword: searchKey }).then(({ code, data, message }) => {
          handleClose()
          if (code === 0) {
            const cinema2 = data.filter(item => {
              return (item.commodityName.indexOf(searchKey) >= 0)
            })
            cb(null, cinema2)
          } else {
            // cb(message)
            console.log(message)
          }
        })
        .catch(err => {
          // cb(err)
          console.log(err)
          handleClose()
        })
      } else {
        cb('searchKey is undefined')
      }
    },
    setpreBuy: (e, num, bool) => {
      e.stopPropagation()
      if (bool && (num < 20)) {
        num++
      } else if (bool && (num === 20)) {
        Toast.info('最多购买20件', 1)
      } else if (num > 1) {
        num--
      }
      dispatch(
        seaReset({
          num,
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
        seaReset({
          cartdata: newCartdata,
        })
      )
    },
    setpreCart: (infoData, num) => {
      const cartdata = getStore('cartdata') || []
      let index = 'string'
      for (let i = 0; i < cartdata.length; i++) {
        if ((cartdata[i].commodityCode).split(',')[0] === (infoData.commodityCode).split(',')[0]) {
          index = i
          break
        }
      }
      if (typeof index === 'number') {
        const numb = cartdata[index].buyQuantity + num
        if (numb > 20) {
          Toast.info('最多购买20件', 1)
          cartdata[index].buyQuantity = 20
        } else {
          cartdata[index].buyQuantity = numb
        }
      } else {
        infoData.buyQuantity = num
        infoData.isBuy = true
        cartdata.push(infoData)
      }
      setStore('cartdata', cartdata)
      dispatch(
        seaReset({
          num:     1,
          detMask: false,
          cartdata,
        })
      )
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
        seaReset({
          cartdata,
        })
      )
    },
  }
}

const mapFunToComponent  = dispatch => {
  return {
    componentWillMount: () => {
      // const { routeParams } = state
      // const { channel, areaId, commodityCode } = routeParams
      // 购物车数据
      const cartdata = getStore('cartdata') || []
      console.log(cartdata)
      dispatch(
        seaReset({
          cartdata,
          areaId: getStore('areaId', 'session'),
        })
      )
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Sear)
  )
