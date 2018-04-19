import { mergeState } from '@boluome/common-lib'

const initialState = {}

const cashier = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ORDER_LITE_SUCCESS':
    case 'TOGGLE_PAGE_LOADING':
    case 'CHANGE_PAYMENT':
      return mergeState(state, action)
    default:
      return state
  }
}

export default cashier
