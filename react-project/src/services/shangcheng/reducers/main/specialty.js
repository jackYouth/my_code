import { mergeState } from '@boluome/common-lib'

const initialState = {}

const specialty = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SPECIALTY_GOODS':
    case 'SET_SPECIALTY_PROVINCE':
      return mergeState(state, action)
    default:
      return state
  }
}

export default specialty
