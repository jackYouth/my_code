import { mergeState } from '@boluome/common-lib'

const initialState = {}

const brand = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_BRAND_INFO':
    case 'SET_BRAND_COMMODITY_LIST':
    case 'SET_BRAND_Attention':
      return mergeState(state, action)
    default:
      return state
  }
}

export default brand
