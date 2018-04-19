import { mergeState } from '@boluome/common-lib'

const billInfo = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_BILL_INFO':
    case 'SET_CURRENT_DATE':
    case 'SET_CURRENT_ORG_DETAIL':
    case 'SHOW_BEIJING_INPUT':
      return mergeState(state, action)
    default:
      return state
  }
}

export default billInfo
