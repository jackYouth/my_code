import { Toast } from 'antd-mobile'
import { getStore, setStore, removeStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { afterOrdering, get, send } from 'business'

// 配送费的请求
export const deliverFee = (serviceDate, contact) => dispatch => {
  const handleClose = Loading()
  const deliverFeeUrl = '/paotui/queryDeliverFee'
  const merchant = getStore('paotui_merchant', 'session')
  const time = serviceDate ? serviceDate.join(' ') : ''
  // console.log('deliverFee--serviceDate', time, merchant)
  let senderLatitude = ''
  let senderAddress = ''
  let senderLongitude = ''
  if (merchant) {
    senderAddress = merchant.address
    senderLatitude = merchant.lat
    senderLongitude = merchant.lng
  }
  let address = ''
  let latitude = ''
  let longitude  = ''
  if (contact && time) { //  && time ---->  预备修改处
    address = contact.address
    latitude = contact.latitude
    longitude = contact.longitude
    // 有收货地址才去请求
    const sendData = {
      type:              '3',
      coordtype:         '4',
      deliverTime:       time,
      receiverAddress:   address,
      receiverLatitude:  latitude,
      receiverLongitude: longitude,
      senderAddress,
      senderLatitude,
      senderLongitude,
      mapType:           'gaode',
    }
    send(deliverFeeUrl, sendData).then(reply => {
      const { code, data, message } = reply
      if (code === 0) {
        // console.log('deliverFees', data)
        dispatch({
          type:        'DELIVERFEE',
          deliverFees: data.deliverFee,
        })
        setStore('paotui_deliverFees', data.deliverFee, 'session')
      } else {
        console.log('数据请求失败', message)
        Toast.info(message, 2, null, false)
        dispatch({ type: 'DELIVERFEE', deliverFees: 0 })
        setStore('paotui_deliverFees', 0, 'session')
      }
      handleClose()
    })
  } else {
    console.log('请选择收货地址', contact, time, 'time')
    dispatch({ type: 'DELIVERFEE', deliverFees: 0 })
    setStore('paotui_deliverFees', '', 'session')
    handleClose()
  }
}

// 配送时间请求
export const orderDeliverTime = contact => dispatch => {
  const handleClose = Loading()
  const goodsListUrl = '/paotui/queryValidDeliverTime'
  const sendData = { type: 3 }
  get(goodsListUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      console.log('orderDeliverTime', data, contact)
      dispatch({
        type:          'KJIN_DELIVERTIME',
        orderTimeDate: data,
        serviceDate:   [data[0].deliverDate, data[0].deliverTime[0]],
      })
      setStore('paotui_serviceDate', [data[0].deliverDate, data[0].deliverTime[0]], 'session')
      // deliverFee(([data[0].deliverDate, data[0].deliverTime[0]]), contact)
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}

const changeContact = (contact, point, dispatch) => {
  const address = getStore('currentPosition', 'session').street + getStore('currentPosition', 'session').streetNumber
  console.log('changeContact--', address)
  const serviceDate = getStore('paotui_serviceDate', 'session')
  const dingPoint = {
    ...point,
    address,
  }
  dispatch({
    type: 'CONTACT',
    contact,
    // userPoint: point,
  })
  if (contact) {
    setStore('paotui_contact', contact, 'session')
    dispatch(deliverFee(serviceDate, contact))
  } else {
    setStore('paotui_contact', '', 'session')
    // deliverFee(serviceDate, dingPoint, dispatch)
    dispatch({ type: 'CONTACT', contact: '' })
    console.log('定位地址', dingPoint)
  }
}
// 获取根据当前定位在用户收货地址中选择最优的收货地址
export const getOptimalContact = point => dispatch => {
  const OptimalContactUrl = '/user/v1/contact'
  const { latitude, longitude } = point
  const userId = getStore('customerUserId', 'session')
  const sendData = {
    userId,
    longitude,
    latitude,
    mapType: 'gaode',
  }
  get(OptimalContactUrl, sendData).then(reply => {
    const { code, data } = reply
    if (code === 0) {
      // console.log('OptimalContactUrl---', data)
      if (data) { // 有最优地址的时候
        const choosePoint = { latitude: data.latitude, longitude: data.longitude }
        if (data.distance > 3) {
          changeContact('', point, dispatch)
        } else {
          dispatch(orderDeliverTime(data))
          changeContact(data, choosePoint, dispatch)
        }
      } else { // 没有返回地址的时候
        changeContact('', point, dispatch)
      }
    } else { // 当请求最优地址失败，进行自动定位
      changeContact('', point, dispatch)
    }
  })
}


// 正常下单
const orderFn = (orderUrl, sendData) => {
  const handleClose = Loading()
  send(orderUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      handleClose()
      // console.log(afterOrdering, data)
      afterOrdering(data)
      removeStore('paotui_textarea', 'session')
      removeStore('paotui_imgSrc', 'session')
      removeStore('paotui_merchant', 'session')
      removeStore('paotui_contact', 'session')
      removeStore('paotui_merchant_self', 'session')
    } else {
      Toast.info('下单失败 !', 2, null, false)
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}

// 创建订单
export const handleGoOrder = (tipsPrice, contact = {}, merchant, serviceDate, Promotion, deliverFees) => {
  // const handleClose = Loading()
  const orderUrl = '/paotui/order'
  const customerUserId = getStore('customerUserId', 'session')
  const { contactId, name, phone } = contact
  const userPhone = getStore('userPhone', 'session') ? getStore('userPhone', 'session') : phone
  const { coupon, activities } = Promotion
  const orderItem = []
  const time = serviceDate[1] === '尽快送' ? (serviceDate).join(' ') : (serviceDate).join(' ')
  // console.log('---time--test-', time)
  const textareaStr = getStore('paotui_textarea', 'session')
  const files = getStore('paotui_imgSrc', 'session')
  const sphotoUrl = getStore('paotui_photoUrl', 'session')
  let merchantSelf = getStore('paotui_merchant_self', 'session')
  let photoUrl = ''
  if (files && sphotoUrl) {
    photoUrl = files.length > 0 ? sphotoUrl : ''
  }
  const obj = {
    photoUrl,
    productName: textareaStr,
  }
  orderItem.push(obj)
  if (!merchantSelf) {
    merchantSelf = ''
  }
  const senderAddress = merchant ? `${ merchant.address + merchantSelf }` : ''
  const senderLatitude = merchant ? merchant.lat : ''
  const senderLongitude = merchant ? merchant.lng : ''
  const sendData = {
    customerUserId,
    userPhone,
    contactId,
    senderAddress,
    senderLatitude,
    senderLongitude,
    orderItem,
    receiverName:  name,
    receiverPhone: phone,
    type:          3,
    coordtype:     4,
    deliverFee:    deliverFees,
    deliverTime:   time,
    tipFee:        tipsPrice,
    couponId:      coupon ? coupon.id : '',
    activityId:    activities ? activities.id : '',
    mapType:       'gaode',
  }
  orderFn(orderUrl, sendData)
}
