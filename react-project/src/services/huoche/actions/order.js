import { Toast } from 'antd-mobile'
import { get, send, afterOrdering } from 'business'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { getStore, removeStore, setStore } from '@boluome/common-lib'  // , removeStore

// 火车意外险须知请求
export const AccidentFn = () => dispatch => {
  const handleClose = Loading()
  const accidentUrl = '/baoxian/v1/insurance/query'
  const sendData = {
    channel:  'dashubao',
    category: 'huoche',
  }
  get(accidentUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      // console.log('huoche----', data[0])
      dispatch({
        type:         'KJIN_ACCIDENT',
        accidentData: data[0],
      })
      dispatch({ type: 'ORDER_CHECKED', checkAccient: data[0] })
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}

// 清楚缓存的数据 removeStore('huoche_', 'session')
export const removeStoreFn = () => {
  setStore('huoche_alterTime', [], 'session')
  setStore('huoche_chooseTrain', [], 'session')
  setStore('huoche_chooseZuowei', [], 'session')
  // removeStore('huoche_details', 'session')
  setStore('huoche_haveChooseZuo', [], 'session')
  setStore('huoche_chooseSeat', [], 'session')
  setStore('huoche_seatsData', [], 'session')
  setStore('huoche_maxprice', 0, 'session')
  setStore('huoche_chooseArrtime', [], 'session')
  setStore('huoche_haschecked', true, 'session')
  removeStore('huoche_packagePrice', 'session')
  removeStore('huoche_chooseSpeedname', 'session')
  removeStore('huoche_maxpriceObj', 'session')
}
// 首页和列表页面进入抢票，需要归零的数据
export const removeStoreAppMore = () => {
  removeStore('huoche_details', 'session')
  removeStore('huoche_seats', 'session')
  removeStore('huoche_maxpriceObj', 'session')
  removeStore('huoche_maxprice', 'session')
  removeStore('huoche_seatsData_grab', 'session')
}
// 提交订单后数据清除
const ClearData = () => {
  // removeStore('huoche_details', 'session')
  removeStore('TOURISTNUMBER', 'session')
  removeStore('huoche_ChangeSign_partnerId', 'session')
  removeStoreFn()
  setStore('huoche_passengersChoose', '', 'session')
  setStore('huoche_ChooseCredentialarr', '', 'session')
  // removeStore('huoche_channel', 'session')
}
// 提交订单，进行下单
export const OrderSave = (promotion, touristNumer, seatsChoose, ticketDetails, phone, chooseTime, contactName, checkAccient, ChangeSign, haschecked) => {
  const handleClose = Loading()
  let orderUrl = '/huoche/v1/order'
  let type = 'NORMAL'
  let parentId = ''
  const { name } = seatsChoose
  const channel = getStore('huoche_channel', 'session')
  const ChangeData = getStore('huoche_Change_data', 'session')
  if (ChangeSign && ChangeSign.indexOf('ChangeSign') > 0) {
    orderUrl = '/huoche/v1/change/apply'
    type = 'CHANGE'
    parentId = ChangeData.orderId
    // seatsChoose.parentId
  }
  const customerUserId = getStore('customerUserId', 'session')
  let userPhone = getStore('userPhone', 'session')
  if (!userPhone) {
    userPhone = phone
  }
  const appCode = getStore('customerCode', 'session')
  const { from, to, startTime, endTime, duration, number } = ticketDetails

  const passenger = []
  const { activities = {}, coupon = {} } = promotion
  const couponId = coupon && coupon.id ? coupon.id : ''
  const activityId = activities && activities.id ? activities.id : ''
  const { date } = chooseTime
  for (let i = 0; i < touristNumer.length; i++) {
    passenger.push(touristNumer[i].id)
  }
  const insuranceList = []
  if (checkAccient && haschecked) {
    const { code } = checkAccient
    const obj = {
      credentialCodes: passenger,
      code,
    }
    insuranceList.push(obj)
  }
  const useTime = duration
  const sendData = {
    channel,
    customerUserId,
    userPhone,
    couponId,
    activityId,
    from,
    to,
    date,
    startTime,
    endTime,
    useTime,
    trainNumber:  number,
    seatName:     name,
    passenger,
    contactPhone: phone,
    contactName,
    count:        touristNumer.length,
    insuranceList,
    type,
    parentId,
    appCode,
  }
  console.log('test--obj-', sendData, ChangeSign)
  send(orderUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      // console.log('huoche----', data, afterOrdering)
      const { isNeedPay, id } = data
      if (isNeedPay) {
        afterOrdering(data)
      } else {
        window.location.href = `${ location.protocol }//${ location.host }/huoche/orderDetails/${ id }`
      }
      ClearData()
    } else {
      console.log('数据请求失败', message)
      Toast.info(message, 3)
    }
    handleClose()
  })
}
// 计算如果是凌晨，截止时间是前一天
const handleMorning = date => {
  const datesplit = date.split('-')
  const nextdate = new Date()
  nextdate.setFullYear(datesplit[0], (datesplit[1] * 1) - 1, (datesplit[2] * 1) - 1)
  // const dateObj = nextdate.toLocaleDateString()
  const dateObj = `${ nextdate.getFullYear() }/${ nextdate.getMonth() + 1 }/${ nextdate.getDate() }`
  const m = `${ dateObj.split('/')[1] > 9 ? dateObj.split('/')[1] : `0${ dateObj.split('/')[1] }` }`
  const d = dateObj.split('/')[2] > 9 ? dateObj.split('/')[2] : `0${ dateObj.split('/')[2] }`
  const t = `${ dateObj.split('/')[0] }-${ m }-${ d }`
  console.log('morning--tttt-', t)
  return t
}
// 计算备用时间的最后一天
const handleLastTime = (chooseArrtime, time) => {
  // console.log('test--chooseArrtime-', chooseArrtime, time)
  const s = time.startTime.split(':')
  const ss = s[0] * 1
  const f = s[1] * 1
  let hours = (-1) + ss
  if (ss === 0) {
    hours = 23 + ss
  }
  // console.log('---test--time-ss', ss, '--hours-', hours)
  let last = chooseArrtime.reduce((pre, cur) => {
    if (pre.datestr < cur.datestr) {
      return cur
    }
    return pre
  }, chooseArrtime[0])
  if (chooseArrtime.length === 0) {
    last = getStore('huoche_ChooseTime', 'session')
  }
  const { date } = last
  let lastPost = ''
  if (ss === 0) {
    const hDate = handleMorning(date)
    lastPost = `${ hDate } ${ hours < 9 ? `0${ hours }` : `${ hours }` }:${ f }:59`
  } else {
    lastPost = `${ date } ${ hours < 9 ? `0${ hours }` : `${ hours }` }:${ f }:59`
  }
  // console.log('ggg---', hours, last, lastPost)
  return lastPost
}
// 抢票提交订单
export const OrderSaveGrab = (promotion, touristNumer, phone, chooseTime, contactName, chooseCity, checkAccient, timearr, chooseSeat, chooseArrtime, haveChooseZuo, startTime, haschecked) => {
  const handleClose = Loading()
  const orderUrl = '/huoche/v1/rob/tickets/order'
  const customerUserId = getStore('customerUserId', 'session')
  let userPhone = getStore('userPhone', 'session')
  if (!userPhone) {
    userPhone = phone
  }
  const details = getStore('huoche_details', 'session')
  const appCode = getStore('customerCode', 'session')
  let grabSeat = getStore('huoche_seatsData_grab', 'session') ? getStore('huoche_seatsData_grab', 'session') : '' // 这里有待确认
  const packagePrice = getStore('huoche_packagePrice', 'session')
  const schedules = getStore('huoche_chooseTrain', 'session') ? getStore('huoche_chooseTrain', 'session') : []
  const channel = getStore('huoche_channel', 'session')
  // const { from, to } = chooseCity
  const passenger = []
  const { activities = {}, coupon = {} } = promotion
  const couponId = coupon && coupon.id ? coupon.id : ''
  const activityId = activities && activities.id ? activities.id : ''
  const { date } = chooseTime
  for (let i = 0; i < touristNumer.length; i++) {
    passenger.push(touristNumer[i].id)
  }
  const insuranceList = []
  if (checkAccient && haschecked) {
    const { code } = checkAccient
    const obj = {
      credentialCodes: passenger,
      code,
    }
    insuranceList.push(obj)
  }
  const acceptDate = []
  if (chooseArrtime) {
    for (let i = 0; i < chooseArrtime.length; i++) {
      acceptDate.push(chooseArrtime[i].date)
    }
  }
  const allTrainNumber = []
  if (chooseSeat) {
    for (let i = 0; i < chooseSeat.length; i++) {
      allTrainNumber.push(chooseSeat[i].number)
    }
  }
  const acceptSeat = []
  if (haveChooseZuo) {
    for (let i = 0; i < haveChooseZuo.length; i++) {
      acceptSeat.push(haveChooseZuo[i].name)
      // 默认坐席
      if (!grabSeat) {
        grabSeat = haveChooseZuo[0].name
      }
    }
  }
  // 如果两种情况，没有备选则默认details为主要的
  if (schedules.length === 0 && details) {
    schedules.push(details)
  }
  console.log('--test-startTime--', startTime)
  //  获取最后时间
  const leakCutOffTime = handleLastTime(chooseArrtime, startTime)
  let trainObj = {}
  if (details) {
    trainObj = details
  } else {
    trainObj = startTime
  }
  const trainsarr = getStore('huoche_chooseTrain', 'session')
  const maxpriceObj = getStore('huoche_maxpriceObj', 'session')
  if (details) {
    trainsarr.push(details)
  }
  const a = trainsarr.filter(e => {
    return e.seats.some(o => {
      return o.name === maxpriceObj.name
    })
  })
  trainObj = a[0]
  console.log('--test---trainsarr-', trainsarr, '---maxpriceObj---', maxpriceObj, '--a---', a)
  console.log('train-', trainObj, details, chooseArrtime[0])
  // const startTimes = startTime
  const type = 'ROBTICKETS'
  console.log(chooseArrtime)
  console.log('startTime--', startTime, grabSeat)
  const sendData = {
    channel,
    appCode,
    customerUserId,
    userPhone,
    couponId,
    activityId,
    from:         trainObj.from,
    to:           trainObj.to,
    date,
    startTime:    trainObj.startTime,
    endTime:      trainObj.endTime,
    useTime:      trainObj.duration,
    trainNumber:  trainObj.number,
    seatName:     maxpriceObj.name,
    passenger,
    contactPhone: phone,
    contactName,
    count:        touristNumer.length,
    insuranceList,
    allTrainNumber,
    acceptDate,
    acceptSeat,
    leakCutOffTime,
    type,
    packagePrice,
    schedules,
  }
  console.log('抢票的--sendData', sendData)
  send(orderUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      // console.log('huoche----', data, afterOrdering)
      afterOrdering(data)
      // removeStore('TOURISTNUMBER', 'session') // 删除本地的乘客
      ClearData()
    } else {
      console.log('数据请求失败', message)
      Toast.info(message, 3)
    }
    handleClose()
  })
}
