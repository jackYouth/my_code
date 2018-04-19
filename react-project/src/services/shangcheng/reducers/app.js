import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'shangcheng',
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MAIN_MENUS':
    case 'SET_CURRENT_MENU':
    case 'SET_MENUS_VISIBLE':
      return mergeState(state, action)
    case 'SET_CART_GOODS':
      // 当商家下没有商品时，删掉该商家
      console.log('action.cartCommoditys', action.cartCommoditys)
      if (action.cartCommoditys && action.cartCommoditys.brandList) action.cartCommoditys.brandList = action.cartCommoditys.brandList.filter(o => o.commodityList.length !== 0)
      return mergeState(state, action)
    default:
      return state
  }
}

export default app
