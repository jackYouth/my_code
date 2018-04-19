import { mergeState } from '@boluome/common-lib'
const initialState = {}

const confirmDistrict = (state = initialState, action) => {
  switch (action.type) {
    case 'CONFIRM_DISTRICT':
        return mergeState(state, action)
    default: return state
  }
}

export default confirmDistrict
