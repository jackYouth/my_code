import { mergeState } from '@boluome/common-lib'

const initialState = {
}

const detail = (state = initialState, action) => {
  switch (action.type) {
    case 'DET_RESET':
      return mergeState(state, action)
    case 'DET_INIT':
      return initialState
    default: return state
  }
}

export default detail
