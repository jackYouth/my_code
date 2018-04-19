import { connect } from 'react-redux'
import { setStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'

import Brand         from '../components/brand'

import { getBrandInfo, handleChangeAttention } from '../actions/brand'

const mapStateToProps = ({ brand }) => {
  return {
    ...brand,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeAttention(brandInfo, isAttention) {
      dispatch(handleChangeAttention(brandInfo, isAttention))
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    const brandId = location.pathname.split('/')[2]
    setStore('brandId', brandId, 'session')
    dispatch(getBrandInfo(brandId))
    // 清空上一个商家的相关信息
    dispatch({ type: 'SET_BRAND_Attention', isAttention: undefined })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Brand)
)
