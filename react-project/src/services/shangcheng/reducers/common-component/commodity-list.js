import { mergeState } from '@boluome/common-lib'

const initialState = {}

const commodityList = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GOOD_LIST':
    case 'SET_CURRENT_FILTER':
    case 'CHANGE_SHOW_MODE':
      return mergeState(state, action)
    default:
      return state
  }
}

export default commodityList
