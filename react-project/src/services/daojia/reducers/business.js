import { mergeState } from '@boluome/common-lib'

const initialState = {
  currentCategoryIndex: 0,
}

const business = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_BUSINESS_DATA':
    case 'SET_CURRENT_CATEGORY_ID':
    case 'SET_CURRENT_SERVICE':
      return mergeState(state, action)
    default: return state
  }
}

export default business
