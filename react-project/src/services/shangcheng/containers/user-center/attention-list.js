import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
// import { parseQuery } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'

import AttentionList from '../../components/user-center/attention-list'

import { getAttentionList, handleChangeAttention } from '../../actions/brand'

const mapStateToProps = ({ attentionList }) => {
  return {
    ...attentionList,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleCancelAttention(brandInfo) {
      dispatch(handleChangeAttention(brandInfo, false, true))
    },
    handleBrandClick(brandId) {
      browserHistory.push(`/shangcheng/${ brandId }`)
    },
  }
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      dispatch(getAttentionList())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(AttentionList))
