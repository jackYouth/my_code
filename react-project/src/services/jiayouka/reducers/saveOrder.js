import { mergeState } from '@boluome/common-lib'

const initialState = {}

const SaveOrder = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_ORDER':
      return mergeState(state, action)
    default: return state
  }
}


export default SaveOrder
