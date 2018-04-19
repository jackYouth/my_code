import React from 'react'
import { getStore, setStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { merge } from 'ramda'
import { afterOrdering } from 'business'

import { get, send } from '../ajax'
import { delCartCommodity } from '../../actions/common-fuc'

export const getFreight = (province, paras) => dispatch => {
  const closeLoading = Loading()
  send(`/mall/v1/pay/freight?province=${ province }`, paras).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_CURRENT_FREIGHT', currentFreight: data })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

// 当改变收货地址时，重新计算运费(首页第一次请求最有地址， 以及每一次改变收获地址之后)
export const changeAddress = contact => dispatch => {
  if (!contact) return
  const freightParas = getStore('freightParas', 'session')
  dispatch(getFreight(contact.province, freightParas))
}

export const getBestAddress = () => dispatch => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  const selectedCity = getStore('selectedCity', 'session')
  const { longitude, latitude } = selectedCity
  const paras = { userId, longitude, latitude, mapType: 'gaode' }
  get('/user/v1/contact', paras).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'SET_CURRENT_ADDRESS', contact: data })
      dispatch(changeAddress(data))
    } else if (code === 1001) {
      dispatch(changeAddress(''))
      dispatch({ type: 'SET_CURRENT_ADDRESS', contact: '' })
    } else {
      Toast.fail(message, 1)
    }
    closeLoading()
  })
}

// directOrder:  表示是否是在详情页面直接下单，如果是，就不删除购物车中数据
export const placeOrder = (paras, directOrder) => () => {
  const closeLoading = Loading()
  const userId = getStore('customerUserId', 'session')
  const userPhone = getStore('userPhone', 'session')
  const commodities = getStore('orderParasCommodities', 'session')
  paras.brands[0].commodities = commodities
  paras = merge(paras)({ userId, userPhone })
  send('/mall/v1/pay/order', paras).then(({ code, data, message }) => {
    if (code === 0) {
      if (!directOrder) {
        const cartCommoditys = delCartCommodity(getStore('cartCommoditys'), getStore('orderCommoditys'))
        setStore('cartCommoditys', cartCommoditys)
      }
      afterOrdering(data)
    } else if (code === 10001) {
      Toast.info(JSON.parse(message).map(o => <p key={ o }>{ o }</p>), 1)
    } else {
      Toast.info(message, 3)
    }
    closeLoading()
  })
}


// export const checkAddressAvail = paras => dispatch => {
//   const closeLoading = Loading()
//   const userId = getStore('customerUserId', 'session')
//   paras.userId = userId
//   send('/daojia/v1/order/address', paras).then(({ code, data, message }) => {
//     if (code === 0) {
//       const addressAvail = data.result
//       dispatch({ type: 'SET_ADDRESS_AVAIL', addressAvail })
//       if (!addressAvail) Toast.info('当前选择地址不支持该服务', 1)
//     } else {
//       Toast.fail(message, 1)
//     }
//     closeLoading()
//   })
// }
