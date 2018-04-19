import { mergeState } from '@boluome/common-lib'

const initialState = {}

const Choosen = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CLASS':
      return mergeState(state, action)
    default: return state
  }
}

export default Choosen
