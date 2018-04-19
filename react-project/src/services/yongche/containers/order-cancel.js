import { connect } from 'react-redux'
import { setStore } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'

import OrderCancel from '../components/order-cancel'
import { putCancleReason } from '../actions/order-cancel'

const mapStateToProps = ({ cancelReason }) => {
  return {
    ...cancelReason,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handelReasonClick(currentReason) {
      dispatch({ type: 'SET_CURRENT_CANCEL_REASON', currentReason })
    },
    handlePlaceCancel(currentReason) {
      // 将flage设为1，表示是从取消原因页面返回的
      setStore('cancelReasonReturn', true, 'session')
      dispatch(putCancleReason(currentReason))
    },
  }
}

const mapFunToComponent = () => {
  return {
    componentWillMount() {
      console.log('order-cancel componentWillMount')
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(OrderCancel))
