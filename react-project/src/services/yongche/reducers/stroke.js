import { mergeState } from '@boluome/common-lib'

const stroke = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ORDER_LIST':
      return mergeState(state, action)
    default:
      return state
  }
}

export default stroke
