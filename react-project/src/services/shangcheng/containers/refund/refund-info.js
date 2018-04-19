import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
// import { parseQuery } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { Toast, Modal } from 'antd-mobile'

import RefundInfo from '../../components/refund/refund-info'

import { getRefundInfo, refundCancel, getExpressInfo, placeExpress } from '../../actions/refund/refund-info'

const mapStateToProps = ({ refundInfo }) => {
  return {
    ...refundInfo,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleEidtRefund(id, originOrderType, refundId, specificationId) {
      clearInterval(window.countdown)
      browserHistory.push(`/shangcheng/refund/${ originOrderType }/${ id }?refundId=${ refundId }&specificationId=${ specificationId }`)
    },
    handleCancelRefund(id, originId, originOrderType) {
      const cancelFn = () => {
        clearInterval(window.countdown)
        dispatch(refundCancel(id, originId, originOrderType))
      }
      Modal.alert('温馨提示', '退款申请仅可发起2次，确定撤销吗？', [
        { text: '取消', onPress: () => console.log('cancel') },
        { text: '确定', onPress: cancelFn },
      ])
    },
    handleExpressChange(currentExpressNumber) {
      dispatch({ type: 'CHANGE_EXPRESS_NUMBER', currentExpressNumber })
    },
    handleIptBlur(currentExpressNumber) {
      dispatch(getExpressInfo(currentExpressNumber))
    },
    placeExpress(paras) {
      if (!paras.express.name) {
        Toast.info('请填写正确的物流单号')
        return
      }
      dispatch(placeExpress(paras))
    },
  }
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      dispatch(getRefundInfo())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(RefundInfo))
