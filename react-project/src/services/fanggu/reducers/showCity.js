import { mergeState } from '@boluome/common-lib'

const initialState = {}

const showCity = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_CITY':
      return mergeState(state, action)
    default: return state
  }
}

export default showCity
