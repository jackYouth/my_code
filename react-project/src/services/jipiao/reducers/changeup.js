import { mergeState } from '@boluome/common-lib'

const initialState = {}

const changeup = (state = initialState, action) => {
  switch (action.type) {
    case 'CHU_RESET':
      return mergeState(state, action)
    case 'CHU_INIT':
      return initialState
    default: return state
  }
}

export default changeup
