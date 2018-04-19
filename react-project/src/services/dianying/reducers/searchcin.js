import { mergeState } from '@boluome/common-lib'

const initialState = {
  more: true,
}
const searchcin = (state = initialState, action) => {
  switch (action.type) {
    case 'SEN_INIT':
      return initialState
    case 'SEN_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default searchcin
