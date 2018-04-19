import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'chegu'
}

const app = (state = initialState, action) => {
    switch (action.type) {
      case 'GET_CITIES':
      case 'DISTANCE_CHANGE':
      case 'CURRENT_CITY':
      case 'CHOOSE_HISTORY':
        return mergeState(state, action)
      default: return state
    }
}

export default app;
