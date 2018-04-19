import { connect } from 'react-redux'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { Modal } from 'antd-mobile'

import Order         from '../components/order'

import { getOrderInfo, cancelOrder } from '../actions/order'

const mapStateToProps = ({ order }) => {
  return {
    ...order,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleCancelOrder(id) {
      Modal.alert('', '您是否要取消用车', [
        { text: '否', onPress: () => console.log('cancel'), style: 'default' },
        { text: '是', onPress: () => dispatch(cancelOrder(id)) },
      ])
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    const id = window.location.pathname.split('/')[3]
    dispatch(getOrderInfo(id))
    window.orderTimer = setInterval(() => dispatch(getOrderInfo(id)), 15000)
  },
  componentWillUnmount() {
    if (window.orderTimer) {
      clearInterval(window.orderTimer)
      delete window.orderTimer
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Order)
)
