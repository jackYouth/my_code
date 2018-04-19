import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'chongzhi',
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CZ':
    case 'SET_CURRENT_PHONE':
      return mergeState(state, action)
    default: return state
  }
}

export default app
