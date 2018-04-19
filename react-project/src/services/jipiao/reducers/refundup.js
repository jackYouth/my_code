import { mergeState } from '@boluome/common-lib'

const initialState = {
}

const refundup = (state = initialState, action) => {
  switch (action.type) {
    case 'REP_RESET':
      return mergeState(state, action)
    case 'REP_INIT':
      return initialState
    default: return state
  }
}

export default refundup
