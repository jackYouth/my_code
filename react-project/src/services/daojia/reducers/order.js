import { mergeState } from '@boluome/common-lib'

const initialState = {}

const detail = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_ADDRESS':
    case 'SET_PROMOTION_DATA':
    case 'SET_ADDRESS_AVAIL':
    case 'SET_PERSONALITY':
    case 'SET_PERSONALITY_CONTENT':
    case 'SET_CURRENT_COUNT':
      return mergeState(state, action)
    default:
      return state
  }
}

export default detail
