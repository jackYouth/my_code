import { mergeState } from '@boluome/common-lib'

const addUser = (state = { }, action) => {
  switch (action.type) {
    case 'CHANGE_CURRENT_HOME':
    case 'CHANGE_NUM':
    case 'CHANGE_PWD':
    case 'SET_CURRENT_QUERY_TYPE':
    case 'CHANGE_SERVER_DATA':
      return mergeState(state, action)
    default:
      return state
  }
}

export default addUser
