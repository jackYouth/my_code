import { mergeState } from '@boluome/common-lib'

const initialState = {}

const attentionList = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ATTENTION_LIST':
      return mergeState(state, action)
    default:
      return state
  }
}

export default attentionList
