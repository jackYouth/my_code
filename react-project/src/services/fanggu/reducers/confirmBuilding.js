import { mergeState } from '@boluome/common-lib'
const initialState = {}

const confirmBuilding = (state = initialState, action) => {
  switch (action.type) {
    case 'CONFIRM_BUILDING':
        return mergeState(state, action)
    default: return state
  }
}

export default confirmBuilding
