import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'

import Market         from '../../components/main/market'
import { getMarketCategories, getMarketCommoditys } from '../../actions/main/market'
import { addCommodity } from '../../actions/common-fuc'

const mapStateToProps = ({ market, app }) => {
  const { cartCommoditys } = app
  return {
    ...market,
    cartCommoditys,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleTabClick(tabs) {
      dispatch(getMarketCommoditys(tabs))
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
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    dispatch(getMarketCategories())
    dispatch(getMarketCommoditys())
    const cartCommoditys = getStore('cartCommoditys')
    dispatch({ type: 'SET_CART_GOODS', cartCommoditys })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Market)
)
