import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
// import { parseQuery } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'

import CollectList from '../../components/user-center/collect-list'

import { getCollectList, handleChangeCollect } from '../../actions/main/commodity-detail'

const mapStateToProps = ({ collectList }) => {
  console.log('collectList', collectList)
  return {
    ...collectList,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleCancelCollect(commodityId) {
      dispatch(handleChangeCollect(commodityId, false, true))
    },
    handleCommdityClick(commodityId) {
      browserHistory.push(`/shangcheng/commodity?commodityId=${ commodityId }`)
    },
  }
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      dispatch(getCollectList())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(CollectList))
