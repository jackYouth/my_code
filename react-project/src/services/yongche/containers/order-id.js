/*
    定时轮询在action中开启
*/

import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap, Mask } from '@boluome/oto_saas_web_app_component'
import { Modal } from 'antd-mobile'
import { getStore, setStore } from '@boluome/common-lib'

import OrderId from '../components/order-id'
import { cancelOrder, getOrderStatus, placeEvaluate, handleToPay } from '../actions/order-id'

const mapStateToProps = ({ orderId }) => {
  return {
    ...orderId,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleCancelClick(status, channel) {
      // 定义一个点击是之后的根据status判断接下来操作的函数
      const yesFunc = () => {
        if (status === 1) {
          dispatch(cancelOrder(status, channel))
        } else {
          const id = location.pathname.split('/')[3]
          // 如果是已接单取消，先去取消原因页面填写取消原因
          browserHistory.push(`/yongche/order/${ id }/cancel`)
        }
      }
      // 如果有行程中的订单，弹出确认框
      Modal.alert('您是否要取消用车', '', [
        { text: '否', onPress: () => console.log('cancel') },
        { text: '是', onPress: yesFunc },
      ])
    },
    handleToPay(paras) {
      dispatch(handleToPay(paras))
    },
    handleRecallClick(currentOrderInfo, isSinglePrice) {
      const { channel, id } = currentOrderInfo
      if (isSinglePrice) {
        // flag等于1表示，是从行程页或是无应答页，点击跳转而来的
        dispatch({ type: 'SET_CURRENT_FLAG', flag: '1' })
        browserHistory.push(`/yongche/order/${ id }?flag=1`)
        return
      }
      const productType = getStore('currentProduct', 'session') ? getStore('currentProduct', 'session').code : '14'
      browserHistory.push(`/yongche/${ channel }/${ productType }`)
      // 提供当页重新叫车服务
      // const { channel, contactPhone, customerUserId, destination, imei, origin, productType, rideType, userPhoen } = currentOrderInfo
      // dispatch(createOrder({ channel, contactPhone, customerUserId, departureTime: ['2017-07-11', '现在'], destination, imei, origin, productType, rideType, userPhoen }, getOrderStatus))
    },
    handelRulesClick() {
      browserHistory.push('/yongche/rules')
    },
    handleToIndex(channel, productType) {
      browserHistory.push(`/yongche/${ channel }/${ productType }`)
    },
    handlePlaceEvaluate(rating, content, id) {
      dispatch(placeEvaluate(rating, content, id))
    },
  }
}

const mapFunToComponent = dispatch => ({
  componentWillMount() {
    const id = location.pathname.split('/')[3]
    // 清除
    if (window[id]) {
      clearInterval(window[id])
      window[id] = null
    }
    if (window[`${ id }_charging`]) {
      clearInterval(window[`${ id }_charging`])
      window[`${ id }_charging`] = null
    }
    // 只会在componentWillUnmount中从session中获取，因为componentWillUnmount时，url已经变了
    setStore('id', id, 'session')
    dispatch(getOrderStatus(id, 'isFirst'))
    // flag等于1表示，是从行程页或是无应答页，点击跳转而来的
    // 如果是取消原因页面返回的，cancelReasonReturn为true，或是从其他页面进入（一般是客户的订单列表，flag不一定为1），这时都算订单列表返回，要和当前页面中无司机接单取消和带退款的状态区分开
    const flag = (getStore('cancelReasonReturn', 'session') || location.search.length > 1) ? '1' : ''
    dispatch({ type: 'SET_CURRENT_FLAG', flag })
  },
  // 当离开此页面时
  componentWillUnmount() {
    // 关闭所有弹窗
    Mask.closeAll()
    // 清空当前的订单信息
    dispatch({ type: 'SET_CURRENT_STATUS', currentStatus: '', currentOrderInfo: '' })

    // 关闭所有派单、行程中的订单轮询
    const id = getStore('id', 'session')
    if (window[id]) {
      clearInterval(window[id])
      window[id] = null
    }
    if (window[`${ id }_charging`]) {
      clearInterval(window[`${ id }_charging`])
      window[`${ id }_charging`] = null
    }
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(OrderId)
  )
