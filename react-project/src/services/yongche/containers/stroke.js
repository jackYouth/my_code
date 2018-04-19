import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { browserHistory } from 'react-router'

import Stroke from '../components/stroke'
import { getOrderList } from '../actions/stroke'

const mapStateToProps = ({ stroke }) => {
  const channel = getStore('channel', 'session')
  return {
    ...stroke,
    channel,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleOrderClick(id) {
      browserHistory.push(`/yongche/order/${ id }?flag=1`)
    },
  }
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      dispatch(getOrderList())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(Stroke))
