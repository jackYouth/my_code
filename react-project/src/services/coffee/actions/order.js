import { Toast } from 'antd-mobile'
import { getStore, setStore, removeStore } from '@boluome/common-lib' // get, , send
import { Loading } from '@boluome/oto_saas_web_app_component'
import { afterOrdering, send, get } from 'business'

// 配送费的请求
export const deliverFee = (serviceDate, contact) => dispatch => {
  const handleClose = Loading()
  const deliverFeeUrl = '/coffee/v1/deliverFee'
  const merchant = getStore('coffee_merchant', 'session')
  // console.log('deliverFee--serviceDate', contact, serviceDate)
  const { id, lat, lng } = merchant
  const { address, latitude, longitude } = contact
  const sendData = {
    coordtype: '4',
    time:      serviceDate,
    merchId:   id,
    merchAddr: merchant.address,
    merchLat:  lat,
    merchLng:  lng,
    rcvrAddr:  address,
    rcvrLat:   latitude,
    rcvrLng:   longitude,
    mapType:   'gaode',
  }
  get(deliverFeeUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      // console.log('deliverFees', data)
      dispatch({
        type:        'DELIVERFEE',
        deliverFees: data.deliverFee,
      })
    } else {
      console.log('数据请求失败', message)
      Toast.info(message, 2, null, false)
      dispatch({
        type:        'DELIVERFEE',
        deliverFees: 0,
      })
    }
    handleClose()
  })
}

// 通过经纬度定位商家，在展示一系列数据请求
export const orderDeliverTime = contact => dispatch => {
  const handleClose = Loading()
  const goodsListUrl = '/coffee/v1/validDeliverTime'
  get(goodsListUrl).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      // console.log('orderDeliverTime', data)
      dispatch({
        type:          'KJIN_DELIVERTIME',
        orderTimeDate: data,
        serviceDate:   [data[0].deliverDate, data[0].deliverTime[0]],
      })
      console.log('test----', [data[0].deliverDate, data[0].deliverTime[0]])
      setStore('coffee_serviceDate', [data[0].deliverDate, data[0].deliverTime[0]], 'session')
      dispatch(deliverFee((`${ data[0].deliverDate } ${ data[0].deliverTime[0] }`), contact))
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}

// 创建订单
export const handleGoOrder = (tipsPrice, contact = {}, merchant, serviceDate, goodsCartarr, Promotion, deliverFees, noteText) => {
  const handleClose = Loading()
  const orderUrl = '/coffee/v1/order'
  const customerUserId = getStore('customerUserId', 'session')
  const { contactId, phone } = contact
  const { coupon, activities } = Promotion
  const orderItem = []
  const userPhone = getStore('userPhone', 'session') ? getStore('userPhone', 'session') : phone
  const time = serviceDate[1] === '尽快送' ? (serviceDate).join(' ') : (serviceDate).join(' ')
  console.log('下单时----', Promotion, serviceDate.join(''))
  for (let k = 0; k < goodsCartarr.length; k++) {
    const { productId, productName, price, unit } = goodsCartarr[k].data
    const selectedAttr = goodsCartarr[k].standard
    const count = goodsCartarr[k].quantity
    const obj = {
      productId,
      productName,
      price,
      unit,
      count,
      selectedAttr,
    }
    orderItem.push(obj)
  }
  const sendData = {
    customerUserId,
    userPhone,
    type:       3,
    coordtype:  4,
    deliverFee: deliverFees,
    contactId,
    merchant:   {
      ...merchant,
    },
    deliverTime: time,
    comment:     noteText,
    tipFee:      tipsPrice,
    couponId:    coupon ? coupon.id : '',
    activityId:  activities ? activities.id : '',
    orderItem,
  }
  send(orderUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      handleClose()
      // console.log(data, afterOrdering)
      afterOrdering(data)
      setStore('goodsCartarr', [], 'session')
      removeStore('tagsmark', 'session')
    } else {
      // Toast.info('下单失败 !', 2, null, false)
      Toast.info(message, 2, null, false)
      // console.log('数据请求失败', message)
    }
    handleClose()
  })
}
