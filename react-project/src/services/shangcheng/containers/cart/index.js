/*
  购物车数据格式：
  {
    totalNum,
    brandList: [
      {
        brandId: 商家id,
        brandName: 商家名,
        commodityList: [
          { 商品信息, 商品数量 },
          { 商品信息, 商品数量 },
        ]
      },
      {
        brandId: 商家id,
        brandName: 商家名,
        commodityList: [
          { 商品信息, 商品数量 },
          { 商品信息, 商品数量 },
        ]
      },
    ]
  }
  默认购物车格式：
  {
    totalNum: 0,
  }
*/

import { connect } from 'react-redux'
import { getStore, setStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'

import Cart         from '../../components/cart'

import { checkCartStatus } from '../../actions/common-api'

const mapStateToProps = ({ cart, app }) => {
  const { cartCommoditys } = app
  return {
    ...cart,
    cartCommoditys,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleChangeCommdity(cartCommoditys) {
      setStore('cartCommoditys', cartCommoditys)
      dispatch({ type: 'SET_CART_GOODS', cartCommoditys })
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    // statusChecked默认为false
    dispatch({ type: 'SET_CHECKED_STATUS', statusChecked: false })

    const cartCommoditys = getStore('cartCommoditys')
    // dispatch({ type: 'SET_CART_GOODS', cartCommoditys })
    dispatch(checkCartStatus(cartCommoditys))
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Cart)
)
