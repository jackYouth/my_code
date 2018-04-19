import { getStore, send } from '@boluome/common-lib'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { afterOrdering } from 'business'
import { Toast } from 'antd-mobile'

export const handleCoupon = orderDiscount => {
  console.log('orderDiscount', orderDiscount)
  const { discount } = orderDiscount
  return {
    type:          'HANDLE_COUPON',
    orderDiscount,
    discountPrice: discount,
  }
}

export const saveOrder = props => {
  console.log('props', props)
  const { chooseTimes = ['1次'], thisData, channel, orderDiscount = {} } = props
  const { airportName, type, facilities, hoursSection, loungeAddress, regulations, areaName, international } = thisData
  const userId = getStore('customerUserId', 'session')
  const userPhone = getStore('userPhone', 'session')
  const count = chooseTimes[0].substring(0, chooseTimes[0].length - 1)
  const couponId = orderDiscount.coupon ? orderDiscount.coupon.id : ''
  const activityId = orderDiscount.activities ? orderDiscount.activities.id : ''
  const server = {
    airportName,
    type,
    facilities,
    hoursSection,
    loungeAddress,
    regulations,
    areaName,
    international,
  }
  const postDatas = {
    userId,
    userPhone,
    count,
    server,
    channel,
    couponId,
    activityId,
  }

  // console.log('postDatas', postDatas)
  const handleClose = Loading()
  send('/dengjifuwu/v1/order', postDatas)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      console.log(data)
      afterOrdering(data)
    } else {
      Toast.info(message, 2)
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    console.log(err)
  })
}
