import { getStore, setStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

// 通过经纬度定位商家，在展示一系列数据请求
export const indexDatalist = point => dispatch => {
  const handleClose = Loading()
  const goodsListUrl = '/coffee/v2/nearByMerchantAndGoods'
  const { latitude, longitude } = point
  const sendData = {
    coordtype: '4',
    lat:       latitude,
    lng:       longitude,
    mapType:   'gaode',
  }
  get(goodsListUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      console.log('coffee---data', data)
      let mark = getStore('tagsmark', 'session')
      if (mark) {
        console.log(mark)
      } else {
        mark = data.tags[0]
      }
      dispatch({
        type:      'KJIN_GOODSLIST',
        goodslist: data,
        tagsmark:  mark,
      })
      setStore('coffee_availableTime', data.availableTime, 'session')
      setStore('coffee_merchant', data.merchant, 'session')
      // handleClose()
    } else {
      console.log('数据请求失败', message)
      dispatch({
        type:      'KJIN_GOODSLIST',
        goodslist: '',
      })
      dispatch({ type: 'KJIN_OUTRANGE', outRange: true })
    }
    handleClose()
  })
}

// 获取改用户的所有收货地址列表
export const getContactList = () => dispatch => {
  const contactListUrl = '/user/v1/contacts'
  const sendData = {
    userId: getStore('customerUserId', 'session'),
  }
  get(contactListUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      // console.log('getContactList-----', data)
      dispatch({
        type:        'KJIN_CONTACTLIST',
        contactData: data,
      })
    } else {
      console.log('数据请求失败', message)
    }
  })
}
const changeContact = (contact, point, title, dispatch) => {
  dispatch({
    type:           'KJIN_OPTIMALCONTACT',
    OptimalContact: contact,
    userPoint:      point,
  })
  setStore('coffee_contact', contact, 'session')
  dispatch(indexDatalist(point))
  dispatch({ type: 'TITLE_ADDRESS', titleAddress: title })
}
// 获取根据当前定位在用户收货地址中选择最优的收货地址
export const getOptimalContact = point => dispatch => {
  const OptimalContactUrl = '/user/v1/contact'
  const currentPosition = getStore('currentPosition', 'session').street + getStore('currentPosition', 'session').streetNumber
  const { latitude, longitude } = point
  const userId = getStore('customerUserId', 'session')
  const sendData = {
    userId,
    longitude,
    latitude,
    mapType: 'gaode',
  }
  get(OptimalContactUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      console.log('getOptimalContact----', data)
      if (data) { // 有最优地址的时候
        const choosePoint = { latitude: data.latitude, longitude: data.longitude }
        const title = data.detail
        if (data.distance > 3) { // 判断范围
          changeContact('', point, currentPosition, dispatch)
        } else {
          changeContact(data, choosePoint, title, dispatch)
        }
      } else { // 没有返回地址的时候
        changeContact('', point, currentPosition, dispatch)
      }
    } else { // 当请求最优地址失败，进行自动定位
      console.log('数据请求失败', message)
      console.log('currentPosition----', currentPosition)
      changeContact('', point, currentPosition, dispatch)
    }
  })
}
