import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'konggang-Detail',
}

const detail = (state = initialState, action) => {
  switch (action.type) {
    case 'CHOOSE_TIMES' :
      return mergeState(state, action)
    default: return state
  }
}

export default detail
