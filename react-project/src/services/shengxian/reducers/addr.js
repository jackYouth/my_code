import { mergeState } from '@boluome/common-lib'

const initialState = {
}

const addr = (state = initialState, action) => {
  switch (action.type) {
    case 'ADDR_INIT':
      return initialState
    case 'ADDR_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default addr
