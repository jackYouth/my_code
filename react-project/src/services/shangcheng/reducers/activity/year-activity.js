import { mergeState } from '@boluome/common-lib'

const initialState = {}

const YearActivity = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ACTIVITIES':
    case 'SET_CURRENT_ACTIVITITY_INDEX':
    case 'SHOW_SUB_TITLES':
      return mergeState(state, action)
    default:
      return state
  }
}

export default YearActivity
