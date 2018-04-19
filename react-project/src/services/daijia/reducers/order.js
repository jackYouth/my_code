import { mergeState } from '@boluome/common-lib'

const initialState = {}

const order = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDER_INFO':
      return mergeState(state, action)
    default:
      return state
  }
}

export default order
