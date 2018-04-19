import { connect }  from 'react-redux'
import { wrap, Loading }     from '@boluome/oto_saas_web_app_component'
import { parseQuery, getStore }  from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { pay, customerCode, customer } from 'business'
import { fetchOrderLite, togglePageLoading } from '../actions'
import Cashier from '../components/cashier'

const mapStateToProps = ({ cashier }, { params }) => {
  const { payments } = getStore('customerConfig', 'session')
  const { showCashier, filterPayments = paymentsinfo => paymentsinfo } = customer()
  const customerPayment = filterPayments(payments)
  const { currentPayment = customerPayment[0], orderlite } = cashier
  return {
    ...params,
    orderlite,
    customerCode,
    currentPayment,
    customerPayment,
    showCashier,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangePayment: currentPayment => {
      dispatch({ type: 'CHANGE_PAYMENT', currentPayment })
    },
    handlePay: (currentPayment, order) => {
      Loading()
      pay(currentPayment)(order)
    },
    handleToOrderInfo: (url, word = '已完成') => {
      Toast.success(word, 2)
      setTimeout(() => (location.href = url), 2000)
    },
  }
}

const mapFuncToComponent = (dispatch, { orderId }) => {
  return {
    componentWillMount: () => {
      const search = parseQuery(location.search)
      const { subId = '', orderType = '' } = search
      dispatch(togglePageLoading({ loading: true }))
      dispatch(fetchOrderLite(orderId, subId, orderType))
      setInterval(() => dispatch(fetchOrderLite(orderId, subId, orderType)), 15000)
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFuncToComponent)(Cashier))
