import { getStore, parseQuery, setStore } from '@boluome/common-lib'
import { get, send, afterOrdering } from 'business'

const search = location.search
const objurl = parseQuery(search)
const orderTimeUrl = `/jiadianweixiu/v1/category/${ objurl.categoryId }/service-time`
const orderUrl = '/jiadianweixiu/v1/order'
// 服务时间的请求
export const getOrderTime = (datastr, sum) => dispatch => {
  console.log('time')
  const datas = {
    channel:   'zmn',
    cityId:    datastr.cityId,
    count:     sum,
    longitude: datastr.longitude,
    latitude:  datastr.latitude,
    mapType:   'gaode',
  }
  send(orderTimeUrl, datas).then(reply => {
    const { code, data } = reply
    data.cityId = datas.cityId
    // console.log('tttt---', reply)
    if (code === 0) {
      dispatch({
        type:     'KJIN_ORDERTIME',
        timeData: data,
      })
      if (data.length === 0) {
        dispatch({ type: 'CHOOSE_SERVICETIME', serviceDate: undefined })
        dispatch({ type: 'MARK_ORDERBTN', disabled: false })
      } else {
        const times = [data[0].date, data[0].time[0]]
        dispatch({ type: 'CHOOSE_SERVICETIME', serviceDate: times })
      }
      // console.log('serviceDate--', times)
    } else {
      console.log('数据加载失败')
    }
  }).catch(err => console.log('message', err))
}
// 选择地址的时候
export const handleChangeContact = (contact, sum) => dispatch => {
  dispatch({ type: 'CHANGE_CONTACT', contact })
  // console.log('contact----', contact)
  const cityName = contact.city.replace(/[市省区]|特别行政区/g, '')
  const cityUrl = '/basis/v1/jiadianweixiu/zmn/cities'
  get(cityUrl, { channel: 'zmn' }).then(reply => {
    const { code, data } = reply
    if (code === 0) {
      const cityFilter = data.filter(item => {
        return item.name === cityName
      })
      // console.log('cityFilter-----', cityFilter[0])
      // console.log('contact--cityid', data)
      if (cityFilter[0]) { // 收货地址与服务商城市列表作对比
        const point = {
          latitude:  contact.latitude,
          longitude: contact.longitude,
          cityId:    cityFilter[0].channelCityId,
          city:      cityFilter[0].name,
          mapType:   'gaode',
        }
        console.log('yes')
        dispatch({ type: 'CHANGE_POINT', point })
        dispatch(getOrderTime(point, sum))
        dispatch({ type: 'MARK_ORDERBTN', disabled: true })
      } else { // 无该服务的城市不进行下单
        let ishas = '1'
        dispatch({ type: 'NOHAS_CITYNAME', ishas })
        setTimeout(() => {
          ishas = '0'
          dispatch({ type: 'NOHAS_CITYNAME', ishas })
        }, 1000)
        dispatch({ type: 'MARK_ORDERBTN', disabled: false })
        dispatch({ type: 'CHOOSE_SERVICETIME', serviceDate: undefined })
      }
    } else {
      console.log('数据加载失败')
    }
  }).catch(err => console.log('message', err))
}
// 默认地址的选择----
export const getAddrContact = () => dispatch => {
  const contactUrl = '/user/v1/contact'
  const sendData = {
    userId:    getStore('customerUserId', 'session'),
    contactId: '',
    longitude: 0,
    latitude:  0,
    mapType:   'gaode',
  }
  get(contactUrl, sendData).then(reply => {
    const { code, data } = reply
    if (code === 0) {
      console.log('getAddrContact---', data)
      setStore('Choosecontact', data, 'session')
      // dispatch({ type: 'CHANGE_CONTACT', contact : data});
      // const points = getStore('geopoint', 'session')
      // points.cityId = getStore('markId', 'session').cityId
      // dispatch(getOrderTime(points, 1))
      dispatch(handleChangeContact(data, 1))
      // handleChangeContact(data, '1')
    } else {
      console.log('数据加载失败')
    }
  }).catch(err => console.log('message', err))
}
// 用户下单
export const getOrder = (detailsData, sum, contact, time, curDiscountData, point) => {
  const customerUserId = getStore('customerUserId', 'session')
  const userPhone = getStore('userPhone', 'session')
  const { cityId } = point
  // console.log('下单了---', curDiscountData)
  const datas = {
    channel:     'zmn',
    customerUserId,
    userPhone,
    categoryId:  detailsData.categoryId,
    cityId,
    count:       sum,
    serviceTime: time.join(' '),
    contact,
    couponId:    curDiscountData.coupon ? curDiscountData.coupon.id : '',
    activityId:  curDiscountData.activities ? curDiscountData.activities.id : '',
  }
  send(orderUrl, datas).then(reply => {
    const { code, data } = reply
    if (code === 0) {
      // dispatch({
      //   type:      'KJIN_ORDERDETAILS',
      //   orderData: data,
      // })
      afterOrdering(data)
      // console.log(afterOrdering, data)
    } else {
      console.log('下单失败')
    }
  }).catch(err => console.log('message', err))
}
