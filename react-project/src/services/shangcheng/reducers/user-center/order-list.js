import { mergeState } from '@boluome/common-lib'

const initialState = {}

const orderList = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTER':
    case 'SET_ORDER_LIST':
    case 'SET_CURRENT_CANCEL_REASON':
      return mergeState(state, action)
    default:
      return state
  }
}

export default orderList
