import { mergeState } from '@boluome/common-lib'

const order = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_DISCOUNT':
      return mergeState(state, action)
    default:
      return state
  }
}

export default order
