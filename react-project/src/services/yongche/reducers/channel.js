import { mergeState } from '@boluome/common-lib'

const initialState = {
  currentPassenger: '换乘车人',
}

const channel = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_CITY':
    case 'SET_PRODUCT_SUPPORT_THIS_CITY':
      return mergeState(state, action)
    default: return state
  }
}

export default channel
