import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'

import Specialty         from '../../components/main/specialty'
import { getSpecialtyCommoditys, getProvince } from '../../actions/main/specialty'
import { addCommodity } from '../../actions/common-fuc'

const mapStateToProps = ({ specialty, app }) => {
  // 购物车相关
  const { cartCommoditys } = app
  return {
    cartCommoditys,
    ...specialty,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeProvince(id) {
      dispatch(getSpecialtyCommoditys(id))
    },
    // 购物车相关
    handleAddCommodity(data, cartCommoditys) {
      const currentPriceInfo = data.prices.filter(o => o.inventory)[0]
      data.currentPriceInfo = currentPriceInfo
      data.buyNum = 1
      dispatch(addCommodity(data, cartCommoditys))
    },
    handleChangeMenu(currentMenu) {
      browserHistory.push(`/shangcheng/${ currentMenu }`)
      dispatch({ type: 'SET_CURRENT_MENU', currentMenu })
    },
    handleToCommodityList(o) {
      browserHistory.push(`/shangcheng/commodityList/${ o.commodityCategoryId }`)
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    dispatch(getSpecialtyCommoditys())
    dispatch(getProvince())
    // 购物车相关
    const cartCommoditys = getStore('cartCommoditys') ? getStore('cartCommoditys') : {}
    dispatch({ type: 'SET_CART_GOODS', cartCommoditys })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Specialty)
)
