import { mergeState } from '@boluome/common-lib'

const initialState = {}

const evaluate = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EVALUATE_ORDER_INFO':
    case 'SET_CURRENT_APPRAISES':
      return mergeState(state, action)
    default:
      return state
  }
}

export default evaluate
