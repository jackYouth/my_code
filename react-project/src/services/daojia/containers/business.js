import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'

import Business from '../components/business'

import { getBusinessData, getBrandGoods } from '../actions/business'

const mapStateToProps = ({ business }) => {
  return {
    ...business,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleToAllComment(businessData) {
      const { brandCode, brandId } = businessData
      browserHistory.push(`/daojia/comment-info?brandId=${ brandId }&brandCode=${ brandCode }`)
    },
    handleGoodClick(goodInfo) {
      const { serviceId } = goodInfo
      const industryCode = getStore('industryCode', 'session')
      browserHistory.push(`/daojia/${ industryCode }/detail?serviceId=${ serviceId }`)
    },
    handleFilterClickMiddleware(currentCategoryIndex, industryCategoryBoList) {
      dispatch({ type: 'SET_CURRENT_CATEGORY_ID', currentCategoryIndex })
      if (currentCategoryIndex !== 0) {
        const currentIndustryCategoryId = industryCategoryBoList[currentCategoryIndex].industryCategoryId
        dispatch(getBrandGoods(currentIndustryCategoryId))
      }
    },
  }
}

const mapFunToComponent = dispatch => {
  return {
    componentWillMount() {
      dispatch(getBusinessData())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(Business))
