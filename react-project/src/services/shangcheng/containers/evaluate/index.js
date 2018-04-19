import { connect } from 'react-redux'
// import { getStore, setStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import Evaluate         from '../../components/evaluate'

import { getOrderInfo, placeEvaluate } from '../../actions/evaluate'

const mapStateToProps = ({ evaluate }) => {
  return {
    ...evaluate,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeImg(imgs, specificationId, appraises) {
      appraises[specificationId].imgs = imgs
      dispatch({ type: 'SET_CURRENT_APPRAISES', appraises })
    },
    handleSelectStar(score, specificationId, appraises) {
      appraises[specificationId].score = score
      dispatch({ type: 'SET_CURRENT_APPRAISES', appraises })
    },
    handleTextareaChange(userComment, specificationId, appraises) {
      appraises[specificationId].userComment = userComment
      dispatch({ type: 'SET_CURRENT_APPRAISES', appraises })
    },
    handleButtonClick(paras) {
      dispatch(placeEvaluate(paras))
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    // 首次进入，清除上一个商品评价状态树中的信息
    dispatch({ type: 'SET_CURRENT_APPRAISES', appraises: {} })
    const orderType = location.pathname.split('/')[3]
    const id = location.pathname.split('/')[4]
    dispatch(getOrderInfo(id, orderType))
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Evaluate)
)
