import { mergeState } from '@boluome/common-lib'
const initialState = {}

const feachFacility = (state = initialState, action) => {
  switch (action.type) {
    case 'FEACH_FACILITY':
        return mergeState(state, action)
    default: return state
  }
}

export default feachFacility
