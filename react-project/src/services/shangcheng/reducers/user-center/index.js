import { mergeState } from '@boluome/common-lib'

const initialState = {}

const userCenter = (state = initialState, action) => {
  switch (action.type) {
    case 'TEST':
      return mergeState(state, action)
    default:
      return state
  }
}

export default userCenter
