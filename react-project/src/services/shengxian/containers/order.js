import { connect } from 'react-redux'
import { Toast } from 'antd-mobile'
import { browserHistory } from 'react-router'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { get, send, getStore, removeStore } from '@boluome/common-lib'
import { afterOrdering } from 'business'
import Order from '../components/order'
import { derReset, getFreight, getDate } from '../actions/order.js'

const mapStateToProps = state => {
  const { order } = state
  return {
    ...order,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    handleSuccess: () => {
      const { routeParams } = props
      const { contactId } = routeParams
      dispatch({ type: 'ADDR_INIT' })
      browserHistory.push(`/shengxian/${ getStore('channel', 'session') }/addr/${ contactId }`)
    },

    handleOther: other => {
      dispatch(
        derReset({
          other: !other,
        })
      )
    },

    handleInvoiceName: invoiceName => {
      dispatch(
        derReset({
          invoiceName,
        })
      )
    },

    handleDeliveryDate: deliveryDate => {
      dispatch(
        derReset({
          deliveryDate,
        })
      )
    },

    handleCur: curDiscountObj => {
      dispatch(
        derReset({
          curDiscountData: curDiscountObj,
        })
      )
    },

    handleOrder: order => {
      const {
              contact,
              deliveryDate,
              invoiceName,
              commodityList,
              commodityAmountpri,
              curDiscountData,
              freight,
            } = order
      if (!contact) {
        Toast.info('请添加收货地址')
      } else if (!freight) {
        Toast.info('配送费计算中0.0')
      } else {
        const handleClose = Loading()
        const activityId = curDiscountData.activities ? curDiscountData.activities.id : ''
        const couponId =  curDiscountData.coupon ? curDiscountData.coupon.id : ''
        send('/shengxian/v1/order', {
          channel:         getStore('channel', 'session'),
          customerUserId:  getStore('customerUserId', 'session'),
          userPhone:       getStore('userPhone', 'session') || contact.phone,
          price:           freight.postFee + commodityAmountpri, // 商品总金额+运费
          commodityAmount: commodityAmountpri, // 商品总金额
          postFee:         freight.postFee, // 运费
          deliveryDate:    deliveryDate[0].replace(/\//g, '-'),
          contact, // 收货人地址信息
          commodityList, // 商品列表
          invoiceName, // 发票抬头
          invoiceContent:  '', // 发票内容
          couponId, // 优惠券ID
          activityId,
        }).then(({ code, data, message }) => {
          handleClose()
          if (code === 0) {
            removeStore('cartdata')
            afterOrdering(data)
          } else {
            Toast.info(message, 3)
            console.log(message)
          }
        })
      }
    },
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {
    componentWillMount: () => {
      // 购物车数据
      const cartdata = getStore('cartdata') || []
      if (!cartdata.length) {
        browserHistory.replace('/shengxian')
        return false
      }
      let commodityAmountpri = 0
      let commodityAmountnum = 0
      const commodityList = cartdata.reduce((arr, { commodityName, commodityId, commodityCode, commodityPicList, buyQuantity, price }) => {
        arr.push({
          commodityId,
          commodityCode: commodityCode.split(',')[0],
          commodityName,
          price,
          num:           buyQuantity,
          totalFee:      price * parseInt(buyQuantity, 10),
          picUrl:        commodityPicList[0].picUrl,
        })
        commodityAmountpri += (price * parseInt(buyQuantity, 10))
        commodityAmountnum += buyQuantity
        return arr
      }, [])
      dispatch(
        derReset({
          commodityList,
          commodityAmountpri,
          commodityAmountnum,
        })
      )

      const { routeParams } = state
      const { contactId } = routeParams
      // if (contactId && contactId !== 'defined') {
        // 获取用户地址
      get('/user/v1/contact', {
        userId:    getStore('customerUserId', 'session'),
        longitude: getStore('geopoint', 'session') ? getStore('geopoint', 'session').longitude : 0,
        latitude:  getStore('geopoint', 'session') ? getStore('geopoint', 'session').latitude : 0,
        contactId: contactId === 'defined' ? '' : contactId,
      }).then(({ code, data, message }) => {
        if (code === 0) {
          dispatch(
            derReset({
              submit:  true,
              contact: data,
            })
          )
          dispatch(getFreight(data.contactId, commodityList))
        } else {
          const dateA = getDate()
          dispatch(
            derReset({
              submit:       false,
              dateArr:      dateA,
              deliveryDate: [dateA[0].value],
            })
          )
          console.log(message)
        }
      })
      // } else {
      //   const dateA = getDate()
      //   dispatch(
      //     derReset({
      //       submit:       false,
      //       dateArr:      dateA,
      //       deliveryDate: [dateA[0].value],
      //     })
      //   )
      // }
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Order)
  )
