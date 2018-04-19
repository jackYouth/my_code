import { mergeState } from '@boluome/common-lib'

const initialState = {
  tip: false,
}
const order = (state = initialState, action) => {
  switch (action.type) {
    case 'DER_RESET':
      return mergeState(state, action)
    case 'DER_INIT':
      return initialState
    default: return state
  }
}

export default order
