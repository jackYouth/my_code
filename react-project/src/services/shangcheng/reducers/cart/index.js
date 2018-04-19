import { mergeState } from '@boluome/common-lib'

const initialState = {}

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SELECT_GOODS':
    case 'SET_CART_COMMODITYS':
    case 'SET_CHECKED_STATUS':
      return mergeState(state, action)
    default:
      return state
  }
}

export default cart
