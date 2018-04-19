import { mergeState } from '@boluome/common-lib'

const initialState = {}

const market = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MARKET_CATEGORIES':
    case 'SET_MARKET_GOODS':
      return mergeState(state, action)
    default:
      return state
  }
}

export default market
