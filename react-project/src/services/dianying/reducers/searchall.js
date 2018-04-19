import { mergeState } from '@boluome/common-lib'

const initialState = {
  more: true,
}
const searchall = (state = initialState, action) => {
  switch (action.type) {
    case 'SER_INIT':
      return initialState
    case 'SER_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default searchall
