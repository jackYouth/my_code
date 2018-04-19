import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { get, send, getStore, setStore } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { detReset } from '../actions/detail.js'
import Detail from '../components/detail'

const mapStateToProps = state => {
  const { detail } = state
  return {
    ...detail,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
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
              detReset({
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
        detReset({
          detMask: !detMask,
        })
      )
    },
    handleSelectspec: specData => {
      dispatch(
        detReset({
          specData,
        })
      )
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
        detReset({
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
        detReset({
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
        detReset({
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
        detReset({
          cartdata,
        })
      )
    },
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {
    componentWillMount: () => {
      const { routeParams } = state
      const { channel, areaId, commodityCode } = routeParams
      // 商品详情
      get('/shengxian/v2/commodity', { channel, areaId, commodityCode }).then(({ code, data, message }) => {
        if (code === 0) {
          dispatch(
           detReset({
             detailData: data,
             specData:   data.specifications[0],
             areaId,
           })
          )
        } else {
          console.log(message)
        }
      })
      // 图文详情
      get('/shengxian/v1/commodity/details', { channel, areaId, commodityCode }).then(({ code, data, message }) => {
        if (code === 0) {
          dispatch(
           detReset({
             picDatiles: data.details || false,
           })
         )
        } else {
          console.log(message)
        }
      })
      // 购物车数据
      const cartdata = getStore('cartdata') || []
      dispatch(
        detReset({
          cartdata,
        })
      )
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Detail)
  )
