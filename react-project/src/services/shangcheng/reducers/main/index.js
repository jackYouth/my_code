import { mergeState } from '@boluome/common-lib'

const initialState = {}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MAIN_COLUMNS':
    case 'SET_MAIN_RECOMMENDATION':
    case 'SET_MAIN_NEW_COMMODITYS':
      return mergeState(state, action)
    default:
      return state
  }
}

export default app
