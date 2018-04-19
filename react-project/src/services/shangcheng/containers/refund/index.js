// 订单详情跳转退款的链接；/shangcheng/refund/mms_nongtechanping/blm001873226498340?specificationId=180

import { connect } from 'react-redux'
import { parseQuery } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'

import Refund from '../../components/refund'

import { getOrderInfo, placeRefundOrder } from '../../actions/refund'

const mapStateToProps = ({ refund }) => {
  const shopId = parseQuery(location.search).shopId ? parseQuery(location.search).shopId : ''
  const shopOrderType = parseQuery(location.search).shopOrderType
  return {
    ...refund,
    shopId,
    shopOrderType,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleRefundTypeChange(refundType) {
      dispatch({ type: 'SET_CURRENT_REFUND_TYPE', refundType, showRefundReason: true })
    },
    handlePriceChange(refundPrice) {
      refundPrice = refundPrice.substring(2)
      dispatch({ type: 'SET_CURRENT_REFUND_PRICE', refundPrice })
    },
    handleRemarkChange(remark) {
      dispatch({ type: 'SET_REFUND_REMARK', remark })
    },
    handleCommodityStatus(currentCommodityStatus) {
      dispatch({ type: 'SET_CURRENT_COMMODITY_STATUS', currentCommodityStatus })
    },
    handleSelectReason(currentReason) {
      dispatch({ type: 'SET_CURRENT_REASON', currentReason })
    },
    placeRefund(paras, maxPrice) {
      if (!paras.commodityStatus) {
        Toast.info('请选择货物状态')
        return
      }
      if (!paras.reason) {
        Toast.info('请选择退款原因')
        return
      }
      if (paras.amount === '') {
        Toast.info('请输入退款金额')
        return
      }
      if (paras.amount > maxPrice) {
        dispatch({ type: 'CHANGE_PRICE_MODAL_VISIBEL', priceModalVisible: true })
        return
      }
      dispatch(placeRefundOrder(paras))
    },
    // 隐藏价格警告框
    handleHidePriceModal() {
      dispatch({ type: 'CHANGE_PRICE_MODAL_VISIBEL', priceModalVisible: false })
    },
    handleChangeImg(uploadImgs) {
      dispatch({ type: 'SET_UPDATE_IMGS', uploadImgs })
    },
  }
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      const orderType = location.pathname.split('/')[3]
      const id = location.pathname.split('/')[4]
      dispatch(getOrderInfo(id, orderType))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(Refund))
