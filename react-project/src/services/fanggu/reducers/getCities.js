import { mergeState } from '@boluome/common-lib'
const initialState = {}

const cities = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CITIES':
        return mergeState(state, action)
    default: return state
  }
}

export default cities
