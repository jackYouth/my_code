import { mergeState } from '@boluome/common-lib'
const initialState = {}

const clickEvaluation = (state = initialState, action) => {
  switch (action.type) {
    case 'CLICK_EVALUATION':
      return mergeState(state, action)
    default: return state
  }
}

export default clickEvaluation
