import { mergeState } from '@boluome/common-lib'

const initialState = {}

const message = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_UNREAD_MSG_COUNT':
    case 'GET_RECENT_CONTACT':
      return mergeState(state, action)
    default:
      return state
  }
}

export default message
