import { mergeState } from '@boluome/common-lib'

const initialState = {}

const refundInfo = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_REFUND_INFO':
    case 'SET_CURRENT_EXPRESS_INFO':
    case 'CHANGE_EXPRESS_NUMBER':
      return mergeState(state, action)
    default:
      return state
  }
}

export default refundInfo
