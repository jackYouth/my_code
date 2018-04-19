import { mergeState } from '@boluome/common-lib'

const initialState = {}

const orderId = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_RECALL_VESIBLE':
    case 'SET_CURRENT_STATUS':
    case 'SET_NO_DRIVER_RESPONSE':
    case 'UPDATE_CURRENT_STATUS':
    case 'SET_CURRENT_FLAG':
      return mergeState(state, action)
    default:
      return state
  }
}

export default orderId
