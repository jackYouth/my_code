import { mergeState } from '@boluome/common-lib'

const cancelReason = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CURRENT_CANCEL_REASON':
      return mergeState(state, action)
    default:
      return state
  }
}

export default cancelReason
