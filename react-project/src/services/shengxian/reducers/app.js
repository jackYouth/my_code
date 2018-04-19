import { mergeState } from '@boluome/common-lib'

const initialState = {
  limit:    20,
  cityName: '上海',
  tip:      true,
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default app
