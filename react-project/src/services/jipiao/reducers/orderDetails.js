import { mergeState } from '@boluome/common-lib'

const initialState = {
}

const orderDetails = (state = initialState, action) => {
  switch (action.type) {
    case 'ODL_RESET':
      return mergeState(state, action)
    case 'ODL_INIT':
      return initialState
    default: return state
  }
}

export default orderDetails
