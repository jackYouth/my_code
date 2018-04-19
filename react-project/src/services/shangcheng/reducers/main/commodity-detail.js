import { mergeState } from '@boluome/common-lib'

const initialState = {}

const commodityDetail = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COMMODITY_DETAIL':
    case 'SET_CURRENT_PARAMS':
    case 'SET_POPUP_VISIBLE':
    case 'SET_CURRENT_NUM':
    case 'SET_CURRENT_COMMODITY_STATUS':
    case 'SET_COMMODITY_COLLECT':
      return mergeState(state, action)
    default:
      return state
  }
}

export default commodityDetail
