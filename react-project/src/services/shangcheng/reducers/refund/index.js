import { mergeState } from '@boluome/common-lib'

const initialState = {}

const refund = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_REFUND_TYPE':
    case 'SET_CURRENT_ORDER_INFO':
    case 'SET_CURRENT_REFUND_PRICE':
    case 'SET_REFUND_REMARK':
    case 'SET_CURRENT_COMMODITY_STATUS':
    case 'SET_CURRENT_REASON':
    case 'CHANGE_PRICE_MODAL_VISIBEL':
    case 'SET_UPDATE_IMGS':
      return mergeState(state, action)
    default:
      return state
  }
}

export default refund
