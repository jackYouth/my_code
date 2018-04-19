import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:                'xianhua',
  currentCategoryIndex: 0,
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_INDUSTRY_CODE':
    case 'SET_SELECTED_ADDRESS':
    case 'SET_CURRENT_CATEGORYID':
    case 'GET_CATEGORIES':
    case 'GET_CURRENT_GOODS':
    case 'GET_SERVER_BUSINESS':
    case 'GET_SERVER_TIMES':
      return mergeState(state, action)
    default: return state
  }
}

export default app
