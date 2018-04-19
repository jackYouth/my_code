// import { browserHistory } from 'react-router'
import { getStore, setStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { login, afterOrdering } from 'business'
import coordtransform from 'coordtransform'

import { get, send } from './'

const useMock = false
const mockStatus = { status: 3, partnerStatus: 'NoDriverAvailable' }

const getOrderStatusMid = (id, isFirst) => dispatch => {
  let closeLoading
  if (isFirst) closeLoading = Loading()
  get(`/order/v1/yongche/${ id }/info`).then(({ code, data, message }) => {
    if (code === 0) {
      let { status, partnerStatus } = data
      const { channel, mapType } = data
      setStore('channel', channel, 'session')
      if (useMock) {
        status = mockStatus.status
        partnerStatus = mockStatus.partnerStatus
      }
      // 将起终点、司机的经纬度转成高德的、
      if (mapType === 'baidu') {
        const originPoint = coordtransform.bd09togcj02(data.origin.longitude, data.origin.latitude)
        const destinationPoint = coordtransform.bd09togcj02(data.destination.longitude, data.destination.latitude)
        data.origin.longitude = originPoint[0]
        data.origin.latitude = originPoint[1]
        data.destination.longitude = destinationPoint[0]
        data.destination.latitude = destinationPoint[1]
        if (data.driver) {
          // 司机位置
          const driverPoint = coordtransform.bd09togcj02(data.driver.longitude, data.driver.latitude)
          data.driver.latitude = driverPoint[0]
          data.driver.longitude = driverPoint[1]
        }
      }
      // 司机经纬度改变
      // let driverPoint = []
      // if (data.driver) {
      //   driverPoint = coordtransform.bd09togcj02(data.driver.longitude, data.driver.latitude)
      //   data.driver.longitude = driverPoint[0]
      //   data.driver.latitude = driverPoint[1]
      // }

      /*
      status:
          2: 行程结束
          4: 已完成
          5: 取消中
          6: 退款中
          7: 已退款
          8: 已取消
          9:
            'Pending': 等待司机接单
            'NoDriverAvailable': 无司机接单
            'Accepted': 司机已接单
            'Charging': 行程中
          10: 订单失败
          11: 等待退款
          12: 支付处理中
      */
      // 个人定义的 currentStatus：0: 无司机接单，1: 等待司机接单，2:司机已接单，3:行程中，4:待支付，5:已支付, 8:取消订单, 11:等待退款, 12: 支付处理中
      // 默认状态是等待司机接单
      let currentStatus = 1
      if (status === 2 || status === 4 || status === 9) {     // 将司机无应答设为false
        dispatch({ type: 'SET_NO_DRIVER_RESPONSE', noDriverResponse: false })
      }
      switch (status) {
        // 因为在关闭页面的时候，会清除所有定时器，所以当前页面只需要有一个地方清除排单中或行程中的定时器就行了，又由于一口价的存在，行程中状态后不存在待支付状态，所以要在完成时，也清楚定时器
        case 2:
          currentStatus = 4
          // 关闭行程中的定时器
          clearInterval(window[`${ id }_charging`])
          window[`${ id }_charging`] = ''
          break
        case 4:
          currentStatus = 5
          clearInterval(window[`${ id }_charging`])
          window[`${ id }_charging`] = ''
          break
        case 5:     // 取消中
        case 6:     // 退款中
        case 7:     // 已退款订单，只会在cancel-info页面用到
        case 8:     // 取消订单，只会在cancel-info页面用到
          currentStatus = 8
          if (partnerStatus === 10 || partnerStatus === 'NoDriverAvailable') {
            currentStatus = 0
            dispatch({ type: 'SET_NO_DRIVER_RESPONSE', noDriverResponse: true })
          }
          if (window[id]) {
            clearInterval(window[id])
            window[id] = ''
          }
          // 删除localStorage中相关的定时器
          // removeStore(`startTime_${ id }`)      // 记录开始时间的定时器
          break
        case 9:
          switch (partnerStatus) {
            case 'Pending':
            case 0:
              currentStatus = 1
              // 当当页没有或是从其他页返回到订单详情页（window[id] === null）时，设置一个等待应答过程的订单轮询，每30s一次，当无应答，行程中 时 以及订单取消的接口请求中, 退出当前页 关闭
              if (!window[id] || window[id] === null) window[id] = setInterval(() => dispatch(getOrderStatusMid(id)), 3000)
              break
            case 'Accepted':
            case 1:
              currentStatus = 2
              data.displayStatus = '司机已接单，请您及时到达上车地点'
              if (!window[id] || window[id] === null) window[id] = setInterval(() => dispatch(getOrderStatusMid(id)), 3000)
              break
            case 'Arrived':
            case 2:
              if (channel === 'shenzhou') {
                currentStatus = 3
              } else {
                currentStatus = 2
              }
              data.displayStatus = '司机已到达上车地点'
              if (!window[id] || window[id] === null) window[id] = setInterval(() => dispatch(getOrderStatusMid(id)), 3000)
              break
            case 'Charging':
            case 3:
            case 4:
              currentStatus = 3
              data.displayStatus = '开始行程，祝您旅途愉快'
              if (window[id]) {
                clearInterval(window[id])
                window[id] = ''
              }
              // 设置一个行程中过程的订单轮询，每60s一次，当已评价时 以及订单取消的接口请求中, 退出当前页 关闭
              if (!window[`${ id }_charging`] || window[`${ id }_charging`] === null) window[`${ id }_charging`] = setInterval(() => dispatch(getOrderStatusMid(id)), 6000)
              break
            default:
              // Toast.fail('订单返回状态错误')
              console.log('订单返回状态错误')
              break
          }
          break
        case 11:
          currentStatus = 11
          // 删除localStorage中相关的定时器
          // removeStore(`startTime_${ id }`)      // 记录开始时间的定时器
          break
        case 12:
          currentStatus = 12
          break
        default:
          // Toast.fail('订单返回状态错误')
          console.log('订单返回状态错误')
          currentStatus = 8
          break
      }
      // 模拟司机位置改变
      // data.driver = {}
      // data.driver.latitude = 31.244870662083018 + (Math.random() * 0.01)
      // data.driver.longitude = 121.49448545338123 + (Math.random() * 0.01)
      // console.log(11111, data.driver.latitude, data.driver.longitude)
      dispatch({ type: 'SET_CURRENT_STATUS', currentStatus, currentOrderInfo: data })
    } else {
      Toast.fail(message)
    }
    if (closeLoading) closeLoading()
  })
}

export const getOrderStatus = id => dispatch => {
  if (!getStore('customerUserId', 'session')) {
    const closeLoading = Loading()
    login(err => {
      if (err) {
        console.log('login err')
      } else {
        dispatch(getOrderStatusMid(id))
      }
      closeLoading()
    })
  } else {
    dispatch(getOrderStatusMid(id))
  }
}


export const cancelOrder = (status, channel, reason) => dispatch => {
  const closeLoading = Loading()
  const id = location.pathname.split('/')[3]
  if (!reason) reason = '无应答取消'
  send('/order/v1/cancel', { channel, orderType: 'yongche', id, reason }).then(({ code, message }) => {
    if (code === 0) {
      // 关闭轮询订单的定时器
      if (window[id]) {
        clearInterval(window[id])
        window[id] = ''
      }
      if (window[`${ id }_charging`]) {
        clearInterval(window[`${ id }_charging`])
        window[`${ id }_charging`] = ''
      }
      // 删除localStorage中相关的定时器
      // removeStore(`startTime_${ id }`)      // 记录开始时间的定时器
      if (status === 1) {
        if (getStore('isSinglePrice', 'session')) {
          dispatch(getOrderStatus(id))
        } else {
          // const productType = getStore('currentProduct', 'session') ? getStore('currentProduct', 'session').code : '14'
          // browserHistory.push(`/yongche/${ channel }/${ productType }`)
          window.history.back()
        }
      }
      if (status === 2) {       // 选择原因后跳转过来
        // 1s后跳转到订单取消详情页面，因为推送有时间差
        setTimeout(() => {
          window.history.back()
          // browserHistory.push(`/yongche/order/${ id }`)
          closeLoading()
        }, 1000)
        return
      }
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const placeEvaluate = (rating, comment, id) => dispatch => {
  const closeLoading = Loading()
  const channel = getStore('channel', 'session')
  const paras = { rating: Math.ceil(rating), comment, channel }
  send(`/yongche/v1/order/${ id }/rating`, paras, 'put').then(({ code, message }) => {
    if (code === 0) {
      dispatch(getOrderStatus(id))
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}

export const handleToPay = paras => {
  const closeLoading = Loading
  get('/yongche/v1/order/settlement', paras).then(({ code, data, message }) => {
    if (code === 0) {
      afterOrdering(data)
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
