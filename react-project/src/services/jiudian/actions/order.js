import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { get, send, afterOrdering } from 'business'
import moment from 'moment'
import { merge } from 'ramda'
import { Toast, Modal } from 'antd-mobile'
// import { browserHistory } from 'react-router'

const alert = Modal.alert

export const goGuarant = isGoGuarantee => {
  console.log('in goGuarant', isGoGuarantee)
  return {
    type: 'IS_GOGUARANTEE',
    isGoGuarantee,
  }
}

export const handleArriveTimeData = state => {
  // console.log('handleArriveTimeData, data-=-=-=-==--=-=-=-==--=-=-=', state)
  // 判断是否需要担保
  const { rateInfo = {}, availData = {} } = state
  // const dateInfo = getStore('dateInfo')
  const { limitArrival = {} } = availData
  // const { startDate } = dateInfo
  const { paymentType, guaranteeRule = {} } = rateInfo
  const { guarantee, isTimeGuarantee, guaranteeAmount, startTime = '' } = guaranteeRule
  const { start, end } = limitArrival
  const arriveTime = []
  let { endTime = '06:00' } = guaranteeRule
  let guaranteePrice = 0
  let specialHour = 24
  // console.log('rateInfo', rateInfo)

  if (!endTime) {
    endTime = '06:00'
  }

  // console.log('rateInfo-==============-------', rateInfo)
  const startHour = startTime.split(':')[0]
  const endHour = Number(endTime.split(':')[0])
  // console.log('guaranteeRule', guaranteeRule)
  // 渲染到店时间选择数据源
  // 午夜前
  // 如果end大于10，说明end不是默认次日凌晨的情况，渲染时就不能以24点作为分界
  if (end >= start) {
    specialHour = (24 - start) + end
    console.log('start-=-=-=-=-==->', start, end, specialHour)
  }
  // console.log('test--==--=-=-=-=-==-=-', start, specialHour, end)
  if (start >= 7) {
    console.log('in  白天', start, specialHour)
    for (let i = start; i < specialHour; i++) {
      // guarantee 为 true 时可能需要担保，反之则不需要
      if (guarantee && paymentType === 'SelfPay') {
        console.log('guarantee true～～～～～～～')
        // isTimeGuarantee 为 true 时根据时间段判断是否需要担保，为false时所有时段均要担保
        if (isTimeGuarantee) {
          // console.log('is TimeGuarantee true～～～～～～', startHour, endHour)
          if (startHour <= i) {
            // console.log('1需要担保', i)
            guaranteePrice = guaranteeAmount
            // if (moment().format('YYYY-MM-DD') === startDate) {
            //   arriveTime.push({ label: `马上到店 担保金 ¥${ guaranteePrice }`, value: `马上到店 担保金 ¥${ guaranteePrice }` })
            // }
            arriveTime.push({ label: `${ i }:00 担保金 ¥${ guaranteePrice }`, value: `${ i }:00 担保金 ¥${ guaranteePrice }` })
          } else if (i <= endHour) {
            // console.log('2需要担保', i)
            guaranteePrice = guaranteeAmount
            arriveTime.push({ label: `${ i }:00 担保金 ¥${ guaranteePrice }`, value: `${ i }:00 担保金 ¥${ guaranteePrice }` })
          } else {
            // console.log('3不需要担保', i)
            arriveTime.push({ label: `${ i }:00`, value: `${ i }:00` })
          }
        } else {
          // console.log('4需要担保', i)
          guaranteePrice = guaranteeAmount
          arriveTime.push({ label: `${ i }:00 担保金 ¥${ guaranteePrice }`, value: `${ i }:00 担保金 ¥${ guaranteePrice }` })
        }
      } else {
        console.log('5不需要担保', i)
        arriveTime.push({ label: `${ i }:00`, value: `${ i }:00` })
      }
    }
  }
  // 午夜后
  if (end <= start) {
    console.log('in  午夜后')
    for (let i = 0; i <= end; i++) {
      if (guarantee && paymentType === 'SelfPay') {
        if (i <= endHour) {
          console.log('end 1 需要担保', i)
          guaranteePrice = guaranteeAmount
          if (i < 10) {
            arriveTime.push({ label: `0${ i }:00 担保金 ¥${ guaranteePrice }`, value: `0${ i }:00 担保金 ¥${ guaranteePrice }` })
          } else {
            arriveTime.push({ label: `${ i }:00 担保金 ¥${ guaranteePrice }`, value: `${ i }:00 担保金 ¥${ guaranteePrice }` })
          }
        }
      } else {
        console.log('end 2 不需要担保', i)
        if (i < 10) {
          arriveTime.push({ label: `0${ i }:00`, value: `0${ i }:00` })
        } else {
          arriveTime.push({ label: `${ i }:00`, value: `${ i }:00` })
        }
      }
    }
  }


  return {
    type: 'ARRIVETIME_DATA',
    arriveTime,
  }
}

export const handleLastestArrivalTime = lastestArriveTime => {
  return {
    type: 'LASTEST_ARRIVETIME',
    lastestArriveTime,
  }
}

export const handleCustomerName = (i, e, customerName) => {
  customerName[i] = e
  return {
    type: 'CUSTOMER_NAME',
    customerName,
  }
}

export const handleCustomerPhone = customerPhone => {
  return {
    type: 'CUSTOMER_PHONE',
    customerPhone,
  }
}

export const handleBill = billInfo => {
  return {
    type: 'BILL_INFO',
    billInfo,
  }
}

export const handleCoupon = orderDiscount => {
  console.log('orderDiscount', orderDiscount)
  const { discount, activities = {}, coupon = {} } = orderDiscount
  return {
    type:          'HANDLE_COUPON',
    couponId:      !coupon.id ? '' : coupon.id,
    activityId:    !activities.id ? '' : activities.id,
    discountPrice: discount,
    orderDiscount,
  }
}

export const handleAvail = state => dispatch => {
  const handleClose = Loading()
  // console.log('state------------>', state)
  const { orderCityId, planId, hotelId, rateInfo = {}, chooseCity = {}, currentCityId = getStore('currentCityId'), quantity = 1, choosenArriveTime = [] } = state
  // console.log('hahahahah-------->', orderCityId)
  const dateInfo = getStore('dateInfo')
  const { startDate, endDate } = dateInfo
  let specialStartDate
  const HotelIds = String(hotelId)
  const { category } = rateInfo
  const { id } = chooseCity
  let lastestArriveTime
  if ((choosenArriveTime.length > 0) && (Number(choosenArriveTime[0].split(':')[0]) >= 0) && (Number(choosenArriveTime[0].split(':')[0]) < 10)) {
    // 说明选择为凌晨时间日期需要递增一日
    specialStartDate = moment(startDate).add('days', 1).format('YYYY-MM-DD')
    console.log('说明选择为凌晨时间日期需要递增一日', startDate, specialStartDate)
  }
  if (choosenArriveTime.length === 0) {
    lastestArriveTime = `${ !specialStartDate ? startDate : specialStartDate } 14:00`
  } else {
    lastestArriveTime = `${ !specialStartDate ? startDate : specialStartDate } ${ choosenArriveTime[0].split(' ')[0] }`
  }

  const postData = {
    quantity,
    channel:           getStore('channel'),
    hotelId:           HotelIds,
    arrivalDate:       startDate,
    departureDate:     endDate,
    ratePlanId:        planId,
    ratePlanCategory:  category,
    latestArrivalTime: lastestArriveTime,
    guestCount:        quantity,
    cityId:            !orderCityId ? !id ? currentCityId : id : orderCityId,
  }

  get('/jiudian/v1/hotel/avail', postData)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      const { price = 0 } = data
      const arrTime = postData.latestArrivalTime
      // console.log('lastestArriveTime', arrTime, postData)
      dispatch({ type: 'LASTEST_ARRIVETIME', lastestArriveTime: arrTime })
      dispatch({
        type:      'AVAIL_DATA',
        availData: data,
        sumPrice:  Number(quantity) * Number(price),
      })
      const newData = merge(state, { availData: data })
      dispatch(handleArriveTimeData(newData))
      // 渲染房间选择数据
      const { maxAmount, minAmount } = data
      const roomQuantity = []
      for (let i = minAmount; i <= maxAmount; i++) {
        roomQuantity.push({ label: `${ i } 间`, value: `${ i } 间` })
      }
      dispatch({ type: 'ROOMQUANTITY_Data', roomQuantity })
    } else {
      console.log('avail 房型没有', message)
      alert('温馨提示', '该房间已被订完，请预订其他房间', [
        {
          text:    '确定',
          onPress: () => {
            window.history.back()
          },
        },
      ])
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log('handleHotels', err)
  })
}

export const handleArriveTime = (choosenArriveTime, state) => dispatch => {
  dispatch({
    type: 'ARRIVE_TIME',
    choosenArriveTime,
  })
  dispatch(handleAvail(merge(state, { choosenArriveTime })))
}

export const handleChooseRoomQuantity = (choosenQuantity, price, props) => dispatch => {
  // console.log('choosenQuantity', choosenQuantity, choosenQuantity[0].split(' ')[0], price)
  const quantity = choosenQuantity[0].split(' ')[0]
  const sumPrice = Number(choosenQuantity[0].split(' ')[0]) * Number(price)
  dispatch({
    type: 'ROOM_QUANTITY',
    choosenQuantity,
    quantity,
    sumPrice,
  })
  dispatch(handleAvail(merge(props, { quantity })))
}

export const saveOrder = datas => {
  console.log('data------------', datas)
  const { isGoGuarantee, lastestArriveTime, quantity = 1, planId, showRoomID, availData = {},
          hotelDetail = {}, cardInfo = {}, customerName = [], customerPhone = getStore('userPhone', 'session'),
          chooseCity = {}, currentCityId = getStore('currentCityId'), creditCardNo, cvvNo, validDate,
          userName, userID, userPhone, couponId, activityId, orderCityId,
        } = datas
  console.log('orderCityId--------->', orderCityId)
  const { cardType, bankId } = cardInfo
  const { price = 0 } = availData
  const { id } = hotelDetail
  const customerUserId = getStore('customerUserId', 'session')
  const rateInfo = getStore('rateInfo', 'session')
  const dateInfo = getStore('dateInfo')
  // console.log('rateInfo=========', rateInfo)
  const { category, paymentType, guaranteeRuleIds, guaranteeAmount } = rateInfo
  const { endDate, startDate } = dateInfo
  const contact = {
    Name:   customerName[0],
    Mobile: customerPhone,
  }
  const CreditCard = {
    Number:          creditCardNo,
    CVV:             cvvNo,
    ExpirationYear:  validDate ? validDate.split('-')[0] : '',
    ExpirationMonth: validDate ? validDate.split('-')[1] : '',
    HolderName:      userName,
    IdType:          'IdentityCard',
    IdNo:            userID,
    CreditCardType:  cardType,
    CardBankID:      bankId,
    MobilePhone:     userPhone,
  }
  // const Customers = []
  const orderRooms = []
  customerName.forEach(i => {
    const Customers = [{ Name: i }]
    orderRooms.push({ Customers })
  })
  // console.log('Customers', Customers)
  // console.log('orderRooms', orderRooms)
  const postData = {
    customerUserId,
    CreditCard,
    couponId,
    activityId,
    channel:           getStore('channel'),
    userPhone:         !getStore('userPhone', 'session') ? customerPhone : getStore('userPhone', 'session'),
    price:             price * quantity,
    HotelId:           id,
    RoomTypeId:        showRoomID,
    RatePlanId:        planId,
    RatePlanCategory:  category,
    ArrivalDate:       startDate,
    DepartureDate:     endDate,
    PaymentType:       paymentType,
    NumberOfRooms:     quantity,
    NumberOfCustomers: quantity,
    LatestArrivalTime: lastestArriveTime,
    IsGuarantee:       isGoGuarantee,
    GuaranteeTypeCode: guaranteeRuleIds,
    GuaranteeAmount:   guaranteeAmount,
    OrderRooms:        orderRooms,
    Contact:           contact,
    cityId:            !orderCityId ? !chooseCity.id ? currentCityId : chooseCity.id : orderCityId,
  }
  const handleClose = Loading()
  send('/jiudian/v1/order/save', postData)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      console.log('data.status-=-=-=-=-=-=-=-=', data.status)
      const { status } = data
      if (status === 2) {
        afterOrdering(data)
      } else {
        window.location.replace(`/jiudian/orderDetails/${ data.id }`)
      }
    } else {
      console.log(message)
      Toast.info(message, 2)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log('checkCreditCard', err)
  })
}
