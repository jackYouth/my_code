import { mergeState } from '@boluome/common-lib'

const initialState = {}

const collectList = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COLLECT_LIST':
      return mergeState(state, action)
    default:
      return state
  }
}

export default collectList
