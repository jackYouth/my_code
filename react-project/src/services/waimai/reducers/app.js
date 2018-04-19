import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:   'takeaway',
  channel: 'ele',
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'BEST_CONTACT':
    case 'HANDLE_ADDRESS':
    case 'SHOW_BANNER':
      return mergeState(state, action)
    default: return state
  }
}

export default app
