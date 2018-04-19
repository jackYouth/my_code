import { getStore, setStore, moment, addInterval } from '@boluome/common-lib'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { afterOrdering, get, send } from 'business'
import { Toast } from 'antd-mobile'
import { merge } from 'ramda'
import getCart from '../components/getCart'

// const alert = Modal.alert

export const handleCreateCart = (props, datas = {}) => dispatch => {
  // console.log('proops', props)
  const handleClose = Loading()
  const { choosePoint, shoppingCarArray, restaurantId, chooseContact = {}, restaurantInfo = {} } = props
  // const customerUserId = getStore('customerUserId', 'session')
  const { latitude = getStore('geopoint', 'session') ? getStore('geopoint', 'session').latitude : getStore('choosepoint', 'session').latitude, longitude = getStore('geopoint', 'session') ? getStore('geopoint', 'session').longitude : getStore('choosepoint', 'session').longitude } = datas
  const addressT = datas
  const foodList = []
  let mapType = props.mapType
  // let restaurantCart = shoppingCarArray[customerUserId][restaurantId]
  let restaurantCart = shoppingCarArray[restaurantId]
  if (!restaurantCart) {
    restaurantCart = []
  }
  if (choosePoint && choosePoint.mapType) {
    // console.log('choosePoint')
    mapType = choosePoint.mapType
  }
  if (chooseContact && chooseContact.mapType) {
    // console.log('chooseContact')
    mapType = chooseContact.mapType
  }
  const shoppingCar = getCart(restaurantCart)
  shoppingCar.forEach(item => {
    // console.log('item', item)
    const newObj = {
      id:       item.foodId,
      quantity: item.quantity,
      newSpecs: item.foodsInfo.specs ? item.foodsInfo.specs : [],
      attrs:    item.foodsInfo.attrsArr ? item.foodsInfo.attrsArr : [],
      garnish:  [],
    }
    foodList.push(newObj)
  })
  // const postData = {
  //   channel:       'ele',
  //   latitude:      datas === 'notHere' ? choosePoint.latitude : latitude,
  //   longitude:     datas === 'notHere' ? choosePoint.longitude : longitude,
  //   userLongitude: getStore('geopoint', 'session').longitude,
  //   userLatitude:  getStore('geopoint', 'session').latitude,
  //   address:       addressT.city ? `${ addressT.province + addressT.city + addressT.county + addressT.address + addressT.detail }` : getStore('currentAddress', 'session'),
  //   phone:         datas.phone ? datas.phone : getStore('userPhone', 'session'),
  //   mapType,
  //   foodList,
  //   restaurantId,
  //   isOnlinePaid:  1,
  // }
  console.log('datas', props)
  const postData = {
    channel:       'ele',
    latitude:      chooseContact.location ? chooseContact.location.lat : datas === 'notHere' ? choosePoint.latitude : datas === 'out' ? restaurantInfo.point.lat : latitude,
    longitude:     chooseContact.location ? chooseContact.location.lng : datas === 'notHere' ? choosePoint.longitude : datas === 'out' ? restaurantInfo.point.lng : longitude,
    userLongitude: !getStore('geopoint', 'session') ? getStore('choosepoint', 'session').longitude : getStore('geopoint', 'session').longitude,
    userLatitude:  !getStore('geopoint', 'session') ? getStore('choosepoint', 'session').latitude : getStore('geopoint', 'session').latitude,
    address:       chooseContact.name ? chooseContact.name : addressT.city ? `${ addressT.province + addressT.city + addressT.county + addressT.address + addressT.detail }` : getStore('currentAddress', 'session'),
    phone:         datas.phone ? datas.phone : getStore('userPhone', 'session'),
    mapType,
    foodList,
    restaurantId,
    isOnlinePaid:  1,
  }
  // console.log('postData-==-=-=--==-=--=', postData)
  send('/waimai/v1/cart', postData)
  .then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({
        type:     'CART_DATA',
        cartData: data,
      })
    } else {
      Toast.info(message, 2)
      console.log(message)
      dispatch({
        type:     'CART_DATA',
        cartData: '',
      })
    }
    handleClose()
  }).catch(err => {
    Toast.info(err, 2)
    console.log(err)
  })
}

export const fetchBestContact = state => dispatch => {
  const userId = getStore('customerUserId', 'session')
  const geopoint = getStore('geopoint', 'session')
  // console.log('state-=-=-==-=--=>', state)
  const { restaurantInfo = {} } = state
  const { point = {} } = restaurantInfo
  let fetchPoint = {}
  if (point.lat && point.lng) {
    fetchPoint.latitude = point.lat
    fetchPoint.longitude = point.lng
  } else {
    fetchPoint = geopoint
  }
  // const fetchPoint = point.lat ? point : geopoint
  console.log('fetchPoint-=-=-==-=--=>', fetchPoint)
  const handleClose = Loading()
  get('/user/v1/contact', { userId, ...fetchPoint, mapType: 'gaode' }, {}, true)
  .then(({ code, data, message }) => {
    if (code === 0 && data.distance <= 3) {
      dispatch({
        type:        'BEST_CONTACT',
        bestContact: data,
        addressResult: data,
      })
      dispatch(handleCreateCart(state, data))
    } else {
      // 用户没有可用地址返回code === 1001，不太科学
      console.log('fetch best contact code !== 0', message)
      dispatch({
        type:        'BEST_CONTACT',
        choosePoint: getStore('geopoint', 'session'),
      })
      dispatch(handleCreateCart(merge(state, data), 'out'))
    }
    handleClose()
  }).catch(err => {
    console.log(err)
  })
}

export const handleChooseContact = chooseContact => {
  // console.log('in handleChooseContact function', chooseContact)
  if (!chooseContact) {
    return {
      type:          'CHOOSE_CONTACT',
      chooseContact: '',
      bestContact:   '',
      addressResult: '',
    }
  }
  return {
    type:       'CHOOSE_CONTACT',
    chooseContact,
    beLocation: false,
  }
}

export const handleArriveTime = chooseTime => {
  let realchooseTime
  if (chooseTime[0].split(' ').length > 1) {
    realchooseTime = ''
  } else {
    realchooseTime = chooseTime
  }
  // console.log('real_chooseTime-=-=-=-=-=-=-=-', realchooseTime)
  return {
    type:       'ARRIVE_TIME',
    chooseTime: realchooseTime,
  }
}

export const handleUserTips = userTips => {
  // console.log('chooseTime-=-=-=-=-=-=-=-', chooseTime)
  return {
    type: 'USER_TIPS',
    userTips,
  }
}

export const handleCoupon = orderDiscount => {
  // console.log('orderDiscount', orderDiscount)
  const { discount } = orderDiscount
  return {
    type:          'HANDLE_COUPON',
    orderDiscount,
    discountPrice: discount,
  }
}

export const saveOrder = props => {
  // console.log('props', props)
  const { channel, cartData, restaurantInfo, userTips = [], chooseTime = [], addressResult, chooseContact, orderDiscount } = props
  const { cartId, price, predictDeliverTime = 45 } = cartData
  const { pic, isVipDelivery, restaurantName, phoneList = [] } = restaurantInfo
  const { coupon = {}, activities = {} } = orderDiscount
  const customerUserId = getStore('customerUserId', 'session')
  const sessionUserPhone = getStore('userPhone', 'session')
  const contactId = chooseContact && chooseContact.contactId ? chooseContact.contactId : addressResult.contactId
  // const description = userTips.reduce(((s, i) => { return s += i }), 0)
  const description = userTips.join()
  // console.log('chooseTime', chooseTime)
  const postDatas = {
    channel,
    cartId,
    price,
    restaurantName,
    customerUserId,
    contactId,
    description,
    isVipDelivery,
    pic,
    restaurantPhone:  phoneList[0],
    couponId:         coupon.id ? coupon.id : '',
    activityId:       activities.id ? activities.id : '',
    // deliveryTime:  Array.isArray(chooseTime) && chooseTime[0] !== '尽快送达' ? chooseTime[0] : '',
    deliveryTimeShow: chooseTime.length !== 0 ? chooseTime[0] : moment('HH:mm')(addInterval(predictDeliverTime, 'm')(moment('x')(new Date()))),
    deliveryTime:     chooseTime.length !== 0 ? chooseTime[0] : '',
    userLongitude: !getStore('geopoint', 'session') ? getStore('choosepoint', 'session').longitude : getStore('geopoint', 'session').longitude,
    userLatitude:  !getStore('geopoint', 'session') ? getStore('choosepoint', 'session').latitude : getStore('geopoint', 'session').latitude,
    isOnlinePaid:     1,
    userPhone:        !sessionUserPhone ? chooseContact && chooseContact.phone ? chooseContact.phone : addressResult.phone : sessionUserPhone,
  }
  // console.log('postDatas', postDatas)
  const handleClose = Loading()
  send('/waimai/v1/order', postDatas)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      setStore('shoppingCarArray', {})
      console.log(data)
      afterOrdering(data)
    } else {
      Toast.info(message, 2)
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    console.log('saveOrder err', err)
  })
}
