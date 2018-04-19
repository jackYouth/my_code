import { mergeState } from '@boluome/common-lib'

const initialState = {}

const refundList = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_REFUND_LIST':
      return mergeState(state, action)
    default:
      return state
  }
}

export default refundList
