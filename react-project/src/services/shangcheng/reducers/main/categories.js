import { mergeState } from '@boluome/common-lib'

const initialState = {}

const categories = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TOP_CATEGORIES':
    case 'SET_SUB_CATEGORIES':
    case 'SET_CURRENT_TOP_CATEGORIES':
      return mergeState(state, action)
    default:
      return state
  }
}

export default categories
