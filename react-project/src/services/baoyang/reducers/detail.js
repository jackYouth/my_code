import { mergeState } from '@boluome/common-lib'

const initialState = {}

const detail = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_SHOP':
      return mergeState(state, action)
    default: return state
  }
}

export default detail
