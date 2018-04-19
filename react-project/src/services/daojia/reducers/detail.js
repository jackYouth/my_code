import { mergeState } from '@boluome/common-lib'

const initialState = {}

const detail = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GOOD_DETAILS':
    case 'SET_RESERVER_TIMES':
    case 'SET_CUREENT_SPECIFICATION':
      return mergeState(state, action)
    default:
      return state
  }
}

export default detail
