import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
// import { parseQuery } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'

import RefundList from '../../components/user-center/refund-list'

import { getRefundList } from '../../actions/user-center/refund-list'

const mapStateToProps = ({ refundList }) => {
  return {
    ...refundList,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleLookRefundOrder(orderType, id) {
      browserHistory.push(`/shangcheng/refundInfo/${ orderType }/${ id }`)
    },
  }
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      dispatch(getRefundList())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(RefundList))
