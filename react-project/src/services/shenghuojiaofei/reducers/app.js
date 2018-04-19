import { mergeState } from '@boluome/common-lib'

const app = (state = {}, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_CITY':
    case 'CHANGE_CITY_SERVICE':
    case 'CHANGE_CURRENT_SERVER':
    case 'GET_USER_PAGE':
    case 'CHANGE_HOME_TAG':
    case 'CHANGE_SERVICE_STYLE':
    case 'SET_CURRENT_EDIT_STATUS':
      return mergeState(state, action)
    default:
      return state
  }
}

export default app
