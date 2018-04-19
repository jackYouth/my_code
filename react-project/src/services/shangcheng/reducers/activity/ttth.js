import { mergeState } from '@boluome/common-lib'

const initialState = {}

const ttth = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TTTH_DATA':
      return mergeState(state, action)
    default:
      return state
  }
}

export default ttth
