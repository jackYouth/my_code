import { mergeState } from '@boluome/common-lib'

const initialState = {
}
const sear = (state = initialState, action) => {
  switch (action.type) {
    case 'SEA_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default sear
