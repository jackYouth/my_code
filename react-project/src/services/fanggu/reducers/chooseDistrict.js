import { mergeState } from '@boluome/common-lib'
const initialState = {}

const districtList = (state = initialState, action) => {
  switch (action.type) {
    case 'FEACH_DISTRICT':
      return mergeState(state, action)
    default: return state
  }
}

export default districtList
