import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap }    from '@boluome/oto_saas_web_app_component'

import Categories         from '../../components/main/categories'
import { getTopCategories, getSubCategories } from '../../actions/main/categories'

const mapStateToProps = ({ categories }) => {
  return {
    ...categories,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeTop(currentTop) {
      const { categoryId } = currentTop
      dispatch(getSubCategories(categoryId))
      dispatch({ type: 'SET_CURRENT_TOP_CATEGORIES', currentTop: categoryId })
    },
    handleToCommodities(brandType, categoryId, categoryCode) {
      // brandType为1表示商城商品，为0表示到家商品
      if (brandType === 1) {
        browserHistory.push(`/shangcheng/commodityList/${ categoryId }`)
      } else if (brandType === 0) {
        location.href = `${ location.origin }/daojia/${ categoryCode }`
      }
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    // 清空想上一次页面的数据
    dispatch({ type: 'SET_CURRENT_TOP_CATEGORIES', currentTop: '' })

    dispatch(getTopCategories())
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Categories)
)
