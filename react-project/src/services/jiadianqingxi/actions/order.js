import { getStore, parseQuery, setStore } from '@boluome/common-lib'
import { afterOrdering, get, send } from 'business'

const search = location.search
const objurl = parseQuery(search)
const orderTimeUrl = `/jiadianqingxi/v1/category/${ objurl.categoryId }/service-time`
const orderUrl = '/jiadianqingxi/v1/order'
// 服务时间的请求
export const getOrderTime = (datastr, sum) => dispatch => {
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
    } else {
      console.log('数据加载失败')
    }
  }).catch(err => console.log('message', err))
}
// 选择地址的时候
export const handleChangeContact = (contact, sum) => dispatch => {
  dispatch({ type: 'CHANGE_CONTACT', contact })
  console.log('contact-handleChangeContact---', contact)
  if (contact.city) {
    const cityName = contact.city.replace(/[市省区]|特别行政区/g, '')
    const cityUrl = '/basis/v1/jiadianqingxi/zmn/cities'
    get(cityUrl, { channel: 'zmn' }).then(reply => {
      const { code, data } = reply
      if (code === 0) {
        const cityFilter = data.filter(item => {
          return item.name === cityName
        })
        // console.log('cityFilter-----', cityFilter[0])
        if (cityFilter[0]) { // 收货地址与服务商城市列表作对比
          const point = {
            latitude:  contact.latitude,
            longitude: contact.longitude,
            cityId:    cityFilter[0].channelCityId,
            city:      cityFilter[0].name,
          }
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
}
// 默认地址的选择----
export const getAddrContact = () => dispatch => {
  const choosecontact = getStore('Choosecontact', 'session')
  if (choosecontact) {
    dispatch(handleChangeContact(choosecontact, 1))
  } else {
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
        // dispatch({ type: 'CHANGE_CONTACT', contact : data});
        setStore('Choosecontact', data, 'session')
        // const points = getStore('geopoint', 'session')
        // points.cityId = getStore('markId', 'session').cityId
        // dispatch(getOrderTime(points, 1))
        dispatch(handleChangeContact(data, 1))
        // handleChangeContact(data, '1')
      } else {
        console.log('数据加载失败--getAddrContact---', code)
        dispatch({ type: 'CHANGE_CONTACT', contact: '' })
      }
    }).catch(err => console.log('message', err))
  }
}
// 用户下单
export const getOrder = (detailsData, sum, contact, time, curDiscountData, point) => dispatch => {
  const customerUserId = getStore('customerUserId', 'session')
  const userPhone = getStore('userPhone', 'session')
  console.log(time.join(' '))
  const { cityId } = point
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
    mapType:     'gaode',
  }
  send(orderUrl, datas).then(reply => {
    const { code, data } = reply
    if (code === 0) {
      dispatch({
        type:      'KJIN_ORDERDETAILS',
        orderData: data,
      })
      // window.location.href = `/cashier/${ data.id }`
      afterOrdering(data)
      // console.log(afterOrdering)
    } else {
      console.log('下单失败')
    }
  }).catch(err => console.log('message', err))
}
