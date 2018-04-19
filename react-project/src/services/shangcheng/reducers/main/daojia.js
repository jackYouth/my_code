import { mergeState } from '@boluome/common-lib'

const initialState = {}

const daojia = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DAOJIA_INFO':
    case 'SET_DAOJIA_ADDRESS':
      return mergeState(state, action)
    default:
      return state
  }
}

export default daojia
