import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { parseQuery } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { Modal } from 'antd-mobile'
import { afterOrdering } from 'business'

import OrderList from '../../components/user-center/order-list'

import { getOrderList } from '../../actions/user-center/order-list'
import { handleDelOrder, handleCancelOrder, handleConfirmOrder } from '../../actions/order-edit'

const mapStateToProps = ({ orderList }) => {
  const cancelReason = [
    { label: '我不想买了', value: '我不想买了' },
    { label: '信息填写错误，重新拍', value: '信息填写错误，重新拍' },
    { label: '卖家缺货', value: '卖家缺货' },
  ]
  return {
    ...orderList,
    cancelReason,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleTabClick(currentFilter) {
      dispatch({ type: 'SET_FILTER', currentFilter })
      dispatch(getOrderList(currentFilter))
    },
    handleCancelOrder(currentReason, orderType, id, filter, channel) {
      console.log('currentReason', currentReason)
      dispatch({ type: 'SET_CURRENT_CANCEL_REASON', currentReason })
      const paras = {
        reason: currentReason,
        orderType,
        id,
        channel,
      }
      dispatch(handleCancelOrder(paras, filter))
    },
    handleDelOrder(orderType, id, filter) {
      Modal.alert('温馨提示', '删除后不可恢复，确认删除订单？', [
        { text: '取消', onPress: () => console.log('cancel') },
        { text: '确定', onPress: () => dispatch(handleDelOrder(orderType, id, filter)) },
      ])
    },
    handlePayOrder(data) {
      afterOrdering(data)
    },
    handleEvaluateOrder(orderType, id) {
      browserHistory.push(`/shangcheng/evaluate/${ orderType }/${ id }`)
    },
    handleConfirmOrder(orderType, id, filter) {
      Modal.alert('温馨提示', '请确认已收到货物没有问题，确认后不可取消操作。', [
        { text: '取消', onPress: () => console.log('cancel') },
        { text: '确定', onPress: () => dispatch(handleConfirmOrder(id, orderType, filter)) },
      ])
    },
    handleOrderClick(orderType, id) {
      browserHistory.push(`/shangcheng/order/${ orderType }/${ id }`)
    },
  }
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      const filters = [
        { title: '全部', id: '' },
        { title: '待付款', id: '0' },
        { title: '待发货', id: '1' },
        { title: '待收货', id: '2' },
        { title: '待评价', id: '3' },
      ]
      const currentFilter = parseQuery(location.search).filter || parseQuery(location.search).filter === 0 ? parseQuery(location.search).filter : filters[0].id
      dispatch({ type: 'SET_FILTER', filters, currentFilter })
      dispatch(getOrderList(currentFilter))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(OrderList))
